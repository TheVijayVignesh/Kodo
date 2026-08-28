"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * "Anatomy of a page" — toggle HTML, CSS, JavaScript on/off and watch
 * the same document render three different ways.
 */
export function PageAnatomy() {
  const [showHTML, setShowHTML] = useState(true);
  const [showCSS, setShowCSS] = useState(true);
  const [showJS, setShowJS] = useState(true);
  const [clicked, setClicked] = useState(0);

  const sourceHTML = showHTML
    ? `<button id="ping" class="ping">${showJS ? "Click me" : "I do nothing"}</button>`
    : "";
  const cssBlock = showCSS
    ? `body { background: #faf6ec; color: #1f1a0e; font-family: Georgia, serif; padding: 1.5rem; }
.ping { background: #c14a3a; color: #fff5e6; border: 0; padding: .55rem 1.2rem;
        border-radius: 999px; cursor: pointer; font: inherit; }`
    : "";
  const jsBlock = showJS
    ? `let n = 0;
document.getElementById('ping').addEventListener('click', () => { n++; alert('You clicked ' + n + ' time' + (n>1?'s':'')); });`
    : "";

  const doc = `<!doctype html><html><head><meta charset="utf-8"><style>${cssBlock}</style></head><body>${sourceHTML}<script>${jsBlock}<\/script></body></html>`;

  return (
    <div className="paper overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-rule bg-[var(--bg-elevated)]">
        <div className="text-sm text-fg-strong">Live page</div>
        <div className="flex items-center gap-1.5">
          <ToggleChip on={showHTML} onChange={setShowHTML} color="vermilion" label="HTML" />
          <ToggleChip on={showCSS} onChange={setShowCSS} color="gold" label="CSS" />
          <ToggleChip on={showJS} onChange={setShowJS} color="moss" label="JavaScript" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b md:border-b-0 md:border-r border-rule">
          <div className="px-4 py-2 text-eyebrow text-fg-faint bg-[var(--bg-ink)] border-b border-rule">
            Source the browser receives
          </div>
          <div className="p-4 space-y-3 text-[12.5px] font-mono">
            <Line label="HTML" dim={!showHTML}><code>{"<button id=\"ping\" class=\"ping\">Click me</button>"}</code></Line>
            <Line label="CSS" dim={!showCSS}>
              <pre className="!p-0 !bg-transparent !border-0 !rounded-none text-[12px] m-0">
{`.ping { background: #c14a3a; color: #fff5e6; padding: .55rem 1.2rem;
        border-radius: 999px; cursor: pointer; }`}
              </pre>
            </Line>
            <Line label="JS" dim={!showJS}>
              <pre className="!p-0 !bg-transparent !border-0 !rounded-none text-[12px] m-0">
{`document.getElementById('ping').addEventListener('click', () => {
  alert('You clicked the button');
});`}
              </pre>
            </Line>
          </div>
        </div>
        <div>
          <div className="px-4 py-2 text-eyebrow text-fg-faint bg-[var(--bg-ink)] border-b border-rule">
            What the browser shows
          </div>
          <iframe
            title="page-anatomy-preview"
            sandbox="allow-scripts allow-modals"
            srcDoc={doc}
            className="w-full bg-white min-h-[260px]"
          />
        </div>
      </div>

      <div className="px-4 py-3 border-t border-rule text-xs text-fg-muted">
        Toggle the chips. Without HTML the body is empty. Without CSS the button is still a button, but it is unstyled. Without JavaScript the button does nothing when clicked.
      </div>
    </div>
  );
}

function ToggleChip({ on, onChange, label, color }: { on: boolean; onChange: (v: boolean) => void; label: string; color: "vermilion" | "gold" | "moss" }) {
  const colors: Record<string, string> = {
    vermilion: "border-[var(--vermilion-500)] text-[var(--vermilion-300)] bg-[color:var(--vermilion-700)]/15",
    gold: "border-[var(--gold-400)] text-[var(--gold-300)] bg-[color:var(--gold-400)]/10",
    moss: "border-[var(--moss-400)] text-[var(--moss-400)] bg-[color:var(--moss-500)]/15",
  };
  return (
    <button
      onClick={() => onChange(!on)}
      className={
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition-all " +
        (on ? colors[color] : "border-rule text-fg-faint bg-[var(--bg-ink)]")
      }
    >
      {on ? <Eye size={11} /> : <EyeOff size={11} />}
      {label}
    </button>
  );
}

function Line({ label, dim, children }: { label: string; dim?: boolean; children: React.ReactNode }) {
  return (
    <div className={"flex gap-3 " + (dim ? "opacity-25" : "")}>
      <span className="text-eyebrow text-fg-faint shrink-0 mt-0.5 w-10">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
