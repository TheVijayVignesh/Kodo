"use client";

import { useState } from "react";
import { Play, RotateCcw, MousePointer2, Plus, Trash2 } from "lucide-react";
import { runSandbox, type RunResult } from "@/components/playground/sandbox";

/**
 * DOM lab — student writes JavaScript that mutates a live page. The page
 * already contains a few target elements; the script can change them.
 * A small inspector on the right shows the live computed state.
 */
export function DomLab() {
  const [code, setCode] = useState(STARTER);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  async function run() {
    setRunning(true);
    setResult(null);
    const src = `${PAGE_HTML.replace("__SCRIPT__", "")}
<script id="user">${code}<\/script>`;
    const r = await runSandbox(src, [
      { kind: "html-contains", selector: "#heading", min: 1 },
      { kind: "html-contains", selector: "ul#list", min: 1 },
      { kind: "html-contains", selector: "button#add", min: 1 },
    ]);
    setResult(r);
    setRunning(false);
    setLog(r.console.map((c) => `[${c.level}] ${c.text}`));
  }

  return (
    <div className="paper overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
        <div className="border-b lg:border-b-0 lg:border-r border-rule">
          <div className="px-4 py-2 text-eyebrow text-fg-faint bg-[var(--bg-ink)] border-b border-rule">JavaScript you write</div>
          <textarea
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full min-h-[300px] lg:min-h-[400px] bg-[var(--ink-950)] text-[var(--ink-50)] p-4 outline-none font-mono text-[13px] leading-[1.6] resize-y"
          />
          <div className="p-3 border-t border-rule flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={run} disabled={running}>
              <Play size={14} /> {running ? "Running…" : "Run on the page"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setCode(STARTER)}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
        <div>
          <div className="px-4 py-2 text-eyebrow text-fg-faint bg-[var(--bg-ink)] border-b border-rule">Live page</div>
          <iframe
            title="dom-lab-preview"
            sandbox="allow-scripts"
            srcDoc={`${PAGE_HTML}<script>${code}<\/script>`}
            className="w-full bg-white min-h-[300px] lg:min-h-[400px]"
          />
        </div>
      </div>
      <div className="border-t border-rule p-3 bg-[var(--bg-elevated)]">
        <div className="text-eyebrow text-fg-faint mb-1">Console</div>
        <div className="font-mono text-[12px] max-h-32 overflow-auto">
          {log.length === 0 ? (
            <div className="text-fg-faint">No output yet.</div>
          ) : log.map((l, i) => (
            <div key={i} className={l.startsWith("[error") ? "text-[var(--vermilion-300)]" : "text-fg-base"}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PAGE_HTML = `<style>
  body { font: 14px Georgia, serif; background: #faf6ec; color: #1f1a0e; margin: 0; padding: 1.5rem; }
  h1#heading { margin: 0 0 0.5rem 0; color: #a23a2c; }
  ul#list { padding-left: 1.2rem; }
  li { margin: 0.2rem 0; }
  button { font: inherit; padding: 0.35rem 0.8rem; border: 1px solid #c4b48e; background: #f1ead7; border-radius: 6px; cursor: pointer; margin-right: 0.4rem; }
  input { font: inherit; padding: 0.35rem 0.6rem; border: 1px solid #c4b48e; border-radius: 6px; background: #fff; }
</style>
<h1 id="heading">Hello</h1>
<input id="name" placeholder="Your name">
<button id="add">Add greeting</button>
<ul id="list"></ul>
`;

const STARTER = `// Try changing the heading text, adding list items, attaching a click handler.
const heading = document.getElementById('heading');
heading.textContent = 'Welcome to the DOM lab';

const input = document.getElementById('name');
const list = document.getElementById('list');
const button = document.getElementById('add');

button.addEventListener('click', () => {
  const v = input.value.trim();
  if (!v) return;
  const li = document.createElement('li');
  li.textContent = v;
  list.appendChild(li);
  input.value = '';
});

console.log('Heading is now:', heading.textContent);
`;
