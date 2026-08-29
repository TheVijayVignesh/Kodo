/**
 * Curriculum content types — one source of truth for lectures, sections,
 * exercises, quizzes, sources. Designed so the UI renders from data only.
 */

import type { ReactNode } from "react";

export type LectureId =
  | "m1l01" | "m1l02" | "m1l03" | "m1l04" | "m1l05"
  | "m1l06" | "m1l07" | "m1l08" | "m1l09";

export type Section =
  | { type: "context"; body: string }
  | { type: "objectives"; items: string[] }
  | { type: "prose"; paragraphs: string[]; title?: string }
  | { type: "concept"; title: string; body: string; mentalModel?: string; example?: { code: string; language: "html" | "css" | "js" | "ts" | "tsx" | "text"; caption?: string }; pitfall?: string; diagram?: DiagramKind; walkthrough?: string }
  | { type: "diagram"; kind: DiagramKind; caption?: string }
  | { type: "example"; title: string; code: string; language: "html" | "css" | "js" | "ts" | "tsx" | "text"; walkthrough: string; runnable?: boolean }
  | { type: "mistakes"; title?: string; items: { mistake: string; fix: string }[] }
  | { type: "interactive"; componentKey: string; title?: string; description?: string }
  | { type: "exercise"; exerciseId: string; title?: string; description?: string }
  | { type: "quiz"; quizId: string; title?: string }
  | { type: "summary"; body: string };

export type DiagramKind =
  | "client-server"
  | "browser-pipeline"
  | "dom-tree"
  | "box-model"
  | "cascade"
  | "cascade-detail"
  | "flex-layout"
  | "grid-layout"
  | "event-flow"
  | "ajax-flow"
  | "react-render"
  | "useeffect-lifecycle";

export type QuizQuestion =
  | {
      kind: "mcq";
      id: string;
      prompt: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }
  | {
      kind: "truefalse";
      id: string;
      prompt: string;
      correct: boolean;
      explanation: string;
    }
  | {
      kind: "code-output";
      id: string;
      prompt: string;
      code: string;
      language: "js" | "ts" | "tsx" | "html" | "css";
      expected: string;
      explanation: string;
    }
  | {
      kind: "identify-bug";
      id: string;
      prompt: string;
      code: string;
      language: "js" | "ts" | "tsx" | "html" | "css";
      options: string[];
      correctIndex: number;
      explanation: string;
    };

export type Quiz = {
  id: string;
  title: string;
  questions: QuizQuestion[];
};

export type TestSpec =
  | { kind: "html-contains"; selector: string; min?: number }
  | { kind: "html-equals"; selector: string; value: string }
  | { kind: "html-matches"; selector: string; regex: string }
  | { kind: "css-property"; selector: string; property: string; expected: string }
  | { kind: "js-result"; expression: string; expected: string | number | boolean | null; description: string }
  | { kind: "js-callable"; functionSource: string; arg?: unknown; expected: unknown; description: string }
  | { kind: "js-no-error"; description: string };

export type Exercise = {
  id: string;
  lectureId: LectureId;
  title: string;
  brief: string;
  kind: "html" | "css" | "js" | "dom";
  starter: string;
  tests: TestSpec[];
  hints: string[];
  solution: string;
  solutionExplanation: string;
};

export type Lecture = {
  id: LectureId;
  module: 1 | 2;
  number: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  difficulty: "foundational" | "core" | "applied" | "advanced";
  objectives: string[];
  sections: Section[];
  sources: { label: string; url?: string; type: "course" | "mdn" | "react" | "w3c" | "book" }[];
  prerequisites: LectureId[];
};

export type SourceRef = {
  id: string;
  title: string;
  topic: string;
  type: "course" | "mdn" | "react-docs" | "w3c" | "book" | "other";
  url?: string;
  license?: string;
  dateAccessed?: string;
};
