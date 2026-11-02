import { validateExpression, evaluateExpression } from '../public/expression.js';
import { shortestDistance } from '../public/scenes/network.js';

// 只接受界面能够解释的教学数据，模型生成的代码不会进入执行流程。
const MODEL_KEYS = {
  linear: ['m', 'b'],
  quadratic: ['a', 'b', 'c'],
  exponential: ['a', 'k', 'c'],
  ellipse: ['a', 'b', 'h', 'k'],
};
// 为最多40个残差的平方和留出余量，避免有限输入在后续计算中溢出。
const NUMERIC_LIMIT = Math.sqrt(Number.MAX_VALUE / 160);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function object(value, name) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${name}应为对象。`);
}

function text(value, name, max = 2000, empty = false) {
  assert(typeof value === 'string' && value.length <= max && (empty || value.trim().length > 0), `${name}应为${max}字以内的文本。`);
}

function number(value, name) {
  assert(typeof value === 'number' && Number.isFinite(value), `${name}应为有限数值。`);
}

function list(value, name, min, max) {
  assert(Array.isArray(value) && value.length >= min && value.length <= max, `${name}应有${min}至${max}项。`);
}

function texts(value, name, min = 1, max = 8) {
  list(value, name, min, max);
  value.forEach((item, i) => text(item, `${name}第${i + 1}项`, 600));
}

function domain(value, name) {
  list(value, name, 2, 2);
  value.forEach(item => number(item, name));
  assert(value[0] < value[1], `${name}的下限应小于上限。`);
  assert(value.every(item => Math.abs(item) <= NUMERIC_LIMIT), `${name}的数值过大，请转换单位。`);
}

function validateLegacyProject(project) {
  object(project, '项目');
  assert(project.version === 1, '项目版本应为1。');
  text(project.title, '项目标题', 80);
  text(project.subtitle, '项目副标题', 180);
  text(project.drivingQuestion, '核心问题', 600);
  text(project.context, '项目情境');

  object(project.dataSource, '数据来源');
  assert(['simulated', 'provided', 'public'].includes(project.dataSource.kind), '数据来源类型应为模拟、用户提供或公开数据。');
  text(project.dataSource.label, '来源名称', 200);
  text(project.dataSource.notes, '来源说明', 1000);
  text(project.dataSource.url, '来源链接', 1000, true);
  if (project.dataSource.url) {
    let url;
    try { url = new URL(project.dataSource.url); } catch { throw new Error('数据来源链接格式错误。'); }
    assert(['http:', 'https:'].includes(url.protocol), '数据来源链接应为HTTP或HTTPS网址。');
  }
  assert(project.dataSource.kind !== 'public' || project.dataSource.url, '公开数据需要提供来源链接。');

  object(project.knowledge, '知识安排');
  texts(project.knowledge.known, '已有知识');
  texts(project.knowledge.new, '拓展知识', 0, 3);

  object(project.dataset, '数据集');
  ['xLabel', 'yLabel'].forEach(key => text(project.dataset[key], `数据集${key}`, 50));
  ['xUnit', 'yUnit'].forEach(key => text(project.dataset[key], `数据集${key}`, 30, true));
  list(project.dataset.rows, '数据行', 6, 40);
  const rowIds = new Set();
  for (const row of project.dataset.rows) {
    object(row, '数据行');
    text(row.id, '数据编号', 40);
    assert(!rowIds.has(row.id), '数据编号应各不相同。');
    rowIds.add(row.id);
    number(row.x, '横坐标');
    number(row.y, '纵坐标');
    assert(['train', 'validation'].includes(row.split), '数据分组应为train或validation。');
  }
  assert(project.dataset.rows.filter(row => row.split === 'train').length >= 4, '请至少保留4个建模数据点。');
  assert(project.dataset.rows.filter(row => row.split === 'validation').length >= 2, '请至少保留2个验证数据点。');

  object(project.model, '模型');
  assert(typeof project.model.family === 'string' && Object.hasOwn(MODEL_KEYS, project.model.family), '请选择界面支持的直线、二次函数、指数函数或椭圆模型。');
  const keys = MODEL_KEYS[project.model.family];
  list(project.model.parameters, '模型参数', keys.length, keys.length);
  const parameterKeys = new Set();
  for (const parameter of project.model.parameters) {
    object(parameter, '模型参数');
    assert(keys.includes(parameter.key) && !parameterKeys.has(parameter.key), '模型参数名称应完整且各不相同。');
    parameterKeys.add(parameter.key);
    text(parameter.label, '参数含义', 80);
    ['min', 'max', 'step', 'value'].forEach(key => number(parameter[key], `参数${parameter.key}的${key}`));
    assert(parameter.min < parameter.max && parameter.step > 0 && parameter.step <= parameter.max - parameter.min, `参数${parameter.key}的范围或步长无效。`);
    assert(parameter.value >= parameter.min && parameter.value <= parameter.max, `参数${parameter.key}的初始值应在范围内。`);
    if (project.model.family === 'ellipse' && ['a', 'b'].includes(parameter.key)) {
      assert(parameter.min > 0, '椭圆半轴的最小值应大于0。');
    }
  }
  domain(project.model.xDomain, '横轴范围');
  domain(project.model.yDomain, '纵轴范围');
  for (const row of project.dataset.rows) {
    assert(row.x >= project.model.xDomain[0] && row.x <= project.model.xDomain[1] && row.y >= project.model.yDomain[0] && row.y <= project.model.yDomain[1], '图表范围应包含全部数据点。');
  }
  if (project.model.family === 'exponential') {
    const k = project.model.parameters.find(parameter => parameter.key === 'k');
    assert(Math.max(...[k.min, k.max].flatMap(value => project.model.xDomain.map(x => Math.abs(value * x)))) <= 100, '指数参数范围过大，请缩小参数范围或调整横轴单位。');
  }
  if (project.model.family === 'ellipse') {
    assert(project.dataset.xUnit.trim() === project.dataset.yUnit.trim(), '椭圆的横纵坐标应统一单位后再计算几何误差。');
  }
  const parameters = Object.fromEntries(project.model.parameters.map(parameter => [parameter.key, parameter]));
  const maximum = key => Math.max(Math.abs(parameters[key].min), Math.abs(parameters[key].max));
  const maxX = Math.max(...project.model.xDomain.map(Math.abs));
  let modelBound;
  if (project.model.family === 'linear') modelBound = maximum('m') * maxX + maximum('b');
  if (project.model.family === 'quadratic') modelBound = maximum('a') * maxX * maxX + maximum('b') * maxX + maximum('c');
  if (project.model.family === 'exponential') {
    const exponent = Math.max(...[parameters.k.min, parameters.k.max].flatMap(k => project.model.xDomain.map(x => k * x)));
    modelBound = maximum('a') * Math.exp(exponent) + maximum('c');
  }
  if (project.model.family === 'ellipse') modelBound = Math.max(maximum('h') + maximum('a'), maximum('k') + maximum('b'));
  assert(Number.isFinite(modelBound) && modelBound <= NUMERIC_LIMIT, '模型参数范围会使曲线或误差计算溢出，请缩小范围或转换单位。');

  const trainingRows = project.dataset.rows.filter(row => row.split === 'train');
  if (project.model.family === 'ellipse') {
    assert(new Set(trainingRows.map(row => `${row.x},${row.y}`)).size >= 4 && new Set(trainingRows.map(row => row.x)).size >= 2 && new Set(trainingRows.map(row => row.y)).size >= 2, '椭圆建模数据应至少包含4个不同位置，并在横纵两个方向上有变化。');
  } else {
    const minimumX = project.model.family === 'linear' ? 2 : 3;
    assert(new Set(trainingRows.map(row => row.x)).size >= minimumX, `该模型的建模数据应至少包含${minimumX}个不同横坐标。`);
  }

  list(project.stages, '递进任务', 4, 6);
  const stageIds = new Set();
  for (const stage of project.stages) {
    object(stage, '任务');
    text(stage.id, '任务编号', 40);
    assert(!Object.hasOwn(Object.prototype, stage.id), '任务编号应使用独立名称，例如stage-1。');
    assert(!stageIds.has(stage.id), '任务编号应各不相同。');
    stageIds.add(stage.id);
    text(stage.title, '任务标题', 60);
    text(stage.goal, '任务目标', 500);
    text(stage.prompt, '任务问题', 1800);
    texts(stage.knowledge, '任务知识', 1, 6);
    text(stage.bridge, '前后任务联系', 500);
    text(stage.deliverable, '阶段成果', 500);
    object(stage.interaction, '交互任务');
    assert(['data', 'model', 'predict', 'compare'].includes(stage.interaction.type), '交互类型应为data、model、predict或compare。');
    text(stage.interaction.instruction, '交互说明', 700);
    texts(stage.successCriteria, '完成标准', 1, 5);
    texts(stage.hints, '三级提示', 3, 3);
  }
  const interactions = new Set(project.stages.map(stage => stage.interaction.type));
  assert(interactions.has('data') && interactions.has('model') && (interactions.has('predict') || interactions.has('compare')), '任务应覆盖数据观察、参数建模，以及预测或方案比较。');
  return project;
}

const EXPERIMENT_TYPES = ['geometry', 'allocation', 'probability', 'network'];

function identifier(value, name, variables = false) {
  text(value, name, 40);
  assert((variables ? /^[A-Za-z][A-Za-z0-9_]*$/ : /^[A-Za-z][A-Za-z0-9_-]*$/).test(value) && !Object.hasOwn(Object.prototype, value) && value !== 'pi', `${name}请使用独立的英文字母编号。`);
}

function bounded(value, name, min = -1e6, max = 1e6, integer = false) {
  number(value, name);
  assert(value >= min && value <= max && (!integer || Number.isInteger(value)), `${name}应在${min}至${max}之间${integer ? '并为整数' : ''}。`);
}

function optionalUnit(value) { if (value !== undefined) text(value, '单位', 30, true); }

function controls(value, name, minCount = 1) {
  list(value, name, minCount, 8);
  const keys = new Set();
  for (const control of value) {
    object(control, name);
    identifier(control.key, '控件参数名', true);
    assert(!keys.has(control.key), '控件参数名应各不相同。');
    keys.add(control.key);
    text(control.label, '控件名称', 80);
    for (const key of ['min', 'max', 'value', 'step']) bounded(control[key], `控件${control.key}的${key}`);
    assert(control.min < control.max && control.step > 0 && control.step <= control.max - control.min, '控件范围应递增，步长应大于0且不超过范围宽度。');
    assert(control.value >= control.min && control.value <= control.max, '控件初始值应在范围内。');
    optionalUnit(control.unit);
  }
  return [...keys];
}

function validateGeometry(config) {
  const keys = controls(config.parameters, '几何参数');
  const variables = Object.fromEntries(config.parameters.map(parameter => [parameter.key, parameter.value]));
  object(config.bounds, '几何画布范围');
  for (const axis of ['x', 'y']) {
    domain(config.bounds[axis], `几何${axis}轴范围`);
    config.bounds[axis].forEach(value => bounded(value, '几何坐标范围'));
  }
  const expression = (value, name) => {
    try { validateExpression(value, keys); return evaluateExpression(value, variables); }
    catch (error) { throw new Error(`${name}：${error.message}`); }
  };
  const point = (x, y) => {
    const px = expression(x, '横坐标表达式'), py = expression(y, '纵坐标表达式');
    assert(px >= config.bounds.x[0] && px <= config.bounds.x[1] && py >= config.bounds.y[0] && py <= config.bounds.y[1], '几何画布应包含全部初始图形。');
    return [px, py];
  };
  list(config.elements, '几何图形', 1, 24);
  const fields = { point: ['x', 'y'], segment: ['x1', 'y1', 'x2', 'y2'], circle: ['cx', 'cy', 'r'], ellipse: ['cx', 'cy', 'rx', 'ry'], rect: ['x', 'y', 'width', 'height'] };
  for (const element of config.elements) {
    object(element, '几何图形');
    assert(typeof element.type === 'string' && (element.type === 'polygon' || Object.hasOwn(fields, element.type)), '几何图形类型不受支持。');
    if (element.label !== undefined) text(element.label, '图形标签', 60, true);
    const values = Object.fromEntries((fields[element.type] || []).map(key => [key, expression(element[key], `图形${key}`)]));
    if (element.type === 'point') {
      point(element.x, element.y);
      if (element.drag !== undefined) {
        object(element.drag, '拖动参数');
        assert(element.drag.xKey || element.drag.yKey, '拖动点至少对应一个坐标参数。');
        for (const axis of ['x', 'y']) if (element.drag[`${axis}Key`] !== undefined) {
          const key = element.drag[`${axis}Key`];
          assert(keys.includes(key) && element[axis] === key, '可拖点的坐标必须直接引用对应参数名。');
        }
      }
    }
    if (element.type === 'segment') { point(element.x1, element.y1); point(element.x2, element.y2); }
    if (element.type === 'polygon') {
      list(element.points, '多边形顶点', 3, 12);
      element.points.forEach(vertex => { object(vertex, '顶点'); point(vertex.x, vertex.y); });
    }
    if (['circle', 'ellipse'].includes(element.type)) {
      const rx = element.type === 'circle' ? values.r : values.rx;
      const ry = element.type === 'circle' ? values.r : values.ry;
      assert(rx > 0 && ry > 0, '圆半径与椭圆半轴初始值应大于0。');
      point(values.cx - rx, values.cy - ry); point(values.cx + rx, values.cy + ry);
    }
    if (element.type === 'rect') {
      assert(values.width > 0 && values.height > 0, '矩形初始宽高应大于0。');
      point(values.x, values.y); point(values.x + values.width, values.y + values.height);
    }
  }
  list(config.metrics, '几何观测量', 1, 6);
  for (const metric of config.metrics) {
    object(metric, '观测量'); text(metric.label, '观测量名称', 60); optionalUnit(metric.unit);
    expression(metric.expression, '观测量公式');
  }
  if (config.constraints !== undefined) {
    list(config.constraints, '几何约束', 0, 8);
    for (const constraint of config.constraints) {
      object(constraint, '几何约束'); text(constraint.label, '约束说明', 120);
      assert(['<=', '>=', '=='].includes(constraint.operator), '约束比较符应为<=、>=或==。');
      expression(constraint.left, '约束左侧'); expression(constraint.right, '约束右侧');
    }
  }
}

function validateAllocation(config) {
  controls(config.items, '分配选项', 2);
  list(config.resources, '资源约束', 1, 5);
  const resourceKeys = new Set();
  for (const resource of config.resources) {
    object(resource, '资源'); identifier(resource.key, '资源编号', true); text(resource.label, '资源名称', 80); optionalUnit(resource.unit);
    assert(!resourceKeys.has(resource.key), '资源编号应各不相同。'); resourceKeys.add(resource.key);
    bounded(resource.capacity, '资源总量', 0, 1e6);
  }
  for (const item of config.items) {
    assert(item.min >= 0 && item.max <= 10000, '分配数量应在0至10000之间。');
    bounded(item.score, '单位目标值'); object(item.resourceUse, '单位资源消耗');
    assert(Object.keys(item.resourceUse).every(key => resourceKeys.has(key)), '分配选项引用了不存在的资源。');
    for (const key of resourceKeys) bounded(item.resourceUse[key] ?? 0, '单位资源消耗', 0, 1e6);
    assert(Object.values(item.resourceUse).some(value => value > 0), '每个分配选项至少消耗一种资源。');
  }
  assert(config.resources.every(resource => config.items.reduce((sum, item) => sum + item.min * (item.resourceUse[resource.key] || 0), 0) <= resource.capacity), '最低分配数量已超过资源总量，请提供可行起点。');
  object(config.objective, '优化目标'); text(config.objective.label, '目标名称', 100); optionalUnit(config.objective.unit);
  assert(['max', 'min'].includes(config.objective.direction), '优化方向应为max或min。');
}

function validateProbability(config) {
  list(config.population, '抽样类别', 2, 6);
  const ids = new Set();
  for (const item of config.population) {
    object(item, '抽样类别'); identifier(item.id, '类别编号'); text(item.label, '类别名称', 60);
    assert(!ids.has(item.id), '类别编号应各不相同。'); ids.add(item.id);
    bounded(item.count, '类别数量', 1, 50, true);
    if (item.color !== undefined) assert(typeof item.color === 'string' && /^#[0-9a-f]{6}$/i.test(item.color), '类别颜色应为六位十六进制颜色。');
  }
  bounded(config.draws, '每轮抽取次数', 1, 8, true); bounded(config.batchSize, '每批实验次数', 20, 1000, true);
  assert(typeof config.replacement === 'boolean', '是否放回应为布尔值。');
  assert(config.replacement || config.draws <= config.population.reduce((sum, item) => sum + item.count, 0), '不放回抽取次数不能超过总体数量。');
  object(config.event, '实验事件');
  assert(['atLeast', 'exactly', 'allSame', 'allDifferent'].includes(config.event.type), '请选择支持的概率事件。');
  if (['atLeast', 'exactly'].includes(config.event.type)) {
    assert(ids.has(config.event.targetId), '概率事件应引用存在的类别。');
    bounded(config.event.count, '目标出现次数', 0, config.draws, true);
  }
}

function validateNetwork(config) {
  list(config.nodes, '路线节点', 3, 12); list(config.edges, '路线边', 2, 30);
  const ids = new Set();
  for (const node of config.nodes) {
    object(node, '路线节点'); identifier(node.id, '节点编号'); text(node.label, '节点名称', 60);
    assert(!ids.has(node.id), '节点编号应各不相同。'); ids.add(node.id);
    bounded(node.x, '节点横向位置', 0, 100); bounded(node.y, '节点纵向位置', 0, 100);
  }
  assert(typeof config.directed === 'boolean', '路线方向设置应为布尔值。');
  text(config.unit, '路线权重单位', 30);
  assert(ids.has(config.start) && ids.has(config.end) && config.start !== config.end, '路线起终点应是两个不同的现有节点。');
  const edgeKeys = new Set();
  for (const edge of config.edges) {
    object(edge, '路线边');
    assert(ids.has(edge.from) && ids.has(edge.to) && edge.from !== edge.to, '路线边应连接两个不同的现有节点。');
    bounded(edge.weight, '路线权重', Number.MIN_VALUE, 1e6);
    const key = (config.directed ? [edge.from, edge.to] : [edge.from, edge.to].sort()).join('->');
    assert(!edgeKeys.has(key), '同一对节点之间的路线边应唯一。'); edgeKeys.add(key);
  }
  const visited = new Set([config.start]), queue = [config.start];
  for (const node of queue) for (const edge of config.edges) {
    const next = edge.from === node ? edge.to : !config.directed && edge.to === node ? edge.from : null;
    if (next && !visited.has(next)) { visited.add(next); queue.push(next); }
  }
  assert(visited.has(config.end), '路线起点应能够到达终点。');
  if (config.requiredNodes !== undefined) {
    list(config.requiredNodes, '必经节点', 0, 6);
    assert(config.requiredNodes.every(id => ids.has(id)) && new Set(config.requiredNodes).size === config.requiredNodes.length, '必经节点应引用不同的现有节点。');
    assert(shortestDistance(config.nodes, config.edges, config.start, config.end, config.directed, config.requiredNodes) !== null, '应存在经过全部必经节点并到达终点的路线。');
  }
}

export function validateInteractiveProject(project) {
  object(project, '项目'); assert(project.version === 2, '新生成项目必须使用version为2的多场景结构。');
  text(project.title, '项目标题', 80); text(project.subtitle, '项目副标题', 180);
  text(project.drivingQuestion, '核心问题', 600); text(project.context, '项目情境');
  object(project.dataSource, '数据来源');
  assert(['simulated', 'provided', 'public'].includes(project.dataSource.kind), '数据来源应为simulated、provided或public。');
  text(project.dataSource.label, '来源名称', 200); text(project.dataSource.notes, '来源说明', 1000); text(project.dataSource.url, '来源链接', 1000, true);
  if (project.dataSource.url) {
    let url; try { url = new URL(project.dataSource.url); } catch { throw new Error('数据来源链接格式错误。'); }
    assert(['http:', 'https:'].includes(url.protocol), '数据来源应为HTTP或HTTPS链接。');
  }
  assert(project.dataSource.kind !== 'public' || project.dataSource.url, '公开数据需要来源链接。');
  object(project.knowledge, '知识安排'); texts(project.knowledge.known, '已有知识'); texts(project.knowledge.new, '拓展知识', 0, 3);
  list(project.experiments, '交互实验', 2, 4);
  const ids = new Set(), types = new Set();
  const validators = { geometry: validateGeometry, allocation: validateAllocation, probability: validateProbability, network: validateNetwork };
  for (const experiment of project.experiments) {
    object(experiment, '实验'); identifier(experiment.id, '实验编号');
    assert(!ids.has(experiment.id), '实验编号应各不相同。'); ids.add(experiment.id);
    assert(EXPERIMENT_TYPES.includes(experiment.type), '实验类型应为geometry、allocation、probability或network。'); types.add(experiment.type);
    text(experiment.title, '实验名称', 80); text(experiment.description, '实验说明', 700); object(experiment.config, '实验配置');
    validators[experiment.type](experiment.config);
  }
  assert(types.size >= 2, '项目应包含至少两种不同的交互实验。');
  list(project.stages, '递进任务', 4, 6);
  const stageIds = new Set(), used = new Set();
  for (const stage of project.stages) {
    object(stage, '任务'); identifier(stage.id, '任务编号');
    assert(!stageIds.has(stage.id), '任务编号应各不相同。'); stageIds.add(stage.id);
    text(stage.title, '任务标题', 60); text(stage.goal, '任务目标', 500); text(stage.prompt, '任务问题', 1800);
    texts(stage.knowledge, '任务知识', 1, 6); text(stage.bridge, '前后任务联系', 500); text(stage.deliverable, '阶段成果', 500);
    object(stage.interaction, '交互任务'); assert(ids.has(stage.interaction.experimentId), '任务引用了不存在的交互实验。'); used.add(stage.interaction.experimentId);
    text(stage.interaction.instruction, '交互说明', 700); texts(stage.successCriteria, '完成标准', 1, 5); texts(stage.hints, '三级提示', 3, 3);
  }
  assert(used.size === ids.size, '每个实验都应在递进任务中使用。');
  return project;
}

export function validateProject(project) {
  return project?.version === 2 ? validateInteractiveProject(project) : validateLegacyProject(project);
}
