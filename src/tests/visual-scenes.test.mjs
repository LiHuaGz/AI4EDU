import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateExpression, validateExpression } from '../public/expression.js';
import { computeGeometry, geometryTransform, mountGeometry } from '../public/scenes/geometry.js';
import { computeAllocation, mountAllocation } from '../public/scenes/allocation.js';
import { mountWorkbench } from '../public/experiment-workbench.js';

const geometry = {
  id: 'garden', type: 'geometry', description: '拖动花园右上角，观察面积。',
  config: {
    parameters: [{ key: 'width', label: '花园宽度', min: 1, max: 19, step: 0.25, value: 6, unit: '米' }],
    bounds: { x: [-2, 22], y: [-2, 22] },
    elements: [{ type: 'rect', x: 0, y: 0, width: 'width', height: '20-width', label: '花园' }, { type: 'point', x: 'width', y: '20-width', drag: { xKey: 'width' }, label: '拖动宽度' }],
    metrics: [{ label: '面积', expression: 'width*(20-width)', unit: '平方米' }, { label: '围栏长度', expression: '2*width+2*(20-width)', unit: '米' }],
    constraints: [{ label: '保留至少３米的纵向空间', left: '20-width', operator: '>=', right: 3 }],
  },
};
const allocation = {
  id: 'activities', type: 'allocation', description: '分配两个活动的场次。',
  config: {
    items: [
      { key: 'sports', label: '体育活动', min: 0, max: 10, step: 1, value: 2, score: 30, unit: '场', resourceUse: { space: 2, volunteers: 3 } },
      { key: 'science', label: '科学活动', min: 0, max: 10, step: 1, value: 3, score: 20, unit: '场', resourceUse: { space: 1, volunteers: 2 } },
    ],
    resources: [{ key: 'space', label: '可用场地', capacity: 12, unit: '间' }, { key: 'volunteers', label: '志愿者', capacity: 18, unit: '人' }],
    objective: { label: '可参与人数', unit: '人', direction: 'max' },
  },
};

test('数学表达式遵循幂与负号优先级，并计算带变量的几何公式', () => {
  assert.equal(evaluateExpression('-2^2'), -4);
  assert.equal(evaluateExpression('2^3^2'), 512);
  assert.equal(evaluateExpression('2^-2'), 0.25);
  assert.equal(evaluateExpression('1e-3 + .5'), 0.501);
  assert.equal(evaluateExpression('sqrt(x^2+y^2)', { x: 3, y: 4 }), 5);
  assert.equal(evaluateExpression('min(2,8,4)+max(1,3)'), 5);
  assert.equal(evaluateExpression('pow(3,2)+round(2.4)'), 11);
  assert.ok(Math.abs(evaluateExpression('sin(pi/2)+cos(0)') - 2) < 1e-12);
  assert.equal(evaluateExpression('3×4−6÷2'), 9);
});

test('表达式仅接受数学语法与已声明变量，拒绝脚本和非法定义域', () => {
  assert.equal(validateExpression('width*(20-width)', ['width']), true);
  assert.throws(() => validateExpression('width*height', ['width']), /未定义/);
  for (const expression of ['globalThis.alert(1)', 'constructor.constructor(1)', 'x=1', 'x;process.exit()', '[1][0]', 'sqrt()', '2 width']) {
    assert.throws(() => validateExpression(expression, ['x', 'width']));
  }
  assert.throws(() => evaluateExpression('sqrt(-1)'), /定义域/);
  assert.throws(() => evaluateExpression('1/0'), /定义域/);
  assert.throws(() => evaluateExpression('x', Object.create({ x: 2 })), /缺少/);
});

test('几何任务可比较固定周长下的面积，并显示限制是否满足', () => {
  const narrow = computeGeometry(geometry.config, { width: 6 });
  const square = computeGeometry(geometry.config, { width: 10 });
  const invalid = computeGeometry(geometry.config, { width: 19 });
  assert.equal(narrow.metrics[0].value, 84);
  assert.equal(square.metrics[0].value, 100);
  assert.equal(narrow.metrics[1].value, square.metrics[1].value);
  assert.equal(square.metrics[1].value, 40);
  assert.equal(square.feasible, true);
  assert.equal(invalid.feasible, false);
  const domain = computeGeometry({ ...geometry.config, metrics: [{ label: '测试', expression: '1/(width-10)' }] }, { width: 10 });
  assert.equal(domain.metrics[0].value, null);
});

test('几何画布保持单位等比例，鼠标坐标可以精确映射回数学坐标', () => {
  const view = geometryTransform({ x: [-2, 22], y: [-2, 10] });
  assert.ok(Math.abs((view.xTo(1) - view.xTo(0)) - (view.yTo(0) - view.yTo(1))) < 1e-10);
  assert.ok(Math.abs(view.xFrom(view.xTo(3.5)) - 3.5) < 1e-10);
  assert.ok(Math.abs(view.yFrom(view.yTo(-1.25)) + 1.25) < 1e-10);
});

test('资源分配分别计算目标与各项消耗，超额方案不能被标为可行', () => {
  const valid = computeAllocation(allocation.config, { sports: 2, science: 3 });
  assert.equal(valid.objective, 120);
  assert.equal(valid.resources[0].used, 7);
  assert.equal(valid.resources[1].used, 12);
  assert.equal(valid.feasible, true);
  const excess = computeAllocation(allocation.config, { sports: 5, science: 3 });
  assert.equal(excess.objective, 210);
  assert.equal(excess.resources[0].remaining, -1);
  assert.equal(excess.resources[1].remaining, -3);
  assert.equal(excess.feasible, false);
});

// 用最小事件容器验证连续编辑、拖动与持久化快照，而不是依赖浏览器自动填值行为。
function fixtureContainer() {
  const nodes = new Map(), listeners = new Map();
  const container = {
    innerHTML: '',
    querySelector(selector) {
      if (!nodes.has(selector)) nodes.set(selector, { value: '', innerHTML: '', textContent: '', focus() {}, setPointerCapture() {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 640, height: 430 }) });
      return nodes.get(selector);
    },
    addEventListener(event, listener) { listeners.set(event, listener); },
    removeEventListener(event) { listeners.delete(event); },
  };
  return { container, nodes, listeners };
}

test('几何数值框与拖动即时更新，保存的对照参数独立保留', () => {
  const { container, nodes, listeners } = fixtureContainer();
  const scene = mountGeometry(container, geometry);
  const input = { value: '5.2500', dataset: { number: 'width' } };
  nodes.set('[data-number="width"]', input);
  listeners.get('input')({ target: input });
  assert.equal(scene.getState().parameters.width, 5.25);
  assert.equal(input.value, '5.2500');
  listeners.get('click')({ target: { closest: selector => selector === '[data-save]' } });
  const view = geometryTransform(geometry.config.bounds);
  listeners.get('pointerdown')({ target: { closest: () => ({ dataset: { drag: '1' } }) }, pointerId: 1, preventDefault() {} });
  listeners.get('pointermove')({ clientX: view.xTo(12), clientY: view.yTo(8) });
  assert.equal(scene.getState().parameters.width, 12);
  assert.equal(scene.getState().comparison.parameters.width, 5.25);
  listeners.get('pointerup')();
  scene.setInstruction('<script>只显示文字</script>');
  assert.equal(nodes.get('.scene-instruction').textContent, '<script>只显示文字</script>');
  scene.destroy();
  assert.equal(listeners.size, 0);
});

test('固定参数显示为常量，恢复、对照和重置保持题设数值', () => {
  const experiment = structuredClone(geometry);
  experiment.config.parameters.push({ key: 'perimeter', label: '围栏总长', min: 40, max: 40, value: 40, step: 0, unit: '米' });
  experiment.config.metrics[0].expression = 'width*(perimeter/2-width)';
  const { container, listeners } = fixtureContainer();
  const scene = mountGeometry(container, experiment, { parameters: { width: 10, perimeter: 80 }, comparison: { parameters: { width: 6, perimeter: 80 } } });
  assert.match(container.innerHTML, /围栏总长（固定）/);
  assert.doesNotMatch(container.innerHTML, /data-range="perimeter"/);
  assert.equal(scene.getState().metrics[0].value, 100);
  assert.equal(scene.getState().comparison.parameters.perimeter, 40);
  listeners.get('click')({ target: { closest: selector => selector === '[data-reset]' } });
  assert.equal(scene.getState().parameters.perimeter, 40);
  assert.equal(scene.getState().metrics[0].value, 84);
  scene.destroy();
});

test('分配数值输入更新资源条，跨阶段恢复快照后保留方案和对照', () => {
  const { container, nodes, listeners } = fixtureContainer();
  const scene = mountAllocation(container, allocation);
  const input = { value: '5', dataset: { number: 'sports' } };
  nodes.set('[data-number="sports"]', input);
  listeners.get('input')({ target: input });
  assert.equal(scene.getState().objective, 210);
  assert.equal(scene.getState().feasible, false);
  listeners.get('click')({ target: { closest: selector => selector === '[data-save]' } });
  input.value = '1'; listeners.get('input')({ target: input });
  assert.equal(scene.getState().objective, 90);
  assert.equal(scene.getState().comparison.quantities.sports, 5);
  const snapshot = scene.getState(); scene.destroy();
  const second = fixtureContainer();
  const restored = mountAllocation(second.container, allocation, snapshot);
  assert.equal(restored.getState().quantities.sports, 1);
  assert.equal(restored.getState().comparison.quantities.sports, 5);
  restored.destroy();
});

test('分区布局在AI常用的字符串尺寸和任意元素顺序下正确渲染', () => {
  // 从真实生成结果提炼的通用案例：两个变量分区、字符串尺寸、靠边拖动点。
  const layout = {
    id: 'layout', type: 'geometry', description: '调整两个分区的分界线。',
    config: {
      parameters: [{ key: 'w', label: '分区宽度', min: 0, max: 10, step: 0.1, value: 4 }],
      bounds: { x: [-1, 11], y: [-1, 11] },
      elements: [
        { type: 'point', x: 0, y: 'w', label: '分界点', drag: { yKey: 'w' } },
        { type: 'rect', x: 0, y: 0, width: '10', height: 'w', label: '分区一' },
        { type: 'rect', x: 0, y: 'w', width: '10', height: '10-w', label: '分区二' },
      ],
      metrics: [{ label: '分区一面积', expression: '10*w' }, { label: '分区二面积', expression: '10*(10-w)' }],
      constraints: [{ label: '分区一至少20', left: '10*w', operator: '>=', right: 20 }, { label: '分区二至少30', left: '10*(10-w)', operator: '>=', right: 30 }],
    },
  };
  const { container, nodes, listeners } = fixtureContainer();
  const scene = mountGeometry(container, layout);
  assert.deepEqual(scene.getState().metrics.map(metric => metric.value), [40, 60]);
  assert.equal(scene.getState().feasible, true);
  const svg = nodes.get('.geometry-svg').innerHTML;
  assert.ok(!/NaN|Infinity|undefined/.test(svg));
  assert.ok(svg.lastIndexOf('data-drag="0"') > svg.lastIndexOf('<rect'), '拖动点应绘制在填充图形上方');
  const view = geometryTransform(layout.config.bounds);
  listeners.get('pointerdown')({ target: { closest: () => ({ dataset: { drag: '0' } }) }, pointerId: 1, preventDefault() {} });
  listeners.get('pointermove')({ clientX: view.xTo(0), clientY: view.yTo(8) });
  assert.deepEqual(scene.getState().metrics.map(metric => metric.value), [80, 20]);
  assert.equal(scene.getState().feasible, false);
  assert.ok(!/NaN|Infinity|undefined/.test(nodes.get('.geometry-svg').innerHTML));
  scene.destroy();
});

test('工作台在不同实验和任务之间保留独立状态，导出快照不共享引用', () => {
  const { container, nodes, listeners } = fixtureContainer();
  const project = { version: 2, experiments: [geometry, allocation] };
  const changes = [];
  const workbench = mountWorkbench(container, project, null, snapshot => changes.push(snapshot));
  const geometryStage = { interaction: { experimentId: geometry.id, instruction: '调整图形。' } };
  const allocationStage = { interaction: { experimentId: allocation.id, instruction: '分配资源。' } };
  workbench.setStage(geometryStage);
  const widthInput = { value: '8', dataset: { number: 'width' } };
  nodes.set('[data-number="width"]', widthInput);
  listeners.get('input')({ target: widthInput });
  workbench.setStage(allocationStage);
  const quantityInput = { value: '5', dataset: { number: 'sports' } };
  nodes.set('[data-number="sports"]', quantityInput);
  listeners.get('input')({ target: quantityInput });
  const snapshot = workbench.getState();
  assert.equal(snapshot.experiments.garden.parameters.width, 8);
  assert.equal(snapshot.experiments.activities.quantities.sports, 5);
  snapshot.experiments.garden.parameters.width = 99;
  workbench.setStage(geometryStage);
  assert.equal(workbench.getState().experiments.garden.parameters.width, 8);
  assert.equal(workbench.getState().experiments.activities.quantities.sports, 5);
  assert.equal(changes.at(-1).activeExperimentId, allocation.id);
  assert.equal(nodes.get('.scene-instruction').textContent, '调整图形。');
  workbench.destroy();
  assert.equal(listeners.size, 0);
});
