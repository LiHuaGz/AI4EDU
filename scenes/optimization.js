import { computeGeometry, mountGeometry } from './geometry.js?v=dba71fabac1f';

export function optimizationGeometry(config) {
  return { ...config.visualization, parameters: [...config.variables, ...(config.parameters || [])], constraints: config.constraints,
    metrics: [{ label: config.objective.label, expression: config.objective.expression, unit: config.objective.unit }, ...config.visualization.metrics] };
}

export function computeOptimization(config, parameters) {
  const result = computeGeometry(optimizationGeometry(config), parameters);
  return { ...result, objective: result.metrics[0].value, direction: config.objective.direction };
}

// 优化实验共用几何交互，设计变量和情境参数分别在目标说明中标明。
export function mountOptimization(container, experiment, saved, onChange = () => {}, stage) {
  const config = { ...experiment.config, objective: stage?.interaction.objective || experiment.config.objective,
    constraints: [...experiment.config.constraints, ...(stage?.interaction.additionalConstraints || [])] };
  const snapshot = value => ({ ...value, type: 'optimization', objective: value.metrics[0].value, direction: config.objective.direction, objectiveDefinition: config.objective });
  const scene = mountGeometry(container, { ...experiment, config: optimizationGeometry(config) }, saved, value => onChange(snapshot(value)), stage);
  const heading = document.createElement('div');
  heading.className = 'optimization-goal';
  heading.hidden = stage?.interaction.showObjective === false;
  const title = document.createElement('strong');
  title.textContent = `${config.objective.direction === 'min' ? '最小化' : '最大化'}：${config.objective.label}`;
  const expression = document.createElement('p');
  expression.textContent = `目标函数：${config.objective.displayExpression || config.objective.expression}；设计变量：${config.variables.map(item => item.label).join('、')}。`;
  heading.append(title, expression);
  container.querySelector('.scene-controls').before(heading);
  return { getState: () => snapshot(scene.getState()), setInstruction: scene.setInstruction, destroy: scene.destroy };
}
