// 概率实验把随机抽样和精确计算分别呈现，避免把频率误当作理论概率。
const PALETTE = ['#0c806f', '#d79949', '#7295ca', '#b388bd', '#cc7c70', '#8da25d'];
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const color = (value, index) => /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(value || '') ? value : PALETTE[index % PALETTE.length];
const percentage = value => `${(100 * value).toFixed(2)}％`;

export function combinations(n, k) {
  if (!Number.isInteger(n) || !Number.isInteger(k) || k < 0 || k > n) return 0;
  let result = 1;
  for (let i = 1; i <= Math.min(k, n - k); i++) result = result * (n - i + 1) / i;
  return result;
}

function falling(n, k) {
  if (k > n) return 0;
  let result = 1;
  for (let i = 0; i < k; i++) result *= n - i;
  return result;
}

export function eventMatches(draw, event) {
  if (event.type === 'allSame') return new Set(draw).size === 1;
  if (event.type === 'allDifferent') return new Set(draw).size === draw.length;
  const hits = draw.filter(id => id === event.targetId).length;
  return event.type === 'exactly' ? hits === event.count : hits >= event.count;
}

export function theoreticalProbability({ population, draws, replacement, event }) {
  const total = population.reduce((sum, item) => sum + item.count, 0);
  if (!total || draws < 1 || (!replacement && draws > total)) return null;
  if (event.type === 'allSame') {
    return population.reduce((sum, item) => sum + (replacement ? (item.count / total) ** draws : falling(item.count, draws) / falling(total, draws)), 0);
  }
  if (event.type === 'allDifferent') {
    // 多项式系数累积所有不同类别的组合，再乘以抽取顺序数。
    const coefficients = [1, ...Array(draws).fill(0)];
    for (const item of population) {
      for (let k = draws; k >= 1; k--) coefficients[k] += coefficients[k - 1] * item.count;
    }
    return coefficients[draws] * falling(draws, draws) / (replacement ? total ** draws : falling(total, draws));
  }
  const targetCount = population.find(item => item.id === event.targetId)?.count || 0;
  const exactly = k => replacement
    ? combinations(draws, k) * (targetCount / total) ** k * (1 - targetCount / total) ** (draws - k)
    : combinations(targetCount, k) * combinations(total - targetCount, draws - k) / combinations(total, draws);
  if (event.type === 'exactly') return exactly(event.count);
  let probability = 0;
  for (let k = event.count; k <= draws; k++) probability += exactly(k);
  return Math.min(1, Math.max(0, probability));
}

export function sampleDraw(population, draws, replacement, random = Math.random) {
  const counts = population.map(item => item.count);
  const result = [];
  for (let i = 0; i < draws; i++) {
    const total = counts.reduce((sum, count) => sum + count, 0);
    if (total <= 0) break;
    let ticket = Math.min(1 - Number.EPSILON, Math.max(0, random())) * total;
    let chosen = counts.length - 1;
    for (let j = 0; j < counts.length; j++) {
      ticket -= counts[j];
      if (ticket < 0) { chosen = j; break; }
    }
    result.push(population[chosen].id);
    if (!replacement) counts[chosen]--;
  }
  return result;
}

export function mountProbability(container, experiment, saved, onChange = () => {}) {
  const config = experiment.config;
  let instruction = experiment.description || '';
  const state = {
    kind: 'probability', population: structuredClone(config.population), draws: config.draws,
    replacement: config.replacement, event: structuredClone(config.event), batchSize: config.batchSize,
    trials: 0, hits: 0, lastDraw: [], history: [], ...structuredClone(saved || {}),
  };
  const getState = () => structuredClone({ ...state, theory: theoreticalProbability(state), frequency: state.trials ? state.hits / state.trials : null });
  const emit = () => onChange(getState());
  const query = selector => container.querySelector(selector);
  const eventDescription = () => {
    if (state.event.type === 'allSame') return `抽出的${state.draws}个对象全部属于同一类`;
    if (state.event.type === 'allDifferent') return `抽出的${state.draws}个对象各不相同`;
    const target = state.population.find(item => item.id === state.event.targetId);
    return `${state.event.type === 'exactly' ? '恰好' : '至少'}抽到${state.event.count}个“${target?.label || state.event.targetId}”`;
  };

  function resetTrials() {
    state.trials = 0; state.hits = 0; state.lastDraw = []; state.history = [];
  }

  function frequencyChart() {
    const theory = theoreticalProbability(state);
    const left = 42, right = 598, top = 16, bottom = 133;
    const y = value => bottom - (bottom - top) * value;
    const x = value => left + (right - left) * value / Math.max(1, state.trials);
    const path = state.history.map((item, index) => `${index ? 'L' : 'M'}${x(item.trials)},${y(item.hits / item.trials)}`).join(' ');
    return `<svg class="ds-frequency" viewBox="0 0 640 163" role="img" aria-label="模拟频率随实验次数的变化"><line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" class="ds-axis"/><line x1="${left}" y1="${top}" x2="${left}" y2="${bottom}" class="ds-axis"/>${[0, .5, 1].map(value => `<text x="33" y="${y(value) + 3}" text-anchor="end" class="ds-tick">${value * 100}％</text><line x1="${left}" y1="${y(value)}" x2="${right}" y2="${y(value)}" class="ds-grid"/>`).join('')}${theory === null ? '' : `<line x1="${left}" y1="${y(theory)}" x2="${right}" y2="${y(theory)}" class="ds-theory-line"/>`}<path d="${path}" class="ds-frequency-line"/><text x="${left}" y="154" class="ds-tick">0</text><text x="${right}" y="154" class="ds-tick" text-anchor="end">${state.trials}次</text></svg>`;
  }

  function updateResults() {
    const theory = theoreticalProbability(state);
    query('[data-stats]').innerHTML = `<div><span>模拟次数</span><strong>${state.trials}</strong></div><div><span>事件发生频率</span><strong>${state.trials ? percentage(state.hits / state.trials) : '—'}</strong></div><div><span>理论概率</span><strong>${theory === null ? '—' : percentage(theory)}</strong></div>`;
    query('[data-history]').innerHTML = frequencyChart();
    query('[data-last-draw]').innerHTML = state.lastDraw.length
      ? state.lastDraw.map((id, index) => { const itemIndex = state.population.findIndex(item => item.id === id); const item = state.population[itemIndex]; return `<span class="ds-token" style="--token-color:${color(item.color, itemIndex)}"><span>${index + 1}</span>${escape(item.label)}</span>`; }).join('')
      : '<span class="ds-empty">点击“抽取一次”，观察一个随机结果。</span>';
    query('[data-last-outcome]').textContent = state.lastDraw.length ? eventMatches(state.lastDraw, state.event) ? '这次满足目标事件' : '这次未满足目标事件' : '';
  }

  function render() {
    const total = state.population.reduce((sum, item) => sum + item.count, 0);
    container.innerHTML = `<section class="ds-panel ds-probability" aria-label="概率模拟实验"><p class="ds-instruction">${escape(instruction)}</p><div class="ds-event"><span>观察事件</span><strong>${escape(eventDescription())}</strong></div><div class="ds-population">${state.population.map((item, index) => `<label class="ds-population-item"><span class="ds-population-symbol" style="--token-color:${color(item.color, index)}">${Array.from({ length: Math.min(item.count, 8) }, () => '<i></i>').join('')}</span><span>${escape(item.label)}</span><input type="number" min="1" max="50" step="1" value="${item.count}" data-population="${index}" aria-label="${escape(item.label)}数量"/></label>`).join('')}</div><div class="ds-probability-controls"><label>每次抽取<input type="number" min="1" max="${state.replacement ? 8 : Math.min(8, total)}" step="1" value="${state.draws}" data-draws aria-label="每次抽取数量"/></label><label class="ds-checkbox"><input type="checkbox" data-replacement ${state.replacement ? 'checked' : ''}/>抽取后放回</label>${['exactly', 'atLeast'].includes(state.event.type) ? `<label>目标个数<input type="number" min="0" max="${state.draws}" step="1" value="${state.event.count}" data-target-count aria-label="目标事件个数"/></label>` : ''}</div><div class="ds-draw-area"><div data-last-draw class="ds-draw-tokens"></div><p data-last-outcome aria-live="polite"></p></div><div class="ds-action-row"><button type="button" class="ds-button" data-draw>抽取一次</button><button type="button" class="ds-button ds-primary" data-batch>模拟${state.batchSize}次</button><button type="button" class="ds-text-button" data-reset>清空实验</button></div><div class="ds-stats" data-stats></div><div data-history></div><div class="ds-chart-key"><span><i class="ds-key-sim"></i>实验频率</span><span><i class="ds-key-theory"></i>理论概率</span></div><p class="ds-note">每次结果随机产生。修改总体、抽取规则或事件条件后，实验记录会重新开始。</p></section>`;
    updateResults();
  }

  function run(count) {
    for (let index = 0; index < count; index++) {
      state.lastDraw = sampleDraw(state.population, state.draws, state.replacement);
      state.trials++;
      if (eventMatches(state.lastDraw, state.event)) state.hits++;
      if (count === 1 || index % Math.max(1, Math.floor(count / 20)) === 0 || index === count - 1) state.history.push({ trials: state.trials, hits: state.hits });
    }
    state.history = state.history.slice(-100);
    updateResults(); emit();
  }

  function onClick(event) {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.hasAttribute('data-draw')) run(1);
    if (target.hasAttribute('data-batch')) run(state.batchSize);
    if (target.hasAttribute('data-reset')) { resetTrials(); updateResults(); emit(); }
  }

  function onChangeInput(event) {
    const target = event.target;
    const inputNumber = (min, max) => Math.max(min, Math.min(max, Math.round(Number(target.value) || min)));
    if (target.hasAttribute('data-population')) state.population[Number(target.dataset.population)].count = inputNumber(1, 50);
    else if (target.hasAttribute('data-draws')) state.draws = inputNumber(1, 8);
    else if (target.hasAttribute('data-replacement')) state.replacement = target.checked;
    else if (target.hasAttribute('data-target-count')) state.event.count = inputNumber(0, state.draws);
    else return;
    if (!state.replacement) state.draws = Math.min(state.draws, state.population.reduce((sum, item) => sum + item.count, 0));
    if (state.event.count !== undefined) state.event.count = Math.min(state.event.count, state.draws);
    resetTrials(); render(); emit();
  }

  function onInput(event) {
    const target = event.target;
    if (target.type !== 'number' || target.value === '') return;
    const value = Number(target.value);
    if (!Number.isInteger(value) || value < Number(target.min) || value > Number(target.max)) return;
    if (target.hasAttribute('data-population')) {
      const index = Number(target.dataset.population);
      state.population[index].count = value;
      target.closest('label').querySelector('.ds-population-symbol').innerHTML = Array.from({ length: Math.min(value, 8) }, () => '<i></i>').join('');
    } else if (target.hasAttribute('data-draws')) state.draws = value;
    else if (target.hasAttribute('data-target-count')) state.event.count = value;
    else return;
    const maxDraws = state.replacement ? 8 : Math.min(8, state.population.reduce((sum, item) => sum + item.count, 0));
    state.draws = Math.min(state.draws, maxDraws);
    query('[data-draws]').max = maxDraws;
    if (target !== query('[data-draws]')) query('[data-draws]').value = state.draws;
    if (['exactly', 'atLeast'].includes(state.event.type)) {
      state.event.count = Math.min(state.event.count, state.draws);
      query('[data-target-count]').max = state.draws;
      if (target !== query('[data-target-count]')) query('[data-target-count]').value = state.event.count;
    }
    query('.ds-event strong').textContent = eventDescription();
    resetTrials(); updateResults(); emit();
  }

  container.addEventListener('click', onClick);
  container.addEventListener('input', onInput);
  container.addEventListener('change', onChangeInput);
  render();
  return {
    getState,
    setInstruction(text) { instruction = text; query('.ds-instruction').textContent = text; },
    destroy() { container.removeEventListener('click', onClick); container.removeEventListener('input', onInput); container.removeEventListener('change', onChangeInput); container.innerHTML = ''; },
  };
}
