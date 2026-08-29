"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";
import { Play, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import type { ReactExercise, ReactTestSpec } from "@/lib/curriculum/types";

/**
 * Renderer for a React exercise. Renders the starter code (or solution
 * when toggled), allows the user to run the test suite, and shows
 * per-test pass/fail output with actionable detail.
 */
export function ReactExercise({ exercise }: { exercise: ReactExercise }) {
  const [code, setCode] = useState(exercise.starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const [results, setResults] = useState<{ id: string; pass: boolean; detail: string }[]>([]);
  const [hasError, setHasError] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  const currentCode = showSolution ? exercise.solution : code;

  // We re-mount the LiveProvider when showSolution toggles so the preview
  // reflects the new code.
  const liveKey = useMemo(
    () => (showSolution ? "sol" : "starter") + ":" + currentCode.length,
    [showSolution, currentCode]
  );

  function reset() {
    setCode(exercise.starterCode);
    setShowSolution(false);
    setResults([]);
    setHasError(false);
  }

  function runTests() {
    if (hasError) {
      setResults(
        exercise.tests.map((t, i) => ({
          id: `t${i}`,
          pass: false,
          detail: "JSX error — fix the syntax first, then re-run.",
        }))
      );
      return;
    }
    const host = hostRef.current;
    if (!host) {
      setResults(exercise.tests.map((_, i) => ({ id: `t${i}`, pass: false, detail: "Preview not ready" })));
      return;
    }
    const out = exercise.tests.map((t, i) => runOne(t, i, host));
    setResults(out);
  }

  return (
    <div className="paper overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-rule bg-[var(--bg-elevated)]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-eyebrow text-fg-faint">React exercise</span>
          <span className="text-sm text-fg-strong truncate">{exercise.title}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="btn btn-ghost btn-sm" onClick={reset}>
            <RotateCcw size={14} /> Reset
          </button>
          <button
            className={"btn btn-sm " + (showSolution ? "btn-ink" : "btn-ghost")}
            onClick={() => setShowSolution((v) => !v)}
          >
            {showSolution ? "Hide solution" : "Show solution"}
          </button>
          <button className="btn btn-primary btn-sm" onClick={runTests}>
            <Play size={14} /> Run tests
          </button>
        </div>
      </div>

      <p className="px-4 pt-3 text-sm text-fg-base leading-relaxed">{exercise.brief}</p>

      <LiveProvider key={liveKey} code={currentCode} noInline={false}>
        <div className="grid grid-cols-1 lg:grid-cols-2 m-4">
          <div className="border border-rule overflow-hidden rounded-md">
            <div className="bg-[var(--ink-950)] max-h-[360px] overflow-auto">
              <LiveEditor
                onChange={(v) => {
                  setCode(v);
                  setHasError(false);
                  setResults([]);
                }}
                disabled={showSolution}
                className="text-[12.5px] font-mono leading-[1.6]"
                style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}
              />
            </div>
          </div>
          <div className="bg-white border border-rule border-l-0 lg:border-l border-t lg:border-t-0 rounded-md overflow-hidden min-h-[260px]">
            <div className="p-4 text-slate-900" ref={hostRef}>
              <LivePreview />
            </div>
            <div className="px-4 pb-3">
              <LiveError
                onError={(_e: Error) => {
                  setHasError(true);
                }}
              />
            </div>
          </div>
        </div>
      </LiveProvider>

      <div className="p-4 space-y-2 border-t border-rule">
        {results.length === 0 ? (
          <p className="text-xs text-fg-faint">Run the tests to see which assertions pass.</p>
        ) : (
          <ul className="space-y-1.5 text-sm font-mono">
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
                <span className="text-xs">{t.pass ? "Passed" : "Failed"} — {t.detail}</span>
              </li>
            ))}
          </ul>
        )}

        {showSolution && (
          <div className="paper p-3 mt-3">
            <div className="text-eyebrow text-fg-faint mb-1">Solution</div>
            <p className="text-sm text-fg-base leading-relaxed mb-2">{exercise.solutionExplanation}</p>
            <pre className="text-[11px] max-h-44 overflow-auto"><code>{exercise.solution}</code></pre>
          </div>
        )}
      </div>
    </div>
  );
}

function runOne(
  t: ReactTestSpec,
  i: number,
  host: HTMLElement
): { id: string; pass: boolean; detail: string } {
  try {
    if (t.kind === "renders-element") {
      const els = host.querySelectorAll(t.selector);
      const min = t.min ?? 1;
      if (els.length >= min) {
        return { id: `t${i}`, pass: true, detail: `${els.length} × ${t.selector} found` };
      }
      return {
        id: `t${i}`,
        pass: false,
        detail: `${t.description} — expected at least ${min} of \`${t.selector}\`, found ${els.length}.`,
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
        detail: `${t.description} — expected ${t.selector} to contain "${t.text}".`,
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
        detail: `${t.description} — expected ${t.selector} to have class "${t.className}".`,
      };
    }
    if (t.kind === "no-error") {
      return { id: `t${i}`, pass: true, detail: t.description };
    }
    return { id: `t${i}`, pass: false, detail: "unknown test kind" };
  } catch (e: any) {
    return { id: `t${i}`, pass: false, detail: e?.message ?? String(e) };
  }
}
