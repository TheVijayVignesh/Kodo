"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import type { Quiz, QuizQuestion } from "@/lib/curriculum/types";
import { useAppStore } from "@/lib/store";

export function QuizPanel({ quiz, lectureId, onComplete }: { quiz: Quiz; lectureId: string; onComplete?: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, number | boolean | string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const setQuizScore = useAppStore((s) => s.setQuizScore);

  const correct = quiz.questions.reduce((acc, q) => {
    const a = answers[q.id];
    if (a === undefined) return acc;
    if (q.kind === "mcq" || q.kind === "identify-bug") return acc + (a === q.correctIndex ? 1 : 0);
    if (q.kind === "truefalse") return acc + (a === q.correct ? 1 : 0);
    if (q.kind === "code-output") return acc + (typeof a === "string" && a.trim() === q.expected.trim() ? 1 : 0);
    return acc;
  }, 0);
  const answered = Object.keys(answers).length;
  const total = quiz.questions.length;
  const allAnswered = answered === total;
  const scorePct = submitted ? Math.round((correct / total) * 100) : 0;

  function select(qid: string, value: number | boolean | string) {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [qid]: value }));
  }
  function submit() {
    setSubmitted(true);
    const pct = Math.round((correct / total) * 100);
    setQuizScore(lectureId as any, pct);
    onComplete?.(pct);
  }
  function reset() {
    setAnswers({});
    setSubmitted(false);
    setShowExplanation({});
  }

  return (
    <div className="paper p-5 md:p-7">
      <div className="flex items-center gap-3 mb-2">
        <span className="seal" aria-hidden>問</span>
        <div>
          <div className="text-eyebrow text-fg-faint">Knowledge check</div>
          <h3 className="headline-md mt-1">{quiz.title}</h3>
        </div>
      </div>
      <div className="mt-2 mb-6 text-xs text-fg-faint">
        {submitted
          ? `${correct} of ${total} correct · ${scorePct}%`
          : `${answered} of ${total} answered`}
      </div>

      <ol className="space-y-5">
        {quiz.questions.map((q, i) => (
          <li key={q.id}>
            <QuizItem
              q={q}
              index={i}
              answer={answers[q.id]}
              submitted={submitted}
              onSelect={(v) => select(q.id, v)}
              showExplanation={!!showExplanation[q.id]}
              onToggleExplanation={() => setShowExplanation((m) => ({ ...m, [q.id]: !m[q.id] }))}
            />
          </li>
        ))}
      </ol>

      <div className="mt-7 flex items-center gap-2 flex-wrap">
        {!submitted ? (
          <button className="btn btn-primary" onClick={submit} disabled={!allAnswered}>
            <Sparkles size={14} /> Submit answers
          </button>
        ) : (
          <button className="btn btn-ghost" onClick={reset}>
            <RotateCcw size={14} /> Try again
          </button>
        )}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-fg-base flex items-center gap-2"
          >
            {scorePct === 100 ? (
              <>
                <CheckCircle2 size={16} className="text-[var(--moss-400)]" />
                All correct. Excellent.
              </>
            ) : scorePct >= 70 ? (
              <>
                <CheckCircle2 size={16} className="text-[var(--gold-400)]" />
                Strong showing. Review the explanations below.
              </>
            ) : (
              <>
                <XCircle size={16} className="text-[var(--vermilion-500)]" />
                Re-read the section, then try again.
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function QuizItem({
  q,
  index,
  answer,
  submitted,
  onSelect,
  showExplanation,
  onToggleExplanation,
}: {
  q: QuizQuestion;
  index: number;
  answer: number | boolean | string | undefined;
  submitted: boolean;
  onSelect: (v: any) => void;
  showExplanation: boolean;
  onToggleExplanation: () => void;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <span className="text-eyebrow text-fg-faint mt-1">{String(index + 1).padStart(2, "0")}</span>
        <div className="flex-1">
          <p className="text-[0.97rem] text-fg-strong leading-relaxed">{q.prompt}</p>

          {q.kind === "mcq" || q.kind === "identify-bug" ? (
            <div className="mt-3 grid gap-2">
              {q.options.map((opt, i) => {
                const selected = answer === i;
                const isCorrect = submitted && i === q.correctIndex;
                const isWrong = submitted && selected && i !== q.correctIndex;
                return (
                  <button
                    key={i}
                    onClick={() => onSelect(i)}
                    disabled={submitted}
                    className={
                      "text-left px-3.5 py-2.5 rounded-xl border transition-colors text-sm " +
                      (isCorrect
                        ? "border-[color:var(--moss-500)] bg-[color:var(--moss-500)]/12 text-fg-strong"
                        : isWrong
                        ? "border-[color:var(--vermilion-700)] bg-[color:var(--vermilion-700)]/15 text-fg-strong"
                        : selected
                        ? "border-[var(--accent)] bg-[color:var(--accent)]/10 text-fg-strong"
                        : "border-rule bg-[var(--bg-elevated)] hover:border-[var(--accent)] text-fg-base")
                    }
                  >
                    <span className="font-mono text-xs text-fg-faint mr-2">{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : null}

          {q.kind === "truefalse" ? (
            <div className="mt-3 flex gap-2">
              {[true, false].map((v) => {
                const selected = answer === v;
                const correct = submitted && v === q.correct;
                const wrong = submitted && selected && v !== q.correct;
                return (
                  <button
                    key={String(v)}
                    onClick={() => onSelect(v)}
                    disabled={submitted}
                    className={
                      "flex-1 px-3.5 py-2.5 rounded-xl border text-sm " +
                      (correct
                        ? "border-[color:var(--moss-500)] bg-[color:var(--moss-500)]/12 text-fg-strong"
                        : wrong
                        ? "border-[color:var(--vermilion-700)] bg-[color:var(--vermilion-700)]/15 text-fg-strong"
                        : selected
                        ? "border-[var(--accent)] bg-[color:var(--accent)]/10 text-fg-strong"
                        : "border-rule bg-[var(--bg-elevated)] hover:border-[var(--accent)] text-fg-base")
                    }
                  >
                    {v ? "True" : "False"}
                  </button>
                );
              })}
            </div>
          ) : null}

          {q.kind === "code-output" ? (
            <div className="mt-3 space-y-2">
              <pre className="text-[12.5px]">{q.code}</pre>
              <input
                type="text"
                placeholder="What does this print?"
                value={(answer as string) ?? ""}
                onChange={(e) => onSelect(e.target.value)}
                disabled={submitted}
                className="input font-mono"
              />
              {submitted && (
                <div className={"text-xs " + (String(answer).trim() === q.expected.trim() ? "text-[var(--moss-400)]" : "text-[var(--vermilion-300)]")}>
                  Expected: <code className="font-mono">{q.expected}</code>
                </div>
              )}
            </div>
          ) : null}

          {submitted && (
            <button
              onClick={onToggleExplanation}
              className="mt-3 text-xs text-fg-faint hover:text-fg-base flex items-center gap-1"
            >
              <ChevronRight size={12} className={"transition-transform " + (showExplanation ? "rotate-90" : "")} />
              {showExplanation ? "Hide" : "Show"} explanation
            </button>
          )}
          <AnimatePresence>
            {submitted && showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 text-sm text-fg-base leading-relaxed border-l-2 border-[var(--accent)] pl-3">
                  {q.explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
