import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFormula, calculationBindings } from '../public/formula-calculator.js';
import { answerToMarkdown, projectToMarkdown, missingAnswers, hasAttempt } from '../public/answer-format.js';

const stage = { id: 'coordinate', title: '坐标计算', prompt: '计算站点位置。', answerFields: [
  {id:'formula',type:'formula',label:'坐标表达式',required:true},
  {id:'x',type:'number',label:'横坐标',unit:'千km',required:true},
  {id:'choice',type:'choice',label:'任务判断',options:['可行','不可行'],required:true},
] };

test('公式计算支持分数、根式、角度制与弧度制，并把e解释为离心率', () => {
  assert.ok(Math.abs(calculateFormula('6.371\\cos(35)').value-5.218817674165) < 1e-9);
  assert.ok(Math.abs(calculateFormula('6.371\\cos(35^\\circ)').value-5.218817674165) < 1e-9);
  assert.ok(Math.abs(calculateFormula('a\\sqrt{1-e^2}', {a:10,e:.2}).value-9.79795897113) < 1e-9);
  assert.equal(calculateFormula('\\frac{R+h}{1-e}',{R:6.371,h:.3,e:.2}).value,8.33875);
  assert.ok(Math.abs(calculateFormula('b=a\\sqrt{1-e^2}',{a:10,e:.2}).value-9.79795897113) < 1e-9);
  assert.equal(calculateFormula('\\cos(\\pi)',{},'rad').value,-1);
  assert.equal(calculateFormula('\\arccos(0.5)').value,60);
});

test('计算只记录实际使用的代入值，错误与未知量不会伪装为数值结果', () => {
  const result=calculateFormula('a+1',{a:2,e:.4});
  assert.deepEqual(result.bindings,{a:2});
  assert.throws(()=>calculateFormula('x+1'),/代入/);
  assert.throws(()=>calculateFormula('\\sqrt{-1}'),/定义域/);
  assert.throws(()=>calculateFormula('\\sum_{n=1}^{1000}n'),/支持/);
  assert.throws(()=>calculateFormula(''),/先输入/);
});

test('公式与数值构成有效作答，必填项和空占位符被分别检查', () => {
  const record={responses:{formula:'x=R\\cos\\beta',x:'0',choice:'可行'}};
  assert.ok(hasAttempt(record));
  assert.deepEqual(missingAnswers(stage,record),[]);
  record.responses.formula='\\frac{\\placeholder{}}{2}';
  assert.deepEqual(missingAnswers(stage,record),['坐标表达式']);
  record.responses.formula='x=1';record.responses.x='abc';
  assert.deepEqual(missingAnswers(stage,record),['横坐标']);
});

test('Markdown保留公式、单位和计算代入记录，修改公式后忽略旧计算结果', () => {
  const record={responses:{formula:'a+1',x:'3',choice:'可行'},calculations:{formula:calculateFormula('a+1',{a:2})},answer:'采用当前任务条件。'};
  const markdown=answerToMarkdown(stage,record);
  assert.match(markdown,/\$\$\na\+1\n\$\$/);
  assert.match(markdown,/横坐标（千km）/);
  assert.match(markdown,/a＝2/);
  record.responses.formula='a+2';
  assert.doesNotMatch(answerToMarkdown(stage,record),/计算结果|数值计算/);
  const exported=projectToMarkdown({title:'卫星任务',stages:[stage],drivingQuestion:'求轨道。'},{coordinate:record});
  assert.match(exported,/第1题/);assert.match(exported,/a\+2/);
});

test('计算环境使用当前实验参数，并映射保障半角的数学符号', () => {
  const project={constants:[{key:'R',value:6.371}],experiments:[{id:'orbit',config:{variables:[{key:'window',symbol:'alpha'}]}}]};
  assert.deepEqual(calculationBindings(project,{experiments:{orbit:{parameters:{window:25,e:.2}}}}),{R:6.371,window:25,e:.2,alpha:25});
});
