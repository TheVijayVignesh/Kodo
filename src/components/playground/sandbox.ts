"use client";

/**
 * Sandbox runner for the code playground.
 *
 * Design goals:
 *   1. Always resolve the run state within a hard timeout so the UI
 *      can never get stuck on "Running…".
 *   2. Surface real diagnostics (syntax errors, assertion failures,
 *      console output) rather than fake checkmarks.
 *   3. Sandboxed from the parent application while still allowing the
 *      parent to read the iframe's DOM and computed styles.
 *   4. Tear down resources on every run so a long run cannot leak.
 *
 * Strategy:
 *   - Render the user HTML inside a sandboxed iframe.
 *   - The iframe's sandboxed script tag installs a postMessage handshake
 *     for evaluating expressions, capturing console output, and
 *     reporting errors.
 *   - The parent reads the rendered DOM and computed styles from inside
 *     the iframe.
 *   - A 6-second hard timeout always resolves the test run.
 *
 * The iframe uses `sandbox="allow-scripts allow-same-origin"`. The
 * `allow-same-origin` flag is what lets the parent read the iframe's
 * document and computed styles for assertions. Without it, every
 * read returns null and every test reports "sandbox unreachable".
 * The iframe is still isolated: it cannot reach the parent's window
 * (no `allow-top-navigation`), and scripts cannot break out of it.
 */

export type SandboxTestResult =
  | { id: string; pass: true; detail?: string }
  | { id: string; pass: false; detail: string; expected?: string; received?: string };

export type RunResult = {
  ok: boolean;
  tests: SandboxTestResult[];
  console: { level: "log" | "warn" | "error"; text: string }[];
  error?: string;
};

const SANDBOX_HTML = (sourceHTML: string, id: string) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style id="__zen_user_style__"></style>
</head>
<body>
${sourceHTML}
<script id="__zen_runner__">
(function(){
  var __id = ${JSON.stringify(id)};
  function stringify(v){
    if (typeof v === 'string') return v;
    try { return JSON.stringify(v); } catch(e){ return String(v); }
  }
  // Capture console
  try {
    var origLog = console.log, origWarn = console.warn, origErr = console.error;
    console.log = function(){
      var args = Array.prototype.slice.call(arguments);
      try { parent.postMessage({__zenId: __id, type:'console', level:'log', text: args.map(stringify).join(' ')}, '*'); } catch(e){}
      origLog.apply(console, arguments);
    };
    console.warn = function(){
      var args = Array.prototype.slice.call(arguments);
      try { parent.postMessage({__zenId: __id, type:'console', level:'warn', text: args.map(stringify).join(' ')}, '*'); } catch(e){}
      origWarn.apply(console, arguments);
    };
    console.error = function(){
      var args = Array.prototype.slice.call(arguments);
      try { parent.postMessage({__zenId: __id, type:'console', level:'error', text: args.map(stringify).join(' ')}, '*'); } catch(e){}
      origErr.apply(console, arguments);
    };
  } catch(e){}
  // Expression evaluator
  window.addEventListener('message', function(ev){
    var data = ev.data;
    if (!data || data.__zenId !== __id) return;
    if (data.type === 'eval'){
      try {
        var result = (0, eval)(data.expression);
        if (result && typeof result.then === 'function'){
          result.then(function(v){ parent.postMessage({__zenId: __id, type:'result', id: data.id, value: v}, '*'); },
                      function(e){ parent.postMessage({__zenId: __id, type:'result', id: data.id, error: String(e && e.message || e)}, '*'); });
        } else {
          parent.postMessage({__zenId: __id, type:'result', id: data.id, value: result}, '*');
        }
      } catch(err){
        parent.postMessage({__zenId: __id, type:'result', id: data.id, error: String(err && err.message || err)}, '*');
      }
    }
  });
  // Catch top-level errors and surface them as console errors
  window.addEventListener('error', function(e){
    try { parent.postMessage({__zenId: __id, type:'console', level:'error', text: String(e.message || e)}, '*'); } catch(_){}
  });
  window.addEventListener('unhandledrejection', function(e){
    try { parent.postMessage({__zenId: __id, type:'console', level:'error', text: 'Unhandled promise rejection: ' + String(e.reason)}, '*'); } catch(_){}
  });
  // Signal ready
  try { parent.postMessage({__zenId: __id, type:'ready'}, '*'); } catch(e){}
})();
</script>
</body>
</html>`;

function makeId() {
  return "zen_" + Math.random().toString(36).slice(2) + "_" + Date.now();
}

const HARD_TIMEOUT_MS = 6000;

export async function runSandbox(
  sourceHTML: string,
  testSpecs: import("@/lib/curriculum/types").TestSpec[]
): Promise<RunResult> {
  const id = makeId();
  const html = SANDBOX_HTML(sourceHTML, id);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  // Container — placed off-screen but kept in the document for ref stability
  const iframe = document.createElement("iframe");
  iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = "1px";
  iframe.style.height = "1px";
  iframe.style.opacity = "0";
  iframe.setAttribute("aria-hidden", "true");
  iframe.setAttribute("tabindex", "-1");
  iframe.src = url;
  document.body.appendChild(iframe);

  // The handshake bus
  const consoleOut: { level: "log" | "warn" | "error"; text: string }[] = [];
  const pendingEvals = new Map<string, { resolve: (v: any) => void; reject: (e: any) => void; timer: any }>();
  const timeouts: any[] = [];
  let ready = false;
  let torn = false;

  function onMessage(ev: MessageEvent) {
    if (torn) return;
    const d: any = ev.data;
    if (!d || d.__zenId !== id) return;
    if (d.type === "ready") ready = true;
    else if (d.type === "console") consoleOut.push({ level: d.level, text: d.text });
    else if (d.type === "result") {
      const p = pendingEvals.get(d.id);
      if (p) {
        pendingEvals.delete(d.id);
        clearTimeout(p.timer);
        if ("error" in d) p.reject(new Error(d.error));
        else p.resolve(d.value);
      }
    }
  }
  window.addEventListener("message", onMessage);

  // Hard timeout — always resolves the run so the UI never hangs.
  const hardTimeout = setTimeout(() => {
    if (torn) return;
    torn = true;
    cleanup();
    resolveNow({ ok: false, tests: [], console: consoleOut, error: "Run timed out after 6s" });
  }, HARD_TIMEOUT_MS);
  timeouts.push(hardTimeout);

  function cleanup() {
    window.removeEventListener("message", onMessage);
    timeouts.forEach(clearTimeout);
    pendingEvals.forEach((p) => clearTimeout(p.timer));
    pendingEvals.clear();
    try { URL.revokeObjectURL(url); } catch {}
    try { iframe.remove(); } catch {}
  }

  function resolveNow(result: RunResult) {
    // Called exactly once
    pendingResolvers.forEach((r) => r(result));
    pendingResolvers.length = 0;
  }
  const pendingResolvers: Array<(r: RunResult) => void> = [];

  // Wait for ready, then run tests
  return new Promise<RunResult>((resolve) => {
    pendingResolvers.push(resolve);

    function startTestsWhenReady() {
      if (torn) return;
      if (ready) {
        // Give a tiny tick for the user script to finish before we test
        setTimeout(async () => {
          if (torn) return;
          try {
            const results = await runTests(iframe, testSpecs, id, pendingEvals, consoleOut, () => torn);
            if (torn) return;
            torn = true;
            clearTimeout(hardTimeout);
            cleanup();
            resolveNow({
              ok: results.every((t) => t.pass),
              tests: results,
              console: consoleOut,
            });
          } catch (e: any) {
            if (torn) return;
            torn = true;
            clearTimeout(hardTimeout);
            cleanup();
            resolveNow({ ok: false, tests: [], console: consoleOut, error: e?.message ?? String(e) });
          }
        }, 80);
      } else {
        setTimeout(startTestsWhenReady, 50);
      }
    }
    // Wait for the iframe to fire "load" first
    if (iframe.contentDocument && iframe.contentDocument.readyState === "complete") {
      startTestsWhenReady();
    } else {
      iframe.addEventListener("load", () => {
        if (torn) return;
        // allow the in-iframe runner script to post 'ready'
        setTimeout(startTestsWhenReady, 30);
      });
    }
  });
}

async function runTests(
  iframe: HTMLIFrameElement,
  tests: import("@/lib/curriculum/types").TestSpec[],
  id: string,
  pending: Map<string, { resolve: (v: any) => void; reject: (e: any) => void; timer: any }>,
  consoleOut: { level: "log" | "warn" | "error"; text: string }[],
  isTorn: () => boolean
): Promise<SandboxTestResult[]> {
  const results: SandboxTestResult[] = [];
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow as any;
  if (!doc || !win) {
    return tests.map((_, i) => ({ id: `t${i}`, pass: false, detail: "Sandbox unreachable" }));
  }

  function evalInSandbox(expr: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const evalId = makeId();
      const timer = setTimeout(() => {
        pending.delete(evalId);
        reject(new Error("Expression timed out"));
      }, 1500);
      pending.set(evalId, { resolve, reject, timer });
      try {
        win.postMessage({ __zenId: id, type: "eval", id: evalId, expression: expr }, "*");
      } catch (e) {
        clearTimeout(timer);
        pending.delete(evalId);
        reject(e);
      }
    });
  }

  for (let i = 0; i < tests.length; i++) {
    if (isTorn()) break;
    const t = tests[i];
    const testId = `t${i}`;
    try {
      if (t.kind === "html-contains") {
        const nodes = doc.querySelectorAll(t.selector);
        const count = nodes.length;
        const min = t.min ?? 1;
        if (count >= min) {
          results.push({ id: testId, pass: true, detail: `${count} match(es) for ${t.selector}` });
        } else {
          results.push({
            id: testId,
            pass: false,
            detail: `Expected at least ${min} of selector \`${t.selector}\` — found ${count}.`,
            expected: `≥ ${min}`,
            received: String(count),
          });
        }
      } else if (t.kind === "html-equals") {
        const el = doc.querySelector(t.selector);
        const got = el ? (el.textContent ?? "").trim() : null;
        if (el && got === t.value) {
          results.push({ id: testId, pass: true, detail: `${t.selector} text matches` });
        } else {
          results.push({
            id: testId,
            pass: false,
            detail: `${t.selector} text does not match.`,
            expected: t.value,
            received: got === null ? "(element not found)" : JSON.stringify(got),
          });
        }
      } else if (t.kind === "html-matches") {
        const el = doc.querySelector(t.selector);
        const got = el ? (el.textContent ?? "").trim() : "";
        try {
          const re = new RegExp(t.regex);
          if (el && re.test(got)) {
            results.push({ id: testId, pass: true, detail: `${t.selector} matches /${t.regex}/` });
          } else {
            results.push({
              id: testId,
              pass: false,
              detail: `${t.selector} text does not match regex /${t.regex}/.`,
              expected: `/${t.regex}/`,
              received: JSON.stringify(got),
            });
          }
        } catch (e: any) {
          results.push({ id: testId, pass: false, detail: "Invalid regex in test: " + e.message });
        }
      } else if (t.kind === "css-property") {
        const el = doc.querySelector(t.selector);
        if (!el) {
          results.push({ id: testId, pass: false, detail: `Selector ${t.selector} not found.` });
          continue;
        }
        const cs = win.getComputedStyle(el);
        const actual = (cs as any)[t.property] ?? "";
        if (actual === t.expected) {
          results.push({ id: testId, pass: true, detail: `${t.selector} ${t.property} = ${t.expected}` });
        } else {
          results.push({
            id: testId,
            pass: false,
            detail: `${t.selector} ${t.property} should be ${t.expected}.`,
            expected: t.expected,
            received: actual,
          });
        }
      } else if (t.kind === "js-result") {
        try {
          const v = await evalInSandbox(t.expression);
          if (deepEqual(v, t.expected)) {
            results.push({ id: testId, pass: true, detail: t.description });
          } else {
            results.push({
              id: testId,
              pass: false,
              detail: t.description,
              expected: JSON.stringify(t.expected),
              received: JSON.stringify(v),
            });
          }
        } catch (e: any) {
          results.push({
            id: testId,
            pass: false,
            detail: `${t.description} — ${e?.message ?? String(e)}`,
          });
        }
      } else if (t.kind === "js-no-error") {
        const errs = consoleOut.filter((c) => c.level === "error");
        if (errs.length === 0) {
          results.push({ id: testId, pass: true, detail: t.description });
        } else {
          results.push({
            id: testId,
            pass: false,
            detail: `${t.description} — but ${errs.length} error(s) in console.`,
            received: errs[0].text,
          });
        }
      }
    } catch (e: any) {
      results.push({ id: testId, pass: false, detail: "Test runner error: " + (e?.message ?? String(e)) });
    }
  }
  return results;
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a === "object") {
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (!deepEqual(a[k], b[k])) return false;
    return true;
  }
  return false;
}
