"use client";

import { useEffect, useRef, useState } from "react";
import { runSandbox, type RunResult } from "@/components/playground/sandbox";
import { Play, RotateCcw } from "lucide-react";

/**
 * JavaScript playground — a textarea for code, a console for output, and
 * a small live HTML surface so the student can also see DOM changes.
 */
export function JsPlayground({ starter = STARTER }: { starter?: string }) {
  const [code, setCode] = useState(starter);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const lastCode = useRef(code);

  async function run() {
    setRunning(true);
    setResult(null);
    try {
      const r = await runSandbox(code, [{ kind: "js-no-error", description: "Code runs without throwing" }]);
      setResult(r);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="paper overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-rule bg-[var(--bg-elevated)]">
        <div className="text-sm text-fg-strong">JavaScript console</div>
        <div className="flex items-center gap-1.5">
          <button className="btn btn-ghost btn-sm" onClick={() => setCode(starter)}>
            <RotateCcw size={14} /> Reset
          </button>
          <button className="btn btn-primary btn-sm" onClick={run} disabled={running}>
            <Play size={14} /> {running ? "Running…" : "Run"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b lg:border-b-0 lg:border-r border-rule">
          <textarea
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full min-h-[280px] lg:min-h-[400px] bg-[var(--ink-950)] text-[var(--ink-50)] p-4 outline-none font-mono text-[13px] leading-[1.6] resize-y"
          />
        </div>
        <div className="bg-[var(--bg-elevated)]">
          <div className="px-4 py-2 text-eyebrow text-fg-faint bg-[var(--bg-ink)] border-b border-rule">
            Output
          </div>
          <div className="p-4 min-h-[280px] lg:min-h-[400px] font-mono text-[12.5px] space-y-1">
            {!result && <p className="text-fg-faint">Run your code to see output here.</p>}
            {result?.error && (
              <div className="text-[var(--vermilion-300)]">Error: {result.error}</div>
            )}
            {result?.console.length === 0 && result && !result.error && (
              <p className="text-fg-faint">(no console output)</p>
            )}
            {result?.console.map((c, i) => (
              <div
                key={i}
                className={
                  c.level === "error"
                    ? "text-[var(--vermilion-300)]"
                    : c.level === "warn"
                    ? "text-[var(--gold-300)]"
                    : "text-fg-base"
                }
              >
                <span className="text-fg-faint mr-2">›</span>
                {c.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const STARTER = `// Try a few expressions.
const total = 12 + 7;
console.log("Total:", total);

const items = ["tea", "rice", "matcha"];
items.forEach((it, i) => console.log(i + 1, it));
`;
