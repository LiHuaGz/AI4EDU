import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateGeneratedProject, validateProject } from '../lib/project-schema.mjs';
import { loadTeachingResources, teachingContext, validateKnowledgeAlignment } from '../lib/teaching-context.mjs';
import { computeGeometry } from '../public/scenes/geometry.js';

const example = JSON.parse(await readFile(new URL('../demo-project.json', import.meta.url), 'utf8'));
const resources = await loadTeachingResources();
const copy = () => structuredClone(example);
const config = example.experiments[0].config;
const defaults = Object.fromEntries(config.parameters.map(item => [item.key, item.value]));

test('任意球示例使用1个实验贯穿6个建模阶段，新增知识具有可达前置与支架', () => {
  assert.equal(validateGeneratedProject(example), example);
  assert.equal(validateKnowledgeAlignment(example, resources.graph), example);
  assert.deepEqual(example.stages.map(stage => stage.modelingStep), ['data', 'model', 'solve', 'solve', 'analysis', 'analysis']);
  assert.equal(example.finalChallenge.stageId, example.stages.at(-1).id);
  assert.equal(new Set(example.stages.map(stage => stage.interaction.experimentId)).size, 1);
  assert.deepEqual(example.knowledge.newIds, [226, 228, 220]);
  assert.ok([224, 225, 219].every(id => example.knowledge.knownIds.includes(id)));
});

test('难度标为较难，最近发展区三个层次与教师审核要点齐全，支架逐步撤除', () => {
  assert.equal(example.learningDesign.difficulty, '较难');
  assert.ok(['independent', 'assisted', 'transfer', 'evidence'].every(key => example.learningDesign.zpd[key].length > 20));
  assert.ok(example.learningDesign.reviewPoints.length >= 2);
  const opened = example.stages.map(stage => stage.support.open);
  assert.equal(opened[0], false);
  assert.equal(opened.at(-1), false);
  assert.ok(opened.includes(true));
  // 第1题记录独立表现，最后一题是迁移，二者都要有可核对的数值。
  assert.ok(example.stages[0].checks.length >= 3 && example.stages.at(-1).checks.length >= 3);
  const difficulty = copy(); difficulty.learningDesign.difficulty = '难';
  assert.throws(() => validateGeneratedProject(difficulty), /较难/);
  const noZpd = copy(); delete noZpd.learningDesign.zpd;
  assert.throws(() => validateGeneratedProject(noZpd), /最近发展区/);
  const lastOpen = copy(); lastOpen.stages.at(-1).support.open = true;
  assert.throws(() => validateGeneratedProject(lastOpen), /收起/);
  const code = copy(); code.stages[0].python = { code: 'print(1)' };
  assert.throws(() => validateGeneratedProject(code), /可执行代码/);
});

test('生成校验拒绝多实验、遗漏建模环节和不一致的数据表', () => {
  const multiple = copy();
  multiple.experiments.push({ id: 'second', type: 'probability', title: '第二个实验', description: '抽样。', config: { population: [{ id: 'a', label: '甲', count: 3 }, { id: 'b', label: '乙', count: 2 }], draws: 2, replacement: true, event: { type: 'allSame' }, batchSize: 100 } });
  multiple.stages[1].interaction.experimentId = 'second';
  assert.doesNotThrow(() => validateProject(multiple));
  assert.throws(() => validateGeneratedProject(multiple), /1个实验/);
  const missing = copy(); missing.stages[4].modelingStep = 'solve'; missing.stages[5].modelingStep = 'solve';
  assert.throws(() => validateGeneratedProject(missing), /必须覆盖/);
  const data = copy(); data.taskData.rows[0].pop();
  assert.throws(() => validateGeneratedProject(data), /单元格/);
});

test('知识对齐拒绝虚构编号、未满足的前置知识和遗漏支架', () => {
  const unknown = copy(); unknown.knowledge.newIds[0] = 99999;
  assert.throws(() => validateKnowledgeAlignment(unknown, resources.graph), /图谱/);
  const gap = copy(); gap.knowledge.knownIds = [1]; gap.knowledge.known = ['集合与元素'];
  assert.throws(() => validateKnowledgeAlignment(gap, resources.graph), /缺少前置/);
  const scaffold = copy(); scaffold.learningDesign.scaffolds.pop();
  assert.throws(() => validateKnowledgeAlignment(scaffold, resources.graph), /支架/);
});

test('项目相关教学上下文保留前置闭包，包含教材页码与课标要求', () => {
  const context = teachingContext(resources, {}, [226, 228]);
  const ids = new Set(context.knowledgeGraph.nodes.map(row => row[0]));
  for (const row of context.knowledgeGraph.nodes) assert.ok(row[2].every(id => ids.has(id)));
  assert.ok(ids.has(225) && ids.has(36) && ids.has(228));
  assert.ok(ids.size < resources.graph.nodes.length);
  assert.equal(context.textbookKnowledge.rows.length, 2);
  assert.ok(context.curriculum.requirements.some(item => item.printedPage === 35));
});

test('知识名称校验列出错误编号对应的标准名称，便于一次修复', () => {
  const project = copy();
  project.knowledge.new[0] = '残差';
  assert.throws(() => validateKnowledgeAlignment(project, resources.graph), /226＝残差与回归模型的拟合效果/);
});

test('固定情境参数参与约束计算，可调控件仍需变化范围', () => {
  const project = copy();
  const constant = project.experiments[0].config.parameters.find(item => item.key === 'H');
  assert.equal(constant.min, constant.max);
  assert.equal(computeGeometry(project.experiments[0].config, { ...defaults, v: 21.6, theta: 19 }).feasible, true);
  constant.value = 2.2;
  assert.throws(() => validateGeneratedProject(project), /几何参数「H」的初始值/);
  constant.value = 2.1;
  project.experiments[0].config.parameters[1].step = 100;
  assert.throws(() => validateGeneratedProject(project), /几何参数「theta」范围或步长无效/);
});

test('小数边界的浮点误差不会拒绝合法步长，真实越界仍报具体参数', () => {
  const project = copy();
  const parameter = project.experiments[0].config.parameters.find(item => item.key === 'sigma');
  Object.assign(parameter, { min: .2, max: .3, value: .2, step: .1 });
  assert.doesNotThrow(() => validateGeneratedProject(project));
  for (const step of [0, -.1, .11]) {
    parameter.step = step;
    assert.throws(() => validateGeneratedProject(project), /几何参数「sigma」范围或步长无效/);
  }
});

test('函数曲线、观测数据与可行区间的配置接受校验，错误引用给出具体原因', () => {
  const curve = copy();
  curve.experiments[0].config.elements.find(item => item.type === 'curve').y = 'x*unknown';
  assert.throws(() => validateGeneratedProject(curve), /曲线函数.*未定义/);
  const lock = copy(); lock.experiments[0].config.observations.lockKeys = ['D'];
  assert.throws(() => validateGeneratedProject(lock), /可调控件/);
  const window = copy(); window.experiments[0].config.window.sigmaKey = 'unknown';
  assert.throws(() => validateGeneratedProject(window), /可行区间/);
  const transform = copy(); transform.experiments[0].config.observations.transform.expression = 'y/z';
  assert.throws(() => validateGeneratedProject(transform), /观测数据变换.*未定义/);
});

test('工作流第7章与示例的任务、全部提示及成果要求一致，使用普通阿拉伯数字', async () => {
  const workflow = await readFile(new URL('../workflow.md', import.meta.url), 'utf8');
  const chapter = workflow.split('## 七、')[1];
  assert.ok(chapter.includes(example.title));
  for (const stage of example.stages) for (const text of [stage.prompt, stage.deliverable, ...stage.hints]) assert.ok(chapter.includes(text));
  assert.doesNotMatch(chapter + JSON.stringify(example), /[０-９]/);
});

test('最终综合题依赖全部前题，拒绝回指、遗漏子问题与纯文字作答', () => {
  const wrongFinal = copy(); wrongFinal.finalChallenge.stageId = wrongFinal.stages[0].id;
  assert.throws(() => validateGeneratedProject(wrongFinal), /最后一题/);
  const backwards = copy(); backwards.stages[0].dependsOn = [backwards.stages[1].id];
  assert.throws(() => validateGeneratedProject(backwards), /只能引用前面/);
  const isolated = copy(); isolated.stages.at(-1).dependsOn = ['trajectory'];
  assert.throws(() => validateGeneratedProject(isolated), /所有前置/);
  const noFormula = copy(); noFormula.stages[0].answerFields = noFormula.stages[0].answerFields.filter(field => field.type !== 'formula');
  assert.throws(() => validateGeneratedProject(noFormula), /公式/);
});

test('情景按钮只改变声明的参数，保留数学范围与示例核对规则', () => {
  const project = copy(); project.stages[2].interaction.presets[0].values.theta = 90;
  assert.throws(() => validateGeneratedProject(project), /情景参数theta超出/);
  const invalid = copy(); invalid.stages[0].checks[0].fieldId = 'unknown_field';
  assert.throws(() => validateGeneratedProject(invalid), /核对项/);
});
