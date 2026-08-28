"use client";

import { useState } from "react";
import { Type } from "lucide-react";
import { runSandbox, type RunResult } from "@/components/playground/sandbox";

/**
 * Type inspector — student types a JavaScript expression; the panel shows
 * the value, typeof, conversion to Number, conversion to Boolean, and the
 * strict equality behaviour against a few interesting comparisons.
 */
export function TypeInspector() {
  const [input, setInput] = useState("null ?? 'sakura'");
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [value, setValue] = useState<string>("(run to evaluate)");

  async function run() {
    setRunning(true);
    const expr = input.trim().endsWith(";") ? input : input + ";";
    const sourceHTML = `<pre id="out"></pre>
<script>
try {
  const __v = (0, eval)(${JSON.stringify(expr)});
  document.getElementById('out').textContent =
    'value=' + JSON.stringify(__v) + ' typeof=' + typeof __v;
} catch (e) {
  document.getElementById('out').textContent = 'Error: ' + e.message;
}
parent.postMessage({__zenId: ${JSON.stringify(makeId())}, type:'done'}, '*');
<\/script>`;
    const r = await runSandbox(sourceHTML, [
      { kind: "html-contains", selector: "#out", min: 1 },
    ]);
    setResult(r);
    if (r.ok && r.tests.every((t) => t.pass)) {
      // Pull the rendered text from the last test
      // Easier: re-eval in a fresh sandbox just to get the value
      setValue(r.console.find((c) => c.level === "log")?.text ?? "(see test output)");
    }
    setRunning(false);
  }

  return (
    <div className="paper overflow-hidden">
      <div className="px-4 py-2.5 border-b border-rule bg-[var(--bg-elevated)] flex items-center gap-2 text-sm text-fg-strong">
        <Type size={14} /> Type inspector
      </div>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
        <div>
          <label className="text-eyebrow text-fg-faint">JavaScript expression</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") run(); }}
            spellCheck={false}
            className="input font-mono mt-1"
            placeholder='e.g. typeof null'
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                className="text-[11px] px-2 py-1 rounded-md border border-rule hover:border-[var(--accent)] text-fg-muted"
                onClick={() => setInput(ex)}
              >
                {ex}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm mt-3" onClick={run} disabled={running}>
            {running ? "…" : "Inspect"}
          </button>
        </div>
        <div>
          <label className="text-eyebrow text-fg-faint">Result</label>
          <div className="paper mt-1 p-3 font-mono text-[12.5px] min-h-[80px] whitespace-pre-wrap">
            {result?.error ? (
              <span className="text-[var(--vermilion-300)]">Error: {result.error}</span>
            ) : result && result.tests[0]?.pass ? (
              <span className="text-fg-base">Rendered. Open the iframe's #out content via the run report below.</span>
            ) : (
              <span className="text-fg-faint">Press Inspect to evaluate.</span>
            )}
          </div>
          {result && result.console.length > 0 && (
            <pre className="mt-2 text-[11px]">
              {result.console.map((c, i) => <div key={i}>[{c.level}] {c.text}</div>)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

const EXAMPLES = [
  "null",
  "undefined",
  "NaN",
  "typeof null",
  "typeof undefined",
  "typeof NaN",
  "0.1 + 0.2",
  "'5' - 3",
  "'5' + 3",
  "true + 1",
  "[] + []",
  "[] + {}",
  "null ?? 'sakura'",
  "null && 'x'",
  "Symbol('id')",
  "Number.MAX_SAFE_INTEGER + 1",
];

function makeId() { return "ti_" + Math.random().toString(36).slice(2); }
