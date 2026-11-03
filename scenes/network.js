// 路线实验由AI给出节点与边，学生沿相邻节点构造方案，再检验总代价。
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const numeric = value => Number(value.toFixed(3)).toLocaleString('zh-CN');

export function edgeBetween(edges, from, to, directed = false) {
  return edges.find(edge => edge.from === from && edge.to === to || !directed && edge.from === to && edge.to === from);
}

export function pathCost(path, edges, directed = false) {
  let cost = 0;
  for (let i = 1; i < path.length; i++) {
    const edge = edgeBetween(edges, path[i - 1], path[i], directed);
    if (!edge) return null;
    cost += edge.weight;
  }
  return cost;
}

export function routeProgress(path, end, requiredNodes = []) {
  const visitedRequired = requiredNodes.filter(id => path.includes(id));
  const missingRequired = requiredNodes.filter(id => !path.includes(id));
  const atDestination = path.at(-1) === end;
  return { atDestination, visitedRequired, missingRequired, complete: atDestination && missingRequired.length === 0 };
}

export function shortestDistance(nodes, edges, start, end, directed = false, requiredNodes = []) {
  // 以“当前位置＋已到达的必经点”作为搜索状态，避免普通最短路遗漏任务条件。
  const nodeIndex = new Map(nodes.map((node, index) => [node.id, index]));
  const requiredBits = new Map(requiredNodes.map((id, index) => [id, 1 << index]));
  const maskCount = 1 << requiredNodes.length;
  const fullMask = maskCount - 1;
  const distances = Array(nodes.length * maskCount).fill(Infinity);
  const settled = new Set();
  const startState = nodeIndex.get(start) * maskCount + (requiredBits.get(start) || 0);
  distances[startState] = 0;
  while (settled.size < distances.length) {
    let currentState = -1;
    for (let index = 0; index < distances.length; index++) {
      if (!settled.has(index) && Number.isFinite(distances[index]) && (currentState < 0 || distances[index] < distances[currentState])) currentState = index;
    }
    if (currentState < 0) return null;
    const current = nodes[Math.floor(currentState / maskCount)].id;
    const mask = currentState % maskCount;
    if (current === end && mask === fullMask) return distances[currentState];
    settled.add(currentState);
    for (const edge of edges) {
      const next = edge.from === current ? edge.to : !directed && edge.to === current ? edge.from : null;
      if (next === null) continue;
      const nextMask = mask | (requiredBits.get(next) || 0);
      const nextState = nodeIndex.get(next) * maskCount + nextMask;
      distances[nextState] = Math.min(distances[nextState], distances[currentState] + edge.weight);
    }
  }
  return null;
}

export function mountNetwork(container, experiment, saved, onChange = () => {}) {
  const config = experiment.config;
  const requiredNodes = config.requiredNodes || [];
  let instruction = experiment.description || '';
  const state = { kind: 'network', path: [config.start], comparison: null, checked: false, ...structuredClone(saved || {}) };
  let message = '';
  const query = selector => container.querySelector(selector);
  const getState = () => structuredClone({
    ...state, start: config.start, end: config.end,
    cost: pathCost(state.path, config.edges, config.directed), unit: config.unit,
    requiredNodes, ...routeProgress(state.path, config.end, requiredNodes),
    arrived: routeProgress(state.path, config.end, requiredNodes).complete,
    ...(state.checked ? { optimalCost: shortestDistance(config.nodes, config.edges, config.start, config.end, config.directed, requiredNodes) } : {}),
  });
  const emit = () => onChange(getState());
  const name = id => config.nodes.find(node => node.id === id)?.label || id;
  const usedEdge = (edge, path) => path?.some((id, index) => index > 0 && (path[index - 1] === edge.from && id === edge.to || !config.directed && path[index - 1] === edge.to && id === edge.from));

  function mapMarkup() {
    const xs = config.nodes.map(node => node.x), ys = config.nodes.map(node => node.y);
    const minX = Math.min(...xs), minY = Math.min(...ys);
    const rangeX = Math.max(...xs) - minX || 1, rangeY = Math.max(...ys) - minY || 1;
    const x = node => 64 + (node.x - minX) / rangeX * 512;
    const y = node => 48 + (node.y - minY) / rangeY * 256;
    const current = state.path.at(-1);
    const edges = config.edges.map(edge => {
      const from = config.nodes.find(node => node.id === edge.from), to = config.nodes.find(node => node.id === edge.to);
      const angle = Math.atan2(y(to) - y(from), x(to) - x(from));
      const offset = 20;
      const selected = usedEdge(edge, state.path), comparison = usedEdge(edge, state.comparison?.path);
      const labelX = (x(from) + x(to)) / 2 - Math.sin(angle) * 14;
      const labelY = (y(from) + y(to)) / 2 + Math.cos(angle) * 14;
      return `<g><line x1="${x(from) + Math.cos(angle) * offset}" y1="${y(from) + Math.sin(angle) * offset}" x2="${x(to) - Math.cos(angle) * offset}" y2="${y(to) - Math.sin(angle) * offset}" class="ds-road ${selected ? 'ds-road-selected' : comparison ? 'ds-road-comparison' : ''}" ${config.directed ? 'marker-end="url(#ds-route-arrow)"' : ''}/><rect x="${labelX - 22}" y="${labelY - 12}" width="44" height="22" rx="7" class="ds-road-label-bg"/><text x="${labelX}" y="${labelY + 3}" text-anchor="middle" class="ds-road-weight">${numeric(edge.weight)}</text></g>`;
    }).join('');
    const nodes = config.nodes.map(node => {
      const next = node.id !== current && Boolean(edgeBetween(config.edges, current, node.id, config.directed));
      const selected = state.path.includes(node.id);
      const required = requiredNodes.includes(node.id);
      return `<g role="button" tabindex="0" aria-label="选择${escape(node.label)}${required ? '，必经节点' : ''}" data-node="${escape(node.id)}" class="ds-map-node ${required ? 'ds-node-required' : ''} ${selected ? 'ds-node-selected' : ''} ${node.id === current ? 'ds-node-current' : ''} ${next ? 'ds-node-next' : ''}"><circle cx="${x(node)}" cy="${y(node)}" r="18"/><text x="${x(node)}" y="${y(node) + 4}" text-anchor="middle" class="ds-node-symbol">${node.id === config.start ? '起' : node.id === config.end ? '终' : state.path.indexOf(node.id) >= 0 ? state.path.indexOf(node.id) + 1 : required ? '必' : '·'}</text><text x="${x(node)}" y="${y(node) + 39}" text-anchor="middle" class="ds-node-label">${escape(node.label)}</text></g>`;
    }).join('');
    return `<svg class="ds-map" viewBox="0 0 640 366" role="group" aria-label="点击相邻节点构造路线"><defs><marker id="ds-route-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#9fb8ad"/></marker><pattern id="ds-map-grid" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="16" cy="16" r="1" fill="#dfe8e1"/></pattern></defs><rect width="640" height="366" fill="url(#ds-map-grid)" rx="12"/>${edges}${nodes}</svg>`;
  }

  function update() {
    const cost = pathCost(state.path, config.edges, config.directed);
    const progress = routeProgress(state.path, config.end, requiredNodes);
    query('[data-map]').innerHTML = mapMarkup();
    query('[data-route]').textContent = state.path.map(name).join(' → ');
    query('[data-distance]').textContent = `${numeric(cost)}${config.unit}`;
    query('[data-arrival]').textContent = progress.complete ? '已完成路线目标' : progress.atDestination ? `已到达终点，还需经过${progress.missingRequired.map(name).join('、')}` : `下一步：点击与${name(state.path.at(-1))}相连的节点`;
    query('[data-required]').innerHTML = requiredNodes.length ? `<span>必经节点</span>${requiredNodes.map(id => `<span class="ds-required-chip ${state.path.includes(id) ? 'ds-required-done' : ''}">${state.path.includes(id) ? '✓' : '○'}${escape(name(id))}</span>`).join('')}` : '';
    query('[data-message]').textContent = message;
    query('[data-undo]').disabled = state.path.length <= 1;
    query('[data-save-route]').disabled = !progress.complete;
    const optimal = state.checked ? shortestDistance(config.nodes, config.edges, config.start, config.end, config.directed, requiredNodes) : null;
    query('[data-verification]').innerHTML = !state.checked ? '' : progress.complete
      ? `<strong>${Math.abs(cost - optimal) < 1e-8 ? '当前路线已达到最短总代价。' : '当前路线还有缩短的空间。'}</strong><span>${requiredNodes.length ? '满足全部必经条件的' : '参考'}最短总代价：${numeric(optimal)}${escape(config.unit)}</span>`
      : `<span>${progress.missingRequired.length ? `请先经过${escape(progress.missingRequired.map(name).join('、'))}，再到达${escape(name(config.end))}。` : '先到达目标节点，再检验完整路线。'}</span>`;
    query('[data-comparison]').innerHTML = state.comparison ? `<div><span>保留的路线</span><strong>${escape(state.comparison.path.map(name).join(' → '))}</strong></div><div><span>对照总代价</span><strong>${numeric(state.comparison.cost)}${escape(config.unit)}</strong></div><button type="button" class="ds-text-button" data-clear-comparison>移除对照</button>` : '';
  }

  function render() {
    container.innerHTML = `<section class="ds-panel ds-network" aria-label="路线规划实验"><p class="ds-instruction">${escape(instruction)}</p><div class="ds-route-goal"><span>起点<strong>${escape(name(config.start))}</strong></span><span class="ds-route-arrow">→</span><span>目标<strong>${escape(name(config.end))}</strong></span><small>边上的数值单位：${escape(config.unit)}</small></div><div class="ds-required-nodes" data-required aria-live="polite"></div><div class="ds-map-wrap" data-map></div><p class="ds-route-description" data-arrival></p><div class="ds-route-summary"><div><span>当前路线</span><strong data-route></strong></div><div><span>累计代价</span><strong data-distance></strong></div></div><div class="ds-action-row"><button type="button" class="ds-button" data-undo>撤销一步</button><button type="button" class="ds-button" data-reset-route>重新选路</button><button type="button" class="ds-button ds-primary" data-check-route>检验路线</button><button type="button" class="ds-text-button" data-save-route>保存为对照</button></div><p class="ds-message" data-message role="status"></p><div class="ds-verification" data-verification aria-live="polite"></div><div class="ds-route-comparison" data-comparison></div><p class="ds-note">从起点逐个选择相邻节点。绿色表示当前路线，虚线表示保留的对照路线。${config.directed ? '箭头表示可以通行的方向。' : '边可以双向通行。'}${requiredNodes.length ? '完成路线时需要覆盖所有必经节点。' : ''}</p></section>`;
    update();
  }

  function selectNode(id) {
    const current = state.path.at(-1);
    if (id === current) return;
    if (!edgeBetween(config.edges, current, id, config.directed)) {
      message = `${name(current)}与${name(id)}之间没有可通行的直连路线。`; update(); return;
    }
    state.path.push(id); state.checked = false; message = ''; update(); emit();
  }
  function onClick(event) {
    const target = event.target.closest('[data-node],button');
    if (!target) return;
    if (target.hasAttribute('data-node')) { selectNode(target.dataset.node); return; }
    if (target.hasAttribute('data-undo') && state.path.length > 1) { state.path.pop(); state.checked = false; }
    else if (target.hasAttribute('data-reset-route')) { state.path = [config.start]; state.checked = false; }
    else if (target.hasAttribute('data-check-route')) state.checked = true;
    else if (target.hasAttribute('data-save-route') && routeProgress(state.path, config.end, requiredNodes).complete) state.comparison = { path: [...state.path], cost: pathCost(state.path, config.edges, config.directed) };
    else if (target.hasAttribute('data-clear-comparison')) state.comparison = null;
    else return;
    message = ''; update(); emit();
  }
  function onKeydown(event) {
    const target = event.target.closest('[data-node]');
    if (target && ['Enter', ' '].includes(event.key)) { event.preventDefault(); selectNode(target.dataset.node); }
  }
  container.addEventListener('click', onClick);
  container.addEventListener('keydown', onKeydown);
  render();
  return {
    getState,
    setInstruction(text) { instruction = text; query('.ds-instruction').textContent = text; },
    destroy() { container.removeEventListener('click', onClick); container.removeEventListener('keydown', onKeydown); container.innerHTML = ''; },
  };
}
