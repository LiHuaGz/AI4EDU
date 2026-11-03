import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 单独生成静态演示版，保留本地完整应用的AI功能。
const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.resolve(root, '../dist-pages');
await mkdir(output, { recursive: true });
await cp(path.join(root, 'public'), output, { recursive: true });
await cp(path.join(root, 'demo-project.json'), path.join(output, 'demo-project.json'));
await mkdir(path.join(output, 'data'), { recursive: true });
const readBook = async name => JSON.parse(await readFile(path.join(root, 'books', name), 'utf8'));
const graph = await readBook('knowledge-graph.full.json');
const curriculum = await readBook('curriculum-context.json');
const compact = await readBook('knowledge-graph.compact.json');
await writeFile(path.join(output, 'data/knowledge-graph.json'), JSON.stringify(graph));
await writeFile(path.join(output, 'data/teaching-resources.json'), JSON.stringify({ curriculum: curriculum.title, requirements: curriculum.requirements, books: graph.books.length, nodes: graph.nodes.length, edges: graph.edges.length, graph: compact }));

// 项目站点位于仓库子路径，页面链接与字体均使用相对地址。
for (const name of ['index.html', 'knowledge-graph.html', 'views.js']) {
  const file = path.join(output, name);
  let text = await readFile(file, 'utf8');
  text = text.replaceAll('href="/', 'href="./').replaceAll('src="/', 'src="./');
  if (name === 'views.js') {
    text = text.replace("['login', '连接AI']", "['login', '示例首页']")
      .replace(/<button id="setup-connect">.*?<\/button>/g, '')
      .replace(/<button id="redesign">.*?<\/button>/g, '')
      .replace('连接AI后，会根据整学期计划和当前进度设计新项目。', '在线演示版提供预置案例、交互实验和分层提示。')
      .replace('说明计划与进度，选好想探索的领域，AI据此安排递进任务。', '查看示例的学习计划与当前进度，进入任意球建模实验。')
      .replace('AI正在设计情境、交互场景和递进任务…', '正在载入示例项目…');
  }
  await writeFile(file, text);
}
const fonts = path.join(output, 'formula-editor.js');
await writeFile(fonts, (await readFile(fonts, 'utf8')).replace("'/vendor/mathlive/fonts'", "new URL('./vendor/mathlive/fonts', import.meta.url).href"));
const graphFile = path.join(output, 'knowledge-graph.js');
await writeFile(graphFile, (await readFile(graphFile, 'utf8')).replace("'/api/knowledge-graph'", "'./data/knowledge-graph.json'"));

let app = await readFile(path.join(output, 'app.js'), 'utf8');
app = app.replace("fetch('/demo-project.json')", "fetch('./demo-project.json')")
  .replace("const STORAGE_KEY = 'zhixing-", "const STORAGE_KEY = 'zhixing-pages-")
  .replace('async function api(route, body) {', `async function api(route, body) {
  // 静态版的数据在浏览器内读取，文件内容也只保存在当前浏览器。
  if (route === 'session') return { connected: false };
  if (route === 'teaching-resources') return fetch('./data/teaching-resources.json').then(response => response.json());
  if (route === 'upload') {
    if (body.content.length > 30000) throw new Error('教学计划最多3万字。');
    return { text: body.content.trim(), filename: body.filename };
  }
  throw new Error('在线演示版提供预置案例和交互实验，实时AI功能尚未启用。');
}
async function localServerApi(route, body) {`)
  .replace('function renderLogin() {', `function renderLogin() {
  state.mode = 'demo';
  shell(\`<main class="page"><section class="card setup-card" style="max-width:850px;margin:40px auto;padding:40px"><span class="eyebrow">知行·数学建模实验室</span><h1>补时绝杀：一脚任意球的数学</h1><p class="hero-lead">从视频追踪数据出发，拟合足球轨迹，寻找越过人墙、进入球门的起脚方案。</p><div class="banner">在线演示版：预置案例、数学交互、Python实验、分层提示与学习记录导出。实时AI功能尚未启用。</div><ol class="flow-steps"><li><span>1</span><div><strong>建立模型</strong><small>从追踪点估计出球速度和起脚仰角。</small></div></li><li><span>2</span><div><strong>动手实验</strong><small>调整参数，运行Python，检验拟合结果。</small></div></li><li><span>3</span><div><strong>比较方案</strong><small>计算进球概率，记录推导和最终结论。</small></div></li></ol><button id="start-demo" class="button primary wide">进入示例项目→</button><p class="key-note">学习记录保存在当前浏览器，支持导出JSON和Markdown。</p></section>\${footer()}</main>\`);
  $('#start-demo').addEventListener('click', async () => {
    fillExample();
    go('setup');
    await generateProject();
  });
}
function renderLocalLogin() {`)
  .replace('或连接AI获取反馈。', '并结合数值核对检查结果。');
await writeFile(path.join(output, 'app.js'), app);
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`静态演示版已生成：${output}`);
