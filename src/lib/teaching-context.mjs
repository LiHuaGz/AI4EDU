import { readFile } from 'node:fs/promises';

const MODULE_SECTIONS = {
  '函数与方程': ['1:1.', '1:2.', '1:3.', '1:4.'], '统计与概率': ['2:9.', '2:10.', '5:6.', '5:7.', '5:8.'],
  '平面向量': ['2:6.'], '圆锥曲线': ['3:2.', '3:3.'], '数列': ['4:4.'],
  '最值与优化': ['1:2.', '1:3.', '4:5.'], '三角函数': ['1:5.'], '立体几何': ['2:8.', '3:1.'], '导数初步': ['4:5.'],
};

export async function loadTeachingResources() {
  const read = name => readFile(new URL(`../books/${name}`, import.meta.url), 'utf8').then(JSON.parse);
  const [graph, compact, curriculum] = await Promise.all([read('knowledge-graph.full.json'), read('knowledge-graph.compact.json'), read('curriculum-context.json')]);
  return { graph, compact, curriculum };
}

export function teachingContext(resources, input, selectedIds) {
  const { graph, compact, curriculum } = resources;
  const prefixes = (input.modules || []).flatMap(module => MODULE_SECTIONS[module] || []);
  // 完整紧凑图用于检查跨册依赖；教材摘录只选当前模块或当前项目涉及的知识点。
  const relevant = selectedIds
    ? graph.nodes.filter(node => selectedIds.includes(node.id))
    : graph.nodes.filter(node => prefixes.some(prefix => node.section_id.startsWith(prefix)) || input.progress?.includes(node.name));
  let knowledgeGraph = compact;
  if (selectedIds) {
    const byId = new Map(graph.nodes.map(node => [node.id, node]));
    const included = new Set();
    const include = id => { if (included.has(id) || !byId.has(id)) return; included.add(id); byId.get(id).prerequisites.forEach(include); };
    selectedIds.forEach(include);
    knowledgeGraph = { ...compact, nodes: compact.nodes.filter(row => included.has(row[0])), optional_nodes: compact.optional_nodes.filter(id => included.has(id)) };
  }
  return {
    curriculum,
    knowledgeGraph,
    textbooks: graph.books.map(({ id, title, file }) => ({ id, title, file })),
    textbookKnowledge: { columns: ['nodeId', 'learningRequirement', 'bookId', 'printedPage', 'excerpt'], rows: relevant.map(node => {
      const source = node.sources[0];
      return [node.id, node.learning_requirement, source.book_id, source.printed_page, source.evidence_excerpt.slice(0, 100)];
    }) },
    interpretation: 'progress是当前能力的依据，plan描述整个学期的安排，modules表示希望联系的内容。图谱关系用于分析知识前置条件，教材摘录用于核对内容。',
  };
}

export function validateKnowledgeAlignment(project, graph) {
  const nodes = new Map(graph.nodes.map(node => [node.id, node]));
  const { knownIds, newIds, known, new: introduced } = project.knowledge;
  for (const [ids, labels, name] of [[knownIds, known, '已有知识'], [newIds, introduced, '拓展知识']]) {
    if (!Array.isArray(ids) || ids.length !== labels.length || new Set(ids).size !== ids.length || ids.some(id => !nodes.has(id))) throw new Error(`${name}应使用知识图谱中各不相同的编号，并与名称逐项对应。`);
    const mismatches = ids.filter((id, index) => nodes.get(id).name !== labels[index]);
    if (mismatches.length) throw new Error(`${name}的编号与图谱名称不一致。请按对应编号核对名称：${mismatches.map(id => `${id}＝${nodes.get(id).name}`).join('；')}。`);
  }
  if (newIds.some(id => knownIds.includes(id))) throw new Error('已有知识与拓展知识应分别列出。');
  const available = new Set();
  function master(id) { if (available.has(id)) return; available.add(id); nodes.get(id).prerequisites.forEach(master); }
  knownIds.forEach(master);
  for (const id of newIds) {
    if (available.has(id)) throw new Error('拓展知识已经包含在已有知识及其前置知识中。');
    const missing = nodes.get(id).prerequisites.filter(parent => !available.has(parent));
    if (missing.length) throw new Error(`拓展知识「${nodes.get(id).name}」缺少前置知识：${missing.map(parent => nodes.get(parent).name).join('、')}。请减少跨度或调整引入顺序。`);
    available.add(id);
  }
  const scaffolds = project.learningDesign.scaffolds;
  if (scaffolds.length !== newIds.length || new Set(scaffolds.map(item => item.nodeId)).size !== newIds.length || scaffolds.some(item => !newIds.includes(item.nodeId))) throw new Error('每个拓展知识点都应有且只有一项对应的学习支架。');
  for (const stage of project.stages) {
    const outside = stage.knowledgeIds.filter(id => !available.has(id));
    if (outside.length) throw new Error(`阶段「${stage.id}」的知识编号${outside.join('、')}超出了已有知识及最多3项拓展知识的范围。`);
  }
  return project;
}
