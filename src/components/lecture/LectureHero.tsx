"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Clock, ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import type { Lecture } from "@/lib/curriculum/types";
import { useAppStore } from "@/lib/store";
import { nextLecture, lectureProgressPct } from "@/lib/curriculum/progress";
import { EXERCISE_COUNT_BY_LECTURE } from "@/lib/curriculum/lectures/index";
import { lectureHref } from "@/lib/curriculum/routes";

const KANJI_BY_LECTURE: Record<string, string> = {
  m1l01: "序",
  m1l02: "骨",
  m1l03: "素",
  m1l04: "彩",
  m1l05: "動",
  m1l06: "型",
  m1l07: "象",
  m1l08: "枝",
  m1l09: "往",
};

export function LectureHero({ lecture }: { lecture: Lecture }) {
  const progress = useAppStore((s) => s.progress[lecture.id]);
  const bookmarked = useAppStore((s) => s.bookmarks.includes(lecture.id));
  const toggleBookmark = useAppStore((s) => s.toggleBookmark);
  const exCount = EXERCISE_COUNT_BY_LECTURE[lecture.id] ?? 0;
  const pct = lectureProgressPct(lecture.id, { [lecture.id]: progress } as any, exCount);

  const next = nextLecture(lecture.id);

  return (
    <section className="relative overflow-hidden">
      <div className="container-zen pt-10 md:pt-16 pb-10">
        <div className="flex items-center gap-2 text-eyebrow text-fg-faint mb-6">
          <Link href={`/modules/${lecture.module}`} className="hover:text-fg-base">Module {lecture.module}</Link>
          <span className="text-fg-faint">/</span>
          <span>Lecture {String(lecture.number).padStart(2, "0")}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="seal text-2xl w-12 h-12" aria-hidden>
                  {KANJI_BY_LECTURE[lecture.id] ?? "学"}
                </span>
                <div>
                  <div className="text-eyebrow text-fg-faint">{lecture.difficulty}</div>
                  <h1 className="headline-display mt-1">{lecture.title}</h1>
                </div>
              </div>
              <p className="body-prose text-fg-muted">{lecture.subtitle}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Tag icon={<Clock size={12} />} label={`${lecture.estimatedMinutes} min`} />
                <Tag icon={<CheckCircle2 size={12} />} label={`${pct}% complete`} />
                <Tag label={`${lecture.objectives.length} objectives`} />
                <Tag label={`${exCount} exercise${exCount === 1 ? "" : "s"}`} />
                <button
                  onClick={() => toggleBookmark(lecture.id)}
                  className={
                    "btn btn-sm " +
                    (bookmarked ? "btn-ink" : "btn-ghost")
                  }
                >
                  {bookmarked ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
                  {bookmarked ? "Bookmarked" : "Bookmark"}
                </button>
              </div>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="glass p-5 space-y-4"
          >
            <div>
              <div className="text-eyebrow text-fg-faint mb-2">Progress</div>
              <ProgressBar value={pct} />
            </div>
            <div className="space-y-1.5 text-sm">
              <Bullet checked={!!progress?.visited} label="Read lecture" />
              <Bullet checked={!!progress?.quizScore || (progress?.exercisesPassed?.length ?? 0) > 0} label="Engage with checks" />
              <Bullet checked={!!progress?.completed} label="Mark complete" />
            </div>
            {next && (
              <Link
                href={lectureHref(next)}
                className="btn btn-ghost btn-sm w-full justify-between"
              >
                Next lecture <ArrowRight size={14} />
              </Link>
            )}
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

function Tag({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-rule text-xs text-fg-muted">
      {icon}
      {label}
    </span>
  );
}

function Bullet({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-fg-base">
      <span
        className={
          "w-4 h-4 rounded-full grid place-items-center border " +
          (checked ? "bg-[var(--accent)] border-[var(--accent)]" : "border-rule")
        }
      >
        {checked ? <CheckCircle2 size={10} className="text-white" /> : null}
      </span>
      <span className="text-fg-muted">{label}</span>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-[var(--bg-ink)] overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full bg-[var(--accent)]"
      />
    </div>
  );
}
