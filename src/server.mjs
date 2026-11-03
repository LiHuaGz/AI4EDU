import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { validateProject, validateGeneratedProject } from './lib/project-schema.mjs';
import { loadTeachingResources, teachingContext, validateKnowledgeAlignment } from './lib/teaching-context.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const COOKIE = 'modeling_session';
const PROVIDERS = {
  openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  deepseek: { baseUrl: 'https://api.deepseek.com', model: 'deepseek-flash' },
  qwen: { baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
  custom: { baseUrl: '', model: '' },
};
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.wasm': 'application/wasm', '.zip': 'application/zip', '.whl': 'application/zip' };

class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function text(value, name, max = 2000, required = true) {
  if (typeof value !== 'string' || (required && !value.trim()) || value.length > max) {
    throw new ApiError(400, `请检查${name}，长度上限为${max}字。`);
  }
  return value.trim();
}

function list(value, name) {
  if (!Array.isArray(value) || !value.length || value.length > 12) throw new ApiError(400, `请选择${name}。`);
  return value.map(item => text(item, name, 100));
}

function parseModelJson(content) {
  // 接受常见的JSON代码围栏，内容始终作为数据解析。
  const source = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(source); }
  catch (error) {
    const position = error.message.match(/position (\d+)/)?.[1];
    throw new Error(`JSON语法无效${position ? `，错误位置约在第${Number(position) + 1}个字符` : ''}。请检查括号配对、引号、逗号及公式反斜杠的转义，只返回完整JSON对象。`);
  }
}

function format(template, input) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => typeof input[key] === 'string' ? input[key] : JSON.stringify(input[key] ?? null));
}

function sessionInfo(session) {
  if (!session) return { connected: false };
  return { connected: true, provider: session.provider, model: session.model, baseUrl: session.baseUrl, expiresAt: session.expiresAt, verifiedAt: session.verifiedAt, lastGeneration: session.lastGeneration ?? null };
}

function getCookie(request, name) {
  return request.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

async function readJson(request) {
  if (!request.headers['content-type']?.startsWith('application/json')) throw new ApiError(415, '请使用JSON格式提交数据。');
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1024 * 1024) throw new ApiError(413, '提交内容超过1MB，请缩短教学计划。');
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new ApiError(400, '提交内容的JSON格式有误。'); }
}

function connectionInput(body) {
  const provider = text(body.provider, '服务商', 30);
  if (!PROVIDERS[provider]) throw new ApiError(400, '请选择可用的模型服务商。');
  const apiKey = text(body.apiKey, 'API密钥', 1024);
  if (/\s/.test(apiKey)) throw new ApiError(400, 'API密钥中含有空白字符，请重新粘贴。');
  const model = text(body.model || PROVIDERS[provider].model, '模型名称', 150);
  let url;
  try { url = new URL(body.baseUrl || PROVIDERS[provider].baseUrl); }
  catch { throw new ApiError(400, '请输入完整的API基础地址。'); }
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) throw new ApiError(400, 'API地址须使用HTTPS，本机模型服务可使用HTTP。');
  if (url.username || url.password || url.search || url.hash) throw new ApiError(400, 'API基础地址应只包含协议、主机与路径。');
  const baseUrl = url.href.replace(/\/+$/, '').replace(/\/chat\/completions$/, '');
  return { provider, apiKey, model, baseUrl };
}

/** 密钥仅存在当前进程内存中，会话退出或到期后删除。 */
export async function createApp(options = {}) {
  const prompts = options.prompts || JSON.parse(await readFile(path.join(ROOT, 'prompts.json'), 'utf8'));
  const teachingResources = await loadTeachingResources();
  const fetchUpstream = options.fetchImpl || fetch;
  const sessionTtlMs = options.sessionTtlMs ?? 2 * 60 * 60 * 1000;
  const cookieName = options.cookieName || COOKIE;
  const now = options.now || Date.now;
  const sessions = new Map();
  const pending = new Set();
  const cleanup = setInterval(() => {
    for (const [id, session] of sessions) if (session.expiresAt <= now()) sessions.delete(id);
  }, 60_000);
  cleanup.unref();

  async function callModel(session, kind, values) {
    const startedAt = Date.now();
    const template = prompts[kind];
    if (!template?.system || !template?.user) throw new ApiError(500, `提示词配置缺少${kind}模板。`);
    const templateValues = { contract: prompts.projectContract, ...values };
    const designing = kind === 'generation' || (kind === 'repair' && values.input.kind === 'generation');
    const payload = {
      model: session.model,
      messages: [{ role: 'system', content: format(template.system, templateValues) }, { role: 'user', content: format(template.user, templateValues) }],
      stream: false,
    };
    // 连接验证只需要极短回复，限制这一步的输出量。
    if (kind === 'connection') payload.max_tokens = 16;
    if (session.provider === 'deepseek') {
      payload.thinking = { type: designing ? 'enabled' : 'disabled' };
      if (designing) payload.reasoning_effort = 'high';
      // 结构化任务启用JSON输出，并为完整题组预留输出容量。
      if (kind !== 'connection') {
        payload.response_format = { type: 'json_object' };
        payload.max_tokens = designing ? 32768 : 4096;
      }
    }
    if (session.provider === 'qwen') payload.enable_thinking = false;
    let response;
    try {
      response = await fetchUpstream(`${session.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'error',
        signal: AbortSignal.timeout(options.upstreamTimeoutMs ?? (designing ? 240_000 : 120_000)),
      });
    } catch (error) {
      if (error.name === 'TimeoutError' || error.name === 'AbortError') throw new ApiError(504, '模型响应超时，请稍后重试或更换模型。');
      throw new ApiError(502, '暂时无法连接模型服务，请检查API地址与网络。');
    }
    // 上游原始错误可能含请求信息，只向界面返回可操作的错误说明。
    if (!response.ok) {
      const errors = {
        400: '模型服务拒绝了请求，请检查模型名称与接口兼容性。',
        401: 'API密钥验证失败，请检查密钥与服务商是否对应。',
        402: session.provider === 'deepseek'
          ? 'DeepSeek API账户余额不足（402）。请登录DeepSeek开放平台检查余额并充值后重新连接。'
          : '模型服务返回支付或额度错误（402），请到服务商控制台检查余额与计费状态。',
        403: '当前API密钥没有访问该模型的权限。',
        404: '未找到模型或接口，请检查模型名称与API基础地址。',
        429: session.provider === 'deepseek'
          ? 'DeepSeek请求过于频繁或已达到并发限制（429），请稍后重试。'
          : '模型服务额度不足或请求过于频繁，请检查账户额度后重试。',
      };
      throw new ApiError([402, 429].includes(response.status) ? response.status : 502, errors[response.status] || `模型服务暂时不可用（状态码${response.status}），请稍后重试。`);
    }
    let data;
    try { data = await response.json(); }
    catch { throw new ApiError(502, '模型服务返回了无法识别的响应，请检查API基础地址。'); }
    const choice = data?.choices?.[0];
    if (choice?.finish_reason === 'length') throw new ApiError(502, '模型输出被长度限制截断，请更换输出容量更大的模型后重试。');
    const content = choice?.message?.content;
    if (typeof content !== 'string' || !content.trim()) throw new ApiError(502, '模型没有返回有效文本，请检查该模型是否支持聊天接口。');
    if (content.length > 180_000) throw new ApiError(502, '模型返回内容过长，请重新生成。');
    const usage = data.usage && typeof data.usage === 'object' ? Object.fromEntries(['prompt_tokens', 'completion_tokens', 'total_tokens'].filter(key => Number.isFinite(data.usage[key])).map(key => [key, data.usage[key]])) : null;
    return { content, model: typeof data.model === 'string' ? data.model : session.model, elapsedMs: Date.now() - startedAt, usage };
  }

  async function structured(session, kind, input, validate) {
    const startedAt = Date.now();
    let result = await callModel(session, kind, { input });
    const calls = [result];
    const finish = value => {
      // 调用凭证与学习内容分开返回，让界面能显示真实来源与耗时。
      const usage = Object.fromEntries(['prompt_tokens', 'completion_tokens', 'total_tokens'].map(key => [key, calls.reduce((sum, call) => sum + (call.usage?.[key] || 0), 0)]));
      return { value, metadata: { source: 'ai', requestId: randomBytes(12).toString('hex'), provider: session.provider, model: result.model, generatedAt: new Date(now()).toISOString(), elapsedMs: Date.now() - startedAt, usage: calls.some(call => call.usage) ? usage : null, repairCount: calls.length - 1 } };
    };
    try { return finish(validate(parseModelJson(result.content))); }
    catch (error) {
      result = await callModel(session, 'repair', { input: { kind, context: input }, output: result.content, error: error.message });
      calls.push(result);
      try { return finish(validate(parseModelJson(result.content))); }
      catch (repairError) {
        const reason = repairError instanceof TypeError ? '项目缺少必要字段，或字段类型有误。' : repairError.message;
        // 保留具体校验原因，凭据和原始响应均不写入错误信息。
        const safeReason = reason.replaceAll(session.apiKey, '［已隐藏］').slice(0, 300);
        throw new ApiError(502, `模型内容经1次自动修复后仍未通过校验：${safeReason}`);
      }
    }
  }

  function readSession(request, required = true) {
    const id = getCookie(request, cookieName);
    const session = sessions.get(id);
    if (session?.expiresAt <= now()) sessions.delete(id);
    const active = sessions.get(id);
    if (!active && required) throw new ApiError(401, '连接已结束，请重新输入API密钥。');
    return active;
  }

  const server = http.createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    const send = (status, data) => {
      response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(JSON.stringify(data));
    };
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
      if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) throw new ApiError(403, '请通过本机地址访问此demo。');
      if (request.method === 'POST' && request.headers.origin && request.headers.origin !== url.origin) throw new ApiError(403, '请在当前网页内发起请求。');
      if (!url.pathname.startsWith('/api/')) {
        if (!['GET', 'HEAD'].includes(request.method)) throw new ApiError(405, '该地址只支持读取。');
        const pathname = decodeURIComponent(url.pathname);
        const publicRoot = path.join(ROOT, 'public');
        const file = pathname === '/demo-project.json' ? path.join(ROOT, 'demo-project.json') : path.resolve(publicRoot, `.${pathname === '/' ? '/index.html' : pathname}`);
        if (pathname !== '/demo-project.json' && !file.startsWith(`${publicRoot}${path.sep}`)) throw new ApiError(404, '页面不存在。');
        let content;
        try {
          if (!(await stat(file)).isFile()) throw new Error();
          content = await readFile(file);
        } catch { throw new ApiError(404, '页面不存在。'); }
        response.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
        response.end(request.method === 'HEAD' ? undefined : content);
        return;
      }
      // 图谱直接读取教材目录中的完整文件，页面无需建立模型会话。
      if (url.pathname === '/api/knowledge-graph') {
        if (request.method !== 'GET') throw new ApiError(405, '知识图谱接口只支持读取。');
        const graph = JSON.parse(await readFile(path.join(ROOT, 'books', 'knowledge-graph.full.json'), 'utf8'));
        return send(200, graph);
      }
      if (request.method === 'GET' && url.pathname === '/api/teaching-resources') {
        return send(200, { curriculum: teachingResources.curriculum.title, requirements: teachingResources.curriculum.requirements,
          books: teachingResources.graph.books.length, nodes: teachingResources.graph.nodes.length, edges: teachingResources.graph.edges.length,
          graph: teachingResources.compact });
      }
      if (request.method === 'GET' && url.pathname === '/api/session') return send(200, sessionInfo(readSession(request, false)));
      if (request.method !== 'POST') throw new ApiError(405, '该接口需要POST请求。');
      const body = await readJson(request);
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw new ApiError(400, '请输入有效的表单内容。');
      if (url.pathname === '/api/connect') {
        const session = connectionInput(body);
        await callModel(session, 'connection', {});
        sessions.delete(getCookie(request, cookieName));
        session.expiresAt = now() + sessionTtlMs;
        session.verifiedAt = new Date(now()).toISOString();
        const id = randomBytes(32).toString('hex');
        sessions.set(id, session);
        response.setHeader('Set-Cookie', `${cookieName}=${id}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.floor(sessionTtlMs / 1000)}`);
        return send(200, sessionInfo(session));
      }
      if (url.pathname === '/api/logout') {
        sessions.delete(getCookie(request, cookieName));
        response.setHeader('Set-Cookie', `${cookieName}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);
        return send(200, { connected: false });
      }
      if (url.pathname === '/api/upload') {
        const filename = text(body.filename, '文件名', 240);
        if (!['.txt', '.md', '.markdown', '.tex', '.csv'].includes(path.extname(filename).toLowerCase())) throw new ApiError(400, '支持TXT、Markdown、TeX与CSV文件，请将其他文档中的文字粘贴到教学计划框。');
        const content = text(body.content, '教学计划', 30_000);
        if (content.includes('\0')) throw new ApiError(400, '请上传UTF－8编码的文本文件。');
        return send(200, { filename: path.basename(filename), text: content });
      }
      if (!['/api/generate', '/api/hint', '/api/feedback'].includes(url.pathname)) throw new ApiError(404, '接口不存在。');
      const session = readSession(request);
      if (pending.has(session)) throw new ApiError(409, '当前模型请求正在处理，请等待完成。');
      pending.add(session);
      try {
        if (url.pathname === '/api/generate') {
          const types = ['geometry', 'optimization', 'probability', 'network'];
          const activityPreference = body.activityPreference === 'allocation' ? 'optimization' : body.activityPreference ?? 'auto';
          if (!['auto', ...types].includes(activityPreference)) throw new ApiError(400, '请选择支持的探索方式。');
          const recentDesigns = body.recentDesigns ?? [];
          if (!Array.isArray(recentDesigns) || recentDesigns.length > 4) throw new ApiError(400, '近期项目记录最多4项。');
          const history = recentDesigns.map(item => ({ title: text(item?.title, '近期项目名称', 80), types: list(item?.types, '近期实验类型').filter(type => types.includes(type)) }));
          // 近期较少出现的实验优先，避免重复请求仍围绕同一种交互。
          const recent = [...(session.recentDesigns || []), ...history];
          const usage = Object.fromEntries(types.map(type => [type, recent.filter(item => item.types.includes(type)).length]));
          const ordered = [...types].sort((a, b) => usage[a] - usage[b]);
          const recommendedTypes = activityPreference === 'auto' ? ordered.slice(0, 1) : [activityPreference];
          const input = {
            plan: text(body.plan, '教学计划', 30_000),
            progress: text(body.progress, '学习进度', 6000),
            interests: list(body.interests, '兴趣领域'),
            modules: list(body.modules, '数学模块'),
            duration: text(String(body.duration ?? ''), '活动时长', 100),
            activityPreference, recommendedTypes, recentDesigns: recent.slice(-4),
          };
          input.teachingResources = teachingContext(teachingResources, input);
          const result = await structured(session, 'generation', input, project => {
            validateGeneratedProject(project);
            validateKnowledgeAlignment(project, teachingResources.graph);
            if (activityPreference !== 'auto' && !project.experiments.some(experiment => experiment.type === activityPreference)) throw new Error('项目应包含用户选择的主要探索方式。');
            return project;
          });
          const design = { title: result.value.title, types: [...new Set(result.value.experiments.map(experiment => experiment.type))] };
          session.recentDesigns = [...(session.recentDesigns || []), design].slice(-4);
          session.lastGeneration = result.metadata;
          return send(200, { project: result.value, generation: { ...result.metadata, grounding: { curriculum: teachingResources.curriculum.title, graphNodes: teachingResources.graph.nodes.length, textbookKnowledge: input.teachingResources.textbookKnowledge.rows.length } } });
        }
        let project;
        try { project = validateProject(body.project); }
        catch { throw new ApiError(400, '当前项目数据不完整，请重新生成项目。'); }
        const stageId = text(body.stageId, '阶段编号', 100);
        const stage = project.stages.find(item => item.id === stageId);
        if (!stage) throw new ApiError(400, '未找到当前学习阶段。');
        const attempt = text(body.attempt, '解题尝试', 15_000);
        const level = body.level ?? 1;
        if (!Number.isInteger(level) || level < 1 || level > 3) throw new ApiError(400, '提示级别应为1至3。');
        const input = { project, stageId, attempt, attemptFormat: body.attemptFormat === 'markdown+latex' ? 'markdown+latex' : 'plain', level, interactionState: body.interactionState ?? {}, previousResults: body.previousResults ?? [],
          learningContext: body.learningContext ?? {},
          teachingResources: teachingContext(teachingResources, {}, [...(project.knowledge.knownIds || []), ...(project.knowledge.newIds || [])]) };
        const kind = url.pathname === '/api/hint' ? 'hint' : 'feedback';
        const fields = kind === 'hint' ? ['title', 'content', 'question'] : ['strength', 'nextStep', 'question'];
        const result = await structured(session, kind, input, data => {
          if (!data || typeof data !== 'object') throw new Error('请返回JSON对象。');
          return Object.fromEntries(fields.map(field => [field, text(data[field], field, 3000)]));
        });
        return send(200, { [kind]: result.value, request: result.metadata });
      } finally { pending.delete(session); }
    } catch (error) {
      send(error.status || 500, { error: error.status ? error.message : '服务处理失败，请稍后重试。' });
    }
  });
  server.on('close', () => { clearInterval(cleanup); sessions.clear(); });
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const server = await createApp();
  const port = Number(process.env.PORT || 3000);
  server.on('error', error => {
    console.error(error.code === 'EADDRINUSE' ? `端口${port}已被占用，请设置PORT后重新启动。` : '服务启动失败，请检查端口设置。');
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => console.log(`数学建模工作室已启动：http://127.0.0.1:${port}`));
}
