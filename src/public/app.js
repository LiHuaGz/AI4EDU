import { mountWorkbench, EXPERIMENT_LABELS } from './experiment-workbench.js';
import { layoutView, loginView, setupView, workspaceView } from './views.js';
import { EXAMPLE_INPUT } from './example-input.js';
import { mountFormulaEditor, renderInlineFormulas } from './formula-editor.js';
import { answerToMarkdown, hasAttempt, missingAnswers, projectToMarkdown } from './answer-format.js';
import { calculationBindings } from './formula-calculator.js';
import { captureFirstAttempt, checkStage, evidenceText } from './learning-evidence.js';
import { mountPythonWorkbench } from './python-workbench.js';

// 连接凭据只交给后端，浏览器仅保存学习计划、实验数据和解题记录。
const STORAGE_KEY = 'zhixing-modeling-workspace-v1';
const providers = {
  deepseek: { label: 'DeepSeek', model: 'deepseek-flash', baseUrl: 'https://api.deepseek.com' },
  openai: { label: 'OpenAI', model: 'gpt-4o-mini', baseUrl: 'https://api.openai.com/v1' },
  qwen: { label: '通义千问', model: 'qwen-plus', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1' },
  custom: { label: '自定义', model: '', baseUrl: '' },
};
// 候选领域与模块供学生直接勾选，避免自由输入造成主题分散。
const interests = [
  ['校园生活', '用水、食堂与空间', 'school'], ['环境生态', '碳排放与资源利用', 'leaf'],
  ['天文探索', '轨道与空间关系', 'orbit'], ['体育运动', '轨迹与表现分析', 'ball'],
  ['城市交通', '路线与通行效率', 'route'], ['经济决策', '定价与方案比较', 'chart'],
  ['生命健康', '用药剂量与运动数据', 'heart'], ['数字媒体', '推荐与图像数据', 'camera'],
];
const modules = ['函数与方程', '统计与概率', '平面向量', '圆锥曲线', '数列', '最值与优化', '三角函数', '立体几何', '导数初步'];
const paths = {
  logo: '<path d="M3 16 9 5l5 10 7-12M3 21h18"/>',
  plug: '<path d="M8 3v5m8-5v5M6 8h12v4a6 6 0 0 1-12 0V8Zm6 10v4"/>',
  book: '<path d="M3 4h7a3 3 0 0 1 2 1 3 3 0 0 1 2-1h7v15h-7a3 3 0 0 0-2 1 3 3 0 0 0-2-1H3V4Zm9 1v15"/>',
  flask: '<path d="M9 3h6m-5 0v6l-6 10a1.4 1.4 0 0 0 1 2h14a1.4 1.4 0 0 0 1-2L14 9V3M7 15h10"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  arrowLeft: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  upload: '<path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6"/>',
  download: '<path d="M12 3v13m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7 0v4m-2-2h4"/>',
  school: '<path d="m3 9 9-6 9 6M5 10v11h14V10M9 21v-7h6v7"/><path d="M9 9h6"/>',
  leaf: '<path d="M20 3C8 3 2 8 5 16c8 5 15-1 15-13ZM5 21 16 10"/>',
  orbit: '<ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-30 12 12)"/><circle cx="12" cy="12" r="3"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5.5 5.5c8 2 8 11 13 13M18.5 5.5c-8 2-8 11-13 13"/>',
  route: '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h9a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h9"/>',
  chart: '<path d="M4 3v17h17M8 15l4-6 4 3 5-7"/>',
  light: '<path d="M9 18h6m-6 3h6M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3Z"/>',
  pen: '<path d="m4 16 12-12 4 4L8 20l-5 1 1-5Zm10-10 4 4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
  link: '<path d="m10 14 4-4m-6 6-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m4 0 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 -1)"/>',
  file: '<path d="M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8m-8 4h6"/>',
  heart: '<path d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.6 12 20 12 20Z"/>',
  camera: '<path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4V8Z"/><circle cx="12" cy="13" r="3.2"/>',
  reset: '<path d="M4 4v6h6M4 10a8 8 0 1 1 0 6"/>',
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const $ = selector => document.querySelector(selector);
let saved = {};
try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { /* 浏览器存储不可用时，本次学习仍保留在内存中。 */ }
const state = {
  page: 'login', mode: 'live', session: null, provider: 'deepseek', busy: false,
  plan: '', progress: '', filename: '', interests: ['校园生活'], modules: ['函数与方程', '统计与概率'], duration: '90',
  project: null, projectInput: null, currentStage: 0, records: {}, labState: null, complete: false,
  activityPreference: 'auto', recentDesigns: [], generation: null,
  ...saved,
};
state.busy = false;
state.session = null;
state.projectMode = saved.projectMode || saved.mode || 'live';
let lab;
let answerEditor;
let pythonWorkbench;
let toastTimer;
let saveTimer;

function persist() {
  const { plan, progress, filename, interests, modules, duration, project, projectInput, currentStage, records, labState, complete, mode, projectMode, page, activityPreference, recentDesigns, generation } = state;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan, progress, filename, interests, modules, duration, project, projectInput, currentStage, records, labState, complete, mode, projectMode, page, activityPreference, recentDesigns, generation })); }
  catch { toast('浏览器存储空间不足，请导出本次学习记录。'); }
}
function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(persist, 300); }
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 4000);
}
async function api(route, body) {
  const response = await fetch(`/api/${route}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401 && route !== 'connect') {
      state.session = null;
      $('.status-pill')?.classList.remove('connected');
      if ($('.status-pill')) $('.status-pill').innerHTML = '<span class="status-dot"></span>连接已过期';
    }
    const error = new Error(data.error || data.message || '请求失败，请重试。');
    error.status = response.status;
    throw error;
  }
  return data;
}
function record() {
  const id = state.project.stages[state.currentStage].id;
  return state.records[id] ||= { answer: '', responses: {}, calculations: {}, scratch: '', difficulty: '', hints: [], criteria: [], completed: false, feedback: null };
}
function go(page) {
  if (state.busy) { toast('当前请求正在处理中，请稍候。'); return; }
  if (lab) { state.labState = lab.getState(); lab.destroy(); lab = null; }
  state.page = page;
  persist();
  render();
  window.scrollTo({ top: 0 });
}
function footer() {
  return `<footer class="footer-note"><span>${icon('shield')}学习记录保存在当前浏览器，可随时导出。</span><span>知行·数学建模实验室　／　课程研究原型</span></footer>`;
}
function shell(content) {
  $('#app').innerHTML = layoutView({ state, providers, icon, esc, content });
  document.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => go(button.dataset.page)));
  $('#brand-home').addEventListener('click', event => { event.preventDefault(); go(state.project ? 'workspace' : 'login'); });
  $('#logout')?.addEventListener('click', async () => {
    if (state.busy) return toast('当前请求正在处理中，请稍候。');
    try { await api('logout', {}); state.session = null; state.mode = 'live'; go('login'); toast('模型连接已断开，学习记录已保留。'); }
    catch (error) { toast(error.message); }
  });
}
function render() {
  answerEditor?.destroy(); answerEditor = null;
  pythonWorkbench?.destroy(); pythonWorkbench = null;
  if (lab) { state.labState = lab.getState(); lab.destroy(); lab = null; }
  if (state.page === 'workspace' && state.project) renderWorkspace();
  else if (state.page === 'setup') renderSetup();
  else renderLogin();
}
function renderLogin() {
  state.page = 'login';
  shell(loginView({ state, providers, icon, esc, footer }));
  document.querySelectorAll('[data-provider]').forEach(button => button.addEventListener('click', () => {
    if (state.busy) return;
    state.provider = button.dataset.provider;
    document.querySelectorAll('[data-provider]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', item === button); });
    $('#api-key').value = '';
    $('#model').value = providers[state.provider].model;
    $('#base-url').value = providers[state.provider].baseUrl;
    $('.settings').open = state.provider === 'custom';
  }));
  $('#reveal-key').addEventListener('click', () => { const input = $('#api-key'); input.type = input.type === 'password' ? 'text' : 'password'; $('#reveal-key').setAttribute('aria-label', input.type === 'password' ? '显示密钥' : '隐藏密钥'); });
  $('#connect-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (state.busy) return;
    state.busy = true;
    const button = $('#connect-button');
    document.querySelectorAll('#connect-form input,#connect-form button,[data-provider]').forEach(element => { element.disabled = true; });
    button.innerHTML = '<span class="spinner"></span>正在验证模型连接…';
    $('#connect-error').textContent = '';
    try {
      state.session = await api('connect', { provider: state.provider, model: $('#model').value.trim(), apiKey: $('#api-key').value.trim(), baseUrl: $('#base-url').value.trim() });
      $('#api-key').value = '';
      state.mode = 'live';
      state.busy = false;
      go('setup');
      toast(`已通过${state.session.model}的真实调用验证。点击生成后，AI会重新设计题目与交互。`);
    } catch (error) {
      $('#connect-error').textContent = error.message;
      document.querySelectorAll('#connect-form input,#connect-form button,[data-provider]').forEach(element => { element.disabled = false; });
      button.innerHTML = `重新连接${icon('arrow')}`;
      state.busy = false;
    }
  });
  $('#try-demo').addEventListener('click', () => { if (state.busy) return; state.mode = 'demo'; fillExample(); go('setup'); });
}
function fillExample() {
  Object.assign(state, structuredClone(EXAMPLE_INPUT));
  state.filename = '';
  persist();
}
function renderSetup() {
  shell(setupView({ state, modules, interests, icon, esc, footer }));
  $('#setup-connect')?.addEventListener('click', () => { state.mode = 'live'; go(state.session ? 'setup' : 'login'); });
  $('#fill-example').addEventListener('click', () => { if (state.busy) return; fillExample(); renderSetup(); toast('已填入示例教学计划，可以继续修改。'); });
  $('#activity-preference').addEventListener('change', event => { state.activityPreference = event.target.value; persist(); });
  for (const [selector, key] of [['#plan-text', 'plan'], ['#progress-text', 'progress']]) $(selector).addEventListener('input', event => { state[key] = event.target.value; scheduleSave(); });
  document.querySelectorAll('[data-module],[data-interest]').forEach(button => button.addEventListener('click', () => {
    if (state.busy) return;
    const isModule = Boolean(button.dataset.module);
    const key = isModule ? 'modules' : 'interests';
    const value = isModule ? button.dataset.module : button.dataset.interest;
    state[key] = state[key].includes(value) ? state[key].filter(item => item !== value) : [...state[key], value];
    persist(); renderSetup();
  }));
  // 时长用按钮呈现，隐藏的下拉框保留原值，便于沿用同一份状态。
  document.querySelectorAll('[data-duration]').forEach(button => button.addEventListener('click', () => {
    if (state.busy) return;
    state.duration = button.dataset.duration;
    persist(); renderSetup();
  }));
  $('#plan-file').addEventListener('change', event => uploadFile(event.target.files[0], 'plan'));
  $('#progress-file').addEventListener('change', event => uploadFile(event.target.files[0], 'progress'));
  const zone = $('#upload-zone');
  zone.addEventListener('dragover', event => { event.preventDefault(); zone.classList.add('dragging'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragging'));
  zone.addEventListener('drop', event => { event.preventDefault(); zone.classList.remove('dragging'); uploadFile(event.dataTransfer.files[0], 'plan'); });
  $('#generate').addEventListener('click', generateProject);
}
async function uploadFile(file, target = 'plan') {
  if (!file || state.busy) return;
  state.busy = true;
  setSetupDisabled(true);
  try {
    if (!/\.(txt|md|markdown|tex|csv)$/i.test(file.name)) throw new Error('请上传TXT、Markdown、TeX或CSV文件。');
    if (file.size > 300000) throw new Error('文件过大，请上传3万字以内的文本。');
    const content = await file.text();
    const result = await api('upload', { filename: file.name, content });
    if (target === 'progress') {
      if (result.text.length > 4000) throw new Error('学习进度最多4000字，请整理后重新上传。');
      state.progress = result.text;
      $('#progress-text').value = state.progress;
      toast('学习进度已读入，可以继续修改。');
    } else {
      state.plan = result.text;
      state.filename = result.filename;
      $('#plan-text').value = state.plan;
      $('#file-label').textContent = state.filename;
      toast('教学计划已读入，可以在文本框中检查和修改。');
    }
    persist();
  } catch (error) { toast(error.message); }
  finally { state.busy = false; setSetupDisabled(false); }
}
function setSetupDisabled(disabled) {
  document.querySelectorAll('.setup-grid input,.setup-grid textarea,.setup-grid select,.setup-grid button').forEach(element => { element.disabled = disabled; });
}
async function generateProject() {
  if (state.busy) return;
  const errorBox = $('#generate-error');
  errorBox.textContent = '';
  if (!state.plan.trim() || !state.progress.trim()) { errorBox.textContent = '请填写教学计划和当前学习进度。'; return; }
  if (!state.interests.length || !state.modules.length) { errorBox.textContent = '请至少选择一个兴趣领域和一个数学模块。'; return; }
  state.busy = true;
  setSetupDisabled(true);
  $('#generate-status').classList.remove('hidden');
  try {
    const live = state.mode !== 'demo' && Boolean(state.session);
    if (!live && state.mode !== 'demo') throw new Error('请先连接AI模型，再生成新的建模项目。');
    const result = live
      ? await api('generate', { plan: state.plan, progress: state.progress, interests: state.interests, modules: state.modules, duration: `${state.duration}分钟`, activityPreference: state.activityPreference, recentDesigns: state.recentDesigns.slice(-4) })
      : { project: await fetch('/demo-project.json').then(response => { if (!response.ok) throw new Error('示例项目加载失败。'); return response.json(); }) };
    const project = result.project;
    state.project = project;
    state.projectMode = live ? 'live' : 'demo';
    state.mode = state.projectMode;
    state.generation = result.generation || null;
    if (live) state.recentDesigns = [...state.recentDesigns, { title: project.title, types: project.experiments.map(item => item.type) }].slice(-4);
    state.projectInput = { plan: state.plan, progress: state.progress, interests: [...state.interests], modules: [...state.modules], duration: state.duration, activityPreference: state.activityPreference };
    state.currentStage = 0; state.records = {}; state.labState = null; state.complete = false;
    state.busy = false;
    go('workspace');
  } catch (error) {
    errorBox.textContent = error.message;
    setSetupDisabled(false);
    $('#generate-status').classList.add('hidden');
    state.busy = false;
  }
}
function stageResults() {
  return state.project.stages.filter(stage => hasAttempt(state.records[stage.id])).map(stage => ({ stageId: stage.id, title: stage.title, answer: answerToMarkdown(stage, state.records[stage.id]), answerFormat: 'markdown+latex', completed: state.records[stage.id].completed, interactionState: state.records[stage.id].snapshot || null }));
}
function renderWorkspace() {
  const project = state.project;
  const stage = project.stages[state.currentStage];
  const current = record();
  const previous = state.currentStage > 0 ? state.records[project.stages[state.currentStage - 1].id] : null;
  shell(workspaceView({ state, project, stage, current, previous, icon, esc, footer, safeLink, feedbackHtml, hintHtml, summaryHtml }));
  lab = mountWorkbench($('#lab'), project, state.labState, value => { state.labState = value; scheduleSave(); });
  lab.setStage(stage);
  const changed = () => { current.completed = false; current.checkResult = null; current.answerMarkdown = answerToMarkdown(stage, current); state.complete = false; scheduleSave(); };
  answerEditor = mountFormulaEditor($('#formula-answers'), stage, current, {
    onChange: changed,
    getBindings: () => calculationBindings(project, lab.getState()),
    previous: project.stages.filter(item => stage.dependsOn?.includes(item.id) && hasAttempt(state.records[item.id])).map(item => ({ stage: item, record: state.records[item.id] })),
  });
  renderInlineFormulas($('#app'));
  const markSupport = name => { current.supportUsed = [...new Set([...(current.supportUsed || []), name])]; scheduleSave(); };
  const supportCard = $('.support-card');
  if (supportCard?.open) markSupport('方法卡');
  supportCard?.addEventListener('toggle', () => { if (supportCard.open) markSupport('方法卡'); });
  $('#lab').addEventListener('toggle', event => { if (event.target.matches('.fit-statistics') && event.target.open) markSupport('拟合统计量'); }, true);
  if (project.pythonLab) pythonWorkbench = mountPythonWorkbench($('#python-lab'), project, stage, current,
    { getSnapshot: () => lab.getState(), onChange: changed, onSupport: markSupport });
  $('#experiment-switch')?.addEventListener('change', event => {
    const experiment = project.experiments.find(item => item.id === event.target.value);
    lab.selectExperiment(experiment.id);
    $('#experiment-title').textContent = experiment.title;
    $('#experiment-subtitle').textContent = `${EXPERIMENT_LABELS[experiment.type]}　·　改动会保留到后续任务`;
    persist();
  });
  $('#answer').addEventListener('input', event => { current.answer = event.target.value; changed(); answerEditor.updateMarkdown(); });
  $('#difficulty').addEventListener('input', event => { current.difficulty = event.target.value; scheduleSave(); });
  document.querySelectorAll('[data-criterion]').forEach(input => input.addEventListener('change', () => { const i = Number(input.dataset.criterion); current.criteria = input.checked ? [...new Set([...current.criteria,i])] : current.criteria.filter(value=>value!==i); scheduleSave(); }));
  document.querySelectorAll('[data-stage]').forEach(button => button.addEventListener('click', () => changeStage(Number(button.dataset.stage))));
  $('#previous').addEventListener('click', () => changeStage(state.currentStage - 1));
  $('#next').addEventListener('click', () => {
    if (state.currentStage < project.stages.length - 1) changeStage(state.currentStage + 1);
    else { if (state.busy) return; state.complete = true; persist(); render(); $('#summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
  $('#complete-stage').addEventListener('click', () => {
    if (state.busy) return toast('当前请求正在处理中，请稍候。');
    const missing = missingAnswers(stage, current);
    if (missing.length) {
      toast(`请补全：${missing[0]}${missing.length > 1 ? `，另有${missing.length - 1}项待完成` : ''}。`);
      const field = stage.answerFields?.find(item => item.label === missing[0]);
      if (field) answerEditor.focusMissing(field.id); else $('#answer').focus();
      return;
    }
    current.completed = true; current.snapshot = lab.getState(); current.updatedAt = new Date().toISOString();
    current.answerMarkdown = answerToMarkdown(stage, current);
    persist(); render(); toast('本题已保存，公式与数值可在后题调用。');
  });
  $('#get-hint').addEventListener('click', requestHint);
  $('#feedback').addEventListener('click', requestFeedback);
  $('#check-values')?.addEventListener('click', () => {
    if (state.busy) return;
    checkStage(stage, current); persist(); render();
    $('#numeric-check')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  $('#export').addEventListener('click', exportRecords);
  $('#export-markdown').addEventListener('click', exportMarkdown);
  $('#summary-export')?.addEventListener('click', exportRecords);
  $('#edit-plan').addEventListener('click', () => go('setup'));
  $('#work-connect')?.addEventListener('click', () => go('login'));
  $('#redesign')?.addEventListener('click', () => { state.mode = 'live'; go(state.session ? 'setup' : 'login'); });
}
function safeLink(value) {
  try { const url = new URL(value); return ['http:','https:'].includes(url.protocol) ? `<p><a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">查看数据来源↗</a></p>` : ''; } catch { return ''; }
}
function changeStage(index) {
  if (state.busy) return toast('当前请求正在处理中，请稍候。');
  if (index < 0 || index >= state.project.stages.length) return;
  state.labState = lab.getState(); lab.destroy(); lab = null;
  state.currentStage = index; persist(); render(); window.scrollTo({ top: 0 });
}
function hintHtml(hint, index) {
  return `<article class="hint-box"><strong>${String(index+1).padStart(2,'0')}　${esc(hint.title)}</strong><p>${esc(hint.content)}</p>${hint.question?`<p class="hint-question">${esc(hint.question)}</p>`:''}</article>`;
}
function feedbackHtml(feedback) {
  if (!feedback) return '';
  return `<div class="feedback-box"><p><strong>${state.projectMode==='demo'&&!state.session?'自查重点':'已经做到的部分'}：</strong>${esc(feedback.strength)}</p><p><strong>下一步：</strong>${esc(feedback.nextStep)}</p><p>${esc(feedback.question)}</p></div>`;
}
// 汇总每题的求助与核对情况。提示和反馈据此判断学生是否已经能够独立完成，及时撤去帮助。
function learningTrace() {
  const score = item => item ? { correct: item.correct, total: item.total } : null;
  return state.project.stages.filter(stage => state.records[stage.id]).map(stage => {
    const item = state.records[stage.id];
    return { stageId: stage.id, hintsUsed: item.hints.length, supportUsed: item.supportUsed || [], completed: item.completed,
      firstAttempt: score(item.firstAttempt), latestCheck: score(item.checkResult) };
  });
}
function learningInput(level) {
  const current = record();
  const stage = state.project.stages[state.currentStage];
  return { project: state.project, stageId: stage.id, attempt: `${answerToMarkdown(stage, current)}${current.difficulty.trim()?'\n\n当前困难：'+current.difficulty.trim():''}`, attemptFormat: 'markdown+latex', level, interactionState: lab.getState(), previousResults: stageResults(), learningTrace: learningTrace(), learningContext: state.projectInput || { plan: state.plan, progress: state.progress } };
}
async function requestHint() {
  const current = record();
  if (state.busy || current.hints.length >= 3) return;
  if (!hasAttempt(current) && !current.difficulty.trim()) { $('#hint-error').textContent = '先填写一个式子、计算结果或具体困难，再获取提示。'; $('#difficulty').focus(); return; }
  captureFirstAttempt(state.project.stages[state.currentStage], current);
  state.busy = true;
  const button = $('#get-hint'); button.disabled = true; button.innerHTML = '<span class="spinner"></span>正在整理提示…';
  $('#hint-error').textContent = '';
  try {
    const index = current.hints.length;
    const hint = state.projectMode === 'demo' && !state.session ? { title: ['寻找方向','连接知识','动手尝试'][index], content: state.project.stages[state.currentStage].hints[index], question: '' } : (await api('hint', learningInput(index + 1))).hint;
    current.hints.push(hint); state.busy = false; persist(); render();
  } catch (error) { state.busy = false; button.disabled = false; button.innerHTML = `${icon('light')}重新获取提示`; $('#hint-error').textContent = error.message; }
}
async function requestFeedback() {
  const current = record();
  if (state.busy) return;
  if (!hasAttempt(current)) { toast('先填写公式或计算结果，再获取反馈。'); $('#formula-answers').scrollIntoView({ behavior: 'smooth' }); return; }
  state.busy = true;
  const button = $('#feedback'); button.disabled = true; button.innerHTML = '<span class="spinner"></span>正在分析…';
  try {
    const stage = state.project.stages[state.currentStage];
    const missing = missingAnswers(stage, current);
    current.feedback = state.projectMode === 'demo' && !state.session ? { strength: stage.successCriteria.join('；'), nextStep: missing.length ? `待补全：${missing.join('、')}。` : '作答项已填写，请核对公式、单位、计算精度和题目条件。', question: '这里检查填写情况；公式是否正确可结合三级提示核对，或连接AI获取反馈。' } : (await api('feedback', learningInput(Math.min(current.hints.length + 1, 3)))).feedback;
    state.busy = false; persist(); render(); $('#feedback-box').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) { state.busy = false; button.disabled = false; button.innerHTML = `${icon('spark')}重新获取反馈`; toast(error.message); }
}
function summaryHtml() {
  const count = state.project.stages.filter(stage => state.records[stage.id]?.completed).length;
  return `<section id="summary" class="card summary-card"><div class="complete-badge">${icon('book')}解题回顾·${count}／${state.project.stages.length}题已保存</div><h2>从子问题到最终解答。</h2><p>查看各题公式和计算如何共同支持最终结论。</p><div class="summary-grid">${state.project.stages.map((stage,i)=>`<article class="summary-stage"><strong>${i+1}　${esc(stage.title)}</strong><p>${esc(hasAttempt(state.records[stage.id]) ? `已填写${Object.values(state.records[stage.id]?.responses || {}).filter(value => String(value).trim()).length}项作答。${state.records[stage.id]?.answer || ''}` : '这一题还没有作答，可以返回补充。')}</p>${stage.checks ? `<p>${esc(evidenceText(state.records[stage.id]))}</p>` : ''}</article>`).join('')}</div><button class="button primary" id="summary-export">${icon('download')}导出完整学习记录</button></section>`;
}
function exportRecords() {
  const snapshot = lab?.getState() || state.labState;
  const source = state.projectInput || state;
  const records = Object.fromEntries(state.project.stages.filter(stage => state.records[stage.id]).map(stage => [stage.id, { ...state.records[stage.id], answerMarkdown: answerToMarkdown(stage, state.records[stage.id]) }]));
  const data = { exportedAt: new Date().toISOString(), mode: state.projectMode, generation: state.generation, teachingPlan: source.plan, learningProgress: source.progress, interests: source.interests, modules: source.modules, duration: source.duration, project: state.project, records, answerMarkdown: projectToMarkdown(state.project, state.records), interactionState: snapshot };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = `知行－${state.project.title.replace(/[\\/:*?"<>|]/g,'') }－学习记录.json`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast('已导出项目、实验数据、解题记录和提示使用情况。');
}

function exportMarkdown() {
  const url = URL.createObjectURL(new Blob([projectToMarkdown(state.project, state.records)], { type: 'text/markdown;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url;
  link.download = `知行－${state.project.title.replace(/[\\/:*?"<>|]/g, '')}－解题记录.md`;
  link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('已导出包含公式、数值和计算记录的Markdown。');
}
// 刷新页面后恢复学习记录，再向后端核验真实连接状态。
async function initialize() {
  try { const session = await api('session'); if (session.connected) state.session = session; } catch { /* 连接状态由登录页面的重试操作恢复。 */ }
  try { state.teachingResources = await api('teaching-resources'); } catch { state.teachingResources = null; }
  if (state.activityPreference === 'allocation') state.activityPreference = 'optimization';
  if (state.mode !== 'demo' && !state.session) state.page = 'login';
  if (state.page === 'workspace' && !state.project) state.page = 'setup';
  render();
}
initialize();
