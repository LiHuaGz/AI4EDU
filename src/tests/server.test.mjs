import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { createApp } from '../server.mjs';

const project = JSON.parse(await readFile(new URL('../demo-project.json', import.meta.url), 'utf8'));
const legacyProject = JSON.parse(await readFile(new URL('../demo-orbit-fitting.json', import.meta.url), 'utf8'));
const interactiveProject = project;
const generationInput = { plan: '高二数学，函数与统计，下一阶段学习圆锥曲线。', progress: '已学习一次函数、二次函数与统计图表。', interests: ['校园生活'], modules: ['函数与数据分析'], duration: '３课时' };

// 本机模拟服务验证完整HTTP代理链路，测试密钥只在测试进程中使用。
async function setup(t, respond = () => ({ content: 'OK' }), options = {}) {
  const requests = [];
  const upstream = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const record = { url: req.url, headers: req.headers, body: JSON.parse(Buffer.concat(chunks).toString()) };
    requests.push(record);
    const answer = await respond(record, requests.length);
    if (answer.delay) await new Promise(resolve => setTimeout(resolve, answer.delay));
    res.writeHead(answer.status ?? 200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(answer.body ?? { model: answer.model, usage: answer.usage, choices: [{ message: { content: answer.content }, finish_reason: answer.finishReason ?? 'stop' }] }));
  });
  upstream.listen(0, '127.0.0.1');
  await once(upstream, 'listening');
  const app = await createApp(options);
  app.listen(0, '127.0.0.1');
  await once(app, 'listening');
  t.after(async () => {
    app.closeAllConnections();
    upstream.closeAllConnections();
    await Promise.all([new Promise(resolve => app.close(resolve)), new Promise(resolve => upstream.close(resolve))]);
  });
  const url = `http://127.0.0.1:${app.address().port}`;
  let cookie = '';
  async function post(route, body, headers = {}) {
    const response = await fetch(`${url}${route}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie, ...headers }, body: JSON.stringify(body) });
    if (response.headers.get('set-cookie')) cookie = response.headers.get('set-cookie').split(';')[0];
    return { status: response.status, headers: response.headers, data: await response.json() };
  }
  const credentials = { provider: 'custom', apiKey: 'test-key-private', baseUrl: `http://127.0.0.1:${upstream.address().port}/v1`, model: 'test-model' };
  return { url, requests, post, credentials, connect: () => post('/api/connect', credentials), get: route => fetch(`${url}${route}`, { headers: { Cookie: cookie } }) };
}

test('连接验证、会话读取与退出构成真实代理流程，响应不含密钥', async t => {
  const app = await setup(t);
  const connected = await app.connect();
  assert.equal(connected.status, 200);
  assert.equal(connected.data.connected, true);
  assert.match(connected.headers.get('set-cookie'), /HttpOnly; SameSite=Strict/);
  assert.equal(JSON.stringify(connected.data).includes('test-key-private'), false);
  assert.equal(app.requests[0].url, '/v1/chat/completions');
  assert.equal(app.requests[0].headers.authorization, 'Bearer test-key-private');
  assert.equal(app.requests[0].body.model, 'test-model');
  assert.equal(JSON.stringify(app.requests[0].body).includes('test-key-private'), false);
  assert.equal((await (await app.get('/api/session')).json()).connected, true);
  assert.equal((await app.post('/api/logout', {})).data.connected, false);
  assert.equal((await app.post('/api/generate', generationInput)).status, 401);
});

test('上游密钥错误被转成可操作提示，原始响应不泄露', async t => {
  const app = await setup(t, () => ({ status: 401, body: { error: 'rejected test-key-private' } }));
  const result = await app.connect();
  assert.equal(result.status, 502);
  assert.match(result.data.error, /密钥验证失败/);
  assert.equal(JSON.stringify(result.data).includes('test-key-private'), false);
  assert.equal(result.headers.has('set-cookie'), false);
});

test('DeepSeek余额不足与限流分别提示，连接验证限制输出量', async t => {
  const balance = await setup(t, () => ({ status: 402, body: { error: { message: 'Insufficient Balance test-key-private' } } }));
  const result = await balance.post('/api/connect', { ...balance.credentials, provider: 'deepseek' });
  assert.equal(result.status, 402);
  assert.match(result.data.error, /DeepSeek API账户余额不足/);
  assert.match(result.data.error, /充值/);
  assert.doesNotMatch(result.data.error, /暂时不可用|test-key-private/);
  assert.equal(result.headers.has('set-cookie'), false);
  assert.equal(balance.requests[0].body.max_tokens, 16);
  assert.deepEqual(balance.requests[0].body.thinking, { type: 'disabled' });

  const limited = await setup(t, () => ({ status: 429, body: { error: 'rate limit' } }));
  const retry = await limited.post('/api/connect', { ...limited.credentials, provider: 'deepseek' });
  assert.equal(retry.status, 429);
  assert.match(retry.data.error, /并发限制/);
  assert.doesNotMatch(retry.data.error, /余额不足/);
});

test('其他服务商的402说明计费状态，生成请求保留正常输出容量', async t => {
  const payment = await setup(t, () => ({ status: 402, body: { error: 'payment required' } }));
  const denied = await payment.connect();
  assert.equal(denied.status, 402);
  assert.match(denied.data.error, /计费状态/);
  const generation = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : JSON.stringify(interactiveProject) }));
  await generation.connect();
  assert.equal((await generation.post('/api/generate', generationInput)).status, 200);
  assert.equal('max_tokens' in generation.requests[1].body, false);
});

test('生成失败后只修复一次，并返回通过校验的项目', async t => {
  const app = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : count === 2 ? '{"title":"缺少结构的项目"}' : JSON.stringify(interactiveProject) }));
  await app.connect();
  const result = await app.post('/api/generate', generationInput);
  assert.equal(result.status, 200);
  assert.equal(result.data.project.title, interactiveProject.title);
  assert.equal(result.data.generation.source, 'ai');
  assert.equal(result.data.generation.repairCount, 1);
  assert.equal(app.requests.length, 3);
  assert.match(app.requests[1].body.messages[1].content, /下一阶段学习圆锥曲线/);
  assert.match(app.requests[2].body.messages[1].content, /缺少结构的项目/);
});

test('生成响应显示实际模型、耗时与用量，并在会话中保留最近一次生成凭证', async t => {
  const app = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : JSON.stringify(interactiveProject), model: 'actual-test-model', usage: { prompt_tokens: 120, completion_tokens: 480, total_tokens: 600 } }));
  const connected = await app.connect();
  assert.match(connected.data.verifiedAt, /^\d{4}-/);
  const result = await app.post('/api/generate', generationInput);
  const metadata = result.data.generation;
  assert.equal(metadata.source, 'ai');
  assert.equal(metadata.provider, 'custom');
  assert.equal(metadata.model, 'actual-test-model');
  assert.equal(metadata.usage.total_tokens, 600);
  assert.equal(metadata.repairCount, 0);
  assert.ok(metadata.elapsedMs >= 0);
  assert.equal(metadata.requestId.length, 24);
  assert.equal((await (await app.get('/api/session')).json()).lastGeneration.requestId, metadata.requestId);
  assert.equal(JSON.stringify(metadata).includes('test-key-private'), false);
});

test('两次无效生成返回错误，不替换成预置项目', async t => {
  const app = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : '{"title":"无效"}' }));
  await app.connect();
  const result = await app.post('/api/generate', generationInput);
  assert.equal(result.status, 502);
  assert.equal('project' in result.data, false);
  assert.equal(app.requests.length, 3);
  assert.match(result.data.error, /1次自动修复.*version/);
});

test('DeepSeek生成和修复启用JSON输出，合法固定参数可进入项目', async t => {
  const generated = structuredClone(interactiveProject);
  Object.assign(generated.experiments[0].config.parameters.find(item => item.key === 'D'), { min: 20, max: 20, value: 20, step: 0 });
  const app = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : count === 2 ? '{"title":"缺少字段"}' : JSON.stringify(generated) }));
  await app.post('/api/connect', { ...app.credentials, provider: 'deepseek' });
  const result = await app.post('/api/generate', generationInput);
  assert.equal(result.status, 200);
  assert.equal(result.data.generation.repairCount, 1);
  assert.equal('response_format' in app.requests[0].body, false);
  for (const request of app.requests.slice(1)) {
    assert.deepEqual(request.body.response_format, { type: 'json_object' });
    assert.equal(request.body.max_tokens, 32768);
    assert.deepEqual(request.body.thinking, { type: 'enabled' });
    assert.equal(request.body.reasoning_effort, 'high');
  }
});

test('校验失败保留具体参数和数值，修复请求可据此定位问题', async t => {
  const invalid = structuredClone(interactiveProject);
  invalid.experiments[0].config.parameters[0].step = 100;
  const app = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : JSON.stringify(invalid) }));
  await app.connect();
  const result = await app.post('/api/generate', generationInput);
  assert.equal(result.status, 502);
  assert.match(result.data.error, /几何参数「v」.*step=100/);
  assert.match(app.requests[2].body.messages[1].content, /几何参数「v」.*step=100/);
});

test('空白与长说明的任务表首次生成成功，保持原始数据且无需模型修复', async t => {
  const generated = structuredClone(interactiveProject);
  generated.taskData.rows = [['无单位', 0, ''], ['待计算', null, '由学生计算'], ['满足约束', true, ''], ['超出约束', false, ''], ['条件说明', '教学设定', '说明文字。'.repeat(100)]];
  const app = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : JSON.stringify(generated) }));
  await app.connect();
  const result = await app.post('/api/generate', generationInput);
  assert.equal(result.status, 200);
  assert.equal(result.data.generation.repairCount, 0);
  assert.equal(app.requests.length, 2);
  assert.deepEqual(result.data.project.taskData, generated.taskData);
});

test('任务表类型错误传入准确行列和转换要求，修复后可生成', async t => {
  const invalid = structuredClone(interactiveProject);
  invalid.taskData.rows[1][2] = [3, 4];
  const repaired = structuredClone(invalid);
  repaired.taskData.rows[1][2] = '（3，4）';
  const app = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : JSON.stringify(count === 2 ? invalid : repaired) }));
  await app.connect();
  const result = await app.post('/api/generate', generationInput);
  assert.equal(result.status, 200);
  assert.equal(result.data.generation.repairCount, 1);
  assert.match(app.requests[2].body.messages[1].content, /taskData\.rows\[1\]\[2\]（第2行，第3列/);
  assert.match(app.requests[2].body.messages[1].content, /当前为数组.*写成文本/);
  assert.equal(result.data.project.taskData.rows[1][2], '（3，4）');
});

test('JSON语法错误给出转义说明，错误正文不回显原始内容', async t => {
  const app = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : 'test-key-private {"prompt":"公式\\frac{1}{2}"' }));
  await app.connect();
  const result = await app.post('/api/generate', generationInput);
  assert.equal(result.status, 502);
  assert.match(result.data.error, /JSON语法无效.*转义/);
  assert.doesNotMatch(result.data.error, /test-key-private/);
});

test('新生成项目拒绝旧拟合结构，并要求包含指定的探索方式', async t => {
  const old = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : JSON.stringify(legacyProject) }));
  await old.connect();
  assert.equal((await old.post('/api/generate', generationInput)).status, 502);
  const preference = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : JSON.stringify(interactiveProject) }));
  await preference.connect();
  assert.equal((await preference.post('/api/generate', { ...generationInput, activityPreference: 'network' })).status, 502);
  assert.equal((await preference.post('/api/generate', { ...generationInput, activityPreference: 'geometry' })).status, 200);
});

test('后续生成会优先推荐尚未使用的实验类型，并把近期设计传给模型', async t => {
  const app = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : JSON.stringify(interactiveProject) }));
  await app.connect();
  await app.post('/api/generate', generationInput);
  await app.post('/api/generate', generationInput);
  const input = app.requests[2].body.messages[1].content;
  assert.match(input, /"recommendedTypes":\["optimization"\]/);
  assert.ok(input.includes(interactiveProject.title));
  assert.equal((await app.post('/api/generate', { ...generationInput, activityPreference: 'run-code' })).status, 400);
});

test('生成请求携带课标、教材原文定位、紧凑知识图谱和原始学情', async t => {
  const app = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : JSON.stringify(interactiveProject) }));
  await app.connect();
  const result = await app.post('/api/generate', { ...generationInput, modules: ['圆锥曲线'], activityPreference: 'geometry' });
  assert.equal(result.status, 200);
  const prompt = app.requests[1].body.messages[1].content;
  assert.match(prompt, /2017年版2025年修订/);
  assert.match(prompt, /knowledgeGraph/);
  assert.match(prompt, /椭圆的定义与标准方程/);
  assert.match(prompt, /printedPage/);
  assert.match(prompt, /下一阶段学习圆锥曲线/);
  assert.equal(result.data.generation.grounding.graphNodes, 234);
  assert.ok(result.data.generation.grounding.textbookKnowledge > 0);
  const resources = await (await app.get('/api/teaching-resources')).json();
  assert.equal(resources.books, 5);
  assert.equal(resources.graph.nodes.length, 234);
});

test('提示与反馈要求先提交尝试，并传入交互状态和既有成果', async t => {
  const app = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : count === 2 ? JSON.stringify({ title: '观察变化', content: '比较横坐标相邻的两个点。', question: '哪个区间的变化更大？' }) : JSON.stringify({ strength: '你比较了两个数据点。', nextStep: '补充单位并检查其他区间。', question: '变化趋势是否一致？' }) }));
  await app.connect();
  const input = { project, stageId: project.stages[0].id, attempt: '', level: 1, interactionState: { changed: true }, previousResults: [{ note: '前一阶段记录' }] };
  assert.equal((await app.post('/api/hint', input)).status, 400);
  assert.equal(app.requests.length, 1);
  input.attempt = '我看到数据逐渐增大，但不知道如何比较变化速度。' + '观察记录。'.repeat(1400);
  const hint = await app.post('/api/hint', input);
  assert.equal(hint.status, 200);
  assert.equal(hint.data.hint.title, '观察变化');
  assert.match(app.requests[1].body.messages[1].content, /前一阶段记录/);
  assert.match(app.requests[1].body.messages[1].content, /changed/);
  const feedback = await app.post('/api/feedback', input);
  assert.equal(feedback.status, 200);
  assert.equal(feedback.data.feedback.nextStep, '补充单位并检查其他区间。');
});

test('上传接受TeX内容，拒绝二进制文档与超长文本', async t => {
  const app = await setup(t);
  const content = '\\section{教学进度}\n已学习统计与函数。';
  const result = await app.post('/api/upload', { filename: '课程计划.tex', content });
  assert.equal(result.status, 200);
  assert.equal(result.data.text, content);
  assert.equal((await app.post('/api/upload', { filename: '课程计划.markdown', content })).status, 200);
  assert.equal((await app.post('/api/upload', { filename: '课程计划.pdf', content })).status, 400);
  assert.equal((await app.post('/api/upload', { filename: '课程计划.txt', content: '甲'.repeat(30001) })).status, 400);
});

test('知识图谱可直接读取，内容与教材目录一致，并保持只读', async t => {
  const app = await setup(t);
  const source = JSON.parse(await readFile(new URL('../books/knowledge-graph.full.json', import.meta.url), 'utf8'));
  const response = await app.get('/api/knowledge-graph');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), source);
  assert.equal((await app.get('/knowledge-graph.html')).status, 200);
  assert.equal((await app.post('/api/knowledge-graph', {})).status, 405);
  assert.equal((await app.get('/books/sources.json')).status, 404);
  assert.equal(app.requests.length, 0);
});

test('会话到期后清除凭据并要求重新连接', async t => {
  let currentTime = 1000;
  const app = await setup(t, undefined, { sessionTtlMs: 1000, now: () => currentTime });
  await app.connect();
  currentTime = 2001;
  assert.equal((await (await app.get('/api/session')).json()).connected, false);
  assert.equal((await app.post('/api/generate', generationInput)).status, 401);
});

test('浏览器测试实例使用独立Cookie，保持主服务会话独立', async t => {
  const app = await setup(t, undefined, { cookieName: 'modeling_ui_test_session' });
  const result = await app.connect();
  assert.match(result.headers.get('set-cookie'), /^modeling_ui_test_session=/);
  assert.equal((await (await app.get('/api/session')).json()).connected, true);
  assert.match((await app.post('/api/logout', {})).headers.get('set-cookie'), /^modeling_ui_test_session=;/);
  assert.equal((await (await app.get('/api/session')).json()).connected, false);
});

test('同源校验与静态文件边界阻止越界读取和跨站调用', async t => {
  const app = await setup(t);
  assert.equal((await app.post('/api/connect', app.credentials, { Origin: 'https://unrelated.example' })).status, 403);
  for (const pathname of ['/server.mjs', '/prompts.json', '/lib/project-schema.mjs', '/%2e%2e%2fserver.mjs']) {
    assert.equal((await app.get(pathname)).status, 404);
  }
  assert.equal(app.requests.length, 0);
});

test('HTTP远程API地址被拒绝，本机模型地址可连接', async t => {
  const app = await setup(t);
  const result = await app.post('/api/connect', { ...app.credentials, baseUrl: 'http://example.com/v1' });
  assert.equal(result.status, 400);
  assert.equal(app.requests.length, 0);
  assert.equal((await app.connect()).status, 200);
});

test('模型响应超时与输出截断显示明确错误', async t => {
  const timed = await setup(t, () => ({ content: 'OK', delay: 100 }), { upstreamTimeoutMs: 20 });
  assert.equal((await timed.connect()).status, 504);
  const truncated = await setup(t, (_, count) => ({ content: count === 1 ? 'OK' : '{', finishReason: count === 1 ? 'stop' : 'length' }));
  await truncated.connect();
  const result = await truncated.post('/api/generate', generationInput);
  assert.equal(result.status, 502);
  assert.match(result.data.error, /截断/);
  assert.equal(truncated.requests.length, 2);
});
