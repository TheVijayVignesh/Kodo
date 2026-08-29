"use client";

import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, FileCode2, Quote, PenLine } from "lucide-react";
import type { Section } from "@/lib/curriculum/types";
import { CodeBlock } from "./CodeBlock";
import { Diagram } from "./Diagram";
import { InteractiveHost } from "./InteractiveHost";
import { QuizPanel } from "@/components/quiz/QuizPanel";
import { CodePlayground } from "@/components/playground/CodePlayground";
import { useAppStore } from "@/lib/store";
import { QUIZ_BY_ID, EXERCISE_BY_ID } from "@/lib/curriculum/m1";

export function SectionRenderer({ sections, lectureId }: { sections: Section[]; lectureId: string }) {
  return (
    <div className="space-y-12">
      {sections.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionBlock section={s} lectureId={lectureId} />
        </motion.div>
      ))}
    </div>
  );
}

function SectionBlock({ section, lectureId }: { section: Section; lectureId: string }) {
  const setVisited = useAppStore((s) => s.setVisited);
  if (section.type === "context") {
    return (
      <div className="paper p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-3 right-3 kanji text-2xl">序</div>
        <div className="text-eyebrow text-fg-faint mb-3">Opening</div>
        <p className="body-prose !max-w-none text-fg-base leading-relaxed">{section.body}</p>
      </div>
    );
  }
  if (section.type === "objectives") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-eyebrow text-fg-faint">
          <span className="seal" aria-hidden>目</span>
          Learning objectives
        </div>
        <ul className="space-y-2.5">
          {section.items.map((it, i) => (
            <li key={i} className="paper px-4 py-3 flex gap-3 text-fg-base">
              <span className="text-eyebrow text-fg-faint pt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <span className="leading-relaxed">{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (section.type === "prose") {
    return (
      <div>
        {section.title && <h2 className="headline-lg mb-4">{section.title}</h2>}
        <div className="body-prose">
          {section.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    );
  }
  if (section.type === "concept") {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="seal" aria-hidden>理</span>
          <h2 className="headline-lg">{section.title}</h2>
        </div>
        <p className="body-prose">{section.body}</p>
        {section.diagram && <Diagram kind={section.diagram} />}
        {section.mentalModel && (
          <div className="paper p-5 border-l-2 border-l-[var(--accent)]">
            <div className="flex items-center gap-2 text-eyebrow text-fg-faint mb-2">
              <Quote size={12} />
              Mental model
            </div>
            <p className="text-fg-base leading-relaxed">{section.mentalModel}</p>
          </div>
        )}
        {section.example && (
          <div>
            <div className="text-eyebrow text-fg-faint mb-2">Example</div>
            <CodeBlock code={section.example.code} language={section.example.language} caption={section.example.caption} />
            {section.walkthrough && (
              <p className="body-prose text-fg-base mt-3">{section.walkthrough}</p>
            )}
          </div>
        )}
        {section.pitfall && (
          <div className="paper p-5 border-l-2 border-l-[var(--vermilion-500)]">
            <div className="flex items-center gap-2 text-eyebrow text-fg-faint mb-2">
              <AlertTriangle size={12} className="text-[var(--vermilion-500)]" />
              Pitfall
            </div>
            <p className="text-fg-base leading-relaxed">{section.pitfall}</p>
          </div>
        )}
      </div>
    );
  }
  if (section.type === "diagram") {
    return <Diagram kind={section.kind} caption={section.caption} />;
  }
  if (section.type === "example") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-eyebrow text-fg-faint">
          <FileCode2 size={12} />
          {section.title}
        </div>
        <CodeBlock code={section.code} language={section.language} />
        <div className="paper p-5">
          <div className="text-eyebrow text-fg-faint mb-2">Walkthrough</div>
          <p className="text-fg-base leading-relaxed">{section.walkthrough}</p>
        </div>
      </div>
    );
  }
  if (section.type === "mistakes") {
    return (
      <div>
        <div className="flex items-center gap-2 text-eyebrow text-fg-faint mb-3">
          <AlertTriangle size={12} className="text-[var(--vermilion-500)]" />
          {section.title ?? "Common mistakes"}
        </div>
        <ul className="space-y-3">
          {section.items.map((m, i) => (
            <li key={i} className="paper p-4 md:p-5">
              <div className="flex items-baseline gap-3">
                <span className="text-eyebrow text-[var(--vermilion-500)]">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-fg-strong">{m.mistake}</p>
              </div>
              <div className="mt-2 ml-9 text-fg-base text-sm leading-relaxed">
                <span className="text-[var(--moss-400)] font-medium">Fix: </span>
                {m.fix}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (section.type === "interactive") {
    return (
      <div>
        {section.title && (
          <div className="flex items-center gap-2 text-eyebrow text-fg-faint mb-3">
            <span className="seal" aria-hidden>実</span>
            {section.title}
          </div>
        )}
        {section.description && (
          <p className="body-prose mb-4 text-fg-muted">{section.description}</p>
        )}
        <InteractiveHost componentKey={section.componentKey} />
      </div>
    );
  }
  if (section.type === "exercise") {
    const ex = EXERCISE_BY_ID[section.exerciseId];
    if (!ex) {
      return <div className="text-fg-faint text-sm">Exercise {section.exerciseId} not found.</div>;
    }
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-eyebrow text-fg-faint">
          <FileCode2 size={12} />
          Coding exercise
        </div>
        {section.description && <p className="body-prose text-fg-muted">{section.description}</p>}
        <CodePlayground exercise={ex} />
      </div>
    );
  }
  if (section.type === "quiz") {
    const q = QUIZ_BY_ID[section.quizId];
    if (!q) return <div className="text-fg-faint text-sm">Quiz {section.quizId} not found.</div>;
    return (
      <div>
        <QuizPanel quiz={q} lectureId={lectureId} onComplete={() => setVisited(lectureId as any)} />
      </div>
    );
  }
  if (section.type === "summary") {
    return (
      <div className="paper p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-3 right-3 kanji text-2xl">結</div>
        <div className="text-eyebrow text-fg-faint mb-3">Closing</div>
        <p className="body-prose !max-w-none text-fg-base leading-relaxed">{section.body}</p>
      </div>
    );
  }
  return null;
}
