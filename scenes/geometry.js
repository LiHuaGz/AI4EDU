import { evaluateExpression, normalCdf } from '../expression.js?v=dba71fabac1f';
import { transformedStatistics, residualSummary } from '../fit-data.js?v=dba71fabac1f';

const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const format = value => Number.isFinite(value) ? Number(value.toFixed(4)).toLocaleString('zh-CN', { maximumFractionDigits: 4 }) : '—';
const PALETTE = ['#5b927c', '#d3a15d', '#7da76e', '#779bb7', '#a28eb1'];
let sequence = 0;

const evaluate = (expression, parameters) => { try { return evaluateExpression(expression, parameters); } catch { return null; } };

function checkConstraint(constraint, parameters) {
  const left = evaluate(constraint.left, parameters), right = evaluate(constraint.right, parameters);
  const tolerance = 1e-8 * Math.max(1, Math.abs(left || 0), Math.abs(right || 0));
  const met = left !== null && right !== null && (constraint.operator === '<=' ? left <= right + tolerance : constraint.operator === '>=' ? left >= right - tolerance : Math.abs(left - right) <= tolerance);
  return { label: constraint.label, left, operator: constraint.operator, right, met };
}

// 沿一个角度控件逐点扫描，找出全部约束同时成立的连续区间；端点用二分法精确到1e-6。
// 实际角度服从以瞄准角为均值的正态分布，成功概率为实际角度落入可行区间的概率。
export function angleWindow(config, parameters) {
  const { key, sigmaKey } = config.window;
  const control = config.parameters.find(item => item.key === key);
  const sigma = parameters[sigmaKey], aim = parameters[key], steps = 2000, step = (control.max - control.min) / steps;
  const feasible = angle => (config.constraints || []).every(constraint => checkConstraint(constraint, { ...parameters, [key]: angle }).met);
  const refine = (outside, inside) => {
    for (let i = 0; i < 40; i++) { const middle = (outside + inside) / 2; if (feasible(middle)) inside = middle; else outside = middle; }
    return inside;
  };
  const runs = [];
  let first = null;
  for (let i = 0; i <= steps; i++) {
    const angle = control.min + i * step, ok = feasible(angle);
    if (ok && first === null) first = i;
    if ((!ok || i === steps) && first !== null) {
      const last = ok ? i : i - 1;
      runs.push([first === 0 ? control.min : refine(control.min + (first - 1) * step, control.min + first * step),
        last === steps ? control.max : refine(control.min + (last + 1) * step, control.min + last * step)]);
      first = null;
    }
  }
  const probability = center => runs.reduce((sum, [low, high]) => sum + normalCdf((high - center) / sigma) - normalCdf((low - center) / sigma), 0);
  const widest = runs.reduce((best, run) => !best || run[1] - run[0] > best[1] - best[0] ? run : best, null);
  const center = widest && (widest[0] + widest[1]) / 2;
  return { runs, low: widest?.[0] ?? null, high: widest?.[1] ?? null, width: widest ? widest[1] - widest[0] : 0, sigma, aim,
    probability: probability(aim), bestAim: center, bestProbability: widest ? probability(center) : 0 };
}

export function computeGeometry(config, parameters) {
  const metrics = config.metrics.map(metric => ({ label: metric.label, value: evaluate(metric.expression, parameters), unit: metric.unit || '' }));
  const constraints = (config.constraints || []).map(constraint => checkConstraint(constraint, parameters));
  const result = { metrics, constraints, feasible: constraints.every(constraint => constraint.met) };
  if (config.window) result.window = angleWindow(config, parameters);
  return result;
}

// 刻度取1、2、5的整数倍，约5段，使坐标轴读数整齐。
function niceTicks(min, max) {
  const raw = (max - min) / 5, power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map(factor => factor * power).find(value => value >= raw);
  const ticks = [];
  for (let tick = Math.ceil(min / step) * step; tick <= max + 1e-9; tick += step) ticks.push(Number(tick.toFixed(10)));
  return ticks;
}

// 每个坐标单位使用相同像素长度，拖动和尺寸比较保留几何意义。
export function geometryTransform(bounds) {
  const width = 640, left = 48, right = 612, top = 25;
  const widthScale = (right - left) / (bounds.x[1] - bounds.x[0]);
  // 横向较宽的场景缩短画布，上下不留大片空白；纵向较高的场景保持原有高度上限。
  const innerHeight = Math.min(365, widthScale * (bounds.y[1] - bounds.y[0]));
  const bottom = top + innerHeight, height = bottom + 40;
  const scale = Math.min(widthScale, innerHeight / (bounds.y[1] - bounds.y[0]));
  const centerX = (bounds.x[0] + bounds.x[1]) / 2, centerY = (bounds.y[0] + bounds.y[1]) / 2;
  const midX = (left + right) / 2, midY = (top + bottom) / 2;
  return { width, height, left, right, top, bottom, scale, xTo: x => midX + (x - centerX) * scale, yTo: y => midY - (y - centerY) * scale, xFrom: x => centerX + (x - midX) / scale, yFrom: y => centerY - (y - midY) / scale };
}

export function mountGeometry(container, experiment, saved, onChange = () => {}, stage) {
  const config = experiment.config;
  const defaults = Object.fromEntries(config.parameters.map(parameter => [parameter.key, parameter.value]));
  const state = { parameters: { ...defaults, ...saved?.parameters }, comparison: saved?.comparison ? structuredClone(saved.comparison) : null,
    fit: structuredClone(saved?.fit || { validationRevealed: false, parameters: null, history: [] }) };
  if (stage?.interaction.fitting && state.fit.parameters) Object.assign(state.parameters, state.fit.parameters);
  // 固定参数沿用题设值，恢复历史记录时也保持不变。
  for (const parameter of config.parameters.filter(item => item.min === item.max)) {
    state.parameters[parameter.key] = parameter.value;
    if (state.comparison) state.comparison.parameters[parameter.key] = parameter.value;
  }
  const view = geometryTransform(config.bounds);
  const clipId = `geometry-clip-${++sequence}`;
  let instruction = experiment.description || '';
  let drag = null;
  const query = selector => container.querySelector(selector);
  const getState = () => structuredClone({ type: 'geometry', ...state, ...computeGeometry(config, state.parameters) });
  const emit = () => onChange(getState());

  container.innerHTML = `<section class="visual-scene geometry-scene ${stage?.interaction.fitting ? 'is-fitting' : ''}" aria-label="几何探索实验">
    <div class="scene-layout"><div class="scene-visual">
    <p class="scene-instruction"></p>
    <div class="geometry-canvas"><svg class="geometry-svg" viewBox="0 0 ${view.width} ${view.height}" role="group" aria-label="可交互的几何场景"></svg></div>
    ${config.observations && stage?.interaction.fitting ? '<div class="fit-data-panel"></div>' : ''}
    ${config.caption ? `<p class="scene-gesture">${escape(config.caption)}</p>` : ''}
    ${stage?.interaction.presets?.length ? `<div class="scene-presets" aria-label="任务情景">${stage.interaction.presets.map((preset, index) => `<button type="button" data-preset="${index}">${escape(preset.label)}</button>`).join('')}</div><p class="scene-live-status" role="status"></p>` : ''}
    ${config.elements.some(element => element.drag) ? '<p class="scene-gesture">拖动图中的实心点，或在下方调整参数。</p>' : ''}
    ${stage?.answerFields ? '<details class="scene-check"><summary>查看计算结果与条件检查</summary>' : ''}
    <div class="scene-metrics" aria-live="polite"></div>
    <div class="scene-constraints" aria-live="polite"></div>
    ${config.window && !stage?.interaction.fitting ? '<div class="scene-window"></div>' : ''}
    ${stage?.answerFields ? '</details>' : ''}
    </div><div class="scene-parameter-panel">
    <div class="scene-controls">${config.parameters.map(parameter => parameter.min === parameter.max
      ? `<div class="scene-control"><span>${escape(parameter.label)}（固定）</span><output>${escape(parameter.value)}${escape(parameter.unit || '')}</output></div>`
      : `<div class="scene-control ${config.observations?.lockKeys?.includes(parameter.key) ? 'fit-primary' : ''}"><label for="${clipId}-${escape(parameter.key)}">${escape(parameter.label)}${parameter.unit ? `<span>（${escape(parameter.unit)}）</span>` : ''}</label><div><input id="${clipId}-${escape(parameter.key)}" type="range" min="${parameter.min}" max="${parameter.max}" step="${parameter.step}" value="${state.parameters[parameter.key]}" data-range="${escape(parameter.key)}" aria-label="${escape(parameter.label)}滑杆"/><input type="number" min="${parameter.min}" max="${parameter.max}" step="${parameter.step}" value="${state.parameters[parameter.key]}" data-number="${escape(parameter.key)}" aria-label="${escape(parameter.label)}数值"/></div></div>`).join('')}</div>
    </div></div>
    <div class="scene-comparison" aria-live="polite"></div>
    <div class="scene-actions"><button type="button" data-save>保存当前参数作对照</button><button type="button" class="scene-text-button" data-reset>恢复初始参数</button></div>
  </section>`;
  query('.scene-instruction').textContent = instruction;

  function drawElements(parameters, comparison = false) {
    const value = expression => evaluateExpression(expression, parameters);
    const className = comparison ? 'geometry-shape geometry-ghost' : 'geometry-shape';
    const label = (text, x, y) => !comparison && text ? `<text x="${x}" y="${y}" text-anchor="middle" class="geometry-label">${escape(text)}</text>` : '';
    // 点始终位于填充图形上方，AI给出的元素顺序不会遮挡拖动控件。
    return config.elements.map((element, index) => ({ element, index }))
      .sort((a, b) => Number(a.element.type === 'point') - Number(b.element.type === 'point'))
      .map(({ element, index }) => {
      try {
        const color = PALETTE[index % PALETTE.length];
        const style = comparison ? '' : ` style="--geometry-color:${color};--geometry-fill:${color}18"`;
        if (element.type === 'point') {
          const x = view.xTo(value(element.x)), y = view.yTo(value(element.y));
          const offset = element.labelOffset || { x: 12, y: -13 };
          return `<circle cx="${x}" cy="${y}" r="${element.drag && !comparison ? 7 : 4}" class="${className} geometry-point ${element.drag ? 'geometry-draggable' : ''}" ${element.drag && !comparison ? `data-drag="${index}" tabindex="0" role="button" aria-label="拖动${escape(element.label || '点') }，方向键微调"` : ''}/>${label(element.label || '', x + offset.x, y + offset.y)}`;
        }
        if (element.type === 'curve') {
          // y＝f（x）的函数图象，从from到to取点；低于yMin的部分不绘制，球落地后轨迹随之结束。
          const from = value(element.from), to = value(element.to), floor = element.yMin === undefined ? -Infinity : value(element.yMin);
          const points = [];
          for (let i = 0; i <= 200; i++) {
            const x = from + (to - from) * i / 200, y = evaluateExpression(element.y, { ...parameters, x });
            if (y < floor) break;
            points.push([x, y]);
          }
          const apex = points.reduce((best, point) => point[1] > best[1] ? point : best, points[0]);
          return `<polyline points="${points.map(([x, y]) => `${view.xTo(x)},${view.yTo(y)}`).join(' ')}" class="${className} geometry-curve"${style}/>${label(element.label, view.xTo(apex[0]), view.yTo(apex[1]) - 12)}`;
        }
        if (element.type === 'segment') {
          const x1 = value(element.x1), y1 = value(element.y1), x2 = value(element.x2), y2 = value(element.y2);
          return `<line x1="${view.xTo(x1)}" y1="${view.yTo(y1)}" x2="${view.xTo(x2)}" y2="${view.yTo(y2)}" class="${className} geometry-line"${style}/>${label(element.label, view.xTo((x1 + x2) / 2), view.yTo((y1 + y2) / 2) - 10)}`;
        }
        if (element.type === 'circle' || element.type === 'ellipse') {
          const cx = value(element.cx), cy = value(element.cy);
          const rx = value(element.type === 'circle' ? element.r : element.rx), ry = value(element.type === 'circle' ? element.r : element.ry);
          if (rx < 0 || ry < 0) return '';
          return `<ellipse cx="${view.xTo(cx)}" cy="${view.yTo(cy)}" rx="${rx * view.scale}" ry="${ry * view.scale}" class="${className}"${style}/>${label(element.label, view.xTo(cx), view.yTo(cy + ry) - 11)}`;
        }
        if (element.type === 'rect') {
          const x = value(element.x), y = value(element.y), width = value(element.width), height = value(element.height);
          if (width < 0 || height < 0) return '';
          return `<rect x="${view.xTo(x)}" y="${view.yTo(y + height)}" width="${width * view.scale}" height="${height * view.scale}" class="${className}"${style}/>${label(element.label, view.xTo(x + width / 2), view.yTo(y + height / 2))}${!comparison ? `<text x="${view.xTo(x + width / 2)}" y="${view.yTo(y) + 20}" text-anchor="middle" class="geometry-dimension">${format(width)}</text><text x="${view.xTo(x + width) + 10}" y="${view.yTo(y + height / 2) + 4}" class="geometry-dimension">${format(height)}</text>` : ''}`;
        }
        if (element.type === 'polygon') {
          const points = element.points.map(point => [value(point.x), value(point.y)]);
          const centerX = points.reduce((sum, point) => sum + point[0], 0) / points.length;
          const centerY = points.reduce((sum, point) => sum + point[1], 0) / points.length;
          return `<polygon points="${points.map(([x, y]) => `${view.xTo(x)},${view.yTo(y)}`).join(' ')}" class="${className}"${style}/>${label(element.label, view.xTo(centerX), view.yTo(centerY))}`;
        }
      } catch { return ''; }
      return '';
    }).join('');
  }

  function draw() {
    const horizontal = niceTicks(...config.bounds.x), vertical = niceTicks(...config.bounds.y);
    const grid = horizontal.map(x => `<path d="M${view.xTo(x)} ${view.top}V${view.bottom}" class="geometry-grid"/><text x="${view.xTo(x)}" y="${view.bottom + 24}" text-anchor="middle" class="geometry-tick">${format(x)}</text>`).join('')
      + vertical.map(y => `<path d="M${view.left} ${view.yTo(y)}H${view.right}" class="geometry-grid"/><text x="${view.left - 10}" y="${view.yTo(y) + 4}" text-anchor="end" class="geometry-tick">${format(y)}</text>`).join('');
    const origin = config.bounds.x[0] <= 0 && config.bounds.x[1] >= 0 && config.bounds.y[0] <= 0 && config.bounds.y[1] >= 0 ? `<path d="M${view.xTo(0)} ${view.top}V${view.bottom}M${view.left} ${view.yTo(0)}H${view.right}" class="geometry-axis"/>` : '';
    const observed = (config.observations?.rows || []).filter(row => row.split === 'train' || state.fit.validationRevealed).map(row => `<circle cx="${view.xTo(row.x)}" cy="${view.yTo(row.y)}" r="4.5" fill="${row.split === 'train' ? '#4f81ac' : '#d69a38'}" stroke="white" stroke-width="1.5"><title>${escape(row.id)}：${row.split === 'train' ? '拟合点' : '验证点'}（${row.x}，${row.y}）</title></circle>`).join('');
    query('.geometry-svg').innerHTML = `<defs><clipPath id="${clipId}"><rect x="${view.left - 12}" y="${view.top - 16}" width="${view.right - view.left + 36}" height="${view.bottom - view.top + 42}"/></clipPath></defs>${grid}${origin}<g clip-path="url(#${clipId})">${state.comparison ? drawElements(state.comparison.parameters, true) : ''}${drawElements(state.parameters)}${observed}</g>`;
    const computed = computeGeometry(config, state.parameters);
    const liveStatus = stage?.interaction.presets?.length ? query('.scene-live-status') : null;
    if (liveStatus) {
      liveStatus.textContent = computed.feasible ? '当前参数满足下方列出的全部条件。' : `当前有${computed.constraints.filter(item => !item.met).length}项条件未满足，请展开“查看计算结果与条件检查”。`;
      liveStatus.classList.toggle('met', computed.feasible);
    }
    query('.scene-metrics').innerHTML = computed.metrics.map(metric => `<div><span>${escape(metric.label)}</span><strong>${format(metric.value)}<small>${escape(metric.unit)}</small></strong></div>`).join('');
    query('.scene-constraints').innerHTML = computed.constraints.map(constraint => `<div class="scene-constraint ${constraint.met ? 'met' : 'unmet'}"><span>${constraint.met ? '✓' : '○'} ${escape(constraint.label)}</span><small>${format(constraint.left)} ${constraint.operator === '<=' ? '≤' : constraint.operator === '>=' ? '≥' : '＝'} ${format(constraint.right)}</small></div>`).join('');
    if (config.observations && stage?.interaction.fitting) drawObservations();
    if (config.window && !stage?.interaction.fitting) {
      const window = computed.window, spec = config.window, unit = spec.unit || '', two = value => value.toFixed(2);
      query('.scene-window').innerHTML = window.low === null
        ? `<strong>当前条件下没有可行的${escape(spec.label)}</strong><p>调整其他控件后，再查看可行区间。</p>`
        : `<strong>可行的${escape(spec.label)}：${two(window.low)}${unit}至${two(window.high)}${unit}，宽度${two(window.width)}${unit}</strong><p>实际${escape(spec.label)}服从以瞄准值为均值、标准差为${format(window.sigma)}${unit}的正态分布。按当前${escape(spec.label)}${two(window.aim)}${unit}瞄准，成功概率为${two(window.probability * 100)}％；瞄准区间中点${two(window.bestAim)}${unit}时，成功概率为${two(window.bestProbability * 100)}％。</p><small>区间由图中全部约束共同决定，成功概率按区间内的全部角度累计。</small>`;
    }
    const comparison = query('.scene-comparison');
    if (state.comparison) {
      const past = computeGeometry(config, state.comparison.parameters);
      comparison.innerHTML = `<div class="scene-comparison-title"><strong>已保存的对照方案</strong><button type="button" class="scene-text-button" data-clear>移除对照</button></div><p>${past.metrics.map(metric => `${escape(metric.label)}：${format(metric.value)}${escape(metric.unit)}`).join('　／　')}</p>`;
    } else comparison.innerHTML = '';
  }

  function drawObservations() {
    const observations = config.observations, unit = observations.unit || '';
    const rows = observations.rows.filter(row => row.split === 'train' || state.fit.validationRevealed);
    const parameters = state.fit.parameters || state.parameters;
    const train = residualSummary(observations, parameters, 'train');
    const statisticsOpen = query('.fit-statistics')?.open;
    const tableOpen = query('.observation-table')?.open;
    const validation = state.fit.validationRevealed ? residualSummary(observations, parameters, 'validation') : null;
    const stats = observations.transform ? transformedStatistics(observations.rows.filter(row => row.split === 'train'), observations.transform) : null;
    const canValidate = stage.interaction.validation !== false;
    query('.fit-data-panel').innerHTML = `<p><span class="observation-legend">蓝色点用于拟合；${canValidate ? '金色点用于检验拟合结果。' : '金色验证点将在后面的题目中显示。'}</span></p>
      <p>${state.fit.parameters ? '固定参数后' : '当前参数下'}，${train.count}个拟合点的均方根误差：${format(train.rmse)}${unit}${validation ? `；${validation.count}个验证点的均方根误差：${format(validation.rmse)}${unit}` : canValidate ? '；验证点尚未显示' : ''}。</p>
      ${canValidate ? `<button type="button" data-reveal-validation ${state.fit.validationRevealed ? 'disabled' : ''}>${state.fit.validationRevealed ? '参数已固定，验证点已显示' : '固定拟合参数，显示验证点'}</button>` : ''}
      ${stats ? `<details class="fit-statistics" ${statisticsOpen ? 'open' : ''}><summary>查看参数估计所需的统计量</summary><p>${escape(observations.transform.label)}。拟合点数n＝${stats.count}，横坐标平均值＝${format(stats.meanX)}，变换后纵坐标的平均值＝${format(stats.meanZ)}。</p><p>横坐标离差平方和：Σ（xᵢ－平均x）²＝${format(stats.sxx)}。</p><p>横坐标与变换后纵坐标的离差乘积和：Σ（xᵢ－平均x）（zᵢ－平均z）＝${format(stats.sxz)}。</p></details>` : ''}
      <details class="observation-table" ${tableOpen ? 'open' : ''}><summary>查看观测坐标表</summary><table><thead><tr><th>编号</th><th>x／${escape(unit)}</th><th>y／${escape(unit)}</th><th>用途</th></tr></thead><tbody>${rows.map(row=>`<tr><td>${escape(row.id)}</td><td>${row.x}</td><td>${row.y}</td><td>${row.split === 'train' ? '拟合' : '验证'}</td></tr>`).join('')}</tbody></table></details>
      <small>残差＝观测的y－模型预测的y。均方根误差是残差平方的平均值再开方。${canValidate ? '重新估计参数时点击“恢复初始参数”；第一次验证的参数与结果仍保留。' : ''}</small>`;
    if (canValidate) for (const key of observations.lockKeys) {
      query(`[data-range="${key}"]`).disabled = state.fit.validationRevealed;
      query(`[data-number="${key}"]`).disabled = state.fit.validationRevealed;
    }
  }

  function updateParameter(key, value, updateNumber = true, snap = false) {
    const parameter = config.parameters.find(item => item.key === key);
    if (stage?.interaction.fitting && state.fit.validationRevealed && config.observations.lockKeys.includes(key)) return;
    if (parameter.min === parameter.max) { state.parameters[key] = parameter.value; return; }
    let bounded = Math.max(parameter.min, Math.min(parameter.max, value));
    if (snap) bounded = Number((parameter.min + Math.round((bounded - parameter.min) / parameter.step) * parameter.step).toFixed(10));
    state.parameters[key] = Math.max(parameter.min, Math.min(parameter.max, bounded));
    query(`[data-range="${key}"]`).value = state.parameters[key];
    if (updateNumber) query(`[data-number="${key}"]`).value = state.parameters[key];
  }
  function onInput(event) {
    const target = event.target;
    const key = target.dataset.range || target.dataset.number;
    if (!key || target.value === '') return;
    const parameter = config.parameters.find(item => item.key === key);
    const value = Number(target.value);
    if (!Number.isFinite(value) || value < parameter.min || value > parameter.max) return;
    updateParameter(key, value, Boolean(target.dataset.range)); draw(); emit();
  }
  function onFieldChange(event) {
    const target = event.target;
    if (!target.dataset.number) return;
    const value = Number(target.value);
    const previous = state.parameters[target.dataset.number];
    updateParameter(target.dataset.number, target.value === '' || !Number.isFinite(value) ? state.parameters[target.dataset.number] : value);
    // input已更新数值时，失焦无需重建面板，避免替换正在点击的验证按钮。
    if (previous !== state.parameters[target.dataset.number]) { draw(); emit(); }
  }
  function onClick(event) {
    if (event.target.closest('[data-reveal-validation]') && !state.fit.validationRevealed) {
      const observations = config.observations;
      state.fit.parameters = Object.fromEntries(observations.lockKeys.map(key => [key, state.parameters[key]]));
      state.fit.validationRevealed = true;
      state.fit.history.push({ parameters: { ...state.fit.parameters }, train: residualSummary(observations, state.parameters, 'train'), validation: residualSummary(observations, state.parameters, 'validation') });
      draw(); emit();
    }
    const presetButton = event.target.closest('[data-preset]');
    if (presetButton) {
      Object.entries(stage.interaction.presets[Number(presetButton.dataset.preset)].values).forEach(([key, value]) => updateParameter(key, value));
      draw(); emit();
    }
    if (event.target.closest('[data-save]')) { state.comparison = { parameters: { ...state.parameters } }; draw(); emit(); }
    if (event.target.closest('[data-clear]')) { state.comparison = null; draw(); emit(); }
    if (event.target.closest('[data-reset]')) {
      if (stage?.interaction.fitting) { state.fit.validationRevealed = false; state.fit.parameters = null; }
      Object.entries(defaults).forEach(([key, value]) => updateParameter(key, value)); state.comparison = null; draw(); emit();
    }
  }
  function onPointerDown(event) {
    const handle = event.target.closest('[data-drag]');
    if (!handle) return;
    drag = config.elements[Number(handle.dataset.drag)].drag;
    query('.geometry-svg').setPointerCapture(event.pointerId);
    event.preventDefault();
  }
  function onPointerMove(event) {
    if (!drag) return;
    const rect = query('.geometry-svg').getBoundingClientRect();
    if (drag.xKey) updateParameter(drag.xKey, view.xFrom((event.clientX - rect.left) / rect.width * view.width), true, true);
    if (drag.yKey) updateParameter(drag.yKey, view.yFrom((event.clientY - rect.top) / rect.height * view.height), true, true);
    draw(); emit();
  }
  function onPointerUp() { drag = null; }
  function onKeyDown(event) {
    const handle = event.target.closest('[data-drag]');
    if (!handle || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    const keys = config.elements[Number(handle.dataset.drag)].drag;
    const key = ['ArrowLeft', 'ArrowRight'].includes(event.key) ? keys.xKey : keys.yKey;
    if (!key) return;
    const parameter = config.parameters.find(item => item.key === key);
    updateParameter(key, state.parameters[key] + parameter.step * (['ArrowRight', 'ArrowUp'].includes(event.key) ? 1 : -1), true, true);
    event.preventDefault(); draw(); query(`[data-drag="${handle.dataset.drag}"]`)?.focus(); emit();
  }
  const events = { input: onInput, change: onFieldChange, click: onClick, pointerdown: onPointerDown, pointermove: onPointerMove, pointerup: onPointerUp, pointercancel: onPointerUp, keydown: onKeyDown };
  Object.entries(events).forEach(([event, listener]) => container.addEventListener(event, listener));
  draw();
  return { getState, setInstruction(text) { instruction = text; query('.scene-instruction').textContent = instruction; }, destroy() { Object.entries(events).forEach(([event, listener]) => container.removeEventListener(event, listener)); container.innerHTML = ''; } };
}
