import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { assessStage, captureFirstAttempt, checkStage, evidenceText } from '../public/learning-evidence.js';
import { projectToMarkdown } from '../public/answer-format.js';

const project=JSON.parse(await readFile(new URL('../demo-project.json',import.meta.url),'utf8'));
const stage=project.stages.find(item=>item.id==='fitting');
const empty=()=>({responses:{},hints:[],answer:''});

test('核对区分空白和错误数值，反馈只给方法线索',()=>{
  const record=empty();
  assert.equal(assessStage(stage,record).correct,0);
  record.responses.fitted_e='0';
  const result=assessStage(stage,record);
  assert.equal(result.attempted,true);
  assert.equal(result.results[0].filled,true);
  assert.equal(result.results[0].matches,false);
  assert.match(result.results[0].support,/检查分子和分母/);
});

test('保留首次独立表现，记录帮助后的结果，重填不会覆盖历史证据',()=>{
  const record=empty(); record.responses.fitted_e='0';
  captureFirstAttempt(stage,record);
  record.hints.push({content:'联系直线与圆的联立方法。'});
  record.responses={linearized_model:'r=p+ex',fit_criterion:'e=Sxr/Sxx',fitted_e:'.25',fitted_p:'8.719',fitted_a:'9.3',train_rmse:'.0170',validation_rmse:'.0203',validation_reason:'预留数据上的误差量级相近。'};
  const result=checkStage(stage,record);
  assert.equal(result.allChecked,true);
  assert.equal(record.firstAttempt.correct,0);
  assert.equal(record.firstAttempt.hintsUsed,0);
  assert.equal(record.firstAttempt.responses.fitted_e,'0');
  assert.equal(result.hintsUsed,1);
  record.responses.fitted_e='.2';
  assert.equal(record.checkHistory[0].responses.fitted_e,'.25');
  assert.match(evidenceText(record),/首次独立.*0／5.*最近核对：5／5.*1层提示/);
});

test('作答尚未完整时继续保留支架，导出包含核对与提示证据',()=>{
  const record=empty(); record.responses={fitted_e:'.25',fitted_p:'8.719',fitted_a:'9.3',train_rmse:'.0170',validation_rmse:'.0203'};
  const result=checkStage(stage,record);
  assert.equal(result.correct,5);
  assert.equal(result.allChecked,false);
  assert.ok(result.missing.includes(stage.answerFields.find(field=>field.id==='linearized_model').label));
  const markdown=projectToMarkdown(project,{fitting:record});
  assert.match(markdown,/首次记录使用0层提示/);
  assert.match(markdown,/公式推导与解释另行评阅/);
});
