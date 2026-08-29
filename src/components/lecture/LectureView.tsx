"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, ArrowRight, ExternalLink, BookOpen, GraduationCap } from "lucide-react";
import { SectionRenderer } from "@/components/lecture/SectionRenderer";
import { LectureHero } from "@/components/lecture/LectureHero";
import { useAppStore } from "@/lib/store";
import { nextLecture, prevLecture, lectureProgressPct } from "@/lib/curriculum/progress";
import { EXERCISE_COUNT_BY_LECTURE, LECTURE_BY_ID } from "@/lib/curriculum/m1";
import type { Lecture } from "@/lib/curriculum/types";

export function LectureView({ lecture }: { lecture: Lecture }) {
  const setVisited = useAppStore((s) => s.setVisited);
  const markComplete = useAppStore((s) => s.markComplete);
  const resetLecture = useAppStore((s) => s.resetLecture);
  const progress = useAppStore((s) => s.progress[lecture.id]);
  const exCount = EXERCISE_COUNT_BY_LECTURE[lecture.id] ?? 0;
  const passed = progress?.exercisesPassed?.length ?? 0;
  const pct = lectureProgressPct(lecture.id, { [lecture.id]: progress } as any, exCount);
  const next = nextLecture(lecture.id);
  const prev = prevLecture(lecture.id);

  useEffect(() => {
    setVisited(lecture.id);
  }, [lecture.id, setVisited]);

  return (
    <div>
      <LectureHero lecture={lecture} />
      <div className="container-prose">
        <SectionRenderer sections={lecture.sections} lectureId={lecture.id} />
      </div>

      <div className="mt-20">
        <SourcesBlock sources={lecture.sources} />
      </div>

      <div className="mt-12">
        <CompletionBar
          completed={!!progress?.completed}
          pct={pct}
          onComplete={() => markComplete(lecture.id)}
          onReset={() => resetLecture(lecture.id)}
        />
      </div>

      <LectureFooter prev={prev} next={next} />
    </div>
  );
}

function SourcesBlock({ sources }: { sources: Lecture["sources"] }) {
  if (!sources?.length) return null;
  return (
    <section className="container-prose">
      <div className="ink-divider" />
      <div className="text-eyebrow text-fg-faint mb-3 flex items-center gap-2">
        <BookOpen size={12} />
        Sources
      </div>
      <ul className="space-y-1.5">
        {sources.map((s, i) => (
          <li key={i} className="text-sm text-fg-base flex items-baseline gap-2">
            <span className="text-eyebrow text-fg-faint">{s.type}</span>
            <span>{s.label}</span>
            {s.url && (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-faint hover:text-fg-base inline-flex items-center gap-1 text-xs"
              >
                <ExternalLink size={10} /> open
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function CompletionBar({ completed, pct, onComplete, onReset }: { completed: boolean; pct: number; onComplete: () => void; onReset: () => void }) {
  return (
    <section className="container-prose">
      <div className="paper p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-eyebrow text-fg-faint">Lecture completion</div>
          <div className="mt-1 text-fg-base">
            {completed
              ? "You've marked this lecture as complete."
              : pct >= 80
              ? "You've worked through most of this lecture. Mark it complete when you are ready."
              : "Continue working through the lecture, then mark it complete."}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="btn btn-ghost btn-sm">Reset</button>
          <button
            onClick={onComplete}
            disabled={completed}
            className={"btn btn-sm " + (completed ? "btn-ink cursor-default" : "btn-primary")}
          >
            <CheckCircle2 size={14} /> {completed ? "Completed" : "Mark complete"}
          </button>
        </div>
      </div>
    </section>
  );
}

function LectureFooter({ prev, next }: { prev: string | null; next: string | null }) {
  const prevTitle = prev ? LECTURE_BY_ID[prev as keyof typeof LECTURE_BY_ID]?.title : null;
  const nextTitle = next ? LECTURE_BY_ID[next as keyof typeof LECTURE_BY_ID]?.title : null;

  return (
    <section className="container-zen mt-16 mb-12">
      <div className="text-eyebrow text-fg-faint mb-4 flex items-center gap-2">
        <span>Continue the path</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {prev ? (
          <Link
            href={`/modules/1/${prev}`}
            className="paper p-5 md:p-6 flex items-center justify-between gap-4 group transition-colors hover:border-[var(--accent)]"
          >
            <div className="flex items-center gap-4 min-w-0">
              <ArrowLeft size={18} className="text-fg-faint group-hover:text-[var(--accent)] shrink-0" />
              <div className="min-w-0">
                <div className="text-eyebrow text-fg-faint mb-1">Previous</div>
                <div className="font-display text-fg-strong text-base md:text-lg truncate">
                  {prevTitle ?? "Earlier lecture"}
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="paper p-5 md:p-6 opacity-50">
            <div className="text-eyebrow text-fg-faint">Start of Module 1</div>
            <div className="font-display text-fg-base">This is the first lecture.</div>
          </div>
        )}
        {next ? (
          <Link
            href={`/modules/1/${next}`}
            className="paper p-5 md:p-6 flex items-center justify-between gap-4 group transition-colors hover:border-[var(--accent)]"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1 justify-end text-right">
              <div className="min-w-0">
                <div className="text-eyebrow text-fg-faint mb-1">Next</div>
                <div className="font-display text-fg-strong text-base md:text-lg truncate">
                  {nextTitle ?? "Upcoming lecture"}
                </div>
              </div>
              <ArrowRight size={18} className="text-fg-faint group-hover:text-[var(--accent)] shrink-0" />
            </div>
          </Link>
        ) : (
          <div className="paper p-5 md:p-6 flex items-center justify-between gap-3 opacity-60">
            <div>
              <div className="text-eyebrow text-fg-faint">End of Module 1</div>
              <div className="font-display text-fg-base">This is the last lecture.</div>
            </div>
            <GraduationCap size={16} className="text-fg-faint" />
          </div>
        )}
      </div>
    </section>
  );
}
