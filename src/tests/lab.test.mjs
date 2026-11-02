import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateModel, computeMetrics, residual, formatFormula, createPlotTransform, mountLab } from '../public/lab.js';

test('四类模型按数学定义计算，并标记椭圆范围外的预测', () => {
  assert.equal(evaluateModel('linear', { m: 2, b: 3 }, 4), 11);
  assert.equal(evaluateModel('quadratic', { a: -1, b: 6, c: 2 }, 3), 11);
  assert.equal(evaluateModel('exponential', { a: 2, k: 0, c: 1 }, 5), 3);
  assert.deepEqual(evaluateModel('ellipse', { a: 5, b: 3, h: 2, k: 4 }, 2), [7, 1]);
  assert.equal(evaluateModel('ellipse', { a: 5, b: 3, h: 2, k: 4 }, 8), null);
  assert.equal(evaluateModel('exponential', { a: 1, k: 1000, c: 0 }, 5), null);
});

test('训练与验证误差分别计算，排除记录不参与统计', () => {
  const rows = [
    { x: 0, y: 3, split: 'train' },
    { x: 1, y: 5, split: 'train' },
    { x: 2, y: 8, split: 'validation' },
    { x: 3, y: 100, split: 'excluded' },
  ];
  const parameters = { m: 2, b: 3 };
  assert.deepEqual(computeMetrics('linear', parameters, rows), { count: 2, invalidCount: 0, rmse: 0, mae: 0, maxError: 0 });
  assert.deepEqual(computeMetrics('linear', parameters, rows, 'validation'), { count: 1, invalidCount: 0, rmse: 1, mae: 1, maxError: 1 });
  assert.equal(computeMetrics('linear', parameters, [], 'validation').rmse, null);
});

test('椭圆误差采用同一中心方向的径向距离', () => {
  const parameters = { a: 5, b: 3, h: 2, k: 4 };
  assert.equal(residual('ellipse', parameters, { x: 7, y: 4 }), 0);
  assert.equal(residual('ellipse', parameters, { x: 2, y: 9 }), 2);
  assert.equal(residual('ellipse', parameters, { x: 2, y: 4 }), -3);
  const point = { x: 2 + 5 / Math.sqrt(2), y: 4 + 3 / Math.sqrt(2) };
  assert.ok(Math.abs(residual('ellipse', parameters, point)) < 1e-12);
});

test('对照模型计算独立，调整新参数不会改变旧结果', () => {
  const rows = [{ x: 2, y: 7, split: 'validation' }];
  const before = { m: 2, b: 3 };
  const after = { m: 3, b: 3 };
  assert.equal(computeMetrics('linear', before, rows, 'validation').rmse, 0);
  assert.equal(computeMetrics('linear', after, rows, 'validation').rmse, 2);
  assert.equal(formatFormula('quadratic', { a: 1, b: -2, c: 3 }), 'y = 1x² − 2x + 3');
});

test('坐标变换在四个象限保持方向，椭圆横纵单位长度相等', () => {
  const model = { family: 'ellipse', xDomain: [-2, 2], yDomain: [-2, 2] };
  const plot = createPlotTransform(model, [], { a: 1.5, b: 1.2, h: 0, k: 0 });
  assert.equal(plot.svgWidth, 640);
  assert.equal(plot.svgHeight, 460);
  assert.ok(Math.abs((plot.xTo(1) - plot.xTo(0)) - (plot.yTo(0) - plot.yTo(1))) < 1e-10);
  assert.ok(plot.xTo(1) > plot.xTo(0) && plot.yTo(1) < plot.yTo(0));
  assert.ok(plot.xTo(-1) < plot.xTo(0) && plot.yTo(1) < plot.yTo(0));
  assert.ok(plot.xTo(-1) < plot.xTo(0) && plot.yTo(-1) > plot.yTo(0));
  assert.ok(plot.xTo(1) > plot.xTo(0) && plot.yTo(-1) > plot.yTo(0));
  const circleWidth = plot.xTo(1.5) - plot.xTo(-1.5);
  const circleHeight = plot.yTo(-1.5) - plot.yTo(1.5);
  assert.ok(Math.abs(circleWidth - circleHeight) < 1e-10);
});

test('椭圆图范围包含平移后的当前模型和对照模型', () => {
  const plot = createPlotTransform(
    { family: 'ellipse', xDomain: [-1, 1], yDomain: [-1, 1] },
    [{ x: -5, y: 0 }], { a: 2, b: 3, h: 4, k: -2 }, { a: 1, b: 4, h: -3, k: 1 },
  );
  assert.ok(plot.minX <= -5 && plot.maxX >= 6);
  assert.ok(plot.minY <= -5 && plot.maxY >= 5);
  assert.ok(Math.abs((plot.xTo(1) - plot.xTo(0)) - (plot.yTo(0) - plot.yTo(1))) < 1e-10);
});

test('无法计算的样本计入总数并使指标暂缺，有限大误差计算保持有限', () => {
  const rows = [{ x: 0, y: 1, split: 'train' }, { x: 1000, y: 1, split: 'train' }];
  const metrics = computeMetrics('exponential', { a: 1, k: 1, c: 0 }, rows);
  assert.equal(metrics.count, 2);
  assert.equal(metrics.invalidCount, 1);
  assert.equal(metrics.rmse, null);
  const large = computeMetrics('linear', { m: 0, b: 0 }, [{ x: 0, y: 1e200, split: 'train' }]);
  assert.equal(large.rmse, 1e200);
});

test('零系数与负参数按定义保留，椭圆四象限边界的误差相同', () => {
  assert.equal(evaluateModel('linear', { m: 0, b: -2 }, 10), -2);
  assert.equal(evaluateModel('quadratic', { a: 0, b: -2, c: 0 }, -3), 6);
  const parameters = { a: 5, b: 3, h: -1, k: -2 };
  for (const signX of [-1, 1]) {
    for (const signY of [-1, 1]) {
      const point = { x: -1 + signX * 5 / Math.sqrt(2), y: -2 + signY * 3 / Math.sqrt(2) };
      assert.ok(Math.abs(residual('ellipse', parameters, point)) < 1e-12);
    }
  }
});

test('数字框的input立即更新模型、预测与数据，并保留小数编辑文本', () => {
  // 用最小容器记录事件与输出，直接验证浏览器input路径，避免依赖真实浏览器。
  const nodes = new Map();
  const listeners = new Map();
  const container = {
    innerHTML: '',
    querySelector(selector) {
      if (!nodes.has(selector)) nodes.set(selector, { value: '', innerHTML: '', textContent: '', hidden: false });
      return nodes.get(selector);
    },
    addEventListener(event, listener) { listeners.set(event, listener); },
    removeEventListener(event) { listeners.delete(event); },
  };
  const project = {
    dataset: { xLabel: '人数', yLabel: '需求', xUnit: '人', yUnit: '升', rows: [{ id: 'r1', x: 1, y: 2, split: 'train' }, { id: 'r2', x: 2, y: 4, split: 'validation' }] },
    model: {
      family: 'linear', xDomain: [0, 10], yDomain: [0, 20],
      parameters: [{ key: 'm', label: '斜率', min: 0, max: 5, step: 0.1, value: 1 }, { key: 'b', label: '截距', min: -5, max: 5, step: 0.1, value: 0 }],
    },
    stages: [{ interaction: { type: 'compare', instruction: '调整参数并比较预测。' } }],
  };
  const lab = mountLab(container, project);
  const parameter = { value: '2.5000', dataset: { paramNumber: 'm' }, matches: selector => selector === '[data-param-number]' };
  nodes.set('[data-param-number="m"]', parameter);
  listeners.get('input')({ target: parameter });
  assert.equal(lab.getState().parameters.m, 2.5);
  assert.equal(parameter.value, '2.5000');
  assert.equal(nodes.get('[data-param="m"]').value, 2.5);

  const prediction = { value: '0.6500', dataset: {}, matches: selector => selector === '[data-prediction-number]' };
  nodes.set('[data-prediction-number]', prediction);
  listeners.get('input')({ target: prediction });
  assert.equal(lab.getState().predictionX, 0.65);
  assert.equal(prediction.value, '0.6500');
  assert.equal(nodes.get('[data-prediction]').value, 0.65);

  const row = { value: '0.7500', dataset: { row: '0', field: 'x' }, matches: selector => selector === '[data-row]' };
  listeners.get('input')({ target: row });
  assert.equal(lab.getState().rows[0].x, 0.75);
  assert.equal(row.value, '0.7500');
  row.value = '';
  listeners.get('input')({ target: row });
  assert.equal(lab.getState().rows[0].x, 0.75);
  listeners.get('change')({ target: row });
  assert.equal(row.value, 0.75);

  parameter.value = '99';
  listeners.get('input')({ target: parameter });
  assert.equal(lab.getState().parameters.m, 2.5);
  listeners.get('change')({ target: parameter });
  assert.equal(lab.getState().parameters.m, 5);
  assert.equal(parameter.value, 5);
  lab.destroy();
  assert.equal(listeners.size, 0);
});
