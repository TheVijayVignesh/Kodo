/**
 * Helpers for running sandboxed code and assertions in the browser.
 *
 * The code editor component embeds the user's HTML/CSS/JS in an <iframe>
 * with `sandbox="allow-scripts"` so the parent application is never reachable.
 *
 * The "checker" is a small test runner that:
 *   - Renders the user's HTML in a sandboxed iframe
 *   - For HTML tests: inspects the parsed DOM inside the iframe
 *   - For CSS tests: reads computed styles from inside the iframe
 *   - For JS tests: runs expressions in a new isolated iframe using a
 *     postMessage handshake (parent asks, sandbox answers with a value).
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

const SANDBOX_HTML = (sourceHTML: string, jsRunnerId: string) => `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style id="__zen_user_style__"></style>
</head>
<body>
${sourceHTML}
<script id="__zen_runner__">
(function(){
  function id(){ return ${JSON.stringify(jsRunnerId)}; }
  window.addEventListener('message', function(ev){
    var data = ev.data;
    if(!data || data.__zenId !== id()) return;
    if(data.type === 'eval'){
      try {
        var result = (0, eval)(data.expression);
        if(result && typeof result.then === 'function'){
          result.then(function(v){ parent.postMessage({__zenId: id(), type:'result', id: data.id, value: v}, '*'); },
                      function(e){ parent.postMessage({__zenId: id(), type:'result', id: data.id, error: String(e)}, '*'); });
        } else {
          parent.postMessage({__zenId: id(), type:'result', id: data.id, value: result}, '*');
        }
      } catch(err){
        parent.postMessage({__zenId: id(), type:'result', id: data.id, error: String(err && err.message || err)}, '*');
      }
    }
  });
  // Capture console
  try {
    var origLog = console.log, origWarn = console.warn, origErr = console.error;
    console.log = function(){ var args = Array.prototype.slice.call(arguments); parent.postMessage({__zenId: id(), type:'console', level:'log', text: args.map(stringify).join(' ')}, '*'); origLog.apply(console, arguments); };
    console.warn = function(){ var args = Array.prototype.slice.call(arguments); parent.postMessage({__zenId: id(), type:'console', level:'warn', text: args.map(stringify).join(' ')}, '*'); origWarn.apply(console, arguments); };
    console.error = function(){ var args = Array.prototype.slice.call(arguments); parent.postMessage({__zenId: id(), type:'console', level:'error', text: args.map(stringify).join(' ')}, '*'); origErr.apply(console, arguments); };
  } catch(e){}
  function stringify(v){
    if(typeof v === 'string') return v;
    try { return JSON.stringify(v); } catch(e){ return String(v); }
  }
  parent.postMessage({__zenId: id(), type:'ready'}, '*');
})();
</script>
</body>
</html>`;

function makeId() {
  return "zen_" + Math.random().toString(36).slice(2);
}

/**
 * Run HTML/CSS/JS source in a sandboxed iframe and evaluate tests.
 * Returns a list of test results plus any console output / errors.
 */
export async function runSandbox(
  sourceHTML: string,
  tests: import("@/lib/curriculum/types").TestSpec[]
): Promise<RunResult> {
  const id = makeId();
  const html = SANDBOX_HTML(sourceHTML, id);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.setAttribute("sandbox", "allow-scripts");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = "1px";
  iframe.style.height = "1px";
  iframe.style.opacity = "0";
  iframe.src = url;
  document.body.appendChild(iframe);

  const consoleOut: { level: "log" | "warn" | "error"; text: string }[] = [];
  let error: string | undefined;

  return new Promise<RunResult>((resolve) => {
    let ready = false;
    const pendingEvals = new Map<string, { resolve: (v: any) => void; reject: (e: any) => void; timer: any }>();
    const timeouts: any[] = [];

    function onMessage(ev: MessageEvent) {
      const d: any = ev.data;
      if (!d || d.__zenId !== id) return;
      if (d.type === "ready") {
        ready = true;
      } else if (d.type === "console") {
        consoleOut.push({ level: d.level, text: d.text });
      } else if (d.type === "result") {
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

    const timeout = setTimeout(() => {
      if (!ready) {
        error = "Sandbox failed to start within 4s.";
        cleanup();
        resolve({ ok: false, tests: [], console: consoleOut, error });
      }
    }, 4000);
    timeouts.push(timeout);

    iframe.addEventListener("load", () => {
      if (!ready) {
        const t = setTimeout(async () => {
          if (!ready) {
            error = "Sandbox did not signal ready.";
            cleanup();
            resolve({ ok: false, tests: [], console: consoleOut, error });
          } else {
            // Wait a tick to let the user script execute
            await new Promise((r) => setTimeout(r, 80));
            try {
              const tests_run = await runTests(iframe, tests, id, pendingEvals, consoleOut);
              cleanup();
              resolve({ ok: tests_run.every((t) => t.pass), tests: tests_run, console: consoleOut });
            } catch (e: any) {
              cleanup();
              resolve({ ok: false, tests: [], console: consoleOut, error: e?.message ?? String(e) });
            }
          }
        }, 600);
        timeouts.push(t);
      }
    });

    function cleanup() {
      window.removeEventListener("message", onMessage);
      timeouts.forEach(clearTimeout);
      pendingEvals.forEach((p) => clearTimeout(p.timer));
      pendingEvals.clear();
      try { URL.revokeObjectURL(url); } catch {}
      try { document.body.removeChild(iframe); } catch {}
    }
  });
}

async function runTests(
  iframe: HTMLIFrameElement,
  tests: import("@/lib/curriculum/types").TestSpec[],
  id: string,
  pending: Map<string, { resolve: (v: any) => void; reject: (e: any) => void; timer: any }>,
  consoleOut: { level: "log" | "warn" | "error"; text: string }[]
): Promise<SandboxTestResult[]> {
  const results: SandboxTestResult[] = [];
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow as any;
  if (!doc || !win) {
    return tests.map((t, i) => ({ id: `t${i}`, pass: false, detail: "Sandbox unreachable" }));
  }

  function evalInSandbox(expr: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const evalId = makeId();
      const timer = setTimeout(() => {
        pending.delete(evalId);
        reject(new Error("Expression timed out"));
      }, 1500);
      pending.set(evalId, { resolve, reject, timer });
      win.postMessage({ __zenId: id, type: "eval", id: evalId, expression: expr }, "*");
    });
  }

  for (let i = 0; i < tests.length; i++) {
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
        // Tests that no top-level error has been logged. We just check the
        // last error console line; this is a soft check.
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
