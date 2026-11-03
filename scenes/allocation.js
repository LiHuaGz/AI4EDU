const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const format = value => Number(value.toFixed(3)).toLocaleString('zh-CN', { maximumFractionDigits: 3 });
const COLORS = ['#168c79', '#e5a44f', '#6c92ba', '#ad88ae', '#8ba774'];

export function computeAllocation(config, quantities) {
  const objective = config.items.reduce((sum, item) => sum + quantities[item.key] * item.score, 0);
  const resources = config.resources.map(resource => {
    const components = config.items.map(item => ({ key: item.key, label: item.label, amount: quantities[item.key] * (item.resourceUse[resource.key] || 0) }));
    const used = components.reduce((sum, item) => sum + item.amount, 0);
    return { key: resource.key, label: resource.label, unit: resource.unit, capacity: resource.capacity, used, remaining: resource.capacity - used, feasible: used <= resource.capacity + 1e-9, components };
  });
  return { objective, resources, feasible: resources.every(resource => resource.feasible) };
}

export function mountAllocation(container, experiment, saved, onChange = () => {}) {
  const config = experiment.config;
  const defaults = Object.fromEntries(config.items.map(item => [item.key, item.value]));
  const state = { quantities: { ...defaults, ...saved?.quantities }, comparison: saved?.comparison ? structuredClone(saved.comparison) : null };
  const query = selector => container.querySelector(selector);
  const getState = () => structuredClone({ type: 'allocation', ...state, ...computeAllocation(config, state.quantities) });
  const emit = () => onChange(getState());

  container.innerHTML = `<section class="visual-scene allocation-scene" aria-label="资源分配实验">
    <p class="scene-instruction"></p>
    <div class="allocation-objective" aria-live="polite"></div>
    <div class="allocation-items">${config.items.map((item, index) => `<article class="allocation-item" style="--item-color:${COLORS[index % COLORS.length]}"><div class="allocation-item-title"><span class="allocation-color"></span><strong>${escape(item.label)}</strong><span>每${escape(item.unit || '份')}贡献${format(item.score)}${escape(config.objective.unit || '')}</span></div><p class="allocation-unit-cost">每${escape(item.unit || '份')}占用：${config.resources.filter(resource => item.resourceUse[resource.key]).map(resource => `${escape(resource.label)}${format(item.resourceUse[resource.key])}${escape(resource.unit || '')}`).join('；')}</p><div class="allocation-pictogram" data-pictogram="${escape(item.key)}" aria-hidden="true"></div><div class="scene-control"><label for="allocation-${escape(experiment.id)}-${escape(item.key)}">${escape(item.label)}数量${item.unit ? `（${escape(item.unit)}）` : ''}</label><div><input id="allocation-${escape(experiment.id)}-${escape(item.key)}" type="range" min="${item.min}" max="${item.max}" step="${item.step}" value="${state.quantities[item.key]}" data-range="${escape(item.key)}" aria-label="${escape(item.label)}数量滑杆"/><input type="number" min="${item.min}" max="${item.max}" step="${item.step}" value="${state.quantities[item.key]}" data-number="${escape(item.key)}" aria-label="${escape(item.label)}数量数值"/></div></div></article>`).join('')}</div>
    <div class="allocation-resources" aria-live="polite"></div>
    <div class="scene-comparison" aria-live="polite"></div>
    <div class="scene-actions"><button type="button" data-save>保存当前方案作对照</button><button type="button" class="scene-text-button" data-reset>恢复初始方案</button></div>
  </section>`;
  query('.scene-instruction').textContent = experiment.description || '';

  function draw() {
    const result = computeAllocation(config, state.quantities);
    query('.allocation-objective').innerHTML = `<div><span>${escape(config.objective.label)}</span><strong>${format(result.objective)}<small>${escape(config.objective.unit || '')}</small></strong></div><span class="allocation-feasibility ${result.feasible ? 'feasible' : 'over-budget'}">${result.feasible ? '满足资源约束' : '资源用量超出上限'}</span>`;
    config.items.forEach(item => {
      const ratio = item.max > 0 ? Math.max(0, Math.min(1, state.quantities[item.key] / item.max)) : 0;
      const dots = Array.from({ length: 20 }, (_, index) => `<rect x="${6 + index % 10 * 23}" y="${8 + Math.floor(index / 10) * 22}" width="15" height="15" rx="3" fill="${index < Math.round(ratio * 20) ? 'var(--item-color)' : '#eaf0eb'}"/>`).join('');
      query(`[data-pictogram="${item.key}"]`).innerHTML = `<svg viewBox="0 0 240 55" role="img" aria-label="数量占可选上限的比例">${dots}</svg><span>${format(state.quantities[item.key])}<small>${escape(item.unit || '份')}</small></span>`;
    });
    query('.allocation-resources').innerHTML = result.resources.map(resource => {
      const denominator = Math.max(resource.capacity, resource.used, 1);
      return `<section class="allocation-resource ${resource.feasible ? '' : 'over-budget'}"><div class="allocation-resource-heading"><strong>${escape(resource.label)}</strong><span>${format(resource.used)}／${format(resource.capacity)}${escape(resource.unit || '')}</span></div><div class="allocation-resource-track">${resource.components.map((component, index) => `<span style="width:${100 * component.amount / denominator}%;background:${COLORS[index % COLORS.length]}" title="${escape(component.label)}：${format(component.amount)}${escape(resource.unit || '')}"></span>`).join('')}<i style="left:${100 * resource.capacity / denominator}%"></i></div><p>${resource.feasible ? '还可使用' : '超出'}${format(Math.abs(resource.remaining))}${escape(resource.unit || '')}</p></section>`;
    }).join('');
    const comparison = query('.scene-comparison');
    if (state.comparison) {
      const past = computeAllocation(config, state.comparison.quantities);
      const difference = result.objective - past.objective;
      const improved = config.objective.direction === 'min' ? difference < 0 : difference > 0;
      comparison.innerHTML = `<div class="scene-comparison-title"><strong>与已保存方案比较</strong><button type="button" class="scene-text-button" data-clear>移除对照</button></div><p>${escape(config.objective.label)}：${format(past.objective)}→${format(result.objective)}${escape(config.objective.unit || '')}</p><p>${result.feasible && past.feasible ? (difference === 0 ? '两个方案的目标值相同。' : `${improved ? '目标有所改善' : '目标有所回落'}，继续结合资源使用情况比较。`) : '先检查两个方案是否都满足约束，再比较目标值。'}</p>`;
    } else comparison.innerHTML = '';
  }
  function updateQuantity(key, value, numberField = true, snap = false) {
    const item = config.items.find(candidate => candidate.key === key);
    let bounded = Math.max(item.min, Math.min(item.max, value));
    if (snap) bounded = Number((item.min + Math.round((bounded - item.min) / item.step) * item.step).toFixed(10));
    state.quantities[key] = Math.max(item.min, Math.min(item.max, bounded));
    query(`[data-range="${key}"]`).value = state.quantities[key];
    if (numberField) query(`[data-number="${key}"]`).value = state.quantities[key];
  }
  function onInput(event) {
    const target = event.target;
    const key = target.dataset.range || target.dataset.number;
    if (!key || target.value === '') return;
    const value = Number(target.value), item = config.items.find(candidate => candidate.key === key);
    if (!Number.isFinite(value) || value < item.min || value > item.max) return;
    updateQuantity(key, value, Boolean(target.dataset.range)); draw(); emit();
  }
  function onFieldChange(event) {
    const target = event.target;
    if (!target.dataset.number) return;
    const value = Number(target.value);
    updateQuantity(target.dataset.number, target.value === '' || !Number.isFinite(value) ? state.quantities[target.dataset.number] : value, true, true);
    draw(); emit();
  }
  function onClick(event) {
    if (event.target.closest('[data-save]')) { state.comparison = { quantities: { ...state.quantities } }; draw(); emit(); }
    if (event.target.closest('[data-clear]')) { state.comparison = null; draw(); emit(); }
    if (event.target.closest('[data-reset]')) { Object.entries(defaults).forEach(([key, value]) => updateQuantity(key, value)); state.comparison = null; draw(); emit(); }
  }
  const events = { input: onInput, change: onFieldChange, click: onClick };
  Object.entries(events).forEach(([event, listener]) => container.addEventListener(event, listener));
  draw();
  return { getState, setInstruction(text) { query('.scene-instruction').textContent = text; }, destroy() { Object.entries(events).forEach(([event, listener]) => container.removeEventListener(event, listener)); container.innerHTML = ''; } };
}
