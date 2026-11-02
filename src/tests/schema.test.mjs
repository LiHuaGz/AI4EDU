import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateProject } from '../lib/project-schema.mjs';

const demo = JSON.parse(await readFile(new URL('../demo-orbit-fitting.json', import.meta.url), 'utf8'));
// 结构异常测试使用独立的一次函数数据，避免教学示例切换主题后改变测试含义。
function copy() {
  const project = structuredClone(demo);
  project.dataset = {
    xLabel: '样本人数', yLabel: '需求量', xUnit: '人', yUnit: '升',
    rows: Array.from({ length: 10 }, (_, index) => ({ id: `point-${index}`, x: 400 + 100 * index, y: 900 + 200 * index, split: index < 8 ? 'train' : 'validation' })),
  };
  project.model = {
    family: 'linear',
    parameters: [{ key: 'm', label: '变化率', min: 0.5, max: 4, step: 0.05, value: 1.8 }, { key: 'b', label: '初始需求', min: 0, max: 500, step: 10, value: 200 }],
    xDomain: [0, 1400], yDomain: [0, 4000],
  };
  return project;
}
const parameter = (key, min, max, value = (min + max) / 2) => ({ key, label: key, min, max, step: (max - min) / 100, value });

// 用可解释的几何数据检查椭圆单位、半轴和位置变化约束。
function ellipseProject() {
  const project = copy();
  project.dataset = {
    xLabel: '平面横坐标', yLabel: '平面纵坐标', xUnit: '米', yUnit: '米',
    rows: Array.from({ length: 8 }, (_, index) => ({
      id: `point-${index}`, x: 3 * Math.cos(index * Math.PI / 4), y: 2 * Math.sin(index * Math.PI / 4), split: index < 6 ? 'train' : 'validation',
    })),
  };
  project.model = {
    family: 'ellipse',
    parameters: [parameter('a', 1, 5, 3), parameter('b', 1, 4, 2), parameter('h', -1, 1, 0), parameter('k', -1, 1, 0)],
    xDomain: [-6, 6], yDomain: [-5, 5],
  };
  return project;
}

function exponentialProject() {
  const project = copy();
  project.dataset.rows = Array.from({ length: 8 }, (_, index) => ({ id: `point-${index}`, x: index, y: Math.exp(index / 10), split: index < 6 ? 'train' : 'validation' }));
  project.model = {
    family: 'exponential',
    parameters: [parameter('a', 0.5, 2, 1), parameter('k', 0, 0.5, 0.1), parameter('c', -1, 1, 0)],
    xDomain: [0, 8], yDomain: [0, 4],
  };
  return project;
}

test('火星示例的六阶段、数据分组与模型满足可交互约定', () => {
  assert.equal(validateProject(demo), demo);
  assert.equal(demo.stages.length, 6);
  assert.equal(demo.dataset.rows.filter(row => row.split === 'train').length, 12);
  assert.equal(demo.dataset.rows.filter(row => row.split === 'validation').length, 4);
  assert.equal(demo.dataSource.kind, 'simulated');
  assert.equal(demo.model.family, 'ellipse');
  assert.ok(demo.stages.every(stage => stage.title.length <= 8));
});

test('模拟轨道与构造参数一致，验证位置覆盖四个象限', () => {
  const a = 1.524, e = 0.0934, b = a * Math.sqrt(1 - e * e), h = -a * e;
  for (const row of demo.dataset.rows) {
    const equation = ((row.x - h) / a) ** 2 + (row.y / b) ** 2;
    assert.ok(Math.abs(equation - 1) < 0.0001);
  }
  const quadrants = new Set(demo.dataset.rows.filter(row => row.split === 'validation').map(row => `${Math.sign(row.x - h)},${Math.sign(row.y)}`));
  assert.equal(quadrants.size, 4);
  assert.ok(demo.model.parameters.find(item => item.key === 'a').min <= b);
  assert.ok(demo.model.parameters.find(item => item.key === 'b').max >= a);
});

test('校验保留独立验证数据，并拒绝无法识别斜率的训练样本', () => {
  const noValidation = copy();
  noValidation.dataset.rows.forEach(row => { row.split = 'train'; });
  assert.throws(() => validateProject(noValidation), /2个验证/);
  const constantX = copy();
  constantX.dataset.rows.filter(row => row.split === 'train').forEach(row => { row.x = 500; });
  assert.throws(() => validateProject(constantX), /不同横坐标/);
});

test('模型参数名称、范围与步长能够被实际控件使用', () => {
  const cases = [
    [project => { project.model.parameters[0].key = 'b'; }, /参数名称/],
    [project => { project.model.parameters[0].step = 0; }, /范围或步长/],
    [project => { project.model.parameters[0].value = 100; }, /初始值/],
    [project => { project.model.family = 'toString'; }, /支持的/],
    [project => { project.model.family = ['linear']; }, /支持的/],
  ];
  for (const [mutate, expected] of cases) {
    const project = copy();
    mutate(project);
    assert.throws(() => validateProject(project), expected);
  }
});

test('图表数据必须是有限数值且包含在初始坐标范围内', () => {
  const invalid = copy();
  invalid.dataset.rows[0].y = Infinity;
  assert.throws(() => validateProject(invalid), /有限数值/);
  const outside = copy();
  outside.dataset.rows[0].x = 1401;
  assert.throws(() => validateProject(outside), /包含全部数据/);
  const hugeDomain = copy();
  hugeDomain.model.xDomain = [0, 1e308];
  assert.throws(() => validateProject(hugeDomain), /数值过大/);
});

test('椭圆使用同一坐标单位、正半轴与二维训练数据', () => {
  assert.doesNotThrow(() => validateProject(ellipseProject()));
  const differentUnits = ellipseProject();
  differentUnits.dataset.yUnit = '千米';
  assert.throws(() => validateProject(differentUnits), /统一单位/);
  const zeroAxis = ellipseProject();
  zeroAxis.model.parameters[0].min = 0;
  assert.throws(() => validateProject(zeroAxis), /半轴/);
  const horizontal = ellipseProject();
  horizontal.dataset.rows.forEach(row => { row.y = 1; });
  assert.throws(() => validateProject(horizontal), /两个方向/);
});

test('指数模型同时检查指数和振幅，避免曲线与误差计算溢出', () => {
  assert.doesNotThrow(() => validateProject(exponentialProject()));
  const exponent = exponentialProject();
  exponent.model.parameters.find(item => item.key === 'k').max = 100;
  assert.throws(() => validateProject(exponent), /指数参数范围/);
  const amplitude = exponentialProject();
  amplitude.model.parameters.find(item => item.key === 'a').max = 1e308;
  assert.throws(() => validateProject(amplitude), /计算溢出/);
});

test('二次模型需要足够的不同横坐标，并限制参数的计算范围', () => {
  const project = copy();
  project.model.family = 'quadratic';
  project.model.parameters = [parameter('a', 0, 1e-3), parameter('b', 0, 4), parameter('c', 0, 500)];
  assert.doesNotThrow(() => validateProject(project));
  project.dataset.rows.filter(row => row.split === 'train').forEach((row, index) => { row.x = index % 2 ? 400 : 800; });
  assert.throws(() => validateProject(project), /3个不同横坐标/);
});

test('任务必须包含实际支持的交互、独立阶段编号与三级提示', () => {
  const cases = [
    [project => { project.stages[1].id = project.stages[0].id; }, /各不相同/],
    [project => { project.stages[0].id = '__proto__'; }, /独立名称/],
    [project => { project.stages[0].interaction.type = 'run-code'; }, /交互类型/],
    [project => { project.stages[0].hints.pop(); }, /3至3项/],
    [project => { project.stages.forEach(stage => { stage.interaction.type = 'data'; }); }, /覆盖数据观察/],
    [project => { project.stages[1].bridge = ''; }, /前后任务联系/],
  ];
  for (const [mutate, expected] of cases) {
    const project = copy();
    mutate(project);
    assert.throws(() => validateProject(project), expected);
  }
});

test('公开数据需要来源链接，并拒绝可执行链接', () => {
  const project = copy();
  project.dataSource.kind = 'public';
  project.dataSource.url = '';
  assert.throws(() => validateProject(project), /来源链接/);
  project.dataSource.url = 'javascript:alert(1)';
  assert.throws(() => validateProject(project), /HTTP或HTTPS/);
  project.dataSource.url = 'https://example.com/dataset';
  assert.doesNotThrow(() => validateProject(project));
});
