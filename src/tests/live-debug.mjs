import { createInterface } from 'node:readline';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

// 实测凭据仅通过标准输入读取；测试产物只包含模型响应和耗时。
console.log('等待标准输入中的实测配置，凭据不会输出或保存。');
if (process.stdin.isTTY) process.stdin.setRawMode(true);
const reader = createInterface({ input: process.stdin, terminal: false });
const input = JSON.parse(await new Promise(resolve => reader.once('line', resolve)));
reader.close();
if (process.stdin.isTTY) process.stdin.setRawMode(false);
const outputDirectory = new URL('./artifacts/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });

if (input.mode === 'connection') {
  const prompts = JSON.parse(await readFile(new URL('../prompts.json', import.meta.url), 'utf8'));
  const results = [];
  for (const model of ['deepseek-chat', 'deepseek-flash']) {
    const started = Date.now();
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${input.apiKey}` },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: prompts.connection.system }, { role: 'user', content: prompts.connection.user }], thinking: { type: 'disabled' }, max_tokens: 32, stream: false }),
      signal: AbortSignal.timeout(60000),
    });
    const data = await response.json();
    const result = { requestedModel: model, status: response.status, actualModel: data.model || null, validReply: Boolean(data.choices?.[0]?.message?.content), elapsedMs: Date.now() - started };
    results.push(result);
    console.log(JSON.stringify(result));
  }
  await writeFile(new URL('live-connection.json', outputDirectory), JSON.stringify(results, null, 2));
} else {
  const base = 'http://127.0.0.1:3000';
  const connected = await fetch(`${base}/api/connect`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'deepseek', model: 'deepseek-flash', baseUrl: 'https://api.deepseek.com', apiKey: input.apiKey }),
  });
  const session = await connected.json();
  if (!connected.ok) throw new Error(session.error);
  const cookie = connected.headers.get('set-cookie').split(';')[0];
  console.log(JSON.stringify({ connected: true, model: session.model }));
  const cases = input.cases || [
    { plan: '高一建模活动９０分钟。已学二次函数、平面几何和不等式。围绕校园空间设计比较不同方案。', progress: '能计算矩形面积，理解函数增减和不等式；尚未学习导数。', interests: ['校园生活', '环境生态'], modules: ['函数与方程', '最值与优化'], duration: '90分钟', activityPreference: 'geometry' },
    { plan: '高一建模活动９０分钟。已学古典概型、频率、平均数和比例，讨论校园活动安排。', progress: '会计算简单抽样概率，希望通过模拟理解随机性和资源分配。', interests: ['校园生活'], modules: ['统计与概率', '最值与优化'], duration: '90分钟', activityPreference: 'probability' },
  ];
  const results = [];
  try {
    for (let index = 0; index < cases.length; index++) {
      const response = await fetch(`${base}/api/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify(cases[index]), signal: AbortSignal.timeout(250000) });
      const result = await response.json();
      if (!response.ok) { console.log(JSON.stringify({ case: index + 1, error: result.error })); process.exitCode = 1; break; }
      results.push(result);
      await writeFile(new URL(`live-project-${index + 1}.json`, outputDirectory), JSON.stringify(result, null, 2));
      console.log(JSON.stringify({ case: index + 1, title: result.project.title, version: result.project.version, types: result.project.experiments?.map(item => item.type), generation: result.generation }));
      if (index === 0) {
        const feedback = await fetch(`${base}/api/hint`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ project: result.project, stageId: result.project.stages[0].id, attempt: '我已经尝试调整控件，但还不清楚怎样比较两个方案，想知道下一步应该观察什么。', level: 1, interactionState: { note: '实测初始状态', experiments: result.project.experiments.map(item => ({ id: item.id, type: item.type, initialConfig: item.config })) }, previousResults: [] }) });
        const hint = await feedback.json();
        await writeFile(new URL('live-hint.json', outputDirectory), JSON.stringify(hint, null, 2));
        console.log(JSON.stringify({ hintStatus: feedback.status, hintTitle: hint.hint?.title, request: hint.request }));
      }
    }
  } finally {
    await fetch(`${base}/api/logout`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: '{}' });
  }
}
