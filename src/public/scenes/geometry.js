import { evaluateExpression } from '../expression.js';

const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const format = value => Number.isFinite(value) ? Number(value.toFixed(4)).toLocaleString('zh-CN', { maximumFractionDigits: 4 }) : '—';
const PALETTE = ['#5b927c', '#d3a15d', '#7da76e', '#779bb7', '#a28eb1'];
let sequence = 0;

export function computeGeometry(config, parameters) {
  const value = expression => { try { return evaluateExpression(expression, parameters); } catch { return null; } };
  const metrics = config.metrics.map(metric => ({ label: metric.label, value: value(metric.expression), unit: metric.unit || '' }));
  const constraints = (config.constraints || []).map(constraint => {
    const left = value(constraint.left), right = value(constraint.right);
    const tolerance = 1e-8 * Math.max(1, Math.abs(left || 0), Math.abs(right || 0));
    const met = left !== null && right !== null && (constraint.operator === '<=' ? left <= right + tolerance : constraint.operator === '>=' ? left >= right - tolerance : Math.abs(left - right) <= tolerance);
    return { label: constraint.label, left, operator: constraint.operator, right, met };
  });
  return { metrics, constraints, feasible: constraints.every(constraint => constraint.met) };
}

// 每个坐标单位使用相同像素长度，拖动和尺寸比较保留几何意义。
export function geometryTransform(bounds) {
  const width = 640, height = 430, left = 48, right = 612, top = 25, bottom = 390;
  const scale = Math.min((right - left) / (bounds.x[1] - bounds.x[0]), (bottom - top) / (bounds.y[1] - bounds.y[0]));
  const centerX = (bounds.x[0] + bounds.x[1]) / 2, centerY = (bounds.y[0] + bounds.y[1]) / 2;
  const midX = (left + right) / 2, midY = (top + bottom) / 2;
  return { width, height, left, right, top, bottom, scale, xTo: x => midX + (x - centerX) * scale, yTo: y => midY - (y - centerY) * scale, xFrom: x => centerX + (x - midX) / scale, yFrom: y => centerY - (y - midY) / scale };
}

export function mountGeometry(container, experiment, saved, onChange = () => {}) {
  const config = experiment.config;
  const defaults = Object.fromEntries(config.parameters.map(parameter => [parameter.key, parameter.value]));
  const state = { parameters: { ...defaults, ...saved?.parameters }, comparison: saved?.comparison ? structuredClone(saved.comparison) : null };
  const view = geometryTransform(config.bounds);
  const clipId = `geometry-clip-${++sequence}`;
  let instruction = experiment.description || '';
  let drag = null;
  const query = selector => container.querySelector(selector);
  const getState = () => structuredClone({ type: 'geometry', ...state, ...computeGeometry(config, state.parameters) });
  const emit = () => onChange(getState());

  container.innerHTML = `<section class="visual-scene geometry-scene" aria-label="几何探索实验">
    <p class="scene-instruction"></p>
    <div class="geometry-canvas"><svg class="geometry-svg" viewBox="0 0 ${view.width} ${view.height}" role="group" aria-label="可交互的几何场景"></svg></div>
    ${config.elements.some(element => element.drag) ? '<p class="scene-gesture">拖动图中的实心点，或在下方调整参数。</p>' : ''}
    <div class="scene-metrics" aria-live="polite"></div>
    <div class="scene-constraints" aria-live="polite"></div>
    <div class="scene-controls">${config.parameters.map(parameter => `<div class="scene-control"><label for="${clipId}-${escape(parameter.key)}">${escape(parameter.label)}${parameter.unit ? `<span>（${escape(parameter.unit)}）</span>` : ''}</label><div><input id="${clipId}-${escape(parameter.key)}" type="range" min="${parameter.min}" max="${parameter.max}" step="${parameter.step}" value="${state.parameters[parameter.key]}" data-range="${escape(parameter.key)}" aria-label="${escape(parameter.label)}滑杆"/><input type="number" min="${parameter.min}" max="${parameter.max}" step="${parameter.step}" value="${state.parameters[parameter.key]}" data-number="${escape(parameter.key)}" aria-label="${escape(parameter.label)}数值"/></div></div>`).join('')}</div>
    <div class="scene-comparison" aria-live="polite"></div>
    <div class="scene-actions"><button type="button" data-save>保存当前方案作对照</button><button type="button" class="scene-text-button" data-reset>恢复初始方案</button></div>
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
          return `<circle cx="${x}" cy="${y}" r="${element.drag && !comparison ? 7 : 4}" class="${className} geometry-point ${element.drag ? 'geometry-draggable' : ''}" ${element.drag && !comparison ? `data-drag="${index}" tabindex="0" role="button" aria-label="拖动${escape(element.label || '点') }，方向键微调"` : ''}/>${label(element.label || '', x + 12, y - 13)}`;
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
    const grid = Array.from({ length: 6 }, (_, index) => {
      const x = config.bounds.x[0] + (config.bounds.x[1] - config.bounds.x[0]) * index / 5;
      const y = config.bounds.y[0] + (config.bounds.y[1] - config.bounds.y[0]) * index / 5;
      return `<path d="M${view.xTo(x)} ${view.top}V${view.bottom}M${view.left} ${view.yTo(y)}H${view.right}" class="geometry-grid"/><text x="${view.xTo(x)}" y="${view.bottom + 24}" text-anchor="middle" class="geometry-tick">${format(x)}</text><text x="${view.left - 10}" y="${view.yTo(y) + 4}" text-anchor="end" class="geometry-tick">${format(y)}</text>`;
    }).join('');
    const origin = config.bounds.x[0] <= 0 && config.bounds.x[1] >= 0 && config.bounds.y[0] <= 0 && config.bounds.y[1] >= 0 ? `<path d="M${view.xTo(0)} ${view.top}V${view.bottom}M${view.left} ${view.yTo(0)}H${view.right}" class="geometry-axis"/>` : '';
    query('.geometry-svg').innerHTML = `<defs><clipPath id="${clipId}"><rect x="${view.left - 12}" y="${view.top - 16}" width="${view.right - view.left + 36}" height="${view.bottom - view.top + 42}"/></clipPath></defs>${grid}${origin}<g clip-path="url(#${clipId})">${state.comparison ? drawElements(state.comparison.parameters, true) : ''}${drawElements(state.parameters)}</g>`;
    const computed = computeGeometry(config, state.parameters);
    query('.scene-metrics').innerHTML = computed.metrics.map(metric => `<div><span>${escape(metric.label)}</span><strong>${format(metric.value)}<small>${escape(metric.unit)}</small></strong></div>`).join('');
    query('.scene-constraints').innerHTML = computed.constraints.map(constraint => `<div class="scene-constraint ${constraint.met ? 'met' : 'unmet'}"><span>${constraint.met ? '✓' : '○'} ${escape(constraint.label)}</span><small>${format(constraint.left)} ${constraint.operator === '<=' ? '≤' : constraint.operator === '>=' ? '≥' : '＝'} ${format(constraint.right)}</small></div>`).join('');
    const comparison = query('.scene-comparison');
    if (state.comparison) {
      const past = computeGeometry(config, state.comparison.parameters);
      comparison.innerHTML = `<div class="scene-comparison-title"><strong>已保存的对照方案</strong><button type="button" class="scene-text-button" data-clear>移除对照</button></div><p>${past.metrics.map(metric => `${escape(metric.label)}：${format(metric.value)}${escape(metric.unit)}`).join('　／　')}</p>`;
    } else comparison.innerHTML = '';
  }

  function updateParameter(key, value, updateNumber = true, snap = false) {
    const parameter = config.parameters.find(item => item.key === key);
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
    updateParameter(target.dataset.number, target.value === '' || !Number.isFinite(value) ? state.parameters[target.dataset.number] : value);
    draw(); emit();
  }
  function onClick(event) {
    if (event.target.closest('[data-save]')) { state.comparison = { parameters: { ...state.parameters } }; draw(); emit(); }
    if (event.target.closest('[data-clear]')) { state.comparison = null; draw(); emit(); }
    if (event.target.closest('[data-reset]')) {
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
