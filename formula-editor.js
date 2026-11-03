import { MathfieldElement } from './vendor/mathlive/mathlive.min.mjs';
import { calculateFormula } from './formula-calculator.js';
import { answerToMarkdown } from './answer-format.js';

MathfieldElement.fontsDirectory = new URL('./vendor/mathlive/fonts', import.meta.url).href;
MathfieldElement.soundsDirectory = null;
MathfieldElement.locale = 'zh-cn';

export function renderInlineFormulas(container) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.parentElement.closest('math-field, pre, code, textarea, script, style') && node.textContent.includes('$')) textNodes.push(node);
  }
  // 将模型回复中的Markdown公式显示为只读数学排版，保留其余文字。
  for (const node of textNodes) {
    const pattern = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
    let match, end = 0;
    const fragment = document.createDocumentFragment();
    while ((match = pattern.exec(node.textContent))) {
      fragment.append(document.createTextNode(node.textContent.slice(end, match.index)));
      const formula = new MathfieldElement(); formula.readOnly = true; formula.value = match[1] || match[2];
      formula.className = match[1] ? 'display-formula' : 'inline-formula';
      formula.setAttribute('aria-label', '数学公式'); fragment.append(formula); end = pattern.lastIndex;
    }
    if (end) { fragment.append(document.createTextNode(node.textContent.slice(end))); node.replaceWith(fragment); }
  }
}

const tools = [
  ['分数', '\\frac{#0}{#?}'], ['根号', '\\sqrt{#0}'], ['平方', '#@^2'], ['幂', '#@^{#?}'], ['下标', '#@_{#?}'],
  ['括号', '\\left(#0\\right)'], ['绝对值', '\\left|#0\\right|'], ['sin', '\\sin\\left(#0\\right)'], ['cos', '\\cos\\left(#0\\right)'], ['tan', '\\tan\\left(#0\\right)'],
  ['max', '\\max\\left(#0\\right)'], ['min', '\\min\\left(#0\\right)'], ['条件组', '\\begin{cases}#?\\\\#?\\\\#?\\end{cases}'],
  ['≤', '\\le'], ['≥', '\\ge'], ['＝', '='], ['α', '\\alpha'], ['β', '\\beta'], ['θ', '\\theta'], ['π', '\\pi'], ['°', '^\\circ'],
];

export function mountFormulaEditor(container, stage, record, { onChange, getBindings, previous = [] }) {
  record.responses ||= {}; record.calculations ||= {};
  const fields = [];
  let active;
  let angleMode = record.angleMode || 'deg';
  const element = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text) node.textContent = text; return node; };
  const toolbar = element('div', 'formula-toolbar');
  toolbar.setAttribute('role', 'toolbar'); toolbar.setAttribute('aria-label', '公式输入工具');
  for (const [label, latex] of tools) {
    const button = element('button', 'formula-tool', label); button.type = 'button';
    button.addEventListener('pointerdown', event => event.preventDefault());
    button.addEventListener('click', () => { if (!active) return; active.focus(); active.executeCommand(['insert', latex]); });
    toolbar.append(button);
  }
  const keyboard = element('button', 'formula-tool', '公式键盘'); keyboard.type = 'button';
  keyboard.addEventListener('pointerdown', event => event.preventDefault());
  keyboard.addEventListener('click', () => { active?.focus(); window.mathVirtualKeyboard.layouts = ['numeric', 'symbols', 'alphabetic', 'greek']; window.mathVirtualKeyboard.show(); });
  toolbar.append(keyboard);
  container.append(element('p', 'formula-help', '点击公式框，再用上方工具输入分数、根号或三角函数。数值计算使用你输入的表达式。'), toolbar);

  const modeRow = element('label', 'formula-angle-mode', '三角函数计算单位');
  const mode = element('select'); mode.setAttribute('aria-label', '三角函数计算单位');
  mode.append(new Option('角度制（度）', 'deg'), new Option('弧度制', 'rad')); mode.value = angleMode;
  mode.addEventListener('change', () => { angleMode = mode.value; record.angleMode = angleMode; onChange(); });
  modeRow.append(mode); container.append(modeRow);
  const body = element('div', 'response-fields'); container.append(body);

  function formulaField(parent, key, label, value, scratch = false) {
    const wrapper = element('div', 'formula-entry');
    const field = new MathfieldElement(); field.value = value || ''; field.mathVirtualKeyboardPolicy = 'manual';
    field.setAttribute('aria-label', label); field.dataset.answerField = key;
    const result = element('div', 'formula-result'); result.setAttribute('aria-live', 'polite');
    const calculate = element('button', 'text-btn', '代入计算'); calculate.type = 'button';
    const show = calculation => {
      const bindings = Object.entries(calculation.bindings).map(([name, number]) => `${name}＝${number}`).join('，');
      result.textContent = `计算结果：${calculation.value}。${bindings ? `本次代入：${bindings}。` : ''}（${calculation.angleMode === 'deg' ? '角度制' : '弧度制'}）`;
    };
    const previousCalculation = record.calculations[key];
    if (previousCalculation && previousCalculation.latex === value) show(previousCalculation);
    field.addEventListener('focusin', () => { active = field; });
    field.addEventListener('input', () => {
      if (scratch) record.scratch = field.value; else record.responses[key] = field.value;
      delete record.calculations[key]; result.textContent = ''; onChange(); updateMarkdown();
    });
    calculate.addEventListener('click', () => {
      try { const calculation = calculateFormula(field.value, getBindings(), angleMode); record.calculations[key] = calculation; show(calculation); onChange(); updateMarkdown(); }
      catch (error) { result.textContent = error.message; }
    });
    wrapper.append(field, calculate, result); parent.append(wrapper); fields.push(field); active ||= field;
  }

  for (const specification of stage.answerFields || []) {
    const block = element('div', `response-field response-${specification.type}`);
    const label = element('label', 'field-label', `${specification.label}${specification.unit ? `（${specification.unit}）` : ''}${specification.required === false ? '（选填）' : ''}`);
    const id = `response-${stage.id}-${specification.id}`; label.htmlFor = id; block.append(label);
    if (specification.type === 'formula') {
      formulaField(block, specification.id, specification.label, record.responses[specification.id]);
      fields.at(-1).id = id;
    } else {
      const input = element(specification.type === 'choice' ? 'select' : 'input', 'input'); input.id = id; input.dataset.answerField = specification.id;
      if (specification.type === 'choice') { input.append(new Option('请选择', '')); specification.options.forEach(option => input.append(new Option(option, option))); }
      else { input.type = 'text'; input.maxLength = specification.type === 'short' ? 300 : 80; if (specification.type === 'number') input.inputMode = 'decimal'; input.placeholder = specification.placeholder || ''; }
      input.value = record.responses[specification.id] || '';
      input.addEventListener('input', () => { record.responses[specification.id] = input.value; onChange(); updateMarkdown(); });
      block.append(input);
    }
    body.append(block);
  }

  const scratch = element('details', 'calculation-scratch'); scratch.append(element('summary', '', '计算草稿'));
  formulaField(scratch, 'scratch', '计算草稿', record.scratch, true); container.append(scratch);

  if (previous.length) {
    const history = element('details', 'formula-history'); history.append(element('summary', '', '调用前题的公式与数值'));
    for (const { stage: previousStage, record: previousRecord } of previous) {
      const group = element('div', 'formula-history-question'); group.append(element('strong', '', previousStage.title));
      for (const specification of previousStage.answerFields || []) {
        const value = previousRecord?.responses?.[specification.id]; if (!value) continue;
        group.append(element('div', 'small muted', specification.label));
        if (specification.type === 'formula') {
          const field = new MathfieldElement(); field.readOnly = true; field.value = value; field.setAttribute('aria-label', `前题公式：${specification.label}`); group.append(field);
          const use = element('button', 'text-btn', '插入当前公式框'); use.type = 'button';
          use.addEventListener('pointerdown', event => event.preventDefault());
          use.addEventListener('click', () => { active?.focus(); active?.executeCommand(['insert', value]); }); group.append(use);
        } else group.append(element('div', '', `${value}${specification.unit || ''}`));
      }
      history.append(group);
    }
    container.append(history);
  }
  const preview = element('details', 'formula-markdown'); preview.append(element('summary', '', '查看本题Markdown'));
  const code = element('pre'); preview.append(code); container.append(preview);
  function updateMarkdown() { code.textContent = answerToMarkdown(stage, record) || '填写后显示。'; }
  updateMarkdown();
  return { updateMarkdown, focusMissing(id) { container.querySelector(`[data-answer-field="${id}"]`)?.focus(); }, destroy() { window.mathVirtualKeyboard?.hide(); container.replaceChildren(); } };
}
