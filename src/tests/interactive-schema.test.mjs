import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateProject, validateInteractiveProject } from '../lib/project-schema.mjs';

const fixture = JSON.parse(await readFile(new URL('./fixtures/v2-project.json', import.meta.url), 'utf8'));
const copy = () => structuredClone(fixture);

// 两组不同的可视实验验证同一公共协议，不依赖具体教学主题。
function discreteProject() {
  const project = copy();
  project.experiments = [
    { id: 'space', type: 'probability', title: '抽样实验', description: '比较抽样条件与事件发生频率。', config: {
      population: [{ id: 'red', label: '红球', count: 4 }, { id: 'blue', label: '蓝球', count: 6 }],
      draws: 3, replacement: false, event: { type: 'atLeast', targetId: 'red', count: 2 }, batchSize: 100,
    } },
    { id: 'budget', type: 'network', title: '选择路径', description: '比较从起点到终点的两条路径。', config: {
      nodes: [{ id: 'a', label: '起点', x: 10, y: 50 }, { id: 'b', label: '中转点', x: 50, y: 20 }, { id: 'c', label: '终点', x: 90, y: 50 }],
      edges: [{ from: 'a', to: 'b', weight: 4 }, { from: 'b', to: 'c', weight: 5 }, { from: 'a', to: 'c', weight: 12 }],
      start: 'a', end: 'c', directed: false, unit: '分钟',
    } },
  ];
  return project;
}

test('多场景项目直接定义图形与资源实验，不要求数据拟合结构', () => {
  const project = copy();
  assert.equal(validateProject(project), project);
  assert.equal(validateInteractiveProject(project), project);
  assert.equal('dataset' in project, false);
  assert.equal('model' in project, false);
});

test('概率与路线实验使用同一阶段引用协议', () => {
  assert.doesNotThrow(() => validateProject(discreteProject()));
  for (const type of ['allSame', 'allDifferent']) {
    const project = discreteProject();
    project.experiments[0].config.event = { type };
    assert.doesNotThrow(() => validateProject(project));
  }
});

test('每个阶段引用已存在的实验，每个实验进入学习流程', () => {
  const unknown = copy(); unknown.stages[0].interaction.experimentId = 'missing';
  assert.throws(() => validateProject(unknown), /不存在/);
  const unused = copy(); unused.stages.forEach(stage => { stage.interaction.experimentId = 'space'; });
  assert.throws(() => validateProject(unused), /每个实验/);
  const duplicate = copy(); duplicate.experiments[1].id = 'space';
  assert.throws(() => validateProject(duplicate), /各不相同/);
});

test('历史多实验项目保持类型区分，交互协议仍使用version为2', () => {
  const project = copy();
  project.experiments[1] = { ...structuredClone(project.experiments[0]), id: 'budget' };
  assert.throws(() => validateProject(project), /两种不同/);
  project.version = 1;
  assert.throws(() => validateInteractiveProject(project), /version为2/);
});

test('几何表达式限定当前参数与数学语法，并检查初始计算有效性', () => {
  for (const expression of ['document.cookie', 'Function(1)', 'unknown+2', 'sqrt(-1)', '1/0']) {
    const project = copy(); project.experiments[0].config.metrics[0].expression = expression;
    assert.throws(() => validateProject(project));
  }
  const project = copy(); project.experiments[0].config.metrics[0].expression = 'sqrt(w^2)+sin(pi/2)';
  assert.doesNotThrow(() => validateProject(project));
});

test('可拖点直接对应参数，初始图形应位于画布内', () => {
  const inverse = copy(); inverse.experiments[0].config.elements[1].x = '2*w';
  assert.throws(() => validateProject(inverse), /直接引用/);
  const outside = copy(); outside.experiments[0].config.elements[0].height = 20;
  assert.throws(() => validateProject(outside), /画布/);
  const radius = copy(); radius.experiments[0].config.elements[0] = { type: 'circle', cx: 4, cy: 4, r: -1 };
  assert.throws(() => validateProject(radius), /大于0/);
  const coerced = copy(); coerced.experiments[0].config.elements[0].type = ['rect'];
  assert.throws(() => validateProject(coerced), /图形类型/);
});

test('资源分配具有非负消耗、实际资源引用与可行最低数量', () => {
  const unknown = copy(); unknown.experiments[1].config.items[0].resourceUse.unknown = 1;
  assert.throws(() => validateProject(unknown), /不存在的资源/);
  const negative = copy(); negative.experiments[1].config.items[0].resourceUse.budget = -1;
  assert.throws(() => validateProject(negative), /单位资源消耗/);
  const infeasible = copy();
  infeasible.experiments[1].config.items.forEach(item => { item.min = 10; item.value = 10; });
  assert.throws(() => validateProject(infeasible), /可行起点/);
});

test('概率事件引用真实类别，抽样数量满足放回条件', () => {
  const target = discreteProject(); target.experiments[0].config.event.targetId = 'missing';
  assert.throws(() => validateProject(target), /存在的类别/);
  const count = discreteProject(); count.experiments[0].config.event.count = 5;
  assert.throws(() => validateProject(count), /目标出现次数/);
  const sample = discreteProject(); sample.experiments[0].config.population.forEach(item => { item.count = 1; });
  assert.throws(() => validateProject(sample), /不放回抽取次数/);
  sample.experiments[0].config.replacement = true;
  assert.doesNotThrow(() => validateProject(sample));
});

test('路线边权为正，示意坐标有效，起终点可达', () => {
  const negative = discreteProject(); negative.experiments[1].config.edges[0].weight = 0;
  assert.throws(() => validateProject(negative), /路线权重/);
  const outside = discreteProject(); outside.experiments[1].config.nodes[0].x = 101;
  assert.throws(() => validateProject(outside), /节点横向位置/);
  const unreachable = discreteProject();
  unreachable.experiments[1].config.directed = true;
  unreachable.experiments[1].config.edges = [{ from: 'b', to: 'a', weight: 4 }, { from: 'c', to: 'b', weight: 5 }];
  assert.throws(() => validateProject(unreachable), /到达终点/);
  const duplicate = discreteProject(); duplicate.experiments[1].config.edges.push({ from: 'c', to: 'a', weight: 7 });
  assert.throws(() => validateProject(duplicate), /唯一/);
});

test('必经节点同时进入配置与可达性检查，避免文字条件与路线检验脱节', () => {
  const valid = discreteProject(); valid.experiments[1].config.requiredNodes = ['b'];
  assert.doesNotThrow(() => validateProject(valid));
  const missing = discreteProject(); missing.experiments[1].config.requiredNodes = ['missing'];
  assert.throws(() => validateProject(missing), /现有节点/);
  const repeated = discreteProject(); repeated.experiments[1].config.requiredNodes = ['b', 'b'];
  assert.throws(() => validateProject(repeated), /不同的现有/);
  const impossible = discreteProject();
  impossible.experiments[1].config.requiredNodes = ['b'];
  impossible.experiments[1].config.directed = true;
  impossible.experiments[1].config.edges = [{ from: 'a', to: 'b', weight: 1 }, { from: 'a', to: 'c', weight: 2 }];
  assert.throws(() => validateProject(impossible), /全部必经节点/);
});
