import { EXPERIMENT_LABELS, describeExperimentText } from './experiment-workbench.js';
import { evidenceText } from './learning-evidence.js';

const MODELING_LABELS = { data: '数据处理', question: '问题与假设', model: '模型建立', solve: '模型求解', analysis: '结果分析', report: '成果表达' };

function learningDesignView(project, esc, records) {
  const design = project.learningDesign;
  if (!design) return '';
  const knowledge = [...(project.knowledge.knownIds || []).map((id, index) => [id, project.knowledge.known[index], '已有']), ...(project.knowledge.newIds || []).map((id, index) => [id, project.knowledge.new[index], '拓展'])];
  return `<details class="card learning-design"><summary>学习起点与挑战安排<span>${esc(design.difficulty)} · ${project.knowledge.new.length}项拓展知识</span></summary><div class="learning-design-content"><p><strong>学情依据：</strong>${esc(design.baseline)}</p><p><strong>本次挑战：</strong>${esc(design.challenge)}</p><p><strong>学期衔接：</strong>${esc(design.semesterConnection)}</p><div class="knowledge-links">${knowledge.map(([id, name, kind]) => `<a href="/knowledge-graph.html#node=${id}" target="_blank" rel="noopener noreferrer">${kind}：${esc(name)}</a>`).join('')}</div>${design.scaffolds.map(item => `<p><strong>学习支架：</strong>${esc(item.support)}</p>`).join('')}${design.zpd ? `<div class="zpd-grid">${[['可独立完成的任务',design.zpd.independent],['需要帮助的学习任务',design.zpd.assisted],['改变条件后的独立应用',design.zpd.transfer]].map(([title,text])=>`<article><strong>${title}</strong><p>${esc(text)}</p></article>`).join('')}</div><p>${esc(design.zpd.evidence)}</p><ol class="learning-evidence">${project.stages.map(stage=>`<li><strong>${esc(stage.title)}</strong><span>${esc(evidenceText(records[stage.id]))}</span></li>`).join('')}</ol>` : ''}</div></details>`;
}

function supportView(stage, records, esc) {
  if (!stage.support) return '';
  const support = stage.support;
  const faded = support.fadeAfter && records[support.fadeAfter]?.checkResult?.allChecked;
  return `<div class="support-phase">${esc(support.phase)}</div><details class="support-card" ${support.open && !faded ? 'open' : ''}><summary>${esc(support.title)}</summary><p>${esc(support.text)}</p>${faded ? '<p>前题数值已核对，方法卡已收起。先尝试独立处理，需要时可重新打开。</p>' : ''}</details>`;
}

function numericCheckView(result, esc) {
  if (!result) return '';
  const next = result.results.find(item => !item.matches);
  return `<div id="numeric-check" class="numeric-check" role="status"><strong>数值与判断核对：${result.correct}／${result.total}项一致</strong><ul>${result.results.map(item=>`<li>${item.matches ? '✓' : '○'} ${esc(item.label)}：${item.matches ? '一致' : item.filled ? '需复查' : '待填写'}</li>`).join('')}</ul><p>${esc(next ? next.support : result.missing.length ? `接着补全：${result.missing.join('、')}。` : '接着用公式推导和情境解释说明这些结果，再作出设计判断。')}</p><small>本次使用${result.hintsUsed}层提示${result.supportUsed?.length ? `及${esc(result.supportUsed.join('、'))}` : ''}。公式与解释另行评阅。</small></div>`;
}

function taskInstructionsView(stage, project, esc) {
  if (!stage.task) return `<p class="task-prompt">${esc(describeExperimentText(stage.prompt, project))}</p>`;
  // 将题目的条件、步骤和答案要求分开呈现，避免把多个问题挤在同一段中。
  return `<div class="task-instructions"><h3>已知条件</h3><ul class="task-givens">${stage.task.givens.map(text=>`<li>${esc(text)}</li>`).join('')}</ul><h3>请依次完成</h3><ol class="task-steps">${stage.task.steps.map(text=>`<li>${esc(text)}</li>`).join('')}</ol><p class="task-precision"><strong>答案要求：</strong>${esc(stage.task.precision)}</p></div>`;
}

export function taskDataView(project, stage, esc) {
  if (!project.taskData) return '';
  const data = project.taskData;
  // 缺失值与零分别显示，判断数据保留其真假含义。
  const display = cell => cell === null || (typeof cell === 'string' && !cell.trim()) ? '—' : typeof cell === 'boolean' ? (cell ? '是' : '否') : cell;
  return `<details class="card task-data" ${stage.modelingStep === 'data' && !stage.interaction?.fitting ? 'open' : ''}><summary>任务数据与建模条件</summary><div class="task-data-content"><p>${esc(data.notes)}</p><div class="task-data-table"><table><thead><tr>${data.columns.map(column => `<th>${esc(column)}</th>`).join('')}</tr></thead><tbody>${data.rows.map(row => `<tr>${row.map(cell => `<td>${esc(display(cell))}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div></details>`;
}

function generationView(generation, esc) {
  if (!generation) return '<div class="connection-proof">已保存的AI项目</div>';
  const date = new Date(generation.generatedAt).toLocaleString('zh-CN', { hour12: false });
  return `<details class="generation-proof"><summary><span class="status-dot"></span>由${esc(generation.model)}实时生成<span>${esc(date)}</span></summary><p>请求编号：${esc(generation.requestId)}　／　耗时：${Math.round(generation.elapsedMs / 1000)}秒${generation.usage?.total_tokens ? `　／　用量：${generation.usage.total_tokens}tokens` : ''}</p></details>`;
}

// 三个页面共用同一套顶部流程导航，说明性内容放入可展开区域。
export function layoutView({ state, providers, icon, esc, content }) {
  const mode = state.page === 'workspace' ? state.projectMode : state.mode;
  const connected = Boolean(state.session);
  const status = connected ? `${providers[state.session.provider]?.label || 'AI'}已连接` : mode === 'demo' ? '示例模式' : '未连接';
  const statusClass = connected ? 'connected' : mode === 'demo' ? 'demo' : '';
  const steps = [['login', '连接AI'], ['setup', '学习计划'], ['workspace', '建模探索']];
  const disabled = page => (page === 'setup' && !connected && state.mode !== 'demo') || (page === 'workspace' && !state.project);
  return `<div class="shell">
    <header class="app-header">
      <a class="brand" href="#" id="brand-home" aria-label="知行首页">
        <span class="brand-mark">${icon('logo')}</span>
        <span class="brand-text"><strong>知行</strong><small>数学建模实验室</small></span>
      </a>
      <nav class="steps" aria-label="学习流程">
        ${steps.map(([page, name], index) => `<button class="step ${state.page === page ? 'active' : ''}" data-page="${page}" aria-label="${index + 1} ${name}"${disabled(page) ? ' disabled' : ''} ${state.page === page ? 'aria-current="step"' : ''}><span class="step-index">${index + 1}</span><span class="step-name">${name}</span></button>`).join('')}
      </nav>
      <div class="header-status">
        <a class="text-btn graph-nav" href="/knowledge-graph.html">知识图谱</a>
        <span class="status-pill ${statusClass}"><span class="status-dot"></span>${esc(status)}</span>
        ${connected ? '<button class="text-btn" id="logout">断开</button>' : ''}
      </div>
    </header>
    ${content}
  </div>`;
}

/** 登录页：左侧说明建模流程，右侧只保留连接模型所需的输入。 */
export function loginView({ state, providers, icon, esc, footer }) {
  const provider = providers[state.provider];
  return `<main class="page login-page">
    <div class="login-grid">
    <section class="login-hero">
      <span class="eyebrow">AI辅助高中数学建模</span>
      <h1>把真实的建模问题，<br />拆成可以动手的每一步。</h1>
      <p class="hero-lead">结合课标、教材与知识图谱，上传整学期计划和当前进度，让AI设计略高于现有能力、可以借助提示完成的建模任务。</p>
      <ol class="flow-steps">
        <li><span>1</span><div><strong>连接模型</strong><small>填入自己的API密钥</small></div></li>
        <li><span>2</span><div><strong>说明计划</strong><small>上传计划，选择兴趣与知识模块</small></div></li>
        <li><span>3</span><div><strong>动手建模</strong><small>操作AI设计的场景，比较不同方案</small></div></li>
      </ol>
      <figure class="hero-figure">
        <svg viewBox="0 0 480 300" role="img" aria-label="椭圆轨道与位置散点示意图">
          <defs>
            <linearGradient id="hero-sky" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#f2f8f5" /><stop offset="1" stop-color="#e8f1ec" />
            </linearGradient>
          </defs>
          <rect width="480" height="300" rx="20" fill="url(#hero-sky)" />
          <g stroke="#d6e4dc" stroke-dasharray="4 6">
            <line x1="44" y1="150" x2="436" y2="150" /><line x1="240" y1="34" x2="240" y2="266" />
          </g>
          <circle cx="240" cy="150" r="96" fill="none" stroke="#c3d6cb" stroke-dasharray="5 6" />
          <ellipse cx="240" cy="150" rx="128" ry="96" fill="none" stroke="#0c6b59" stroke-width="2" />
          <g fill="#c07a2c" stroke="#fff" stroke-width="2.4">
            <circle cx="332" cy="206" r="4.6" /><circle cx="259" cy="244" r="4.6" /><circle cx="179" cy="234" r="4.6" />
            <circle cx="128" cy="185" r="4.6" /><circle cx="130" cy="112" r="4.6" /><circle cx="180" cy="66" r="4.6" />
            <circle cx="262" cy="58" r="4.6" /><circle cx="333" cy="96" r="4.6" />
          </g>
          <circle cx="157" cy="150" r="12" fill="#e2a34a" opacity=".28" />
          <circle cx="157" cy="150" r="6" fill="#d08f33" />
          <text x="120" y="132" class="hero-note">地心焦点</text>
          <text x="318" y="262" class="hero-note">轨道位置</text>
        </svg>
        <figcaption>极光号任务：从有误差的观测点拟合轨道，再用几何与概率评审通信方案。</figcaption>
      </figure>
    </section>
    <section class="card connect-card">
      <header class="card-head">
        <h2>连接你的AI模型</h2>
        <p>填入你自己的API密钥，请求直接发往所选服务商。</p>
      </header>
      <div class="provider-tabs" role="group" aria-label="选择模型服务商">${Object.entries(providers).map(([key, item]) => `<button class="provider-tab ${state.provider === key ? 'active' : ''}" data-provider="${key}" aria-pressed="${state.provider === key}">${item.label}</button>`).join('')}</div>
      <form id="connect-form">
        <label class="field"><span class="field-label">模型名称</span><input class="input" id="model" name="model" required value="${esc(provider.model)}" placeholder="输入可用的模型名称" autocomplete="off" /></label>
        <label class="field"><span class="field-label">API密钥</span><span class="input-wrap"><input class="input" id="api-key" name="apiKey" type="password" required placeholder="粘贴API key" autocomplete="off" spellcheck="false" /><button type="button" id="reveal-key" class="reveal" aria-label="显示密钥">${icon('eye')}</button></span></label>
        <details class="settings" ${state.provider === 'custom' ? 'open' : ''}><summary>API地址与连接设置</summary><label class="field"><span class="field-label">API地址</span><input class="input" id="base-url" value="${esc(provider.baseUrl)}" required type="url" placeholder="https://api.example.com/v1" spellcheck="false" /><span class="field-note">使用兼容OpenAI的Chat Completions接口。</span></label></details>
        <div id="connect-error" class="form-error" role="alert"></div>
        <button class="button primary wide" id="connect-button" type="submit">连接并继续${icon('arrow')}</button>
        <p class="key-note">${icon('shield')}<span>密钥只保存在本地服务的会话内存中，连接有效期2小时。连接检测会调用一次模型。</span></p>
      </form>
      <div class="connect-divider"><span>暂时没有密钥</span></div>
      <button class="button ghost wide" id="try-demo">用示例项目体验完整流程${icon('arrow')}</button>
    </section>
    </div>
    ${footer()}
  </main>`;
}

/** 学习计划页：左列填写教学素材，右列选择情境、时长与生成方式。 */
export function setupView({ state, modules, interests, icon, esc, footer }) {
  const demo = state.mode === 'demo';
  return `<main class="page setup-page">
    <div class="page-heading">
      <div><span class="eyebrow">第2步 / 共3步</span><h1>从你学过的知识出发。</h1><p>说明计划与进度，选好想探索的领域，AI据此安排递进任务。</p></div>
      ${demo ? `<div class="mode-chip">${state.session ? '示例题目 · AI提示已启用' : '示例模式：任务与提示已预置'}</div>` : ''}
    </div>
    ${demo ? '<div class="banner">当前体验卫星应急通信示例。连接AI后，会根据整学期计划和当前进度设计新项目。<button id="setup-connect">连接AI，生成自己的项目→</button></div>' : `<div class="connection-proof"><span class="status-dot"></span>${esc(state.session?.model || 'AI')}连接已验证，下一次生成将调用该模型。</div>`}
    <div class="teaching-resources">${state.teachingResources ? `<strong>已载入教学依据</strong><span>${esc(state.teachingResources.curriculum)}</span><span>${state.teachingResources.books}册人教A版教材 · ${state.teachingResources.nodes}个知识点 · ${state.teachingResources.edges}条前置关系</span><a href="/knowledge-graph.html" target="_blank" rel="noopener noreferrer">查看知识图谱↗</a>` : '<span>教学依据尚未载入，请重启本地服务后刷新页面。</span>'}</div>
    <div class="setup-grid">
      <section class="card setup-card">
        <header class="card-head"><span class="card-step">01</span><div><h2>整学期计划与当前进度</h2><p>学期计划安排前后联系，当前进度确定学习起点。</p></div><button class="text-btn" id="fill-example">填入示例</button></header>
        <label class="upload-zone" id="upload-zone" for="plan-file">${icon('upload')}<span><strong id="file-label">${esc(state.filename || '上传教学计划文件')}</strong><small>TXT、MD、TEX、CSV，最多3万字；也可直接粘贴</small></span><input id="plan-file" type="file" accept=".txt,.md,.markdown,.tex,.csv" /></label>
        <label class="field"><span class="field-label">整学期教学计划</span><textarea id="plan-text" rows="8" maxlength="30000" placeholder="按周或单元说明整个学期的教学安排、当前周次、课时，以及建模活动如何联系前后知识。">${esc(state.plan)}</textarea></label>
        <div class="field"><div class="field-label field-row"><span>当前学习进度</span><label class="inline-upload" for="progress-file">${icon('upload')}从文件读入<input id="progress-file" type="file" accept=".txt,.md,.markdown,.tex,.csv" /></label></div><textarea id="progress-text" rows="3" maxlength="4000" placeholder="已经掌握哪些知识？哪些内容还不熟悉？">${esc(state.progress)}</textarea></div>
        <div class="field"><span class="field-label field-row"><span>数学模块</span><span class="muted small">已选${state.modules.length}项</span></span><div class="chips">${modules.map(item => `<button class="chip ${state.modules.includes(item) ? 'selected' : ''}" data-module="${item}" aria-pressed="${state.modules.includes(item)}">${item}</button>`).join('')}</div></div>
      </section>
      <section class="card setup-card">
        <header class="card-head"><span class="card-step">02</span><div><h2>兴趣领域与时长</h2><p>AI会在所选领域中建立贯穿全程的情境。</p></div></header>
        <div class="interest-grid">${interests.map(([name, description, glyph]) => `<button class="interest-card ${state.interests.includes(name) ? 'selected' : ''}" data-interest="${name}" aria-pressed="${state.interests.includes(name)}">${icon(glyph)}<span><strong>${name}</strong><small>${description}</small></span></button>`).join('')}</div>
        <label class="field"><span class="field-label">想怎样探索？</span><select id="activity-preference">${[['auto', '交给AI选择一种合适的方式'], ...Object.entries(EXPERIMENT_LABELS).filter(([key]) => key !== 'allocation')].map(([value, label]) => `<option value="${value}" ${state.activityPreference === value ? 'selected' : ''}>${label}</option>`).join('')}</select><small class="field-note">1个实验贯穿4～6个阶段：处理数据、建立模型、求解与检验。挑战控制在当前知识与最多3项相邻新知识之间。</small></label>
        <div class="field"><span class="field-label field-row"><span>活动时长</span><span class="muted small">决定任务数量</span></span><div class="duration-group">${[['45', '45分钟', '4个紧凑阶段'], ['90', '90分钟', '6个递进阶段'], ['180', '180分钟', '深入调查与比较']].map(([value, name, note]) => `<button class="duration-option ${state.duration === value ? 'selected' : ''}" data-duration="${value}" aria-pressed="${state.duration === value}"><strong>${name}</strong><small>${note}</small></button>`).join('')}</div></div>
        <div class="generate-block">
          <p class="generate-note">${icon('spark')}<span>一个核心情境，4—6个前后衔接的任务。<br />每一步都可以回到交互区继续试验。</span></p>
          <div id="generate-error" class="form-error" role="alert"></div>
          <button class="button primary wide" id="generate">${demo ? '进入示例项目' : '生成建模项目'}${icon('arrow')}</button>
          <div id="generate-status" class="hidden generate-status" role="status"><span class="spinner"></span>AI正在设计情境、交互场景和递进任务…</div>
          <p class="key-note">${demo ? '示例任务与三级提示来自本地文件，采用教学模拟数据。' : '生成时，教学计划与学习进度会发送到你选择的模型服务商。'}</p>
        </div>
      </section>
    </div>${footer()}
  </main>`;
}

/** 建模工作台：左侧交互与作答，右侧是当前任务与按需提示。 */
export function workspaceView({ state, project, stage, current, previous, icon, esc, footer, safeLink, feedbackHtml, hintHtml, summaryHtml }) {
  const total = project.stages.length;
  const index = state.currentStage;
  const done = project.stages.filter(item => state.records[item.id]?.completed).length;
  const taskExperiment = project.experiments?.find(item => item.id === stage.interaction.experimentId);
  const experiment = project.experiments?.find(item => item.id === (state.labState?.activeStageId === stage.id ? state.labState.activeExperimentId : stage.interaction.experimentId)) || taskExperiment;
  const typeLabel = taskExperiment ? EXPERIMENT_LABELS[taskExperiment.type] : { data: '数据观察', model: '参数建模', predict: '模型预测', compare: '方案比较' }[stage.interaction.type];
  const hintName = ['给我一点提示', '再具体一点', '给出下一步'][current.hints.length] || '';
  return `<main class="page work-page">
    <header class="project-head">
      <div class="project-title">
        <div class="project-badges"><span class="badge ${state.projectMode === 'demo' ? 'amber' : 'brand'}">${state.projectMode === 'demo' ? '示例项目' : 'AI生成项目'}</span><span class="badge ghost">${project.stages.length}道递进题</span></div>
        <h1>${esc(project.title)}</h1>
        <p>${esc(project.subtitle)}</p>
        ${project.finalChallenge ? '' : `<p class="project-question"><span>核心问题</span>${esc(project.drivingQuestion)}</p>`}
      </div>
      <div class="work-actions"><button class="button ghost" id="export">${icon('download')}导出JSON</button><button class="button ghost" id="export-markdown">导出Markdown</button><button class="text-btn" id="edit-plan">修改计划</button></div>
    </header>
    ${state.projectMode === 'demo' ? `<div class="banner">${state.session ? '当前题目来自预置示例，AI提示与反馈已启用。' : '当前题目与提示为预置示例，采用教学模拟条件。'}<button id="redesign">${state.session ? '用已连接的AI设计新题目→' : '连接AI，生成自己的题目→'}</button></div>` : generationView(state.generation, esc)}
    ${project.experiments?.length > 1 ? `<div class="experiment-overview">${project.experiments.map(item => `<span>${esc(EXPERIMENT_LABELS[item.type])}</span>`).join('<i>＋</i>')}<span class="design-origin">场景与规则${state.projectMode === 'demo' ? '来自示例设计' : '来自本次模型响应'}</span></div>` : ''}
    ${learningDesignView(project, esc, state.records)}
    ${project.finalChallenge ? `<details class="final-challenge"><summary>最终挑战 · 第${project.stages.length}题</summary><p>${esc(project.finalChallenge.prompt)}</p><span>前${project.stages.length-1}题将分别算出解决它需要的结果。</span></details>` : ''}
    <nav class="stage-track" aria-label="建模阶段">
      <div class="stage-meta"><span>解题进度</span><strong>${done}／${total} 题已保存</strong></div>
      <div class="stage-list">${project.stages.map((item, i) => `<button class="stage-item ${i === index ? 'current' : ''} ${state.records[item.id]?.completed ? 'done' : ''}" data-stage="${i}" ${i === index ? 'aria-current="step"' : ''}><span class="stage-num">${state.records[item.id]?.completed ? icon('check') : i + 1}</span><span class="stage-name">${esc(item.title)}</span></button>`).join('')}</div>
    </nav>
    <div class="work-layout">
      <div class="work-main">
        ${taskDataView(project, stage, esc)}
        <section class="card lab-card">
          <header class="lab-head"><div><h2>${icon('flask')}<span id="experiment-title">${esc(experiment?.title || '交互工作台')}</span></h2><p id="experiment-subtitle">${stage.interaction.fitting ? "观测点拟合 · 锁定参数后再验证" : (experiment ? EXPERIMENT_LABELS[experiment.type] : typeLabel) + "　·　改动会保留到后续任务"}</p></div><details class="source-details"><summary>情境说明</summary><div class="source-pop"><strong>${esc(project.dataSource.label)}</strong><p>${esc(project.dataSource.notes)}</p>${safeLink(project.dataSource.url)}</div></details></header>
          ${project.experiments?.length > 1 ? `<label class="experiment-switch-label">切换实验<select id="experiment-switch" aria-label="切换实验">${project.experiments.map(item => `<option value="${esc(item.id)}" ${experiment?.id === item.id ? 'selected' : ''}>${esc(item.title)}</option>`).join('')}</select><span>各实验的操作分别保留</span></label>` : ''}
          <div id="lab"></div>
        </section>
        ${project.pythonLab ? '<section class="card python-card"><div id="python-lab"></div></section>' : ''}
        <section class="card answer-card">
          <header class="answer-head"><h2>解答第${index+1}题</h2><span class="autosave">${icon('pen')}自动保存</span></header>
          <p class="deliverable">${esc(stage.deliverable)}</p>
          <div id="formula-answers"></div>
          <label class="field"><span class="field-label">${stage.answerFields ? '补充说明（选填）' : '解题思路'}</span><textarea id="answer" rows="2" maxlength="1200" aria-label="解题思路" placeholder="需要时用一两句话补充你的判断。">${esc(current.answer)}</textarea></label>
          <details class="criteria-details"><summary>完成标准（${stage.successCriteria.length}项）</summary><div class="criteria">${stage.successCriteria.map((criterion, i) => `<label class="criterion"><input type="checkbox" data-criterion="${i}" ${current.criteria.includes(i) ? 'checked' : ''} /><span>${esc(criterion)}</span></label>`).join('')}</div></details>
          <div class="answer-actions">${stage.checks ? '<button class="button ghost" id="check-values">核对数值</button>' : ''}<button class="button ghost" id="feedback">${state.projectMode === 'demo' && !state.session ? '检查填写' : '获取解答反馈'}</button><button class="button primary" id="complete-stage">${current.completed ? '更新本题' : '保存本题'}${icon('check')}</button></div>
          ${numericCheckView(current.checkResult, esc)}
          <div id="feedback-box" ${current.feedback ? '' : 'class="hidden"'}>${feedbackHtml(current.feedback)}</div>
        </section>
        <div class="stage-bottom"><button class="button ghost" id="previous" ${index === 0 ? 'disabled' : ''}>${icon('arrowLeft')}上一步</button><span class="stage-count">${index + 1} / ${total}</span><button class="button primary" id="next">${index === total - 1 ? '回顾探索' : '下一步'}${icon('arrow')}</button></div>
        ${state.complete ? summaryHtml() : ''}
      </div>
      <aside class="work-aside">
        <section class="card task-card">
          <div class="task-header"><span class="task-index">第${index + 1}题<i>／${total}</i></span><span class="task-type">${current.completed ? '已保存' : MODELING_LABELS[stage.modelingStep] || typeLabel}</span></div>
          <h2>${esc(stage.title)}</h2>
          ${stage.briefing ? `<p class="mission-briefing">${esc(stage.briefing)}</p>` : ''}
          ${taskInstructionsView(stage, project, esc)}
          ${supportView(stage, state.records, esc)}
          <details class="task-details"><summary>前后任务与知识联系</summary>${stage.contribution ? `<p><strong>这一步得到什么：</strong>${esc(stage.contribution)}</p>` : ''}<div class="knowledge-chips">${stage.knowledge.map(item => `<span>${esc(item)}</span>`).join('')}</div><p>${esc(describeExperimentText(stage.bridge, project))}</p>${previous?.answer ? `<div class="previous-result"><strong>上一步的记录</strong><p>${esc(previous.answer)}</p></div>` : ''}<p>${esc(project.context)}</p><p class="muted">已有知识：${esc(project.knowledge.known.join('、'))}</p>${project.knowledge.new.length ? `<p class="muted">后续探索：${esc(project.knowledge.new.join('、'))}</p>` : ''}</details>
        </section>
        <section class="card guide-card">
          <div class="guide-head"><h2>${icon('light')}提示</h2><span class="hint-dots" aria-label="已使用${current.hints.length}条提示">${[0, 1, 2].map(i => `<i class="${current.hints.length > i ? 'used' : ''}"></i>`).join('')}</span></div>
          <p class="guide-note">${state.session ? 'AI会结合当前图形、方案或实验结果给出提示。' : state.projectMode === 'demo' ? '先写下具体困难，再逐层展开示例提示。' : '连接已结束，重新连接后可继续请求AI提示。'}</p>
          <textarea id="difficulty" rows="2" maxlength="2000" aria-label="当前困难" placeholder="我试了哪些操作？卡在什么地方？">${esc(current.difficulty)}</textarea>
          <button class="button quiet wide" id="get-hint" ${current.hints.length >= 3 ? 'disabled' : ''}>${current.hints.length >= 3 ? '三层提示已全部展开' : hintName}</button>
          <div id="hint-error" class="hint-error" role="alert"></div>
          <div class="hint-stack">${current.hints.map((hint, i) => hintHtml(hint, i)).join('')}</div>
        </section>
        <details class="card outline-card"><summary>项目脉络与知识安排</summary><p><strong>核心问题</strong>${esc(project.drivingQuestion)}</p><p><strong>已有知识</strong>${esc(project.knowledge.known.join('、'))}</p>${project.knowledge.new.length ? `<p><strong>计划内拓展</strong>${esc(project.knowledge.new.join('、'))}</p>` : ''}<p><strong>数据来源</strong>${esc(project.dataSource.label)}</p></details>
      </aside>
    </div>${footer()}
  </main>`;
}
