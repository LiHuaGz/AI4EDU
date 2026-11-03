import { ComputeEngine } from './vendor/compute-engine/compute-engine.js?v=dba71fabac1f';

const engine = new ComputeEngine({ precision: 16 });
const operations = new Set(['Add', 'Subtract', 'Multiply', 'Divide', 'Negate', 'Power', 'Sqrt', 'Root', 'Abs', 'Sin', 'Cos', 'Tan', 'Cot', 'Sec', 'Csc', 'Arcsin', 'Arccos', 'Arctan', 'Exp', 'Ln', 'Log', 'Max', 'Min', 'Rational']);

export function calculateFormula(latex, bindings = {}, angleMode = 'deg') {
  if (!latex.trim()) throw new Error('先输入要计算的表达式。');
  if (latex.length > 1000) throw new Error('请把长公式拆成几步计算。');
  engine.angularUnit = angleMode;
  engine.pushScope();
  try {
    // 在独立作用域声明变量，使轨道离心率e按学生模型解释。
    for (const [key, value] of Object.entries(bindings)) {
      if (!Number.isFinite(value)) continue;
      engine.declare(key, 'real'); engine.assign(key, value);
    }
    return engine.withTimeLimit(250, () => {
      let expression = engine.parse(latex);
      if (expression.operator === 'Equal' && expression.ops.length === 2) expression = expression.ops[1];
      let count = 0;
      function inspect(item) {
        if (++count > 256) throw new Error('请把长公式拆成几步计算。');
        if (Array.isArray(item)) {
          if (item[0] === 'Complex') throw new Error('结果超出实数定义域，请检查表达式。');
          if (!operations.has(item[0])) throw new Error('这里支持代数和三角函数的数值计算，请将推导拆成可代入的一步。');
          item.slice(1).forEach(inspect);
        }
      }
      inspect(expression.json);
      if (!expression.isValid) throw new Error('公式还有空位或语法问题，请补全后计算。');
      const result = expression.N();
      if (!Number.isFinite(result.re) || result.im !== 0) throw new Error('请检查定义域，并将其余变量代入数值后计算。');
      const used = {};
      for (const symbol of expression.symbols) if (Object.hasOwn(bindings, symbol)) used[symbol] = bindings[symbol];
      return { latex: latex.trim(), value: Number(result.re.toPrecision(12)), bindings: used, angleMode };
    });
  } catch (error) {
    if (error.name === 'CancellationError') throw new Error('这一步计算较长，请拆成更小的表达式。');
    throw error;
  } finally { engine.popScope(); }
}

export function calculationBindings(project, snapshot) {
  const constants = Object.fromEntries((project.constants || []).map(item => [item.key, item.value]));
  const experiment = project.experiments?.[0];
  const state = snapshot?.experiments?.[experiment?.id];
  const values = { ...constants, ...(state?.parameters || {}) };
  for (const item of [...(experiment?.config.variables || []), ...(experiment?.config.parameters || [])]) {
    if (item.symbol) values[item.symbol] = values[item.key];
  }
  return values;
}
