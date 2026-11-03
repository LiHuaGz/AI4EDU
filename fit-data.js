import { evaluateExpression } from './expression.js?v=dba71fabac1f';

// 曲线关系可先对纵坐标做变换，化成直线关系后用最小二乘法估计。
export function transformedStatistics(rows, transform) {
  const values = rows.map(row => evaluateExpression(transform.expression, { x: row.x, y: row.y }));
  const count = rows.length;
  const meanX = rows.reduce((sum, row) => sum + row.x, 0) / count;
  const meanZ = values.reduce((sum, value) => sum + value, 0) / count;
  return { count, meanX, meanZ,
    sxx: rows.reduce((sum, row) => sum + (row.x - meanX) ** 2, 0),
    sxz: rows.reduce((sum, row, index) => sum + (row.x - meanX) * (values[index] - meanZ), 0) };
}

// 残差等于观测的y减去模型在同一x处的预测值，模型是只含x与控件参数的表达式。
export function residualSummary(observations, parameters, split) {
  const rows = observations.rows.filter(row => row.split === split);
  const residuals = rows.map(row => row.y - evaluateExpression(observations.model, { ...parameters, x: row.x }));
  return { count: rows.length, rmse: Math.sqrt(residuals.reduce((sum, value) => sum + value * value, 0) / rows.length),
    maxError: Math.max(...residuals.map(Math.abs)), residuals };
}
