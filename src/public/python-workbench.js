import { pythonTemplate, pythonContext } from './python-templates.js';

export function mountPythonWorkbench(container, project, stage, record, { getSnapshot, onChange, onSupport }) {
  const template = pythonTemplate(stage.id);
  const saved = record.python ||= { code: template.code, output: '', status: '尚未运行', edited: false, hasRun: false };
  container.innerHTML = '<details class="python-workbench"><summary>Python计算：编辑代码并运行</summary><div class="python-content"><p class="python-task"></p><p>先按注释填写本题需要计算的公式，再点击“运行代码”。可使用NumPy与Python标准库。验证点在图形中固定拟合参数后提供。</p><label>本题代码<textarea class="python-code" spellcheck="false" rows="15" maxlength="20000" aria-label="Python代码"></textarea></label><div class="python-actions"><button type="button" data-python-run>运行代码</button><button type="button" data-python-stop disabled>停止</button><button type="button" data-python-reset>恢复本题模板</button></div><p class="python-status" role="status"></p><pre class="python-output" aria-label="Python运行结果"></pre><small>Ctrl＋Enter运行，Tab缩进。代码、运行结果及使用过的帮助会随学习记录保存。</small></div></details>';
  const find = selector => container.querySelector(selector);
  const editor = find('.python-code'), status = find('.python-status'), output = find('.python-output');
  const run = find('[data-python-run]'), stop = find('[data-python-stop]'), reset = find('[data-python-reset]');
  editor.value = saved.code; output.textContent = saved.output; status.textContent = saved.status;
  find('.python-task').textContent = template.title;
  let worker, timer, running = false;
  const show = message => { saved.status = message; status.textContent = message; };
  const finish = message => {
    clearTimeout(timer); running = false; editor.readOnly = false; run.disabled = false; stop.disabled = true; reset.disabled = false;
    show(message); onChange();
  };
  const cancel = message => { worker?.terminate(); worker = null; finish(message); };
  function execute() {
    if (running) return;
    onSupport('Python代码模板');
    saved.code = editor.value; saved.output = ''; saved.hasRun = true;
    saved.lastRun = { code: saved.code, context: pythonContext(project,stage,getSnapshot()), at: new Date().toISOString() };
    saved.firstRun ||= structuredClone(saved.lastRun);
    output.textContent = ''; running = true; editor.readOnly = true; run.disabled = true; stop.disabled = false; reset.disabled = true;
    show('正在加载本地Python与NumPy…'); onChange();
    worker ||= new Worker(new URL('./python-worker.js', import.meta.url), { type: 'module' });
    timer = setTimeout(() => cancel('加载超时，请重新运行。'), 60000);
    worker.onmessage = event => {
      const message = event.data;
      if (message.type === 'running') { clearTimeout(timer); timer = setTimeout(() => cancel('计算超过10秒，已停止；可缩小计算规模后重试。'),10000); show('正在计算…'); }
      if (message.type === 'output') { saved.output = (saved.output + message.text + '\n').slice(0,20000); output.textContent = saved.output; }
      if (message.type === 'done') finish('运行完成，结果保留在下方。');
      if (message.type === 'error') { saved.output += message.text.slice(0,20000-saved.output.length); output.textContent = saved.output; finish('运行有误，请根据下方信息修改代码。'); }
    };
    worker.onerror = event => { saved.output = event.message; output.textContent = saved.output; cancel('Python加载失败，请重新运行。'); };
    worker.postMessage({ code: saved.code, context: saved.lastRun.context });
  }
  editor.addEventListener('input', () => { saved.code = editor.value; saved.edited = true; saved.output = ''; output.textContent = ''; show('代码已修改，等待运行。'); onChange(); });
  editor.addEventListener('keydown', event => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); execute(); }
    if (event.key === 'Tab') { event.preventDefault(); editor.setRangeText('    ',editor.selectionStart,editor.selectionEnd,'end'); editor.dispatchEvent(new Event('input')); }
  });
  run.addEventListener('click',execute);
  stop.addEventListener('click',()=>cancel('已停止，可以修改后重新运行。'));
  reset.addEventListener('click',()=>{ editor.value=template.code; saved.code=template.code; saved.output=''; saved.edited=false; output.textContent=''; show('已恢复本题模板。'); onChange(); });
  find('details').addEventListener('toggle',event=>{ if(event.target.open) onSupport('Python代码模板'); });
  return { destroy() { clearTimeout(timer); worker?.terminate(); if(running) saved.status='已离开本题，计算已停止。'; } };
}
