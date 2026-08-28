"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Eye, EyeOff, Lightbulb, CheckCircle2, XCircle, Terminal, Code2, ChevronRight, Copy, Maximize2, Minimize2 } from "lucide-react";
import { runSandbox, type RunResult } from "./sandbox";
import type { Exercise } from "@/lib/curriculum/types";
import { useAppStore } from "@/lib/store";

type Props = {
  exercise: Exercise;
  onPass?: () => void;
};

export function CodePlayground({ exercise, onPass }: Props) {
  const [code, setCode] = useState(exercise.starter);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [hintIndex, setHintIndex] = useState<number>(-1);
  const [showPreview, setShowPreview] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "ok">("idle");

  const markPassed = useAppStore((s) => s.markExercisePassed);

  const passedTests = result ? result.tests.filter((t) => t.pass).length : 0;
  const totalTests = result ? result.tests.length : 0;
  const allPassing = result?.ok ?? false;

  useEffect(() => {
    if (allPassing) {
      markPassed(exercise.lectureId, exercise.id);
      onPass?.();
    }
  }, [allPassing, exercise.id, exercise.lectureId, markPassed, onPass]);

  async function run() {
    setRunning(true);
    setResult(null);
    try {
      const r = await runSandbox(code, exercise.tests);
      setResult(r);
    } catch (e: any) {
      setResult({ ok: false, tests: [], console: [], error: e?.message ?? String(e) });
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    setCode(exercise.starter);
    setResult(null);
    setShowSolution(false);
    setHintIndex(-1);
  }

  function copy() {
    navigator.clipboard?.writeText(showSolution ? exercise.solution : code);
    setCopyState("ok");
    setTimeout(() => setCopyState("idle"), 1200);
  }

  return (
    <div className={"paper overflow-hidden " + (fullscreen ? "fixed inset-3 z-40" : "")}>
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-rule bg-[var(--bg-elevated)]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-eyebrow text-fg-faint">Exercise</span>
          <span className="text-sm text-fg-strong truncate">{exercise.title}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="btn btn-ghost btn-sm" onClick={copy} title="Copy code">
            <Copy size={14} />
            <span className="hidden sm:inline">{copyState === "ok" ? "Copied" : "Copy"}</span>
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setFullscreen((v) => !v)}
            title="Toggle fullscreen"
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={reset} title="Reset to starter">
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={run} disabled={running}>
            <Play size={14} />
            {running ? "Running…" : "Run tests"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="border-b lg:border-b-0 lg:border-r border-rule">
          <Editor value={code} onChange={setCode} language="html" />
        </div>
        <div className="bg-[var(--bg-elevated)] flex flex-col">
          <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-rule">
            <div className="flex items-center gap-2 text-sm text-fg-muted">
              <Eye size={14} />
              <span>Preview</span>
            </div>
            <button
              className="text-xs text-fg-faint hover:text-fg-base flex items-center gap-1"
              onClick={() => setShowPreview((v) => !v)}
            >
              {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
              {showPreview ? "Hide" : "Show"}
            </button>
          </div>
          <div className="flex-1 relative min-h-[260px]">
            {showPreview ? (
              <SandboxPreview source={code} />
            ) : (
              <div className="p-6 text-fg-faint text-sm">Preview hidden.</div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-rule p-4 space-y-3 bg-[var(--bg-elevated)]">
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  {result.ok ? (
                    <CheckCircle2 size={16} className="text-[var(--moss-400)]" />
                  ) : (
                    <XCircle size={16} className="text-[var(--vermilion-500)]" />
                  )}
                  <span className="text-sm text-fg-strong">
                    {result.ok ? "All tests passed" : result.error ? "Could not run" : "Some tests failed"}
                  </span>
                </div>
                {!result.error && (
                  <span className="text-xs text-fg-faint font-mono">
                    {passedTests} / {totalTests}
                  </span>
                )}
              </div>
              <ul className="space-y-1.5 text-sm font-mono">
                {result.tests.map((t) => (
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
                    <div className="flex-1 min-w-0">
                      <div className="text-xs">
                        {t.pass ? "Passed" : "Failed"} — {t.detail}
                      </div>
                      {!t.pass && t.expected && (
                        <div className="mt-0.5 text-[11px] text-fg-faint">
                          Expected: <span className="text-[var(--ink-100)]">{t.expected}</span> · Received:{" "}
                          <span className="text-[var(--vermilion-300)]">{t.received}</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {result.console.length > 0 && (
                <details className="mt-3">
                  <summary className="text-xs text-fg-faint cursor-pointer flex items-center gap-1.5">
                    <Terminal size={12} />
                    Console ({result.console.length})
                  </summary>
                  <pre className="mt-2 text-xs">
                    {result.console.map((c, i) => (
                      <div key={i} className={c.level === "error" ? "text-[var(--vermilion-300)]" : c.level === "warn" ? "text-[var(--gold-300)]" : ""}>
                        [{c.level}] {c.text}
                      </div>
                    ))}
                  </pre>
                </details>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <HintPanel
            hints={exercise.hints}
            index={hintIndex}
            onReveal={() => setHintIndex((i) => Math.min(exercise.hints.length - 1, i + 1))}
            onReset={() => setHintIndex(-1)}
          />
          <SolutionPanel
            show={showSolution}
            onToggle={() => setShowSolution((v) => !v)}
            solution={exercise.solution}
            explanation={exercise.solutionExplanation}
          />
          <ExerciseBrief brief={exercise.brief} />
        </div>
      </div>
    </div>
  );
}

function Editor({ value, onChange, language }: { value: string; onChange: (v: string) => void; language: "html" | "css" | "js" }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-ink)] border-b border-rule text-xs text-fg-faint">
        <Code2 size={12} />
        <span className="font-mono">{language}</span>
      </div>
      <textarea
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[280px] lg:min-h-[420px] bg-[var(--ink-950)] text-[var(--ink-50)] p-4 outline-none font-mono text-[13px] leading-[1.6] resize-y"
        style={{ tabSize: 2 }}
      />
    </div>
  );
}

function SandboxPreview({ source }: { source: string }) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const doc = ref.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(source);
    doc.close();
  }, [source]);
  return (
    <iframe
      ref={ref}
      sandbox="allow-scripts"
      title="Preview"
      className="w-full h-full bg-white min-h-[260px] lg:min-h-[420px]"
    />
  );
}

function HintPanel({ hints, index, onReveal, onReset }: { hints: string[]; index: number; onReveal: () => void; onReset: () => void }) {
  return (
    <div className="paper p-3 space-y-2">
      <div className="flex items-center gap-2 text-sm text-fg-strong">
        <Lightbulb size={14} className="text-[var(--gold-400)]" />
        Hints
      </div>
      {index < 0 ? (
        <p className="text-xs text-fg-faint">Stuck? Reveal a hint one at a time.</p>
      ) : (
        <ol className="space-y-1.5">
          {hints.slice(0, index + 1).map((h, i) => (
            <li key={i} className="flex gap-2 text-xs text-fg-base">
              <ChevronRight size={12} className="mt-0.5 text-[var(--gold-400)]" />
              <span>{h}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="flex gap-2 pt-1">
        {index < hints.length - 1 ? (
          <button className="btn btn-ghost btn-sm" onClick={onReveal}>
            Reveal next hint
          </button>
        ) : (
          <span className="text-[11px] text-fg-faint self-center">All hints shown.</span>
        )}
        {index >= 0 && (
          <button className="text-[11px] text-fg-faint hover:text-fg-base" onClick={onReset}>
            Hide
          </button>
        )}
      </div>
    </div>
  );
}

function SolutionPanel({ show, onToggle, solution, explanation }: { show: boolean; onToggle: () => void; solution: string; explanation: string }) {
  return (
    <div className="paper p-3 space-y-2 md:col-span-1">
      <div className="flex items-center gap-2 text-sm text-fg-strong">
        <CheckCircle2 size={14} className="text-[var(--moss-400)]" />
        Solution
      </div>
      {!show ? (
        <p className="text-xs text-fg-faint">Try the exercise first. You can always reveal a working solution.</p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-fg-base leading-relaxed">{explanation}</p>
          <pre className="text-[11px] max-h-44 overflow-auto">{solution}</pre>
        </div>
      )}
      <button className="btn btn-ghost btn-sm" onClick={onToggle}>
        {show ? "Hide solution" : "Reveal solution"}
      </button>
    </div>
  );
}

function ExerciseBrief({ brief }: { brief: string }) {
  return (
    <div className="paper p-3 space-y-2">
      <div className="text-sm text-fg-strong">Brief</div>
      <p className="text-xs text-fg-base leading-relaxed whitespace-pre-line">{brief}</p>
    </div>
  );
}
