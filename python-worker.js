import { loadPyodide } from './vendor/pyodide/pyodide.mjs?v=dba71fabac1f';

// Python在独立工作线程运行，主页面可以随时停止计算。
let outputLength = 0;
let capturing = false;
const output = text => {
  if (!capturing || outputLength >= 20000) return;
  const chunk = String(text).slice(0, 20000 - outputLength);
  outputLength += chunk.length;
  self.postMessage({ type: 'output', text: chunk });
};
const ready = loadPyodide({ indexURL: new URL('./vendor/pyodide/', import.meta.url).href, stdout: output, stderr: output })
  .then(async python => { await python.loadPackage('numpy'); return python; });

self.onmessage = async event => {
  let globals;
  try {
    const python = await ready;
    outputLength = 0;
    capturing = true;
    self.postMessage({ type: 'running' });
    globals = python.toPy({ _context_json: JSON.stringify(event.data.context) });
    const setup = 'import json\nimport numpy as np\ndata = json.loads(_context_json)\ntrain = np.array(data["train"], dtype=float).reshape(-1, 2)\nvalidation = np.array(data["validation"], dtype=float).reshape(-1, 2)\nparams = data["parameters"]\n';
    const result = await python.runPythonAsync(setup + event.data.code, { globals });
    result?.destroy?.();
    self.postMessage({ type: 'done' });
  } catch (error) {
    self.postMessage({ type: 'error', text: error.message });
  } finally { capturing = false; globals?.destroy(); }
};
