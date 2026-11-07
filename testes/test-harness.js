const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message = 'Expected condition to be truthy') {
  if (!condition) throw new Error(message);
}

assert.equal = (actual, expected, message = '') => {
  if (actual !== expected) {
    throw new Error(message || `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
  }
};

assert.notEqual = (actual, expected, message = '') => {
  if (actual === expected) {
    throw new Error(message || `Expected ${JSON.stringify(actual)} not to equal ${JSON.stringify(expected)}`);
  }
};

assert.deepEqual = (actual, expected, message = '') => {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(message || `Expected ${actualJson} to equal ${expectedJson}`);
  }
};

assert.includes = (value, expected, message = '') => {
  if (!String(value).includes(expected)) {
    throw new Error(message || `Expected ${JSON.stringify(value)} to include ${JSON.stringify(expected)}`);
  }
};

function appState(win) {
  return win.eval('state');
}

function lineageState(win) {
  return win.eval('lineageState');
}

function appVar(win, name) {
  return win.eval(name);
}

function setAppVar(win, name, value) {
  win.eval(`${name} = ${JSON.stringify(value)}`);
}

async function tick() {
  await new Promise(resolve => setTimeout(resolve, 0));
}

function click(element) {
  const EventCtor = element.ownerDocument.defaultView.MouseEvent;
  element.dispatchEvent(new EventCtor('click', { bubbles: true, cancelable: true }));
}

function input(element, value) {
  const EventCtor = element.ownerDocument.defaultView.Event;
  element.value = value;
  element.dispatchEvent(new EventCtor('input', { bubbles: true }));
}

function change(element, value) {
  const EventCtor = element.ownerDocument.defaultView.Event;
  element.value = value;
  element.dispatchEvent(new EventCtor('change', { bubbles: true }));
}

function appFrameHtml() {
  const baseUrl = new URL('../../', window.location.href).href;
  const appVersion = Date.now();
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <base href="${baseUrl}">
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ficha Testada</title>
  <link rel="stylesheet" href="style.css?v=${appVersion}" />
</head>
<body>
  <script src="scripts/components/header-template.js?v=${appVersion}"></script>
  <script src="scripts/components/sheet-sections.js?v=${appVersion}"></script>
  <script src="scripts/components/creation-world-template.js?v=${appVersion}"></script>
  <script src="scripts/components/modals-template.js?v=${appVersion}"></script>
  <script src="scripts/components/wiki-template.js?v=${appVersion}"></script>
  <script src="scripts/components/sheet-shell.js?v=${appVersion}"></script>
  <script>renderAppShell();</script>
  <script src="prompt.js?v=${appVersion}"></script>
  <script src="scripts/config.js?v=${appVersion}"></script>
  <script src="scripts/character-image.js?v=${appVersion}"></script>
  <script src="scripts/state-utils.js?v=${appVersion}"></script>
  <script src="scripts/dots.js?v=${appVersion}"></script>
  <script src="scripts/health-fields.js?v=${appVersion}"></script>
  <script src="scripts/lineage.js?v=${appVersion}"></script>
  <script src="scripts/coven.js?v=${appVersion}"></script>
  <script src="scripts/sheets-serialization.js?v=${appVersion}"></script>
  <script src="scripts/github-sync.js?v=${appVersion}"></script>
  <script src="scripts/character-lists.js?v=${appVersion}"></script>
  <script src="scripts/autosave.js?v=${appVersion}"></script>
  <script src="scripts/sheet-loading-creation.js?v=${appVersion}"></script>
  <script src="scripts/github-ui.js?v=${appVersion}"></script>
  <script src="scripts/ai.js?v=${appVersion}"></script>
  <script src="scripts/wiki.js?v=${appVersion}"></script>
  <script src="scripts/printing.js?v=${appVersion}"></script>
  <script src="scripts/integrations/github.js?v=${appVersion}"></script>
  <script src="scripts/integrations/local-files.js?v=${appVersion}"></script>
  <script src="scripts/bootstrap.js?v=${appVersion}"></script>
</body>
</html>`;
}

async function loadAppFrame() {
  const iframe = document.createElement('iframe');
  iframe.className = 'app-frame';
  document.body.appendChild(iframe);
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timed out loading app iframe')), 5000);
    iframe.addEventListener('load', () => {
      clearTimeout(timeout);
      resolve();
    }, { once: true });
    iframe.srcdoc = appFrameHtml();
  });

  const win = iframe.contentWindow;
  win.alert = message => {
    win.__lastAlert = String(message || '');
  };
  win.confirm = () => true;
  win.HTMLInputElement.prototype.reportValidity = function reportValidity() {
    win.__lastReportedValidity = this.validationMessage || '';
    return !this.validationMessage;
  };
  win.HTMLTextAreaElement.prototype.reportValidity = function reportValidity() {
    win.__lastReportedValidity = this.validationMessage || '';
    return !this.validationMessage;
  };
  win.HTMLSelectElement.prototype.reportValidity = function reportValidity() {
    win.__lastReportedValidity = this.validationMessage || '';
    return !this.validationMessage;
  };
  return { iframe, win, doc: win.document };
}

function resetApp(win, data = {}) {
  win.applySheetData(JSON.parse(JSON.stringify(data)), '', 'fichas');
}

async function runTests() {
  const results = document.getElementById('results');
  const summary = document.getElementById('summary');
  const startedAt = performance.now();
  let failed = 0;

  for (const item of tests) {
    const row = document.createElement('li');
    row.className = 'test-row running';
    row.textContent = item.name;
    results.appendChild(row);

    try {
      await item.fn();
      row.className = 'test-row passed';
      row.textContent = `PASS ${item.name}`;
    } catch (error) {
      failed += 1;
      row.className = 'test-row failed';
      row.textContent = `FAIL ${item.name}: ${error.message}`;
      const details = document.createElement('pre');
      details.textContent = error.stack || String(error);
      row.appendChild(details);
      console.error(`[test] ${item.name}`, error);
    }
  }

  const elapsed = Math.round(performance.now() - startedAt);
  const passed = tests.length - failed;
  const testResults = { passed, failed, total: tests.length, elapsed };
  summary.textContent = `${passed}/${tests.length} testes passaram em ${elapsed} ms`;
  summary.className = failed ? 'failed' : 'passed';
  document.title = failed ? `FAIL ${document.title}` : `PASS ${document.title}`;
  window.__testResults = testResults;
  window.parent?.postMessage({
    type: 'mage-test-results',
    suite: document.body.dataset.suite || document.title,
    results: testResults,
    failures: Array.from(document.querySelectorAll('.test-row.failed')).map(row => row.textContent)
  }, '*');
}

window.TestHarness = {
  appState,
  appVar,
  assert,
  change,
  click,
  input,
  lineageState,
  loadAppFrame,
  resetApp,
  runTests,
  setAppVar,
  test,
  tick
};
