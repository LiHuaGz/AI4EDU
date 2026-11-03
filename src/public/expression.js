// 数学表达式使用独立语法树求值，模型返回的内容始终作为数据处理。
// 标准正态分布函数Φ，用全为正项的级数计算erf，避免大数相消；超过8个标准差时取极限值。
export function normalCdf(z) {
  if (Math.abs(z) > 8) return z > 0 ? 1 : 0;
  const x = Math.abs(z) / Math.SQRT2, square = x * x;
  let term = x, sum = x;
  for (let n = 1; term > 1e-17 * sum; n++) { term *= 2 * square / (2 * n + 1); sum += term; }
  const erf = 2 / Math.sqrt(Math.PI) * Math.exp(-square) * sum;
  return z >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf);
}
const FUNCTIONS = {
  sqrt: [Math.sqrt, 1], abs: [Math.abs, 1], sin: [Math.sin, 1], cos: [Math.cos, 1], tan: [Math.tan, 1],
  atan: [Math.atan, 1], acos: [Math.acos, 1], Phi: [normalCdf, 1],
  min: [Math.min, 1, 8], max: [Math.max, 1, 8], pow: [Math.pow, 2], exp: [Math.exp, 1],
  log: [Math.log, 1], floor: [Math.floor, 1], ceil: [Math.ceil, 1], round: [Math.round, 1],
};
const parsed = new Map();

function parseExpression(expression) {
  if (typeof expression === 'number') {
    if (!Number.isFinite(expression)) throw new Error('表达式中的数值应为有限数。');
    return { type: 'number', value: expression };
  }
  if (typeof expression !== 'string' || !expression.trim() || expression.length > 500) throw new Error('数学表达式应为500字以内的有效文本。');
  if (parsed.has(expression)) return parsed.get(expression);
  const source = expression.replace(/×/g, '*').replace(/[−－]/g, '-').replace(/÷/g, '/').replace(/π/g, 'pi');
  const tokens = [];
  let position = 0;
  while (position < source.length) {
    const rest = source.slice(position);
    const whitespace = rest.match(/^\s+/);
    if (whitespace) { position += whitespace[0].length; continue; }
    const match = rest.match(/^(?:(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|[A-Za-z_][A-Za-z_0-9]*|[+*/^(),-])/i);
    if (!match) throw new Error(`数学表达式含有不支持的符号：${source[position]}。`);
    tokens.push(match[0]);
    position += match[0].length;
  }
  if (tokens.length > 160) throw new Error('数学表达式过长，请拆分计算。');
  let cursor = 0;
  const peek = () => tokens[cursor];
  const take = token => {
    if (tokens[cursor] !== token) throw new Error(`数学表达式缺少${token}。`);
    cursor++;
  };
  function sum() {
    let node = product();
    while (['+', '-'].includes(peek())) { const operator = tokens[cursor++]; node = { type: 'binary', operator, left: node, right: product() }; }
    return node;
  }
  function product() {
    let node = unary();
    while (['*', '/'].includes(peek())) { const operator = tokens[cursor++]; node = { type: 'binary', operator, left: node, right: unary() }; }
    return node;
  }
  function unary() {
    if (['+', '-'].includes(peek())) return { type: 'unary', operator: tokens[cursor++], value: unary() };
    return power();
  }
  function power() {
    const left = primary();
    if (peek() !== '^') return left;
    cursor++;
    return { type: 'binary', operator: '^', left, right: unary() };
  }
  function primary() {
    const token = tokens[cursor++];
    if (token === '(') { const node = sum(); take(')'); return node; }
    if (token && /^(?:\d|\.)/.test(token)) {
      const value = Number(token);
      if (!Number.isFinite(value)) throw new Error('数学表达式中的数值过大。');
      return { type: 'number', value };
    }
    if (!token || !/^[A-Za-z_][A-Za-z_0-9]*$/.test(token)) throw new Error('请检查数学表达式的数字、变量与括号。');
    if (peek() !== '(') return token === 'pi' ? { type: 'number', value: Math.PI } : { type: 'variable', name: token };
    if (!Object.hasOwn(FUNCTIONS, token)) throw new Error(`数学表达式不支持函数${token}。`);
    cursor++;
    const args = [];
    if (peek() !== ')') {
      args.push(sum());
      while (peek() === ',') { cursor++; args.push(sum()); }
    }
    take(')');
    const [, min, max = min] = FUNCTIONS[token];
    if (args.length < min || args.length > max) throw new Error(`函数${token}的参数数量有误。`);
    return { type: 'call', name: token, args };
  }
  const tree = sum();
  if (cursor !== tokens.length) throw new Error('数学表达式含有多余内容，乘法请使用＊号。');
  if (parsed.size >= 500) parsed.clear();
  parsed.set(expression, tree);
  return tree;
}

export function validateExpression(expression, allowedKeys = []) {
  const names = new Set(allowedKeys);
  function visit(node) {
    if (node.type === 'variable' && !names.has(node.name)) throw new Error(`数学表达式引用了未定义的参数${node.name}。`);
    if (node.type === 'unary') visit(node.value);
    if (node.type === 'binary') { visit(node.left); visit(node.right); }
    if (node.type === 'call') node.args.forEach(visit);
  }
  visit(parseExpression(expression));
  return true;
}

export function evaluateExpression(expression, variables = {}) {
  function evaluate(node) {
    if (node.type === 'number') return node.value;
    if (node.type === 'variable') {
      if (!Object.hasOwn(variables, node.name) || !Number.isFinite(variables[node.name])) throw new Error(`参数${node.name}缺少有效数值。`);
      return variables[node.name];
    }
    if (node.type === 'unary') return (node.operator === '-' ? -1 : 1) * evaluate(node.value);
    if (node.type === 'call') return FUNCTIONS[node.name][0](...node.args.map(evaluate));
    const left = evaluate(node.left), right = evaluate(node.right);
    return { '+': () => left + right, '-': () => left - right, '*': () => left * right, '/': () => left / right, '^': () => left ** right }[node.operator]();
  }
  const result = evaluate(parseExpression(expression));
  if (!Number.isFinite(result)) throw new Error('当前参数使计算超出定义域，请调整参数。');
  return result;
}
