"use client";

import { useState } from "react";
import { Plus, Trash2, Edit3, Hash, ArrowRight, FileJson, Eye, EyeOff } from "lucide-react";
import { runSandbox, type RunResult } from "@/components/playground/sandbox";

/**
 * Object lab — student builds and manipulates an object using a tiny
 * form-based UI. Reflects the in-memory state, computed JSON, and the
 * real output of the JS object after every change.
 */
export function ObjectLab() {
  const [state, setState] = useState<{ key: string; value: string }[]>([
    { key: "name", value: "Sora" },
    { key: "year", value: "3" },
    { key: "courses", value: "['Web','AI']" },
  ]);
  const [draftKey, setDraftKey] = useState("");
  const [draftValue, setDraftValue] = useState("");
  const [showKeys, setShowKeys] = useState(true);
  const [run, setRun] = useState<RunResult | null>(null);

  async function refresh() {
    const objLiteral = `{ ${state.map(({ key, value }) => `${JSON.stringify(key)}: ${value}`).join(", ")} }`;
    const src = `<pre id="out"></pre>
<script>
try {
  const obj = ${objLiteral};
  document.getElementById('out').textContent = JSON.stringify(obj, null, 2);
  console.log('keys=', Object.keys(obj));
  console.log('values=', Object.values(obj));
  console.log('entries=', Object.entries(obj));
} catch(e) {
  document.getElementById('out').textContent = 'Error: ' + e.message;
}
<\/script>`;
    const r = await runSandbox(src, [{ kind: "html-contains", selector: "#out", min: 1 }]);
    setRun(r);
  }

  function add() {
    if (!draftKey.trim()) return;
    setState((s) => [...s, { key: draftKey.trim(), value: draftValue }]);
    setDraftKey("");
    setDraftValue("");
  }
  function update(i: number, patch: Partial<{ key: string; value: string }>) {
    setState((s) => s.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }
  function remove(i: number) {
    setState((s) => s.filter((_, idx) => idx !== i));
  }

  return (
    <div className="paper overflow-hidden">
      <div className="px-4 py-2.5 border-b border-rule bg-[var(--bg-elevated)] flex items-center justify-between">
        <div className="text-sm text-fg-strong">Object workbench</div>
        <div className="flex items-center gap-1.5">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowKeys((v) => !v)}
            title="Show/hide keys"
          >
            {showKeys ? <EyeOff size={14} /> : <Eye size={14} />}
            <span className="hidden sm:inline">{showKeys ? "Hide" : "Show"} live JSON</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={refresh}>
            <Hash size={14} /> Compute
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
        <div className="border-b lg:border-b-0 lg:border-r border-rule p-3 space-y-2">
          <div className="text-eyebrow text-fg-faint">Properties</div>
          {state.map((row, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={row.key}
                onChange={(e) => update(i, { key: e.target.value })}
                className="input font-mono !py-1.5 !text-sm flex-1"
                placeholder="key"
              />
              <ArrowRight size={12} className="text-fg-faint" />
              <input
                value={row.value}
                onChange={(e) => update(i, { value: e.target.value })}
                className="input font-mono !py-1.5 !text-sm flex-1"
                placeholder="value (JS expression)"
              />
              <button className="btn btn-ghost btn-sm" onClick={() => remove(i)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <div className="flex gap-2 items-center pt-2 border-t border-rule">
            <input
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              className="input font-mono !py-1.5 !text-sm flex-1"
              placeholder="new key"
            />
            <input
              value={draftValue}
              onChange={(e) => setDraftValue(e.target.value)}
              className="input font-mono !py-1.5 !text-sm flex-1"
              placeholder="new value"
            />
            <button className="btn btn-primary btn-sm" onClick={add}>
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
        <div>
          <div className="px-4 py-2 text-eyebrow text-fg-faint bg-[var(--bg-ink)] border-b border-rule">Live JSON</div>
          <div className="p-3 min-h-[200px] font-mono text-[12.5px]">
            {showKeys ? (
              run?.console.length ? (
                <div>
                  <div className="text-fg-faint text-[11px] mb-1">console.log() output</div>
                  {run.console.map((c, i) => (
                    <div key={i} className="text-fg-base">{c.text}</div>
                  ))}
                </div>
              ) : run?.error ? (
                <div className="text-[var(--vermilion-300)]">Error: {run.error}</div>
              ) : (
                <div className="text-fg-faint">Press Compute to evaluate.</div>
              )
            ) : (
              <div className="text-fg-faint">Hidden.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
