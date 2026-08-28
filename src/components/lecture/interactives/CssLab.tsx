"use client";

import { useMemo, useState } from "react";
import { CodeBlock } from "../CodeBlock";
import { Play } from "lucide-react";

/**
 * CSS lab — student writes CSS, immediately sees the result. Includes:
 *   - a starter with a card, a row of icons, a button, a flex container
 *   - a property inspector for the selected element
 */
export function CssLab() {
  const [css, setCss] = useState(STARTER_CSS);
  const [selected, setSelected] = useState<string>(".card");

  const doc = useMemo(() => {
    return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
<main class="page">
  <section class="card" data-tag=".card">
    <h2>CSS lab</h2>
    <p>Click any element to inspect it. Edit the CSS on the left.</p>
  </section>
  <ul class="row" data-tag=".row">
    <li>One</li><li>Two</li><li>Three</li>
  </ul>
  <button class="btn" data-tag=".btn">A button</button>
</main>
<script>
document.querySelectorAll('[data-tag]').forEach(function(el){
  el.addEventListener('click', function(e){
    e.preventDefault();
    parent.postMessage({__zenInspect: true, tag: el.getAttribute('data-tag')}, '*');
  });
});
<\/script>
</body></html>`;
  }, [css]);

  return (
    <div className="paper overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
        <div className="border-b lg:border-b-0 lg:border-r border-rule">
          <div className="px-4 py-2 text-eyebrow text-fg-faint bg-[var(--bg-ink)] border-b border-rule">CSS</div>
          <textarea
            spellCheck={false}
            value={css}
            onChange={(e) => setCss(e.target.value)}
            className="w-full min-h-[300px] lg:min-h-[420px] bg-[var(--ink-950)] text-[var(--ink-50)] p-4 outline-none font-mono text-[13px] leading-[1.6] resize-y"
          />
        </div>
        <div>
          <div className="px-4 py-2 text-eyebrow text-fg-faint bg-[var(--bg-ink)] border-b border-rule flex items-center justify-between">
            <span>Preview</span>
            <span className="text-fg-faint">Click an element to select it</span>
          </div>
          <iframe
            title="css-lab-preview"
            sandbox="allow-scripts"
            srcDoc={doc}
            className="w-full bg-white min-h-[300px] lg:min-h-[420px]"
            onLoad={(e) => {
              const iframe = e.currentTarget;
              const handler = (ev: MessageEvent) => {
                if (ev.data && ev.data.__zenInspect && ev.data.tag) setSelected(ev.data.tag);
              };
              window.addEventListener("message", handler);
              return () => window.removeEventListener("message", handler);
            }}
          />
        </div>
      </div>
      <Inspector css={css} selected={selected} />
    </div>
  );
}

const STARTER_CSS = `body { background: #faf6ec; color: #1f1a0e;
        font-family: Georgia, serif; padding: 1.5rem; }

.page { display: flex; flex-direction: column; gap: 1.25rem; max-width: 480px; }

.card {
  background: #fff;
  border: 1px solid #d4c7a4;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 12px 30px -16px rgba(80,60,20,0.25);
}

.row { list-style: none; padding: 0; margin: 0; display: flex; gap: 0.5rem; }
.row li {
  flex: 1; text-align: center;
  background: #f1ead7; padding: 0.6rem 0.8rem;
  border-radius: 10px;
}

.btn {
  background: #c14a3a; color: #fff5e6;
  border: 0; padding: 0.55rem 1.2rem; border-radius: 999px;
  font: inherit; cursor: pointer;
}`;

function Inspector({ css, selected }: { css: string; selected: string }) {
  // Extract the rule for the selected selector
  const rules = useMemo(() => {
    const out: { prop: string; val: string }[] = [];
    const re = new RegExp(`(^|[\\s,}])${escapeRegExp(selected)}\\s*\\{([^}]*)\\}`, "g");
    let m;
    while ((m = re.exec(css))) {
      m[2].split(";").forEach((decl) => {
        const [p, ...rest] = decl.split(":");
        if (!p || rest.length === 0) return;
        out.push({ prop: p.trim(), val: rest.join(":").trim() });
      });
    }
    return out;
  }, [css, selected]);
  return (
    <div className="border-t border-rule p-4 bg-[var(--bg-elevated)]">
      <div className="flex items-center gap-2 text-eyebrow text-fg-faint mb-2">
        <span className="font-mono text-fg-base">{selected}</span>
        <span>· {rules.length} declaration{rules.length === 1 ? "" : "s"}</span>
      </div>
      {rules.length === 0 ? (
        <p className="text-xs text-fg-faint">No matching rule. Add one in the editor.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[12.5px]">
          {rules.map((r, i) => (
            <div key={i} className="flex gap-2 px-2 py-1 rounded bg-[var(--bg-ink)] border border-rule">
              <span className="text-fg-faint">{r.prop}</span>
              <span className="text-fg-faint">:</span>
              <span className="text-fg-base">{r.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
