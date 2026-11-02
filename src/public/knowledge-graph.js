const $ = selector => document.querySelector(selector);
const palette = ['#0c6b59', '#b9772b', '#3d6f9d', '#a85882', '#7761b4'];
const svg = $('#graph-svg');
let graph, nodes, books, sections, children, levels;
let selected = 21;
let visibleKey = '';
let view = { x: 0, y: 0, scale: 1 };
let drag;

function element(tag, attributes, parent) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  parent.append(node);
  return node;
}

const bookId = node => sections.get(node.section_id).book_id;
const bookName = id => books.get(id).title.replace('普通高中教科书数学A版', '');

function matchingNodes() {
  const query = $('#graph-search').value.trim().toLowerCase();
  const book = $('#graph-book').value;
  return graph.nodes.filter(node => (book === 'all' || bookId(node) === Number(book)) &&
    (!query || `${node.id} ${node.name} ${sections.get(node.section_id).title}`.toLowerCase().includes(query)));
}

function saveLocation() {
  const params = new URLSearchParams({ node: selected, book: $('#graph-book').value });
  if ($('#graph-search').value) params.set('q', $('#graph-search').value);
  if ($('#graph-neighborhood').checked) params.set('near', '1');
  history.replaceState(null, '', `#${params}`);
}

function choose(id) {
  selected = Number(id);
  // 跨册跳转时清除不包含目标的筛选，让前置与后续知识都能继续浏览。
  if (!matchingNodes().some(node => node.id === selected)) {
    $('#graph-book').value = 'all';
    $('#graph-search').value = '';
  }
  render();
  saveLocation();
}

function renderRelations(selector, ids, direction) {
  const container = $(selector);
  container.replaceChildren();
  if (!ids.length) {
    const note = document.createElement('span');
    note.className = 'small muted';
    note.textContent = `图中未记录直接${direction}知识。`;
    container.append(note);
  }
  for (const id of ids) {
    const node = nodes.get(id);
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.node = id;
    const number = document.createElement('span');
    number.textContent = id;
    const name = document.createElement('span');
    name.textContent = node.name + (node.is_optional ? '（选学）' : '');
    button.append(number, name);
    button.addEventListener('click', () => choose(id));
    container.append(button);
  }
}

function renderDetails() {
  const node = nodes.get(selected);
  $('#graph-node-id').textContent = `知识点${node.id}`;
  $('#graph-node-type').textContent = node.type + (node.is_optional ? ' · 选学' : '');
  $('#graph-node-name').textContent = node.name;
  $('#graph-node-requirement').textContent = node.learning_requirement;
  $('#graph-parent-title').textContent = `直接前置（${node.prerequisites.length}）`;
  $('#graph-child-title').textContent = `直接后续（${children.get(selected).length}）`;
  renderRelations('#graph-parents', node.prerequisites, '前置');
  renderRelations('#graph-children', children.get(selected), '后续');
  $('#graph-node-sources').replaceChildren();
  $('#graph-evidence').replaceChildren();
  for (const source of node.sources) {
    const section = sections.get(source.section_id);
    const label = document.createElement('div');
    label.className = 'graph-source';
    const heading = document.createElement('strong');
    heading.textContent = `${bookName(source.book_id)} · ${section.code} ${section.title}`;
    label.append(heading, document.createTextNode(`书内第${source.printed_page}页／PDF第${source.pdf_page}页`));
    $('#graph-node-sources').append(label);
    const quote = document.createElement('blockquote');
    quote.textContent = source.evidence_excerpt;
    $('#graph-evidence').append(quote);
  }
}

function transform() {
  svg.querySelector('.graph-world')?.setAttribute('transform', `translate(${view.x} ${view.y}) scale(${view.scale})`);
  $('#graph-scale').textContent = `${Math.round(view.scale * 100)}％`;
}

function zoom(factor, x = svg.clientWidth / 2, y = svg.clientHeight / 2) {
  const next = Math.max(.5, Math.min(5, view.scale * factor));
  const ratio = next / view.scale;
  view = { x: x - (x - view.x) * ratio, y: y - (y - view.y) * ratio, scale: next };
  transform();
}

function draw(visible) {
  svg.querySelector('.graph-drawing')?.remove();
  const width = svg.clientWidth, height = svg.clientHeight;
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  const ids = new Set(visible.map(node => node.id));
  const edges = graph.edges.filter(edge => ids.has(edge.source) && ids.has(edge.target));
  $('#graph-visible-count').textContent = `显示${visible.length}个知识点／${edges.length}条关系${$('#graph-neighborhood').checked ? ' · 包含跨册依赖' : ''}`;
  $('#graph-empty').classList.toggle('hidden', visible.length > 0);
  if (!visible.length) return;
  const key = visible.map(node => node.id).join(',');
  if (key !== visibleKey) { view = {x:0,y:0,scale:1}; visibleKey = key; }
  const related = new Set([selected, ...nodes.get(selected).prerequisites, ...children.get(selected)]);
  const usedLevels = [...new Set(visible.map(node => levels.get(node.id)))].sort((a,b) => a-b);
  const positions = new Map();
  const columnWidth = (width - 64) / Math.max(1, usedLevels.length - 1);
  // 采用拓扑分层，同层按教材和前置节点位置排序，箭头始终从左向右。
  usedLevels.forEach((level, columnIndex) => {
    const column = visible.filter(node => levels.get(node.id) === level);
    const mean = node => {
      const parents = node.prerequisites.filter(id => positions.has(id));
      return parents.length ? parents.reduce((sum,id) => sum + positions.get(id).y, 0) / parents.length : node.id;
    };
    column.sort((a,b) => bookId(a)-bookId(b) || mean(a)-mean(b) || a.id-b.id);
    column.forEach((node,index) => positions.set(node.id, {
      x: usedLevels.length === 1 ? width/2 : 32 + columnIndex*columnWidth,
      y: 32 + (index+.5)/column.length*(height-64)
    }));
  });
  const drawing = element('g', {class:'graph-drawing'}, svg);
  const defs = element('defs', {}, drawing);
  for (const [name,color] of [['base','var(--line-strong)'],['active','var(--brand)']]) {
    const marker = element('marker', {id:`graph-arrow-${name}`,viewBox:'0 0 8 8',refX:7,refY:4,markerWidth:5,markerHeight:5,orient:'auto',markerUnits:'userSpaceOnUse'}, defs);
    element('path',{d:'M0 0 L8 4 L0 8 Z',fill:color},marker);
  }
  const world = element('g',{class:'graph-world'},drawing);
  for (const active of [false,true]) {
    for (const edge of edges) {
      if ((edge.source === selected || edge.target === selected) !== active) continue;
      const a=positions.get(edge.source), b=positions.get(edge.target);
      const start=a.x+6, end=b.x-8, bend=(end-start)*.48;
      element('path',{d:`M${start},${a.y} C${start+bend},${a.y} ${end-bend},${b.y} ${end},${b.y}`,class:`graph-edge${active?' active':''}`,'marker-end':`url(#graph-arrow-${active?'active':'base'})`,'data-source':edge.source,'data-target':edge.target},world);
    }
  }
  const labels = [];
  for (const node of visible) {
    const point=positions.get(node.id);
    const link=element('a',{href:`#node=${node.id}`,class:'graph-node','data-node':node.id,'aria-label':`${node.id}，${node.name}`},world);
    element('title',{},link).textContent=`${node.name}｜${bookName(bookId(node))}${node.is_optional?'｜选学':''}`;
    const dot=element('circle',{cx:point.x,cy:point.y,r:node.id===selected?7:related.has(node.id)?5:3.8,class:`graph-dot${related.has(node.id)?' related':''}${node.id===selected?' selected':''}`},link);
    dot.style.setProperty('--node-color',palette[bookId(node)-1]);
    if (visible.length <= 35 || related.has(node.id)) labels.push(node);
  }
  const occupied=[];
  labels.sort((a,b) => Number(b.id===selected)-Number(a.id===selected)).forEach(node => {
    const p=positions.get(node.id), detailed=visible.length<=35;
    const maxChars=Math.max(3,Math.min(16,Math.floor((columnWidth-20)/12)-1));
    const name=node.name.length>maxChars?node.name.slice(0,maxChars)+'…':node.name;
    const label=String(node.id);
    const labelWidth=detailed?Math.max(name.length*12,label.length*7):label.length*7;
    const x=Math.max(labelWidth/2+6,Math.min(width-labelWidth/2-6,p.x));
    const y=detailed?p.y+20:p.y-10;
    const left=x-labelWidth/2;
    if (occupied.some(box => left<box.right+4 && left+labelWidth>box.left-4 && Math.abs(y-box.y)<(detailed?34:16))) return;
    occupied.push({left,right:left+labelWidth,y});
    const text=element('text',{x,y,'text-anchor':'middle',class:'graph-label'},world);
    text.textContent=label;
    if (detailed) element('tspan',{x,dy:15},text).textContent=name;
  });
  transform();
}

function render() {
  const matches=matchingNodes();
  if (matches.length && !matches.some(node => node.id===selected)) selected=matches[0].id;
  const picker=$('#graph-node');
  picker.replaceChildren();
  for (const book of graph.books) {
    const group=document.createElement('optgroup');
    group.label=bookName(book.id);
    for (const node of matches.filter(item => bookId(item)===book.id)) {
      const option=document.createElement('option');
      option.value=node.id;
      option.textContent=`${node.id}｜${node.name}${node.is_optional?'（选学）':''}`;
      group.append(option);
    }
    if (group.children.length) picker.append(group);
  }
  picker.disabled=!matches.length;
  picker.value=String(selected);
  $('#graph-match-count').textContent=`${matches.length}项`;
  $('#graph-details').classList.toggle('hidden', !matches.length);
  let visible=matches;
  if (matches.length) {
    renderDetails();
    if ($('#graph-neighborhood').checked) {
      const neighborhood=new Set([selected,...nodes.get(selected).prerequisites,...children.get(selected)]);
      visible=graph.nodes.filter(node => neighborhood.has(node.id));
    }
  }
  draw(visible);
}

async function load() {
  $('#graph-error').classList.add('hidden');
  $('#graph-total').textContent='正在读取图谱…';
  try {
    const response=await fetch('/api/knowledge-graph');
    if (!response.ok) throw new Error('图谱加载失败，请确认本地服务已重启，再重新加载。');
    graph=await response.json();
    nodes=new Map(graph.nodes.map(node => [node.id,node]));
    books=new Map(graph.books.map(book => [book.id,book]));
    sections=new Map(graph.sections.map(section => [section.id,section]));
    children=new Map(graph.nodes.map(node => [node.id,[]]));
    graph.edges.forEach(edge => children.get(edge.source).push(edge.target));
    levels=new Map();
    graph.validation.topological_order.forEach(id => levels.set(id,Math.max(-1,...nodes.get(id).prerequisites.map(parent => levels.get(parent)))+1));
    $('#graph-book').replaceChildren(new Option('全部五册','all'));
    $('#graph-legend').replaceChildren();
    for (const book of graph.books) {
      $('#graph-book').append(new Option(bookName(book.id),String(book.id)));
      const label=document.createElement('span'), dot=document.createElement('i');
      dot.style.setProperty('--book-color',palette[book.id-1]);
      label.append(dot,document.createTextNode(bookName(book.id)));
      $('#graph-legend').append(label);
    }
    const params=new URLSearchParams(location.hash.slice(1));
    selected=nodes.has(Number(params.get('node')))?Number(params.get('node')):21;
    $('#graph-book').value=books.has(Number(params.get('book')))?params.get('book'):'all';
    $('#graph-search').value=params.get('q')||'';
    $('#graph-neighborhood').checked=params.get('near')==='1';
    $('#graph-total').textContent=`${nodes.size}个知识点 · ${graph.edges.length}条依赖 · ${graph.validation.is_dag?'有向无环':'存在有向环'}`;
    $('#graph-content').classList.remove('hidden');
    render();
  } catch (error) {
    $('#graph-total').textContent='图谱暂未载入';
    $('#graph-error-text').textContent=error.message;
    $('#graph-error').classList.remove('hidden');
  }
}

$('#graph-retry').addEventListener('click',load);
$('#graph-search').addEventListener('input',() => {render();saveLocation();});
$('#graph-book').addEventListener('change',() => {render();saveLocation();});
$('#graph-neighborhood').addEventListener('change',() => {render();saveLocation();});
$('#graph-node').addEventListener('change',event => choose(event.target.value));
$('#graph-zoom-in').addEventListener('click',() => zoom(1.3));
$('#graph-zoom-out').addEventListener('click',() => zoom(1/1.3));
$('#graph-fit').addEventListener('click',() => {view={x:0,y:0,scale:1};transform();});
svg.addEventListener('wheel',event => {
  event.preventDefault();
  const box=svg.getBoundingClientRect();
  zoom(Math.exp(-event.deltaY*.0015),event.clientX-box.left,event.clientY-box.top);
},{passive:false});
svg.addEventListener('pointerdown',event => {
  if (event.button!==0) return;
  drag={id:event.pointerId,startX:event.clientX,startY:event.clientY,x:view.x,y:view.y,moved:false,node:event.target.closest('[data-node]')?.dataset.node};
  svg.setPointerCapture(event.pointerId);
});
svg.addEventListener('pointermove',event => {
  if (!drag || drag.id!==event.pointerId) return;
  const dx=event.clientX-drag.startX, dy=event.clientY-drag.startY;
  if (Math.hypot(dx,dy)>4) drag.moved=true;
  if (drag.moved) {view.x=drag.x+dx;view.y=drag.y+dy;svg.classList.add('dragging');transform();}
});
svg.addEventListener('pointerup',event => {
  if (!drag || drag.id!==event.pointerId) return;
  const target=drag.node, moved=drag.moved;
  drag=null;
  svg.releasePointerCapture(event.pointerId);
  svg.classList.remove('dragging');
  if (target && !moved) choose(target);
});
svg.addEventListener('pointercancel',() => {drag=null;svg.classList.remove('dragging');});
svg.addEventListener('click',event => {
  const target=event.target.closest('[data-node]');
  if (target) {event.preventDefault();if (event.detail===0) choose(target.dataset.node);}
});
new ResizeObserver(() => {if (graph) render();}).observe($('#graph-canvas'));
load();
