import { missingAnswers } from './answer-format.js';

// 本地只核对示例中的数值与选择，公式推导仍交给教师或AI结合过程评阅。
export function assessStage(stage, record) {
  const results = stage.checks.map(check => {
    const field = stage.answerFields.find(item => item.id === check.fieldId);
    const raw = String(record.responses?.[field.id] ?? '').trim();
    const matches = raw !== '' && (field.type === 'number'
      ? Number.isFinite(Number(raw)) && Math.abs(Number(raw) - check.expected) <= check.tolerance
      : raw === check.expected);
    return { fieldId: field.id, label: field.label, filled: raw !== '', matches, support: check.support };
  });
  const missing = missingAnswers(stage, record);
  return { at: new Date().toISOString(), hintsUsed: record.hints.length, supportUsed: [...(record.supportUsed || [])], responses: structuredClone(record.responses || {}),
    correct: results.filter(item => item.matches).length, total: results.length, attempted: results.some(item => item.filled),
    allChecked: results.every(item => item.matches) && missing.length === 0, missing, results };
}

export function captureFirstAttempt(stage, record) {
  if (stage.checks && !record.firstAttempt) record.firstAttempt = assessStage(stage, record);
}

export function checkStage(stage, record) {
  captureFirstAttempt(stage, record);
  record.checkResult = assessStage(stage, record);
  (record.checkHistory ||= []).push(record.checkResult);
  if (record.checkResult.attempted && record.checkResult.correct < record.checkResult.total) {
    record.supportUsed = [...new Set([...(record.supportUsed || []), '针对性核对反馈'])];
  }
  return record.checkResult;
}

export function evidenceText(record) {
  if (!record?.firstAttempt) return '尚未记录首次尝试。';
  const first = record.firstAttempt;
  const start = first.attempted ? `首次${first.hintsUsed || first.supportUsed?.length ? '在支持下' : '独立'}记录：${first.correct}／${first.total}项数值与判断一致。` : '首次记录时尚无可核对的数值或判断。';
  const latest = record.checkResult;
  return start + (latest ? `最近核对：${latest.correct}／${latest.total}项一致，使用${latest.hintsUsed}层提示${latest.supportUsed?.length ? `及${latest.supportUsed.join('、')}` : ''}。` : '修改作答后可再次核对。');
}
