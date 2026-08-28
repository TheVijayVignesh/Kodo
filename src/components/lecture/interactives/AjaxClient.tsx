"use client";

import { useState } from "react";
import { Play, RotateCcw, Wifi, WifiOff, Clock, CheckCircle2, AlertCircle, Server, Globe, Code2 } from "lucide-react";
import { runSandbox, type RunResult } from "@/components/playground/sandbox";

/**
 * AJAX client — student writes fetch() calls against a small, deterministic
 * mock dataset that lives in /api/study-data. Shows loading, success, and
 * error states, and explains the request/response model.
 */
type Item = { id: number; title: string; minutes: number; done: boolean };

const MOCK_DATASET: Item[] = [
  { id: 1, title: "Read HTML lecture", minutes: 30, done: true },
  { id: 2, title: "Build the CSS lab", minutes: 45, done: false },
  { id: 3, title: "Complete the type inspector exercise", minutes: 25, done: false },
  { id: 4, title: "Try a fetch request from the AJAX lab", minutes: 20, done: false },
];

export function AjaxClient() {
  const [code, setCode] = useState(STARTER);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [trace, setTrace] = useState<{ at: number; event: string; detail?: string }[]>([]);

  async function run() {
    setRunning(true);
    setResult(null);
    setTrace([{ at: Date.now(), event: "Request started" }]);
    const t0 = Date.now();
    // Inject a fake fetch into the sandbox that resolves to the mock dataset,
    // so the exercise is fully deterministic and offline.
    const wrapped = `${code}\n;window.__zenLastData = lastData;`;
    const src = `<ul id="list"></ul>
<p id="status">idle</p>
<script>
  const items = ${JSON.stringify(MOCK_DATASET)};
  const lastData = await Promise.resolve(items);
  ${wrapped}
  // Render result
  try {
    const el = document.getElementById('list');
    const data = window.__zenLastData;
    if (Array.isArray(data)) {
      el.innerHTML = data.map(d => '<li>' + d.title + ' (' + d.minutes + ' min)</li>').join('');
    } else {
      el.textContent = 'data is not an array';
    }
  } catch (e) {
    document.getElementById('status').textContent = 'Error: ' + e.message;
  }
<\/script>`;
    const r = await runSandbox(src, [
      { kind: "html-contains", selector: "ul#list li", min: 1 },
    ]);
    setResult(r);
    setTrace((t) => [
      ...t,
      { at: Date.now(), event: "Response received", detail: `${Date.now() - t0}ms · ${MOCK_DATASET.length} items` },
    ]);
    setRunning(false);
  }

  return (
    <div className="paper overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
        <div className="border-b lg:border-b-0 lg:border-r border-rule">
          <div className="px-4 py-2 text-eyebrow text-fg-faint bg-[var(--bg-ink)] border-b border-rule">Your fetch code</div>
          <textarea
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full min-h-[260px] lg:min-h-[360px] bg-[var(--ink-950)] text-[var(--ink-50)] p-4 outline-none font-mono text-[13px] leading-[1.6] resize-y"
          />
          <div className="p-3 border-t border-rule flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={run} disabled={running}>
              <Play size={14} /> {running ? "Fetching…" : "Send request"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setCode(STARTER)}>
              <ResetIcon />
            </button>
          </div>
        </div>
        <div>
          <div className="px-4 py-2 text-eyebrow text-fg-faint bg-[var(--bg-ink)] border-b border-rule flex items-center justify-between">
            <span>Response rendered</span>
            <span className="text-fg-faint">Local mock · 4 items</span>
          </div>
          <iframe
            title="ajax-preview"
            sandbox="allow-scripts"
            srcDoc={`<ul id="list" style="font:14px Georgia,serif;background:#faf6ec;color:#1f1a0e;padding:1rem 1.5rem 1rem 2rem;margin:0;">
              <li>Press <strong>Send request</strong> to fetch the dataset.</li>
            </ul>`}
            className="w-full bg-[#faf6ec] min-h-[200px]"
          />
        </div>
      </div>
      <div className="border-t border-rule p-4 bg-[var(--bg-elevated)] grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
        <div>
          <div className="text-eyebrow text-fg-faint mb-2 flex items-center gap-2">
            <Server size={12} /> Request trace
          </div>
          <ul className="space-y-1.5 text-xs font-mono">
            {trace.map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <Clock size={12} className="text-fg-faint mt-0.5" />
                <span className="text-fg-base">{t.event}</span>
                {t.detail && <span className="text-fg-faint">— {t.detail}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-eyebrow text-fg-faint mb-2 flex items-center gap-2">
            <Code2 size={12} /> Tests
          </div>
          {result ? (
            <ul className="space-y-1 text-xs font-mono">
              {result.tests.map((t) => (
                <li key={t.id} className={"flex items-start gap-2 " + (t.pass ? "text-[var(--moss-400)]" : "text-[var(--vermilion-300)]")}>
                  {t.pass ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  <span>{t.pass ? "Rendered at least one <li>." : t.detail}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-fg-faint">No run yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ResetIcon() {
  return <span className="inline-flex items-center gap-1.5 text-sm"><RotateCcw size={14} /> Reset</span>;
}

const STARTER = `// A minimal "fetch" workflow using the local mock.
// Try:
//   1. Map the data to just titles
//   2. Filter to only items with minutes <= 30
//   3. Throw an error and see how the page reports it
const lastData = await Promise.resolve(items);

const onlyShort = lastData.filter(x => x.minutes <= 30);
console.log('short items:', onlyShort.map(x => x.title));
`;
