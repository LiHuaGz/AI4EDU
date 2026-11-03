import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { evaluateExpression, normalCdf } from '../public/expression.js';
import { transformedStatistics, residualSummary } from '../public/fit-data.js';
import { computeGeometry } from '../public/scenes/geometry.js';
import { pythonContext } from '../public/python-templates.js';
import { answerToMarkdown } from '../public/answer-format.js';

const project = JSON.parse(await readFile(new URL('../demo-project.json', import.meta.url), 'utf8'));
const config = project.experiments[0].config, observations = config.observations;
const parameters = Object.fromEntries(config.parameters.map(item => [item.key, item.value]));
const answers = id => Object.fromEntries(project.stages.find(stage => stage.id === id).checks.map(check => [check.fieldId, check.expected]));
const rad = Math.PI / 180;

// 独立实现：给定速度，按四个入门条件逐点扫描仰角，返回可行区间。
function scanWindow(v, step = 0.0005) {
  let low = null, high = null;
  for (let angle = 10; angle <= 45; angle += step) {
    const t = Math.tan(angle * rad), height = x => x * t - 9.8 * (1 + t * t) * x * x / (2 * v * v);
    if (height(9.15) >= 2.1 && height(20) <= 2.44 && height(20) >= 0 && 20 / (v * Math.cos(angle * rad)) <= 1.2) { low ??= angle; high = angle; }
  }
  return low === null ? null : { low, high, width: high - low };
}
const normal = (low, high, aim, sigma) => normalCdf((high - aim) / sigma) - normalCdf((low - aim) / sigma);

test('标准正态分布函数与已知值一致', () => {
  assert.ok(Math.abs(normalCdf(0) - 0.5) < 1e-15);
  assert.ok(Math.abs(normalCdf(1.96) - 0.9750021048517795) < 1e-12);
  assert.ok(Math.abs(normalCdf(-1) - 0.15865525393145707) < 1e-12);
  assert.ok(Math.abs(normalCdf(3) - 0.9986501019683699) < 1e-12);
  assert.equal(evaluateExpression('Phi(0)+atan(1)*0+acos(1)'), 0.5);
});

test('线性化回归重建出球速度与起脚仰角，验证数据独立于拟合统计量', () => {
  const train = observations.rows.filter(row => row.split === 'train');
  const stats = transformedStatistics(train, observations.transform);
  const b = stats.sxz / stats.sxx, a = stats.meanZ - b * stats.meanX, k = -b;
  const checks = answers('regression');
  assert.ok(Math.abs(k - checks.k_hat) < 1e-5);
  assert.ok(Math.abs(Math.atan(a) / rad - checks.theta_hat) < 0.005);
  assert.ok(Math.abs(Math.sqrt(9.8 * (1 + a * a) / (2 * k)) - checks.v_hat) < 0.005);
  const fitted = { v: checks.v_hat, theta: checks.theta_hat };
  assert.ok(Math.abs(residualSummary(observations, fitted, 'train').rmse - checks.train_rmse) < 0.0006);
  assert.ok(Math.abs(residualSummary(observations, fitted, 'validation').rmse - checks.valid_rmse) < 0.0006);
  // 两点估计的初步参数拟合更差，说明用全部拟合点的必要性。
  const initial = residualSummary(observations, { v: 20.8, theta: 21.1 }, 'train').rmse;
  assert.ok(initial > checks.train_rmse && Math.abs(initial - answers('trajectory').rmse_two_point) < 0.0005);
});

test('习惯脚法过墙但越过横梁，结果与观测的验证点一致', () => {
  const state = { ...parameters, v: 21.56, theta: 20.3 };
  const result = computeGeometry(config, state);
  const checks = answers('habit');
  assert.ok(Math.abs(result.metrics[0].value - checks.height_wall) < 0.001);
  assert.ok(Math.abs(result.metrics[1].value - checks.height_goal) < 0.001);
  assert.deepEqual(result.constraints.map(item => item.met), [true, false, true, true]);
  const last = observations.rows.find(row => row.id === 'V4');
  assert.ok(last.y > 2.44 && Math.abs(last.y - result.metrics[1].value) < 0.1);
});

test('固定速度的仰角窗口与独立扫描一致，窗口两端由横梁与人墙决定', () => {
  const checks = answers('window');
  const scanned = scanWindow(21.6);
  assert.ok(Math.abs(scanned.low - checks.theta_low) < 0.01 && Math.abs(scanned.high - checks.theta_high) < 0.01);
  const window = computeGeometry(config, { ...parameters, v: 21.6, theta: 19 }).window;
  assert.ok(Math.abs(window.low - scanned.low) < 0.001 && Math.abs(window.high - scanned.high) < 0.001);
  assert.ok(Math.abs(window.width - checks.window_width) < 0.005);
  assert.ok(Math.abs(window.bestAim - answers('accuracy').best_aim) < 0.005);
  assert.ok(Math.abs(window.bestProbability - answers('accuracy').probability_best) < 0.0005);
  assert.ok(Math.abs(normal(window.low, window.high, 20.3, 0.8) - answers('accuracy').probability_habit) < 0.0005);
  assert.ok(window.bestProbability < 0.9);
});

test('同时调整速度与仰角后，窗口宽度在两个上限相等处最大，概率达到90％', () => {
  const checks = answers('plan');
  let best = null;
  for (let v = 15; v <= 26.0001; v += 0.01) {
    const found = scanWindow(v, 0.005);
    if (found && (!best || found.width > best.width)) best = { v, ...found };
  }
  assert.ok(Math.abs(best.v - checks.best_speed) < 0.03);
  const window = computeGeometry(config, { ...parameters, v: checks.best_speed, theta: checks.best_angle }).window;
  assert.ok(Math.abs(window.bestAim - checks.best_angle) < 0.03);
  assert.ok(Math.abs(window.probability - checks.probability_best_plan) < 0.001);
  assert.ok(window.probability > 0.9 && answers('plan').probability_keep_speed < 0.9);
  // 速度离开最优点后窗口收窄，说明最优速度不是端点值。
  for (const v of [17.9, 19.5, 21.6]) assert.ok(computeGeometry(config, { ...parameters, v, theta: 20 }).window.width < window.width);
});

test('Python只拿到已揭示的数据，代码与对应运行结果进入Markdown', () => {
  const id = project.experiments[0].id, stage = project.stages[1];
  const snapshot = { experiments: { [id]: { parameters, fit: { validationRevealed: false } } } };
  assert.equal(pythonContext(project, stage, snapshot).validation.length, 0);
  snapshot.experiments[id].fit.validationRevealed = true;
  assert.equal(pythonContext(project, stage, snapshot).validation.length, 4);
  assert.equal(pythonContext(project, stage, snapshot).train.length, 8);
  const record = { python: { code: 'print(1)', edited: true, hasRun: true, output: '1', lastRun: { code: 'print(1)' } } };
  assert.match(answerToMarkdown(stage, record), /```python\nprint\(1\)/);
  assert.match(answerToMarkdown(stage, record), /Python运行结果/);
  record.python.code = 'print(2)';
  assert.doesNotMatch(answerToMarkdown(stage, record), /Python运行结果/);
});
