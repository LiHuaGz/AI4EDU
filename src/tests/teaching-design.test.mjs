import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateGeneratedProject, validateProject } from '../lib/project-schema.mjs';
import { loadTeachingResources, teachingContext, validateKnowledgeAlignment } from '../lib/teaching-context.mjs';
import { computeOptimization } from '../public/scenes/optimization.js';

const example = JSON.parse(await readFile(new URL('../demo-project.json', import.meta.url), 'utf8'));
const resources = await loadTeachingResources();
const copy = () => structuredClone(example);
const config = example.experiments[0].config;
const defaults = Object.fromEntries([...config.variables, ...config.parameters].map(item => [item.key, item.value]));

test('卫星示例使用1个实验贯穿6个建模阶段，新增知识具有可达前置与支架', () => {
  assert.equal(validateGeneratedProject(example), example);
  assert.equal(validateKnowledgeAlignment(example, resources.graph), example);
  assert.deepEqual(example.stages.map(stage => stage.modelingStep), ['data', 'model', 'model', 'model', 'solve', 'analysis']);
  assert.equal(example.finalChallenge.stageId, example.stages.at(-1).id);
  assert.equal(new Set(example.stages.map(stage => stage.interaction.experimentId)).size, 1);
  assert.deepEqual(example.knowledge.newIds, [224,225,226]);
  assert.ok(example.knowledge.knownIds.includes(160) && example.knowledge.knownIds.includes(161));
});

test('生成校验拒绝多实验、遗漏建模环节和不一致的数据表', () => {
  const multiple = copy();
  multiple.experiments.push({ ...structuredClone(multiple.experiments[0]), id: 'second', type: 'geometry', config: { ...config.visualization, parameters: [...config.variables, ...config.parameters] } });
  multiple.stages[1].interaction.experimentId = 'second';
  assert.doesNotThrow(() => validateProject(multiple));
  assert.throws(() => validateGeneratedProject(multiple), /1个实验/);
  const missing = copy(); missing.stages[4].modelingStep = 'analysis';
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
  const context = teachingContext(resources, {}, [160, 161]);
  const ids = new Set(context.knowledgeGraph.nodes.map(row => row[0]));
  for (const row of context.knowledgeGraph.nodes) assert.ok(row[2].every(id => ids.has(id)));
  assert.ok(ids.has(14) && ids.has(151) && ids.has(161));
  assert.ok(ids.size < resources.graph.nodes.length);
  assert.equal(context.textbookKnowledge.rows.length, 2);
  assert.ok(context.curriculum.requirements.some(item => item.printedPage === 35));
});

test('优化函数可计算一般目标，可变观测参数保持独立', () => {
  const project = copy();
  project.experiments[0].config.objective.expression = '(a-9)^2+e^2';
  assert.doesNotThrow(() => validateGeneratedProject(project));
  assert.equal(computeOptimization(project.experiments[0].config, defaults).objective, 1.04);
  project.experiments[0].config.objective.expression = 'theta';
  assert.throws(() => validateGeneratedProject(project), /未定义/);
});

test('知识名称校验列出错误编号对应的标准名称，便于一次修复', () => {
  const project = copy();
  project.knowledge.new[0] = '线性回归';
  assert.throws(() => validateKnowledgeAlignment(project, resources.graph), /224＝一元线性回归模型与随机误差/);
});

test('固定情境参数参与计算，设计变量仍需变化范围', () => {
  const project = copy();
  const constant = project.experiments[0].config.parameters.find(item => item.key === 'h');
  Object.assign(constant, { min: .3, max: .3, value: .3, step: 0 });
  project.experiments[0].config.objective.expression = 'a+h';
  assert.doesNotThrow(() => validateGeneratedProject(project));
  assert.equal(computeOptimization(project.experiments[0].config, defaults).feasible, true);
  assert.equal(computeOptimization(project.experiments[0].config, defaults).objective, 10.3);
  constant.value = .4;
  assert.throws(() => validateGeneratedProject(project), /情境参数「h」的初始值/);
  constant.value = .3;
  const variable = project.experiments[0].config.variables[0];
  variable.min = variable.max = variable.value;
  assert.throws(() => validateGeneratedProject(project), /设计变量「a」范围或步长无效/);
});

test('小数边界的浮点误差不会拒绝合法步长，真实越界仍报具体参数', () => {
  const project = copy();
  const parameter = project.experiments[0].config.variables.find(item => item.key === 'e');
  Object.assign(parameter, { min: .2, max: .3, value: .2, step: .1 });
  project.stages.forEach(stage=>stage.interaction.presets?.forEach(preset=>{if(preset.values.e===0)preset.values.e=.2;}));
  assert.doesNotThrow(() => validateGeneratedProject(project));
  for (const step of [0, -.1, .11]) {
    parameter.step = step;
    assert.throws(() => validateGeneratedProject(project), /设计变量「e」范围或步长无效/);
  }
});

test('保障弧段约束与逐点真实仰角检查一致，遮挡升级会改变可行性', () => {
  assert.equal(computeOptimization(config, defaults).feasible, true);
  const R = 6.371, beta = 35 * Math.PI / 180;
  for (const a of [7, 9, 10, 14]) for (const e of [0, .2, .4, .55]) for (const window of [15, 20, 25, 30]) for (const epsilon of [0,5,8]) {
    const state = { ...defaults, a, e, window, epsilon };
    let visible = true;
    for (let theta = -window; theta <= window; theta++) {
      const t = theta * Math.PI / 180;
      const x = a * e + a * Math.cos(t), y = a * Math.sqrt(1 - e * e) * Math.sin(t);
      // 从站点到卫星的向量直接计算仰角，独立核验配置中的直线公式。
      for (const sign of [-1, 1]) {
        const distance = Math.hypot(x - R * Math.cos(beta), y - sign * R * Math.sin(beta));
        visible &&= x * Math.cos(beta) + sign * y * Math.sin(beta) - R >= distance * Math.sin(epsilon * Math.PI / 180) - 1e-8;
      }
    }
    const expected = visible && a * (1 - e) >= R + state.h - 1e-8;
    assert.equal(computeOptimization(config, state).feasible, expected);
  }
  const narrow = computeOptimization(config, { ...defaults, a:9.3, e:.25, epsilon:5 });
  const wide = computeOptimization(config, { ...defaults, a:9.3, e:.25, epsilon:8 });
  assert.equal(narrow.feasible, true);
  assert.equal(wide.feasible, false);
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
  const isolated = copy(); isolated.stages.at(-1).dependsOn = ['observations'];
  assert.throws(() => validateGeneratedProject(isolated), /所有前置/);
  const noFormula = copy(); noFormula.stages[0].answerFields = noFormula.stages[0].answerFields.filter(field => field.type !== 'formula');
  assert.throws(() => validateGeneratedProject(noFormula), /公式/);
});

test('最后一题的最大保障角目标与预算约束使用同一个实验', () => {
  const stage = example.stages.at(-1);
  assert.equal(stage.interaction.objective.expression, 'window');
  assert.equal(stage.interaction.objective.direction, 'max');
  const finalConfig = { ...config, objective: stage.interaction.objective, constraints: [...config.constraints, ...stage.interaction.additionalConstraints] };
  assert.equal(computeOptimization(finalConfig, { ...defaults, a:10 }).feasible, false);
  const a=9.3,e=1-6.671/a,beta=43*Math.PI/180;
  const m=Math.hypot(Math.cos(beta),Math.sqrt(1-e*e)*Math.sin(beta));
  const angle=(Math.acos((6.371*Math.cos(8*Math.PI/180)/a-e*Math.cos(beta))/m)-Math.atan(Math.sqrt(1-e*e)*Math.tan(beta)))*180/Math.PI;
  assert.ok(angle>19 && angle<20);
  assert.equal(computeOptimization(finalConfig,{...defaults,a,e,epsilon:8,window:angle}).feasible,true);
  assert.equal(computeOptimization(finalConfig,{...defaults,a,e,epsilon:8,window:20}).feasible,false);
});

test('两种最优方案经独立扫描核验，最终概率满足目标', () => {
  const answers = id => Object.fromEntries(example.stages.find(stage => stage.id === id).checks.map(check => [check.fieldId, check.expected]));
  for (const [epsilon,expected] of [[5,answers('baseline').optimal_a],[8,answers('mission').required_a]]) {
    let best=Infinity;
    for(let i=0;i<=10000;i++) {
      const e=i*.55/10000, beta=(35+epsilon)*Math.PI/180, angle=20*Math.PI/180;
      const height=6.671/(1-e), communication=6.371*Math.cos(epsilon*Math.PI/180)/((e+Math.cos(angle))*Math.cos(beta)-Math.sqrt(1-e*e)*Math.sin(angle)*Math.sin(beta));
      best=Math.min(best,Math.max(height,communication));
    }
    assert.ok(best>=expected-1e-10 && best-expected<.001);
  }
  const mission=answers('mission');
  assert.equal(mission.minimum_retries,3);
  assert.ok(Math.abs(mission.final_probability-(1-(1-.95*.9)**3))<1e-12);
});

test('情景按钮只改变声明的参数，保留数学范围与示例核对规则', () => {
  const project=copy(); project.stages[0].interaction.presets[0].values.e=2;
  assert.throws(()=>validateGeneratedProject(project),/情景参数e超出/);
  const invalid=copy(); invalid.stages[0].checks[0].fieldId='ellipse_equation';
  assert.throws(()=>validateGeneratedProject(invalid),/核对项/);
});
