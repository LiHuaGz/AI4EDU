import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateGeneratedProject } from '../lib/project-schema.mjs';
import { taskDataView } from '../public/views.js';

const example = JSON.parse(await readFile(new URL('../demo-project.json', import.meta.url), 'utf8'));
const copy = () => structuredClone(example);
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

test('任务表允许空白单位、缺失值、布尔值和长说明，保留原始数据', () => {
  for (const value of ['', '  \n', null, 0, false, true, '说明'.repeat(1001)]) {
    const project = copy();
    project.taskData.rows[0][2] = value;
    assert.equal(validateGeneratedProject(project), project);
    assert.equal(project.taskData.rows[0][2], value);
  }
});

test('任务表拒绝非有限数值和嵌套结构，错误给出具体行列', () => {
  for (const value of [NaN, Infinity, -Infinity, [1, 2], { value: 3, unit: 'km' }, undefined]) {
    const project = copy();
    project.taskData.rows[1][2] = value;
    assert.throws(() => validateGeneratedProject(project), /taskData\.rows\[1\]\[2\]（第2行，第3列/);
  }
  const project = copy();
  project.taskData.rows[1].pop();
  assert.throws(() => validateGeneratedProject(project), /第2行的单元格/);
});

test('任务表显示区分空值、零与否，保留长文本并转义HTML', () => {
  const project = copy();
  const explanation = '建模说明。'.repeat(100) + '<img src=x onerror=alert(1)>';
  project.taskData.rows = [['空白', '', null], ['边界值', 0, false], ['已满足', true, explanation]];
  validateGeneratedProject(project);
  const html = taskDataView(project, project.stages[0], escape);
  assert.match(html, /<td>—<\/td><td>—<\/td>/);
  assert.match(html, /<td>0<\/td><td>否<\/td>/);
  assert.match(html, /<td>是<\/td>/);
  assert.ok(html.includes(escape(explanation)));
  assert.doesNotMatch(html, /<img|\[object Object\]/);
});
