// 公式以LaTeX保存，由界面编辑器生成；模型输入和Markdown导出共用此序列化规则。
export function hasAttempt(record) {
  return Boolean(record?.answer?.trim() || record?.scratch?.trim() || record?.python?.edited || record?.python?.hasRun || Object.values(record?.responses || {}).some(value => String(value).trim()));
}

export function missingAnswers(stage, record) {
  if (!stage.answerFields) return record.answer?.trim() ? [] : ['本题解答'];
  return stage.answerFields.filter(field => {
    if (field.required === false) return false;
    const value = String(record.responses?.[field.id] ?? '').trim();
    if (!value) return true;
    if (field.type === 'number') return !Number.isFinite(Number(value));
    if (field.type === 'formula') return /\\placeholder|\\frac\{\}\{\}|\\sqrt\{\}/.test(value);
    if (field.type === 'choice') return !field.options.includes(value);
    return false;
  }).map(field => field.label);
}

export function answerToMarkdown(stage, record = {}) {
  const parts = [];
  for (const field of stage.answerFields || []) {
    const value = String(record.responses?.[field.id] ?? '').trim();
    if (!value) continue;
    parts.push(`### ${field.label}${field.unit ? `（${field.unit}）` : ''}`);
    parts.push(field.type === 'formula' ? `$$\n${value}\n$$` : value);
    const calculation = record.calculations?.[field.id];
    if (calculation?.latex === value) parts.push(calculationMarkdown(calculation));
  }
  if (record.scratch?.trim()) {
    parts.push(`### 计算草稿\n\n$$\n${record.scratch.trim()}\n$$`);
    if (record.calculations?.scratch?.latex === record.scratch.trim()) parts.push(calculationMarkdown(record.calculations.scratch));
  }
  if (record.answer?.trim()) parts.push(`### ${stage.answerFields ? '补充说明' : '解答'}\n\n${record.answer.trim()}`);
  if (record.python?.edited || record.python?.hasRun) {
    const code = record.python.code;
    const fence = '`'.repeat(Math.max(3,...(code.match(/`+/g) || []).map(value => value.length + 1)));
    parts.push(`### Python计算代码\n\n${fence}python\n${code}\n${fence}`);
    if (record.python.output && record.python.lastRun?.code === code) parts.push(`### Python运行结果\n\n${record.python.output}`);
  }
  return parts.join('\n\n');
}

function calculationMarkdown(calculation) {
  const substitutions = Object.entries(calculation.bindings).map(([key, value]) => `${key}＝${value}`).join('，');
  return `数值计算：${calculation.value}。角度单位：${calculation.angleMode === 'deg' ? '度' : '弧度'}。${substitutions ? `代入值：${substitutions}。` : ''}`;
}

export function projectToMarkdown(project, records) {
  const parts = [`# ${project.title}`, project.finalChallenge ? `最终挑战：${project.finalChallenge.prompt}` : project.drivingQuestion];
  project.stages.forEach((stage, index) => {
    parts.push(`## 第${index + 1}题：${stage.title}`, stage.prompt, answerToMarkdown(stage, records[stage.id]) || '尚未作答。');
    const record = records[stage.id];
    if (record?.firstAttempt) {
      parts.push(`首次记录使用${record.firstAttempt.hintsUsed}层提示${record.firstAttempt.supportUsed?.length ? `及${record.firstAttempt.supportUsed.join('、')}` : ''}，${record.firstAttempt.correct}／${record.firstAttempt.total}项数值与判断一致。`);
      if (record.checkResult) parts.push(`最近核对使用${record.checkResult.hintsUsed}层提示，${record.checkResult.correct}／${record.checkResult.total}项数值与判断一致。公式推导与解释另行评阅。`);
    }
  });
  return parts.join('\n\n') + '\n';
}
