// 地心为左焦点、长轴方向已知时，椭圆可写为r＝p＋ex，p＝a（1－e²）。
export function observationStatistics(rows) {
  const count = rows.length;
  const meanX = rows.reduce((sum, row) => sum + row.x, 0) / count;
  const meanR = rows.reduce((sum, row) => sum + Math.hypot(row.x, row.y), 0) / count;
  return { count, meanX, meanR,
    sxx: rows.reduce((sum, row) => sum + (row.x - meanX) ** 2, 0),
    sxr: rows.reduce((sum, row) => sum + (row.x - meanX) * (Math.hypot(row.x, row.y) - meanR), 0) };
}

export function orbitResiduals(observations, parameters, split) {
  const a = parameters[observations.aKey], e = parameters[observations.eKey], p = a * (1 - e * e);
  const rows = observations.rows.filter(row => row.split === split);
  const residuals = rows.map(row => Math.hypot(row.x, row.y) - (p + e * row.x));
  return { count: rows.length, rmse: Math.sqrt(residuals.reduce((sum, value) => sum + value * value, 0) / rows.length),
    maxError: Math.max(...residuals.map(Math.abs)), residuals };
}
