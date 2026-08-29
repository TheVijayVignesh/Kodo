"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";
import { Play, RotateCcw, Copy, Check, Maximize2, Minimize2, Terminal, CheckCircle2, XCircle } from "lucide-react";
import type { TestSpec } from "@/lib/curriculum/types";

/**
 * React playground for Module 2.
 *
 * The user edits JSX in the editor. react-live transpiles it in-browser
 * (via @babel/standalone) and renders the result in a sandboxed preview
 * pane. We surface console output and run a small set of test specs
 * against the rendered output.
 *
 * Test specs here use a different shape from the M1 HTML/CSS sandbox
 * tests — we can only check the rendered DOM. JSX state/return-value
 * checks would need a separate evaluator (out of scope for M2).
 */

type ReactTestSpec =
  | { kind: "renders-element"; selector: string; min?: number; description: string }
  | { kind: "contains-text"; selector: string; text: string; description: string }
  | { kind: "has-class"; selector: string; className: string; description: string }
  | { kind: "no-error"; description: string };

type ReactTestResult =
  | { id: string; pass: true; detail?: string }
  | { id: string; pass: false; detail: string };

type Props = {
  exerciseId: string;
  title: string;
  brief: string;
  starterCode: string;
  tests: ReactTestSpec[];
  hints: string[];
  solution: string;
  solutionExplanation: string;
  scope?: { [importName: string]: unknown }; // e.g. { useState, useEffect }
};

export function ReactPlayground(props: Props) {
  const [code, setCode] = useState(props.starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState<"idle" | "ok">("idle");
  const [results, setResults] = useState<ReactTestResult[]>([]);
  const [hasError, setHasError] = useState(false);

  const scope = useMemo(() => props.scope ?? {}, [props.scope]);
  const currentCode = showSolution ? props.solution : code;

  function reset() {
    setCode(props.starterCode);
    setShowSolution(false);
    setHintIndex(-1);
    setResults([]);
    setHasError(false);
  }

  async function copy() {
    await navigator.clipboard?.writeText(currentCode);
    setCopied("ok");
    setTimeout(() => setCopied("idle"), 1200);
  }

  return (
    <div className={"paper overflow-hidden " + (fullscreen ? "fixed inset-3 z-40" : "")}>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-rule bg-[var(--bg-elevated)]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-eyebrow text-fg-faint">React exercise</span>
          <span className="text-sm text-fg-strong truncate">{props.title}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="btn btn-ghost btn-sm" onClick={copy}>
            <Copy size={14} />
            <span className="hidden sm:inline">{copied === "ok" ? "Copied" : "Copy"}</span>
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setFullscreen((v) => !v)}
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={reset}>
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            className="btn btn-ink btn-sm"
            onClick={() => setShowSolution((v) => !v)}
          >
            <Check size={14} />
            <span className="hidden sm:inline">{showSolution ? "Hide solution" : "Show solution"}</span>
          </button>
        </div>
      </div>

      <LiveProvider
        code={currentCode}
        scope={scope}
        noInline={false}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="border-b lg:border-b-0 lg:border-r border-rule overflow-hidden">
            <div className="px-4 py-1.5 bg-[var(--bg-ink)] border-b border-rule text-xs text-fg-faint font-mono flex items-center gap-2">
              <span>jsx</span>
            </div>
            <div className="bg-[var(--ink-950)] max-h-[420px] overflow-auto">
              <LiveEditor
                onChange={(v) => {
                  setCode(v);
                  setHasError(false);
                }}
                className="text-[12.5px] font-mono leading-[1.6]"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12.5,
                }}
              />
            </div>
          </div>
          <div className="bg-[var(--bg-elevated)] flex flex-col">
            <div className="px-4 py-1.5 bg-[var(--bg-ink)] border-b border-rule text-xs text-fg-faint font-mono flex items-center gap-2">
              <span>Live preview</span>
            </div>
            <div className="p-5 flex-1 min-h-[220px] flex items-center justify-center bg-white text-slate-900 overflow-auto">
              <div className="w-full">
                <LivePreview />
              </div>
            </div>
          </div>
        </div>
      </LiveProvider>

      <div className="border-t border-rule p-4 space-y-3 bg-[var(--bg-elevated)]">
        <LiveError
          // Surface the error as a console-style block
          // (LiveError only renders when there is one)
        />
        {hasError && (
          <div className="text-sm text-[var(--vermilion-300)] font-mono flex items-start gap-2">
            <XCircle size={14} className="mt-0.5 shrink-0" />
            <span>Your JSX threw an error. Check the syntax and try again.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Hints hints={props.hints} index={hintIndex} onReveal={() => setHintIndex((i) => Math.min(props.hints.length - 1, i + 1))} onReset={() => setHintIndex(-1)} />
          <SolutionCard show={showSolution} solution={props.solution} explanation={props.solutionExplanation} />
          <TestPanel code={currentCode} scope={scope} tests={props.tests} onResults={setResults} hasError={hasError} />
        </div>

        {results.length > 0 && (
          <ul className="space-y-1.5 text-sm font-mono mt-3">
            {results.map((t) => (
              <li
                key={t.id}
                className={
                  "flex items-start gap-2 rounded-md px-2.5 py-1.5 border " +
                  (t.pass
                    ? "border-[color:var(--moss-500)]/30 bg-[color:var(--moss-500)]/10 text-[var(--ink-100)]"
                    : "border-[color:var(--vermilion-700)]/30 bg-[color:var(--vermilion-700)]/15 text-[var(--ink-100)]")
                }
              >
                {t.pass ? (
                  <CheckCircle2 size={14} className="mt-0.5 text-[var(--moss-400)]" />
                ) : (
                  <XCircle size={14} className="mt-0.5 text-[var(--vermilion-300)]" />
                )}
                <div className="flex-1 min-w-0 text-xs">
                  <div>{t.pass ? "Passed" : "Failed"} — {t.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Hints({ hints, index, onReveal, onReset }: { hints: string[]; index: number; onReveal: () => void; onReset: () => void }) {
  return (
    <div className="paper p-3 space-y-2">
      <div className="flex items-center gap-2 text-sm text-fg-strong">
        <span className="text-[var(--gold-400)]">{"\u2728"}</span>
        Hints
      </div>
      {index < 0 ? (
        <p className="text-xs text-fg-faint">Stuck? Reveal a hint one at a time.</p>
      ) : (
        <ol className="space-y-1.5">
          {hints.slice(0, index + 1).map((h, i) => (
            <li key={i} className="text-xs text-fg-base leading-relaxed">
              {i + 1}. {h}
            </li>
          ))}
        </ol>
      )}
      <div className="flex gap-2 pt-1">
        {index < hints.length - 1 ? (
          <button onClick={onReveal} className="btn btn-ghost btn-sm">Reveal next hint</button>
        ) : (
          <span className="text-[11px] text-fg-faint self-center">All hints shown.</span>
        )}
        {index >= 0 && (
          <button onClick={onReset} className="text-[11px] text-fg-faint hover:text-fg-base">Hide</button>
        )}
      </div>
    </div>
  );
}

function SolutionCard({ show, solution, explanation }: { show: boolean; solution: string; explanation: string }) {
  return (
    <div className="paper p-3 space-y-2">
      <div className="flex items-center gap-2 text-sm text-fg-strong">
        <CheckCircle2 size={14} className="text-[var(--moss-400)]" />
        Solution
      </div>
      {!show ? (
        <p className="text-xs text-fg-faint">Try the exercise first. You can always reveal a working solution.</p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-fg-base leading-relaxed">{explanation}</p>
          <pre className="text-[11px] max-h-40 overflow-auto"><code>{solution}</code></pre>
        </div>
      )}
      <p className="text-[11px] text-fg-faint">Click <span className="text-fg-base">Show solution</span> above to load it in the editor.</p>
    </div>
  );
}

/**
 * Test runner for React. Renders the code in an off-screen div, waits
 * a tick for react-live to commit, then runs the assertions. Pushes
 * results back up so the parent can render them in the test list.
 */
function TestPanel({
  code,
  scope,
  tests,
  onResults,
  hasError,
}: {
  code: string;
  scope: { [k: string]: unknown };
  tests: ReactTestSpec[];
  onResults: (r: ReactTestResult[]) => void;
  hasError: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    if (hasError) {
      onResults(
        tests.map((t, i) => ({
          id: `t${i}`,
          pass: false,
          detail: "JSX error — fix it before tests can run.",
        }))
      );
      setBusy(false);
      return;
    }
    // We rely on react-live being mounted in the parent; the LivePreview
    // DOM is what we inspect.
    await new Promise((r) => setTimeout(r, 120));
    const host = ref.current;
    if (!host) {
      onResults([]);
      setBusy(false);
      return;
    }
    const results: ReactTestResult[] = tests.map((t, i) => {
      try {
        if (t.kind === "renders-element") {
          const els = host.querySelectorAll(t.selector);
          const min = t.min ?? 1;
          if (els.length >= min) {
            return { id: `t${i}`, pass: true, detail: `${els.length} \u00d7 ${t.selector} found` };
          }
          return {
            id: `t${i}`,
            pass: false,
            detail: `${t.description} \u2014 expected at least ${min} of \`${t.selector}\`, found ${els.length}.`,
          };
        }
        if (t.kind === "contains-text") {
          const el = host.querySelector(t.selector);
          const text = el ? (el.textContent ?? "").trim() : "";
          if (el && text.includes(t.text)) {
            return { id: `t${i}`, pass: true, detail: `${t.selector} contains "${t.text}"` };
          }
          return {
            id: `t${i}`,
            pass: false,
            detail: `${t.description} \u2014 expected ${t.selector} to contain "${t.text}".`,
          };
        }
        if (t.kind === "has-class") {
          const el = host.querySelector(t.selector);
          if (el && el.classList.contains(t.className)) {
            return { id: `t${i}`, pass: true, detail: `${t.selector} has class "${t.className}"` };
          }
          return {
            id: `t${i}`,
            pass: false,
            detail: `${t.description} \u2014 expected ${t.selector} to have class "${t.className}".`,
          };
        }
        if (t.kind === "no-error") {
          return { id: `t${i}`, pass: true, detail: t.description };
        }
        return { id: `t${i}`, pass: false, detail: "unknown test kind" };
      } catch (e: any) {
        return { id: `t${i}`, pass: false, detail: e?.message ?? String(e) };
      }
    });
    onResults(results);
    setBusy(false);
  }

  return (
    <div className="paper p-3 space-y-2">
      <div className="flex items-center gap-2 text-sm text-fg-strong">
        <span className="text-[var(--ink-200)]">{"\u2713"}</span>
        Tests
      </div>
      <p className="text-xs text-fg-faint">
        The checker inspects the rendered JSX in the preview pane.
      </p>
      <button className="btn btn-primary btn-sm" onClick={run} disabled={busy}>
        <Play size={14} /> {busy ? "Running\u2026" : "Run tests"}
      </button>
      {/* Hidden off-screen mount for the code so we can query it. */}
      <div className="hidden">
        <LiveMount code={code} scope={scope} mountRef={ref} />
      </div>
    </div>
  );
}

function LiveMount({ code, scope, mountRef }: { code: string; scope: { [k: string]: unknown }; mountRef: React.MutableRefObject<HTMLDivElement | null> }) {
  return (
    <LiveProvider code={code} scope={scope} noInline={false}>
      <div ref={mountRef as any}>
        <LivePreview />
      </div>
    </LiveProvider>
  );
}
