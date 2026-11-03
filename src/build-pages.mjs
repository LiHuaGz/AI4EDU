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
    // 沿用本地界面，只在原有说明位置标明在线版的连接状态。
    text = text.replace('密钥只保存在本地服务的会话内存中，连接有效期2小时。连接检测会调用一次模型。', '当前在线版暂未启用AI连接，可使用下方示例项目体验交互实验。');
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
async function localServerApi(route, body) {`);
await writeFile(path.join(output, 'app.js'), app);
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`静态演示版已生成：${output}`);
