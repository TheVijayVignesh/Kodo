"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Layers, Sparkles } from "lucide-react";
import { MODULE_1, MODULE_2, MODULE_3, EXERCISE_COUNT_BY_LECTURE, REACT_EXERCISE_COUNT_BY_LECTURE } from "@/lib/curriculum/lectures/index";
import { useAppStore } from "@/lib/store";
import { getLectureStatus, getModuleProgress, lectureProgressPct } from "@/lib/curriculum/progress";
import type { LectureId } from "@/lib/curriculum/types";

export function ModuleView({ moduleId }: { moduleId: 1 | 2 | 3 }) {
  if (moduleId === 2) return <Module2View />;
  if (moduleId === 3) return <Module3View />;
  return <Module1View />;
}

function Module1View() {
  const progress = useAppStore((s) => s.progress);
  const ids = MODULE_1.lectures.map((l) => l.id) as LectureId[];
  const exCounts = EXERCISE_COUNT_BY_LECTURE;
  const modulePct = getModuleProgress(progress as any, ids, exCounts);
  const completed = ids.filter((id) => progress[id]?.completed).length;
  const totalMin = MODULE_1.lectures.reduce((s, l) => s + l.estimatedMinutes, 0);

  return (
    <div>
      <section className="container-zen pt-16 md:pt-24 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 text-eyebrow text-fg-faint mb-4">
            <Layers size={12} /> Module 1 · {MODULE_1.lectures.length} lectures
          </div>
          <h1 className="headline-display">{MODULE_1.title}</h1>
          <p className="body-prose mt-5 text-fg-muted">{MODULE_1.subtitle}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            <Tag label={`${totalMin} min total`} />
            <Tag label={`${completed} / ${ids.length} completed`} />
            <Tag label={`${Object.values(exCounts).reduce((a, b) => a + b, 0)} exercises`} />
            <Tag label={`${modulePct}% complete`} />
          </div>
        </motion.div>
      </section>

      <section className="container-zen pb-24">
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MODULE_1.lectures.map((l, i) => {
            const status = getLectureStatus(l.id, progress as any);
            const ex = exCounts[l.id];
            const pct = lectureProgressPct(l.id, { [l.id]: progress[l.id] } as any, ex);
            return (
              <motion.li
                key={l.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/modules/1/${l.id}`}
                  className="paper block p-5 md:p-6 transition-colors hover:border-[var(--accent)]"
                >
                  <div className="flex items-start gap-4">
                    <NodeBig status={status} n={l.number} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-eyebrow text-fg-faint">
                        <span>Lecture {String(l.number).padStart(2, "0")}</span>
                        <span>·</span>
                        <span>{l.estimatedMinutes} min</span>
                        <span>·</span>
                        <span>{ex} exercise{ex === 1 ? "" : "s"}</span>
                      </div>
                      <div className="font-display text-fg-strong text-lg mt-1">{l.title}</div>
                      <p className="text-sm text-fg-muted mt-1 line-clamp-2">{l.subtitle}</p>
                      <div className="mt-3 h-1 rounded-full bg-[var(--bg-ink)] overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-2 text-[11px] text-fg-faint flex items-center gap-3">
                        <span className="capitalize">{status.replace("_", " ")}</span>
                        {pct > 0 && <span>· {pct}%</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

function Module2View() {
  const progress = useAppStore((s) => s.progress);
  const ids = MODULE_2.lectures.map((l) => l.id) as LectureId[];
  const reCounts = REACT_EXERCISE_COUNT_BY_LECTURE as Record<string, number>;
  const totalEx = ids.reduce((s, id) => s + (reCounts[id] ?? 0), 0);
  const completed = ids.filter((id) => progress[id]?.completed).length;
  const totalMin = MODULE_2.lectures.reduce((s, l) => s + l.estimatedMinutes, 0);

  return (
    <div>
      <section className="container-zen pt-16 md:pt-24 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 text-eyebrow text-fg-faint mb-4">
            <Layers size={12} /> Module 2 · {MODULE_2.lectures.length} lectures
          </div>
          <h1 className="headline-display">{MODULE_2.title}</h1>
          <p className="body-prose mt-5 text-fg-muted">{MODULE_2.subtitle}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            <Tag label={`${totalMin} min total`} />
            <Tag label={`${completed} / ${ids.length} completed`} />
            <Tag label={`${totalEx} React exercises`} />
          </div>
        </motion.div>
      </section>

      <section className="container-zen pb-24">
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MODULE_2.lectures.map((l, i) => {
            const status = getLectureStatus(l.id, progress as any);
            const ex = reCounts[l.id] ?? 0;
            const pct = lectureProgressPct(l.id, { [l.id]: progress[l.id] } as any, ex);
            return (
              <motion.li
                key={l.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/modules/1/${l.id}`}
                  className="paper block p-5 md:p-6 transition-colors hover:border-[var(--accent)]"
                >
                  <div className="flex items-start gap-4">
                    <NodeBig status={status} n={l.number} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-eyebrow text-fg-faint">
                        <span>Lecture {String(l.number).padStart(2, "0")}</span>
                        <span>·</span>
                        <span>{l.estimatedMinutes} min</span>
                        <span>·</span>
                        <span>{ex} React exercise{ex === 1 ? "" : "s"}</span>
                      </div>
                      <div className="font-display text-fg-strong text-lg mt-1">{l.title}</div>
                      <p className="text-sm text-fg-muted mt-1 line-clamp-2">{l.subtitle}</p>
                      <div className="mt-3 h-1 rounded-full bg-[var(--bg-ink)] overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-2 text-[11px] text-fg-faint flex items-center gap-3">
                        <span className="capitalize">{status.replace("_", " ")}</span>
                        {pct > 0 && <span>· {pct}%</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

function Module3View() {
  const progress = useAppStore((s) => s.progress);
  const ids = MODULE_3.lectures.map((l) => l.id) as LectureId[];
  const exCounts = EXERCISE_COUNT_BY_LECTURE;
  const totalEx = ids.reduce((sum, id) => sum + exCounts[id], 0);
  const modulePct = getModuleProgress(progress as any, ids, exCounts);
  const completed = ids.filter((id) => progress[id]?.completed).length;
  const totalMin = MODULE_3.lectures.reduce((sum, l) => sum + l.estimatedMinutes, 0);

  return (
    <div>
      <section className="container-zen pt-16 md:pt-24 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 text-eyebrow text-fg-faint mb-4">
            <Layers size={12} /> Module 3 · {MODULE_3.lectures.length} lectures
          </div>
          <h1 className="headline-display">{MODULE_3.title}</h1>
          <p className="body-prose mt-5 text-fg-muted">{MODULE_3.subtitle}</p>

          <div className="mt-7 flex flex-wrap gap-2">
            <Tag label={`${totalMin} min total`} />
            <Tag label={`${completed} / ${ids.length} completed`} />
            <Tag label={`${totalEx} exercises`} />
            <Tag label={`${modulePct}% complete`} />
          </div>
        </motion.div>
      </section>

      <section className="container-zen pb-24">
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MODULE_3.lectures.map((l, i) => {
            const status = getLectureStatus(l.id, progress as any);
            const ex = exCounts[l.id];
            const pct = lectureProgressPct(l.id, { [l.id]: progress[l.id] } as any, ex);
            return (
              <motion.li
                key={l.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/modules/3/${l.id}`}
                  className="paper block p-5 md:p-6 transition-colors hover:border-[var(--accent)]"
                >
                  <div className="flex items-start gap-4">
                    <NodeBig status={status} n={l.number} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-eyebrow text-fg-faint">
                        <span>Lecture {String(l.number).padStart(2, "0")}</span>
                        <span>·</span>
                        <span>{l.estimatedMinutes} min</span>
                        <span>·</span>
                        <span>{ex} exercise{ex === 1 ? "" : "s"}</span>
                      </div>
                      <div className="font-display text-fg-strong text-lg mt-1">{l.title}</div>
                      <p className="text-sm text-fg-muted mt-1 line-clamp-2">{l.subtitle}</p>
                      <div className="mt-3 h-1 rounded-full bg-[var(--bg-ink)] overflow-hidden">
                        <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-2 text-[11px] text-fg-faint flex items-center gap-3">
                        <span className="capitalize">{status.replace("_", " ")}</span>
                        {pct > 0 && <span>· {pct}%</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-rule text-xs text-fg-muted">
      {label}
    </span>
  );
}

function NodeBig({ status, n }: { status: ReturnType<typeof getLectureStatus>; n: number }) {
  const styles: Record<typeof status, string> = {
    available: "border-rule text-fg-faint bg-[var(--bg-ink)]",
    in_progress: "border-[var(--gold-400)] text-fg-strong bg-[var(--bg-paper)]",
    completed: "border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-paper)]",
  };
  return (
    <div className={"shrink-0 w-14 h-14 rounded-full grid place-items-center border-2 " + styles[status]}>
      {status === "completed" ? <CheckCircle2 size={20} /> : <span className="font-mono">{String(n).padStart(2, "0")}</span>}
    </div>
  );
}

function Module2Placeholder() {
  return (
    <section className="container-zen pt-24 pb-24 text-center">
      <div className="max-w-xl mx-auto">
        <div className="seal text-3xl w-16 h-16 mx-auto mb-5" aria-hidden>禅</div>
        <h1 className="headline-display">Module 2 is on the way</h1>
        <p className="body-prose mt-5 mx-auto text-fg-muted">
          The current release covers Module 1 — Web Foundations — in full. Module 2 (React) will be
          built next on the same architecture, with no rework needed for what's already here.
        </p>
        <Link href="/modules/1" className="btn btn-primary mt-8 inline-flex">
          Return to Module 1 <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
