"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, FileText, Layers, Compass, PenLine, Sparkles, GraduationCap, Library, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { MODULE_1, EXERCISE_COUNT_BY_LECTURE } from "@/lib/curriculum/m1";
import { getModuleProgress, getLectureStatus, lectureProgressPct } from "@/lib/curriculum/progress";
import type { LectureId } from "@/lib/curriculum/types";

const EX_COUNTS = EXERCISE_COUNT_BY_LECTURE;

export function HomeView() {
  const progress = useAppStore((s) => s.progress);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const resetAll = useAppStore((s) => s.resetAll);
  const ids = MODULE_1.lectures.map((l) => l.id) as LectureId[];
  const modulePct = getModuleProgress(progress as any, ids, EX_COUNTS);
  const completedCount = ids.filter((id) => progress[id]?.completed).length;
  const lastVisited = useMemo(() => {
    return ids
      .filter((id) => progress[id]?.lastVisitedAt)
      .sort((a, b) => (progress[b].lastVisitedAt! - progress[a].lastVisitedAt!))[0];
  }, [progress, ids]);
  const recommended = useMemo(() => {
    if (lastVisited) return lastVisited;
    return ids.find((id) => !progress[id]?.completed) ?? ids[0];
  }, [lastVisited, progress, ids]);

  return (
    <div>
      <section className="relative">
        <div className="container-zen pt-20 md:pt-32 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-7">
              <span className="seal text-2xl w-12 h-12" aria-hidden>禅</span>
              <div className="text-eyebrow text-fg-faint">Zen Atlas · CS3005</div>
            </div>
            <h1 className="headline-display">
              A studio for the web
              <span className="block text-fg-faint">as a quiet study</span>
            </h1>
            <p className="body-prose mt-7 text-fg-muted">
              An interactive learning environment for the CS3005 Web Technologies
              curriculum. Nine lessons cover the platform, the languages, the document
              tree, and the network. Every concept has a working example, every
              example has a checker, and your progress is yours to keep.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/modules/1" className="btn btn-primary btn-lg">
                Enter Module 1 <ArrowRight size={16} />
              </Link>
              <Link href="/exam" className="btn btn-ghost btn-lg">
                <FileText size={16} /> Exam Hall
              </Link>
              <Link href="/sources" className="btn btn-ghost btn-lg">
                <Library size={16} /> Sources
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl"
          >
            <Stat label="Lectures" value={String(MODULE_1.lectures.length)} />
            <Stat label="Exercises" value={String(Object.values(EX_COUNTS).reduce((a, b) => a + b, 0))} />
            <Stat label="Completed" value={`${completedCount} / ${MODULE_1.lectures.length}`} />
            <Stat label="Module 1 progress" value={`${modulePct}%`} />
          </motion.div>
        </div>
      </section>

      <section className="container-zen pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          <div className="paper p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-eyebrow text-fg-faint">Continue learning</div>
                <h2 className="headline-lg mt-1">{MODULE_1.lectures.find((l) => l.id === recommended)?.title}</h2>
              </div>
              <Link href={`/modules/1/${recommended}`} className="btn btn-primary">
                Resume <ArrowRight size={14} />
              </Link>
            </div>
            <ProgressBar value={lectureProgressPct(recommended, { [recommended]: progress[recommended] } as any, EX_COUNTS[recommended])} />
            <p className="text-fg-muted mt-3 text-sm leading-relaxed">
              {MODULE_1.lectures.find((l) => l.id === recommended)?.subtitle}
            </p>
          </div>

          <div className="paper p-6 md:p-8">
            <div className="text-eyebrow text-fg-faint mb-2">This week in the studio</div>
            <ul className="space-y-3 text-sm text-fg-base">
              <li className="flex items-start gap-3">
                <Sparkles size={14} className="text-[var(--gold-400)] mt-0.5" />
                Work through HTML and CSS labs. Every concept has a working example.
              </li>
              <li className="flex items-start gap-3">
                <Sparkles size={14} className="text-[var(--gold-400)] mt-0.5" />
                Try the DOM and AJAX labs in Lecture 8 and 9 — they are the most interactive.
              </li>
              <li className="flex items-start gap-3">
                <Sparkles size={14} className="text-[var(--gold-400)] mt-0.5" />
                Attempt the original exam paper in the Exam Hall before you look at solutions.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <PathView />

      <section className="container-zen pb-24">
        <div className="ink-divider" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/modules/1" className="paper p-5 hover:border-[var(--accent)] transition-colors">
            <BookOpen size={20} className="text-[var(--accent)] mb-3" />
            <div className="headline-md text-fg-strong">Module 1</div>
            <p className="text-fg-muted text-sm mt-1 leading-relaxed">Web foundations. The platform, the document tree, the network. Nine lectures.</p>
          </Link>
          <Link href="/exam" className="paper p-5 hover:border-[var(--accent)] transition-colors">
            <FileText size={20} className="text-[var(--accent)] mb-3" />
            <div className="headline-md text-fg-strong">Exam Hall</div>
            <p className="text-fg-muted text-sm mt-1 leading-relaxed">The original 50-mark paper and a generated practice paper, with solutions you can reveal.</p>
          </Link>
          <Link href="/sources" className="paper p-5 hover:border-[var(--accent)] transition-colors">
            <Library size={20} className="text-[var(--accent)] mb-3" />
            <div className="headline-md text-fg-strong">Research sources</div>
            <p className="text-fg-muted text-sm mt-1 leading-relaxed">Course slides, MDN references, and the official React documentation that informed each page.</p>
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-between text-xs text-fg-faint">
          <span>Your progress is stored in this browser only.</span>
          <button
            onClick={() => {
              if (window.confirm("Reset all progress? This cannot be undone.")) resetAll();
            }}
            className="hover:text-[var(--vermilion-500)] transition-colors"
          >
            Reset all progress
          </button>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="paper px-4 py-3">
      <div className="text-eyebrow text-fg-faint">{label}</div>
      <div className="font-display text-2xl text-fg-strong mt-1">{value}</div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-[var(--bg-ink)] overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full bg-[var(--accent)]"
      />
    </div>
  );
}

function PathView() {
  const progress = useAppStore((s) => s.progress);
  return (
    <section className="container-zen py-16">
      <div className="text-eyebrow text-fg-faint mb-2 flex items-center gap-2">
        <Compass size={12} />
        Learning path
      </div>
      <h2 className="headline-xl mb-8">The path through Module 1</h2>
      <PathFlow progress={progress as any} />
    </section>
  );
}

function PathFlow({ progress }: { progress: any }) {
  return (
    <div className="paper p-6 md:p-10 relative overflow-hidden">
      <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
        <defs>
          <linearGradient id="path" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--vermilion-500)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--gold-400)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path
          d="M 40 60 Q 280 60 280 180 T 540 300 T 800 240 T 1060 380"
          fill="none"
          stroke="url(#path)"
          strokeWidth="1.5"
          strokeDasharray="3 6"
        />
      </svg>
      <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
        {MODULE_1.lectures.map((l) => {
          const status = getLectureStatus(l.id, progress);
          return (
            <li key={l.id} className="relative">
              <Link href={`/modules/1/${l.id}`} className="block group">
                <div className="flex items-center gap-3 mb-2">
                  <Node status={status} n={l.number} />
                  <div>
                    <div className="text-eyebrow text-fg-faint">Lecture {String(l.number).padStart(2, "0")}</div>
                    <div className="font-display text-fg-strong group-hover:text-[var(--accent)] transition-colors">
                      {l.title}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-fg-muted leading-relaxed line-clamp-3 pl-12">{l.subtitle}</p>
                <div className="pl-12 mt-2 text-[11px] text-fg-faint flex items-center gap-3">
                  <span>{l.estimatedMinutes} min</span>
                  <span>·</span>
                  <span>{EX_COUNTS[l.id]} exercise{EX_COUNTS[l.id] === 1 ? "" : "s"}</span>
                  <span>·</span>
                  <span className="capitalize">{status.replace("_", " ")}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Node({ status, n }: { status: ReturnType<typeof getLectureStatus>; n: number }) {
  const styles: Record<typeof status, string> = {
    locked: "border-rule text-fg-faint bg-[var(--bg-ink)]",
    available: "border-[var(--accent)] text-fg-base bg-[var(--bg-paper)]",
    in_progress: "border-[var(--gold-400)] text-fg-strong bg-[var(--bg-paper)]",
    completed: "border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-paper)]",
  };
  return (
    <div className={"shrink-0 w-12 h-12 rounded-full grid place-items-center border-2 " + styles[status]}>
      {status === "completed" ? (
        <CheckCircle2 size={18} />
      ) : (
        <span className="font-mono text-sm">{String(n).padStart(2, "0")}</span>
      )}
    </div>
  );
}
