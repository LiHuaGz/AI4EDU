import { mountLab } from './lab.js';
import { mountGeometry } from './scenes/geometry.js';
import { mountAllocation } from './scenes/allocation.js';
import { mountOptimization } from './scenes/optimization.js';
import { mountProbability } from './scenes/probability.js';
import { mountNetwork } from './scenes/network.js';

export const EXPERIMENT_LABELS = {
  geometry: '几何探索', optimization: '方案优化', allocation: '资源分配', probability: '概率模拟', network: '路线规划',
};
const renderers = { geometry: mountGeometry, optimization: mountOptimization, allocation: mountAllocation, probability: mountProbability, network: mountNetwork };

export function describeExperimentText(text, project) {
  let result = String(text || '');
  for (const experiment of project.experiments || []) {
    if (experiment.id.length < 2) continue;
    const id = experiment.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(`\\b${id}\\b`, 'g'), `“${experiment.title}”`);
  }
  return result;
}

// 按AI返回的实验类型选择组件，同一实验在不同任务间保留完整操作状态。
export function mountWorkbench(container, project, saved, onChange) {
  if (project.version === 1) return mountLab(container, project, saved, onChange);
  const snapshots = structuredClone(saved?.experiments || {});
  let currentId;
  let currentStage;
  let active;
  function getState() {
    if (active) snapshots[currentId] = active.getState();
    return { version: 2, activeStageId: currentStage?.id, activeExperimentId: currentId, experiments: structuredClone(snapshots) };
  }
  function showExperiment(id) {
    if (active) { snapshots[currentId] = active.getState(); active.destroy(); }
    const experiment = project.experiments.find(item => item.id === id);
    currentId = experiment.id;
    active = renderers[experiment.type](container, experiment, snapshots[currentId], value => {
      snapshots[currentId] = value;
      onChange({ version: 2, activeStageId: currentStage.id, activeExperimentId: currentId, experiments: structuredClone(snapshots) });
    }, currentStage);
    active.setInstruction(describeExperimentText(id === currentStage.interaction.experimentId ? currentStage.interaction.instruction : experiment.description, project));
  }
  return {
    getState,
    setStage(stage) {
      currentStage = stage;
      const retained = saved?.activeExperimentId && saved.activeStageId === stage.id && project.experiments.some(item => item.id === saved.activeExperimentId);
      showExperiment(retained ? saved.activeExperimentId : stage.interaction.experimentId);
    },
    selectExperiment(id) { showExperiment(id); onChange(getState()); },
    destroy() {
      if (active) { snapshots[currentId] = active.getState(); active.destroy(); active = null; }
    },
  };
}
