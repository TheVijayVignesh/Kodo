"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Sparkles, ChevronRight, FileText, Timer, BookOpen, RotateCcw, CheckCircle2, AlertCircle, ArrowRight, GraduationCap } from "lucide-react";
import type { ExamPaper, ExamQuestion } from "@/lib/exam/papers";

export function ExamView({ papers }: { papers: ExamPaper[] }) {
  return (
    <div className="container-zen py-12 md:py-20 space-y-16">
      <header>
        <div className="flex items-center gap-2 text-eyebrow text-fg-faint mb-3">
          <GraduationCap size={12} /> Exam Hall
        </div>
        <h1 className="headline-display">Two papers, three states</h1>
        <p className="body-prose mt-5 text-fg-muted max-w-2xl">
          The original 50-mark mid-semester paper from 2023, and a generated practice paper in the
          same format. Each question has a hidden worked solution. You can attempt the paper under
          exam-like conditions, or open solutions as you read.
        </p>
      </header>

      {papers.map((p) => (
        <PaperBlock key={p.id} paper={p} />
      ))}
    </div>
  );
}

function PaperBlock({ paper }: { paper: ExamPaper }) {
  return (
    <section>
      <div className="paper p-6 md:p-8 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-eyebrow text-fg-faint mb-1">{paper.id === "original-50-2023-odd" ? "Original paper" : "Practice paper"}</div>
            <h2 className="headline-xl">{paper.label}</h2>
            <p className="text-sm text-fg-muted mt-2 leading-relaxed">
              {paper.program} · {paper.course} · Semester {paper.semester} · Regulation 2021
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="tag-pill"><FileText size={12} /> {paper.questions.length} questions</span>
            <span className="tag-pill"><Timer size={12} /> {paper.duration}</span>
            <span className="tag-pill"><BookOpen size={12} /> {paper.totalMarks} marks</span>
          </div>
        </div>
        <div className="mt-4 text-sm text-fg-base border-t border-rule pt-4">
          <span className="text-eyebrow text-fg-faint mr-2">Instructions</span>
          {paper.answerAll ? "Answer all questions. " : ""}Marks are indicated against each question. KL refers to Bloom's Taxonomy levels: KL1 Remembering, KL2 Understanding, KL3 Applying, KL4 Analysing, KL5 Evaluating, KL6 Creating.
        </div>
      </div>

      <ol className="space-y-3">
        {paper.questions.map((q, i) => (
          <QuestionBlock key={`${paper.id}-q${q.n}`} q={q} index={i} paperId={paper.id} />
        ))}
      </ol>
    </section>
  );
}

function QuestionBlock({ q, index, paperId }: { q: ExamQuestion; index: number; paperId: string }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="paper p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full border border-rule grid place-items-center text-sm font-mono text-fg-base">
            {q.n}
          </div>
          <div className="flex-1 min-w-0">
            {q.kind === "or" ? <OrBlock or={q} index={index} paperId={paperId} /> : <SingleQuestion q={q as Exclude<ExamQuestion, { kind: "or" }>} />}
          </div>
        </div>
      </div>
    </motion.li>
  );
}

function SingleQuestion({ q }: { q: Exclude<ExamQuestion, { kind: "or" }> }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-eyebrow text-fg-faint flex-wrap">
        <span>{q.marks} {q.marks === 1 ? "mark" : "marks"}</span>
        <span>·</span>
        <span>{q.co}</span>
        <span>·</span>
        <span>{q.kl}</span>
      </div>
      <PromptText prompt={q.prompt} />
      <SolutionReveal explanation={q.explanation} solution={q.solution} examinerNotes={q.examinerNotes} runnableExample={q.kind === "code" ? q.runnableExample : undefined} />
    </div>
  );
}

function OrBlock({ or, paperId }: { or: Extract<ExamQuestion, { kind: "or" }>; index: number; paperId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-eyebrow text-fg-faint flex-wrap">
        <span>{or.marks} marks total</span>
        <span>·</span>
        <span>Choose one of the following</span>
        <span>·</span>
        <span>{or.co}</span>
        <span>·</span>
        <span>{or.kl}</span>
      </div>
      <ol className="space-y-3">
        {or.parts.map((p, i) => {
          if (p.kind === "or") return null;
          return (
            <li key={i} className="border-l-2 border-[var(--accent)] pl-4">
              <div className="text-eyebrow text-fg-faint mb-1">Option {String.fromCharCode(65 + i)} · {p.marks} marks</div>
              <PromptText prompt={p.prompt} />
              <SolutionReveal
                explanation={p.explanation}
                solution={p.solution}
                examinerNotes={p.examinerNotes}
                runnableExample={p.kind === "code" ? p.runnableExample : undefined}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function PromptText({ prompt }: { prompt: string }) {
  // Render markdown-ish — code fences become <pre>, plain text stays plain.
  // We avoid wrapping in <p> because some prompts contain code blocks.
  const parts = prompt.split(/```/);
  return (
    <div className="text-fg-base leading-relaxed space-y-2">
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <pre key={i} className="my-2 text-[12.5px] !bg-[var(--ink-900)] !text-[var(--ink-50)]">
            <code>{p.replace(/^[a-z]+\n/, "")}</code>
          </pre>
        ) : (
          <p key={i} className="whitespace-pre-line">{p}</p>
        )
      )}
    </div>
  );
}

function SolutionReveal({
  explanation,
  solution,
  examinerNotes,
  runnableExample,
}: {
  explanation: string;
  solution: string;
  examinerNotes: string;
  runnableExample?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-rule pt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn btn-ghost btn-sm"
      >
        {open ? <><EyeOff size={12} /> Hide solution</> : <><Sparkles size={12} /> Reveal solution</>}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-3">
              <Block label="Answer" body={solution} />
              <Block label="Why this is correct" body={explanation} />
              <Block label="Marks-oriented notes" body={examinerNotes} />
              {runnableExample && (
                <Block label="Runnable equivalent (modern syntax)" body={runnableExample} language="js" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Block({ label, body, language }: { label: string; body: string; language?: "js" | "html" | "css" }) {
  // Render code blocks if present in body
  const parts = body.split(/```/);
  return (
    <div>
      <div className="text-eyebrow text-fg-faint mb-1">{label}</div>
      <div className="text-sm text-fg-base leading-relaxed space-y-2">
        {parts.map((p, i) =>
          i % 2 === 1 ? (
            <pre key={i} className="!my-1 text-[12.5px]"><code>{p.replace(/^[a-z]+\n/, "")}</code></pre>
          ) : (
            <p key={i} className="whitespace-pre-line">{p}</p>
          )
        )}
      </div>
    </div>
  );
}
