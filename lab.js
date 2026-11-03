// 模型计算只接受约定的四种数学模型，模型输出始终作为数据处理。
export function evaluateModel(family, parameters, x) {
  const p = parameters;
  let y;
  if (family === 'linear') y = p.m * x + p.b;
  else if (family === 'quadratic') y = p.a * x * x + p.b * x + p.c;
  else if (family === 'exponential') y = p.a * Math.exp(p.k * x) + p.c;
  else if (family === 'ellipse') {
    const radicand = 1 - ((x - p.h) / p.a) ** 2;
    if (radicand < 0 || p.a <= 0 || p.b <= 0) return null;
    const offset = p.b * Math.sqrt(radicand);
    return [p.k + offset, p.k - offset];
  } else return null;
  return Number.isFinite(y) ? y : null;
}

export function residual(family, parameters, row) {
  if (family !== 'ellipse') {
    const predicted = evaluateModel(family, parameters, row.x);
    return predicted === null ? null : row.y - predicted;
  }
  const { a, b, h, k } = parameters;
  if (a <= 0 || b <= 0) return null;
  const dx = row.x - h;
  const dy = row.y - k;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) return -Math.min(a, b);
  const boundaryDistance = 1 / Math.sqrt((dx / distance / a) ** 2 + (dy / distance / b) ** 2);
  return distance - boundaryDistance;
}

export function computeMetrics(family, parameters, rows, split = 'train') {
  const errors = rows.filter(row => row.split === split).map(row => residual(family, parameters, row));
  const values = errors.filter(value => value !== null && Number.isFinite(value));
  const count = errors.length;
  const invalidCount = count - values.length;
  // 一旦有样本无法计算，就显示缺失指标，避免丢弃困难样本后产生偏低误差。
  if (!count || invalidCount) return { count, invalidCount, rmse: null, mae: null, maxError: null };
  const scale = Math.max(...values.map(Math.abs));
  if (scale === 0) return { count, invalidCount: 0, rmse: 0, mae: 0, maxError: 0 };
  return {
    count,
    invalidCount: 0,
    rmse: scale * Math.sqrt(values.reduce((sum, error) => sum + (error / scale) ** 2, 0) / count),
    mae: scale * (values.reduce((sum, error) => sum + Math.abs(error) / scale, 0) / count),
    maxError: scale,
  };
}

// 椭圆坐标轴使用相同单位长度，圆与椭圆的视觉形状因此保持几何意义。
export function createPlotTransform(model, rows, parameters, comparison) {
  const ellipse = model.family === 'ellipse';
  const svgWidth = ellipse ? 640 : 760;
  const svgHeight = ellipse ? 460 : 420;
  const left = ellipse ? 65 : 68, right = ellipse ? 620 : 706, top = ellipse ? 30 : 34, bottom = ellipse ? 405 : 356;
  let minX = Math.min(model.xDomain[0], ...rows.map(row => row.x));
  let maxX = Math.max(model.xDomain[1], ...rows.map(row => row.x));
  let minY = Math.min(model.yDomain[0], ...rows.map(row => row.y));
  let maxY = Math.max(model.yDomain[1], ...rows.map(row => row.y));
  if (model.family === 'ellipse') {
    for (const p of [parameters, comparison].filter(Boolean)) {
      minX = Math.min(minX, p.h - p.a);
      maxX = Math.max(maxX, p.h + p.a);
      minY = Math.min(minY, p.k - p.b);
      maxY = Math.max(maxY, p.k + p.b);
    }
    const unitsPerPixel = Math.max((maxX - minX) / (right - left), (maxY - minY) / (bottom - top));
    const middleX = (minX + maxX) / 2;
    const middleY = (minY + maxY) / 2;
    const halfWidth = unitsPerPixel * (right - left) / 2;
    const halfHeight = unitsPerPixel * (bottom - top) / 2;
    [minX, maxX] = [middleX - halfWidth, middleX + halfWidth];
    [minY, maxY] = [middleY - halfHeight, middleY + halfHeight];
  }
  return {
    svgWidth, svgHeight, left, right, top, bottom, minX, maxX, minY, maxY,
    xTo: x => left + (x - minX) / (maxX - minX) * (right - left),
    yTo: y => bottom - (y - minY) / (maxY - minY) * (bottom - top),
  };
}

function number(value, digits = 2) {
  if (value === null || !Number.isFinite(value)) return '—';
  if (Math.abs(value) >= 1e7 || (value !== 0 && Math.abs(value) < 1e-5)) return value.toExponential(2);
  return Number(value.toFixed(digits)).toLocaleString('zh-CN', { maximumFractionDigits: digits });
}

function term(value, variable = '') {
  return ` ${value >= 0 ? '+' : '−'} ${number(Math.abs(value), 4)}${variable}`;
}

export function formatFormula(family, p) {
  if (family === 'linear') return `y = ${number(p.m, 3)}x${term(p.b)}`;
  if (family === 'quadratic') return `y = ${number(p.a, 3)}x²${term(p.b, 'x')}${term(p.c)}`;
  if (family === 'exponential') return `y = ${number(p.a, 3)}·e^(${number(p.k, 3)}x)${term(p.c)}`;
  const inside = (variable, value) => value >= 0 ? `${variable} − ${number(value, 4)}` : `${variable} + ${number(-value, 4)}`;
  return `(${inside('x', p.h)})² / ${number(p.a, 4)}² + (${inside('y', p.k)})² / ${number(p.b, 4)}² = 1`;
}

function escape(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function axisLabel(label, unit) {
  return `${label}${unit ? `（${unit}）` : ''}`;
}

export function mountLab(container, project, initialState = {}, onChange = () => {}) {
  const definition = project.model;
  let stage = project.stages[0];
  let selectedRow = null;
  // 预测横坐标保留四位小数，避免中点出现长串浮点尾数。
  const roundX = value => Number(Number(value).toFixed(4));
  const state = {
    rows: structuredClone(initialState?.rows ?? project.dataset.rows),
    parameters: { ...Object.fromEntries(definition.parameters.map(p => [p.key, p.value])), ...initialState?.parameters },
    predictionX: initialState?.predictionX ?? roundX((definition.xDomain[0] + definition.xDomain[1]) / 2),
    comparison: initialState?.comparison ? structuredClone(initialState.comparison) : null,
  };
  const getState = () => structuredClone({
    ...state,
    formula: formatFormula(definition.family, state.parameters),
    metrics: {
      train: computeMetrics(definition.family, state.parameters, state.rows, 'train'),
      validation: computeMetrics(definition.family, state.parameters, state.rows, 'validation'),
    },
  });
  const emit = () => onChange(getState());
  const query = selector => container.querySelector(selector);

  function tableMarkup() {
    return `<div class="lab-table-scroll"><table class="lab-data-table"><caption class="lab-sr-only">编辑数据与训练、验证分组</caption><thead><tr><th scope="col">编号</th><th scope="col">${escape(axisLabel(project.dataset.xLabel, project.dataset.xUnit))}</th><th scope="col">${escape(axisLabel(project.dataset.yLabel, project.dataset.yUnit))}</th><th scope="col">数据用途</th></tr></thead><tbody>${state.rows.map((row, index) => `<tr data-row-id="${escape(row.id)}"><td>${String(index + 1).padStart(2, '0')}</td><td><input type="number" step="any" value="${row.x}" data-row="${index}" data-field="x" aria-label="第${index + 1}行${escape(project.dataset.xLabel)}"></td><td><input type="number" step="any" value="${row.y}" data-row="${index}" data-field="y" aria-label="第${index + 1}行${escape(project.dataset.yLabel)}"></td><td><select data-row="${index}" data-field="split" aria-label="第${index + 1}行数据用途">${[['train', '训练数据'], ['validation', '验证数据'], ['excluded', '暂时排除']].map(([value, label]) => `<option value="${value}"${row.split === value ? ' selected' : ''}>${label}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div>`;
  }

  function render() {
    const type = stage.interaction.type;
    const hasModel = type !== 'data';
    container.innerHTML = `<section class="lab" aria-label="交互实验区">
      <div class="lab-step"><span class="lab-step-mark">动手</span><p>${escape(stage.interaction.instruction)}</p></div>
      <div class="lab-plot"></div>
      <p class="lab-scroll-hint">图表可以左右滑动，查看完整坐标范围。</p>
      <div class="lab-legend"><span><i class="lab-dot lab-dot-train"></i>训练数据</span><span><i class="lab-dot lab-dot-validation"></i>验证数据</span>${hasModel ? '<span><i class="lab-swatch-line"></i>当前模型</span><span><i class="lab-swatch-residual"></i>残差</span>' : ''}<span class="lab-comparison-legend" hidden><i class="lab-swatch-line lab-swatch-compare"></i>保存的对照</span></div>
      <div class="lab-model-area"${hasModel ? '' : ' hidden'}>
        <div class="formula-card"><span>当前模型</span><div class="lab-formula" aria-label="当前模型公式"></div></div>
        <div class="lab-metrics"></div>
        <div class="param-group">${definition.parameters.map(p => `<div class="param-row"><div class="param-head"><label for="lab-param-${escape(p.key)}">${escape(p.label)}</label><span class="param-key">${escape(p.key)}</span></div><div class="param-inputs"><input id="lab-param-${escape(p.key)}" class="param-range" type="range" min="${p.min}" max="${p.max}" step="${p.step}" value="${state.parameters[p.key]}" data-param="${escape(p.key)}" aria-label="${escape(p.label)}滑杆"><input class="param-number" type="number" min="${p.min}" max="${p.max}" step="${p.step}" value="${state.parameters[p.key]}" data-param-number="${escape(p.key)}" aria-label="${escape(p.label)}数值"></div></div>`).join('')}</div>
        ${['predict', 'compare'].includes(type) ? `<div class="predict-card"><div class="predict-head"><label for="lab-prediction-x">预测位置</label><output class="lab-prediction-value"></output></div><div class="param-inputs"><input id="lab-prediction-x" class="param-range" type="range" min="${definition.xDomain[0]}" max="${definition.xDomain[1]}" step="any" value="${state.predictionX}" data-prediction aria-label="预测位置"><input class="param-number" type="number" min="${definition.xDomain[0]}" max="${definition.xDomain[1]}" step="any" value="${state.predictionX}" data-prediction-number aria-label="预测位置精确数值"></div><p class="lab-prediction-result"></p></div>` : ''}
        <div class="compare-card"><div><strong>${type === 'compare' ? '把两次尝试放在一起比较' : '保留一次模型尝试'}</strong><p>保存当前参数，再调整模型，观察误差与曲线的变化。</p></div><button class="lab-secondary" type="button" data-save-comparison>保存为对照</button></div>
        <div class="lab-comparison-result" aria-live="polite"></div>
        <p class="lab-note">${definition.family === 'ellipse' ? '误差为沿椭圆中心方向的径向距离RMSE，单位与坐标一致。横纵坐标等比例显示。' : '误差为预测值与观测值的均方根误差（RMSE），单位与纵轴一致。'}</p>
        <p class="lab-warning" role="status" hidden></p>
      </div>
      <details class="lab-data-details"><summary><span>数据工作表</span><span>${state.rows.length}条数据，可编辑与分组</span></summary><p class="lab-table-help">点击图中的数据点可以定位记录。修改数值或数据用途，图表与误差会同步更新。</p>${tableMarkup()}</details>
      <div class="lab-footer"><span class="lab-data-count"></span><button class="lab-text-button" type="button" data-reset>恢复初始数据与参数</button></div>
    </section>`;
    updateVisuals();
  }

  // 曲线与散点共享同一坐标变换，数据超出初始范围时自动扩大画布范围。
  function chartMarkup() {
    const type = stage.interaction.type;
    const rows = state.rows;
    const { svgWidth, svgHeight, minX, maxX, minY, maxY, left, right, top, bottom, xTo, yTo } = createPlotTransform(definition, rows, type === 'data' ? null : state.parameters, type === 'data' ? null : state.comparison?.parameters);
    const grid = Array.from({ length: 6 }, (_, i) => {
      const x = minX + (maxX - minX) * i / 5;
      const y = minY + (maxY - minY) * i / 5;
      return `<line x1="${xTo(x)}" y1="${top}" x2="${xTo(x)}" y2="${bottom}" class="lab-grid"/><line x1="${left}" y1="${yTo(y)}" x2="${right}" y2="${yTo(y)}" class="lab-grid"/><text x="${xTo(x)}" y="${bottom + 22}" text-anchor="middle" class="lab-tick">${number(x)}</text><text x="${left - 12}" y="${yTo(y) + 4}" text-anchor="end" class="lab-tick">${number(y)}</text>`;
    }).join('');
    const pathFor = parameters => {
      if (definition.family === 'ellipse') {
        const { a, b, h, k } = parameters;
        return Array.from({ length: 181 }, (_, i) => `${i ? 'L' : 'M'}${xTo(h + a * Math.cos(i / 180 * 2 * Math.PI)).toFixed(2)},${yTo(k + b * Math.sin(i / 180 * 2 * Math.PI)).toFixed(2)}`).join(' ') + ' Z';
      }
      let path = '', drawing = false;
      for (let i = 0; i <= 180; i++) {
        const x = minX + (maxX - minX) * i / 180;
        const y = evaluateModel(definition.family, parameters, x);
        if (y === null || Math.abs(yTo(y)) > 1e7) { drawing = false; continue; }
        path += `${drawing ? 'L' : 'M'}${xTo(x).toFixed(2)},${yTo(y).toFixed(2)} `;
        drawing = true;
      }
      return path;
    };
    const modelPath = type === 'data' ? '' : `<path d="${pathFor(state.parameters)}" class="lab-model-path"/>`;
    const comparisonPath = state.comparison && type !== 'data' ? `<path d="${pathFor(state.comparison.parameters)}" class="lab-compare-path"/>` : '';
    // 残差线把每个数据点与模型上对应的位置连起来，误差大小可以直接看出。
    const residuals = type === 'data' ? '' : rows.filter(row => row.split !== 'excluded').map(row => {
      if (definition.family === 'ellipse') {
        const { a, b, h, k } = state.parameters;
        const dx = row.x - h, dy = row.y - k;
        const distance = Math.hypot(dx, dy);
        if (a <= 0 || b <= 0 || !distance) return '';
        const boundary = 1 / Math.sqrt((dx / distance / a) ** 2 + (dy / distance / b) ** 2);
        return `<line x1="${xTo(row.x).toFixed(2)}" y1="${yTo(row.y).toFixed(2)}" x2="${xTo(h + dx / distance * boundary).toFixed(2)}" y2="${yTo(k + dy / distance * boundary).toFixed(2)}" class="lab-residual"/>`;
      }
      const predicted = evaluateModel(definition.family, state.parameters, row.x);
      const values = Array.isArray(predicted) ? predicted : predicted === null ? [] : [predicted];
      return values.map(value => `<line x1="${xTo(row.x).toFixed(2)}" y1="${yTo(row.y).toFixed(2)}" x2="${xTo(row.x).toFixed(2)}" y2="${yTo(value).toFixed(2)}" class="lab-residual"/>`).join('');
    }).join('');
    const dots = rows.map((row, index) => `<circle cx="${xTo(row.x)}" cy="${yTo(row.y)}" r="${selectedRow === index ? 7 : 5}" class="lab-point lab-point-${row.split}" data-point="${index}" tabindex="0" role="button" aria-label="第${index + 1}条数据，${escape(project.dataset.xLabel)}${number(row.x)}，${escape(project.dataset.yLabel)}${number(row.y)}"><title>第${index + 1}条：${escape(project.dataset.xLabel)}＝${number(row.x)}，${escape(project.dataset.yLabel)}＝${number(row.y)}</title></circle>`).join('');
    let prediction = '';
    if (['predict', 'compare'].includes(type)) {
      const predicted = evaluateModel(definition.family, state.parameters, state.predictionX);
      const values = Array.isArray(predicted) ? predicted : predicted === null ? [] : [predicted];
      prediction = `<line x1="${xTo(state.predictionX)}" y1="${top}" x2="${xTo(state.predictionX)}" y2="${bottom}" class="lab-prediction-line"/>${values.map(y => `<circle cx="${xTo(state.predictionX)}" cy="${yTo(y)}" r="7" class="lab-prediction-point"/>`).join('')}`;
    }
    const origin = definition.family === 'ellipse' && minX <= 0 && maxX >= 0 && minY <= 0 && maxY >= 0
      ? `<line x1="${xTo(0)}" y1="${top}" x2="${xTo(0)}" y2="${bottom}" class="lab-origin-axis"/><line x1="${left}" y1="${yTo(0)}" x2="${right}" y2="${yTo(0)}" class="lab-origin-axis"/><circle cx="${xTo(0)}" cy="${yTo(0)}" r="3" class="lab-origin"/><text x="${xTo(0) + 8}" y="${yTo(0) - 8}" class="lab-origin-label">原点</text>` : '';
    return `<svg class="lab-chart" viewBox="0 0 ${svgWidth} ${svgHeight}" role="img" aria-label="${escape(project.dataset.xLabel)}与${escape(project.dataset.yLabel)}的散点及模型图"><title>交互建模图表</title><defs><clipPath id="lab-plot-clip"><rect x="${left - 8}" y="${top - 8}" width="${right - left + 16}" height="${bottom - top + 16}"/></clipPath></defs>${grid}<line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" class="lab-axis"/><text x="${left}" y="16" class="lab-axis-label">${escape(axisLabel(project.dataset.yLabel, project.dataset.yUnit))}</text><text x="${right}" y="${svgHeight - 10}" text-anchor="end" class="lab-axis-label">${escape(axisLabel(project.dataset.xLabel, project.dataset.xUnit))}</text><g clip-path="url(#lab-plot-clip)">${origin}${comparisonPath}${modelPath}${residuals}${prediction}${dots}</g></svg>`;
  }

  function updateVisuals() {
    query('.lab-plot').innerHTML = chartMarkup();
    query('.lab-formula').textContent = formatFormula(definition.family, state.parameters);
    const train = computeMetrics(definition.family, state.parameters, state.rows, 'train');
    const validation = computeMetrics(definition.family, state.parameters, state.rows, 'validation');
    query('.lab-metrics').innerHTML = `<div class="metric"><span>训练误差 RMSE</span><strong>${number(train.rmse, 5)}</strong><small>${train.count}条训练数据参与计算</small></div><div class="metric"><span>验证误差 RMSE</span><strong>${number(validation.rmse, 5)}</strong><small>${validation.count}条验证数据参与计算</small></div>`;
    const invalidCount = train.invalidCount + validation.invalidCount;
    query('.lab-warning').hidden = !invalidCount;
    query('.lab-warning').textContent = `${invalidCount}条数据超出当前模型的计算范围，相应误差暂缺。请调整参数或数据单位。`;
    const predictionOutput = query('.lab-prediction-value');
    if (predictionOutput) {
      predictionOutput.textContent = `${number(state.predictionX)}${project.dataset.xUnit}`;
      const predicted = evaluateModel(definition.family, state.parameters, state.predictionX);
      const predictionText = result => result === null ? '超出模型范围' : (Array.isArray(result) ? [...new Set(result)] : [result]).map(value => `${number(value, 3)}${project.dataset.yUnit}`).join(' 或 ');
      query('.lab-prediction-result').textContent = `${project.dataset.xLabel}为${number(state.predictionX)}${project.dataset.xUnit}时，预测${project.dataset.yLabel}为${predictionText(predicted)}${state.comparison ? `；对照模型为${predictionText(evaluateModel(definition.family, state.comparison.parameters, state.predictionX))}` : ''}`;
    }
    query('.lab-comparison-legend').hidden = !state.comparison || stage.interaction.type === 'data';
    if (state.comparison) {
      const comparisonMetric = computeMetrics(definition.family, state.comparison.parameters, state.rows, 'validation');
      const difference = comparisonMetric.rmse === null || validation.rmse === null ? null : validation.rmse - comparisonMetric.rmse;
      const direction = difference === null ? '' : difference < 0 ? `比对照低${number(Math.abs(difference), 5)}` : difference > 0 ? `比对照高${number(difference, 5)}` : '与对照相同';
      query('.lab-comparison-result').innerHTML = `<div class="cmp-row"><span>对照模型</span><strong>${escape(formatFormula(definition.family, state.comparison.parameters))}</strong></div><div class="cmp-metrics"><div><span>对照验证误差</span><strong>${number(comparisonMetric.rmse, 5)}</strong></div><div><span>当前验证误差</span><strong>${number(validation.rmse, 5)}</strong><small>${direction}</small></div></div><button type="button" class="lab-text-button" data-clear-comparison>移除对照</button>`;
    } else query('.lab-comparison-result').innerHTML = '';
    const excluded = state.rows.filter(row => row.split === 'excluded').length;
    query('.lab-data-count').textContent = `训练${train.count}条 · 验证${validation.count}条${excluded ? ` · 排除${excluded}条` : ''}`;
  }

  function updateParameter(key, value, commit = true) {
    const spec = definition.parameters.find(parameter => parameter.key === key);
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    state.parameters[key] = Math.max(spec.min, Math.min(spec.max, parsed));
    query(`[data-param="${key}"]`).value = state.parameters[key];
    if (commit) query(`[data-param-number="${key}"]`).value = state.parameters[key];
    updateVisuals();
    emit();
  }

  function updatePrediction(value, commit = true) {
    state.predictionX = roundX(Math.max(definition.xDomain[0], Math.min(definition.xDomain[1], Number(value))));
    query('[data-prediction]').value = state.predictionX;
    if (commit) query('[data-prediction-number]').value = state.predictionX;
    updateVisuals();
    emit();
  }

  function updateRow(target) {
    state.rows[Number(target.dataset.row)][target.dataset.field] = Number(target.value);
    updateVisuals();
    emit();
  }

  function onInput(event) {
    const target = event.target;
    if (target.matches('[data-param]')) updateParameter(target.dataset.param, target.value);
    else if (target.matches('[data-prediction]')) updatePrediction(target.value);
    // 输入时保留数字框原文，允许继续输入小数；提交时再规范显示与范围。
    else if (target.value !== '' && Number.isFinite(Number(target.value))) {
      const value = Number(target.value);
      if (target.matches('[data-param-number]')) {
        const spec = definition.parameters.find(parameter => parameter.key === target.dataset.paramNumber);
        if (value >= spec.min && value <= spec.max) updateParameter(spec.key, value, false);
      } else if (target.matches('[data-prediction-number]')) {
        if (value >= definition.xDomain[0] && value <= definition.xDomain[1]) updatePrediction(value, false);
      } else if (target.matches('[data-row]') && target.dataset.field !== 'split') updateRow(target);
    }
  }

  function onFieldChange(event) {
    const target = event.target;
    if (target.matches('[data-param-number]')) {
      if (target.value === '') target.value = state.parameters[target.dataset.paramNumber];
      else updateParameter(target.dataset.paramNumber, target.value);
    } else if (target.matches('[data-prediction-number]')) {
      const value = Number(target.value);
      if (target.value === '' || !Number.isFinite(value)) { target.value = state.predictionX; return; }
      updatePrediction(value);
    } else if (target.matches('[data-row]')) {
      const row = state.rows[Number(target.dataset.row)];
      const field = target.dataset.field;
      const value = field === 'split' ? target.value : Number(target.value);
      if (field !== 'split' && (target.value === '' || !Number.isFinite(value))) { target.value = row[field]; return; }
      row[field] = value;
      updateVisuals();
      emit();
    }
  }

  function onClick(event) {
    const target = event.target.closest('button,[data-point]');
    if (!target) return;
    if (target.hasAttribute('data-save-comparison')) {
      state.comparison = { parameters: { ...state.parameters } };
      updateVisuals();
      emit();
    } else if (target.hasAttribute('data-clear-comparison')) {
      state.comparison = null;
      updateVisuals();
      emit();
    } else if (target.hasAttribute('data-reset')) {
      state.rows = structuredClone(project.dataset.rows);
      state.parameters = Object.fromEntries(definition.parameters.map(p => [p.key, p.value]));
      state.predictionX = roundX((definition.xDomain[0] + definition.xDomain[1]) / 2);
      state.comparison = null;
      selectedRow = null;
      render();
      emit();
    } else if (target.hasAttribute('data-point')) {
      selectedRow = Number(target.dataset.point);
      query('.lab-data-details').open = true;
      updateVisuals();
      const input = query(`[data-row="${selectedRow}"][data-field="x"]`);
      input.focus({ preventScroll: true });
      input.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function onKeydown(event) {
    if (event.target.matches('[data-point]') && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      event.target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  }

  container.addEventListener('input', onInput);
  container.addEventListener('change', onFieldChange);
  container.addEventListener('click', onClick);
  container.addEventListener('keydown', onKeydown);
  render();
  return {
    getState,
    setStage(nextStage) { stage = nextStage; selectedRow = null; render(); },
    destroy() {
      container.removeEventListener('input', onInput);
      container.removeEventListener('change', onFieldChange);
      container.removeEventListener('click', onClick);
      container.removeEventListener('keydown', onKeydown);
      container.innerHTML = '';
    },
  };
}
