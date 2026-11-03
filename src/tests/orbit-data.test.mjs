import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { observationStatistics, orbitResiduals } from '../public/orbit-data.js';
import { computeOptimization } from '../public/scenes/optimization.js';
import { pythonContext } from '../public/python-templates.js';
import { answerToMarkdown } from '../public/answer-format.js';

const project=JSON.parse(await readFile(new URL('../demo-project.json',import.meta.url),'utf8'));
const config=project.experiments[0].config, observations=config.visualization.observations;
const parameters=Object.fromEntries([...config.variables,...config.parameters].map(item=>[item.key,item.value]));

test('观测数据的最小二乘估计重建椭圆，验证数据独立于拟合统计量',()=>{
  const stats=observationStatistics(observations.rows.filter(row=>row.split==='train'));
  const e=stats.sxr/stats.sxx,p=stats.meanR-e*stats.meanX,a=p/(1-e*e);
  assert.ok(Math.abs(e-.25)<1e-7);
  assert.ok(Math.abs(a-9.3)<1e-6);
  const fitted={a,e};
  assert.ok(Math.abs(orbitResiduals(observations,fitted,'train').rmse-.016955825)<1e-6);
  assert.ok(Math.abs(orbitResiduals(observations,fitted,'validation').rmse-.020310096)<1e-6);
  const circle=orbitResiduals(observations,{a:stats.meanR,e:0},'validation');
  assert.ok(circle.rmse>50*orbitResiduals(observations,fitted,'validation').rmse);
});

test('持续遮挡不能被重发消除，两种情景都可用后3次发送达到目标',()=>{
  const initial=computeOptimization(config,{...parameters,a:9.3,e:.25,window:20,retries:3}).reliability;
  assert.deepEqual(initial.cases.map(item=>item.available),[true,false]);
  assert.ok(Math.abs(initial.probability-.7975611)<1e-10);
  // 遮挡状态在一次任务中固定，不能把混合成功率当作每次独立概率。
  assert.notEqual(initial.probability,1-(1-.8*.855)**3);
  const improved=computeOptimization(config,{...parameters,a:9.3,e:.2826,window:19.45,retries:3}).reliability;
  assert.deepEqual(improved.cases.map(item=>item.available),[true,true]);
  assert.ok(improved.probability>.99);
  assert.ok(computeOptimization(config,{...parameters,a:9.3,e:.2826,window:19.45,retries:2}).reliability.probability<.99);
});

test('Python只拿到已揭示的数据，代码与对应运行结果进入Markdown',()=>{
  const id=project.experiments[0].id,stage=project.stages[1];
  const snapshot={experiments:{[id]:{parameters,fit:{validationRevealed:false}}}};
  assert.equal(pythonContext(project,stage,snapshot).validation.length,0);
  snapshot.experiments[id].fit.validationRevealed=true;
  assert.equal(pythonContext(project,stage,snapshot).validation.length,4);
  assert.equal(pythonContext(project,stage,snapshot).train.length,8);
  const record={python:{code:'print(1)',edited:true,hasRun:true,output:'1',lastRun:{code:'print(1)'}}};
  assert.match(answerToMarkdown(stage,record),/```python\nprint\(1\)/);
  assert.match(answerToMarkdown(stage,record),/Python运行结果/);
  record.python.code='print(2)';
  assert.doesNotMatch(answerToMarkdown(stage,record),/Python运行结果/);
});
