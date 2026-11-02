import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { once } from 'node:events';
import { createApp } from '../server.mjs';
import { validateProject } from '../lib/project-schema.mjs';

// 仅用于浏览器端到端测试：3002返回固定数据，3001运行真实网页与代理。
// 本脚本不调用真实AI服务，测试密钥固定，两个监听地址都只允许本机访问。
const TEST_KEY = 'local-ui-test-key';
const prompts = JSON.parse(await readFile(new URL('../prompts.json', import.meta.url), 'utf8'));
const project = validateProject(JSON.parse(await readFile(new URL('../demo-project.json', import.meta.url), 'utf8')));

const upstream = http.createServer(async (request, response) => {
  const send = (status, body) => {
    response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(body));
  };
  if (request.method !== 'POST' || !['/v1/chat/completions', '/chat/completions'].includes(request.url)) {
    return send(404, { error: { message: '本机模拟接口仅接收聊天请求。' } });
  }
  if (request.headers.authorization !== `Bearer ${TEST_KEY}`) {
    return send(401, { error: { message: '测试密钥不匹配。' } });
  }
  try {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const system = body.messages.find(message => message.role === 'system')?.content;
    let kind = Object.keys(prompts).find(key => typeof prompts[key] === 'object' && prompts[key].system?.replaceAll('{{contract}}', prompts.projectContract || '') === system);
    const userText = body.messages.find(message => message.role === 'user')?.content || '';
    let input;
    if (kind === 'repair') {
      const ending = prompts.repair.user.split('{{input}}')[1].split('{{output}}')[0];
      const repairInput = JSON.parse(userText.slice(userText.indexOf('{'), userText.indexOf(ending)));
      kind = repairInput.kind;
      input = repairInput.context;
    }
    let result;
    if (kind === 'connection') result = 'OK';
    else if (kind === 'generation') result = project;
    else if (kind === 'hint' || kind === 'feedback') {
      input ||= JSON.parse(userText.slice(userText.indexOf('{')));
      const stage = project.stages.find(item => item.id === input.stageId) || project.stages[0];
      result = kind === 'hint'
        ? { title: '本机测试提示', content: stage.hints[(input.level || 1) - 1], question: '请依据提示继续操作，并记录观察到的变化。' }
        : { strength: '本机测试已收到你的解题尝试与交互状态。', nextStep: stage.deliverable, question: '请核对你的记录是否包含数据依据与方法说明。' };
    } else return send(400, { error: { message: '未识别当前提示词模板。' } });
    // 留出短暂等待时间，便于浏览器测试加载状态与重复点击。
    await new Promise(resolve => setTimeout(resolve, 450));
    console.log(`本机模拟响应：${kind}`);
    send(200, { id: 'local-ui-fixture', object: 'chat.completion', model: body.model, choices: [{ index: 0, message: { role: 'assistant', content: typeof result === 'string' ? result : JSON.stringify(result) }, finish_reason: 'stop' }] });
  } catch { send(400, { error: { message: '本机测试请求格式有误。' } }); }
});

// Cookie不区分端口，因此测试实例使用独立名称，保持3000端口的会话不受影响。
const app = await createApp({ cookieName: 'modeling_ui_test_session' });
async function stop() {
  for (const server of [app, upstream]) {
    server.closeAllConnections();
    server.close();
  }
}
process.once('SIGINT', stop);
process.once('SIGTERM', stop);

try {
  upstream.listen(3002, '127.0.0.1');
  await once(upstream, 'listening');
  app.listen(3001, '127.0.0.1');
  await once(app, 'listening');
  console.log('浏览器测试服务已启动，当前使用固定响应，并未连接真实AI。');
  console.log('网页：http://127.0.0.1:3001');
  console.log('自定义API地址：http://127.0.0.1:3002/v1');
  console.log('模型名称：ui-test-model；测试密钥：local-ui-test-key');
} catch (error) {
  await stop();
  console.error(error.code === 'EADDRINUSE' ? '测试端口3001或3002已被占用，请停止原测试进程。' : '浏览器测试服务启动失败。');
  process.exitCode = 1;
}
