import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LectureId } from "./curriculum/types";
export type { LectureId } from "./curriculum/types";

export type LectureProgress = {
  visited: boolean;
  completed: boolean;
  quizScore?: number; // percentage 0-100
  exercisesPassed: string[]; // exercise ids
  notes?: string;
  bookmarked?: boolean;
  lastVisitedAt?: number;
};

export type ExamAttempt = {
  id: string;
  startedAt: number;
  submittedAt?: number;
  answers: Record<string, string>; // qN -> answer
  score?: number;
  revealed: boolean;
};

type State = {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;

  progress: Record<LectureId, LectureProgress>;
  setVisited: (id: LectureId) => void;
  setQuizScore: (id: LectureId, score: number) => void;
  markExercisePassed: (id: LectureId, exerciseId: string) => void;
  markComplete: (id: LectureId) => void;
  resetLecture: (id: LectureId) => void;
  resetAll: () => void;

  bookmarks: LectureId[];
  toggleBookmark: (id: LectureId) => void;

  notes: Record<string, string>; // key: lectureId or lectureId:conceptId
  setNote: (key: string, value: string) => void;
  removeNote: (key: string) => void;

  examAttempts: ExamAttempt[];
  recordExamAttempt: (a: ExamAttempt) => void;
  updateExamAttempt: (id: string, patch: Partial<ExamAttempt>) => void;
};

const emptyProgress: LectureProgress = {
  visited: false,
  completed: false,
  exercisesPassed: [],
};

const initialProgress: Record<LectureId, LectureProgress> = {
  m1l01: { ...emptyProgress },
  m1l02: { ...emptyProgress },
  m1l03: { ...emptyProgress },
  m1l04: { ...emptyProgress },
  m1l05: { ...emptyProgress },
  m1l06: { ...emptyProgress },
  m1l07: { ...emptyProgress },
  m1l08: { ...emptyProgress },
  m1l09: { ...emptyProgress },
  m2l01: { ...emptyProgress },
  m2l02: { ...emptyProgress },
  m2l03: { ...emptyProgress },
  m2l04: { ...emptyProgress },
  m2l05: { ...emptyProgress },
  m2l06: { ...emptyProgress },
  m2l07: { ...emptyProgress },
  m2l08: { ...emptyProgress },
  m2l09: { ...emptyProgress },
  m2l10: { ...emptyProgress },
  m3l01: { ...emptyProgress },
  m3l02: { ...emptyProgress },
  m3l03: { ...emptyProgress },
  m3l04: { ...emptyProgress },
  m3l05: { ...emptyProgress },
  m3l06: { ...emptyProgress },
  m3l07: { ...emptyProgress },
  m3l08: { ...emptyProgress },
};

export const useAppStore = create<State>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (t) => {
        if (typeof document !== "undefined") {
          if (t === "light") document.documentElement.classList.add("light");
          else document.documentElement.classList.remove("light");
          document.documentElement.dataset.theme = t;
        }
        set({ theme: t });
      },

      progress: initialProgress,
      setVisited: (id) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [id]: { ...s.progress[id], visited: true, lastVisitedAt: Date.now() },
          },
        })),
      setQuizScore: (id, score) =>
        set((s) => ({
          progress: { ...s.progress, [id]: { ...s.progress[id], quizScore: score } },
        })),
      markExercisePassed: (id, exerciseId) =>
        set((s) => {
          const cur = s.progress[id];
          if (cur.exercisesPassed.includes(exerciseId)) return s;
          return {
            progress: {
              ...s.progress,
              [id]: { ...cur, exercisesPassed: [...cur.exercisesPassed, exerciseId] },
            },
          };
        }),
      markComplete: (id) =>
        set((s) => ({
          progress: { ...s.progress, [id]: { ...s.progress[id], completed: true, lastVisitedAt: Date.now() } },
        })),
      resetLecture: (id) =>
        set((s) => ({ progress: { ...s.progress, [id]: { ...emptyProgress } } })),
      resetAll: () => set({ progress: initialProgress, examAttempts: [], bookmarks: [], notes: {} }),

      bookmarks: [],
      toggleBookmark: (id) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(id)
            ? s.bookmarks.filter((b) => b !== id)
            : [...s.bookmarks, id],
        })),

      notes: {},
      setNote: (key, value) => set((s) => ({ notes: { ...s.notes, [key]: value } })),
      removeNote: (key) =>
        set((s) => {
          const { [key]: _, ...rest } = s.notes;
          return { notes: rest };
        }),

      examAttempts: [],
      recordExamAttempt: (a) => set((s) => ({ examAttempts: [...s.examAttempts, a] })),
      updateExamAttempt: (id, patch) =>
        set((s) => ({
          examAttempts: s.examAttempts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
    }),
    {
      name: "zen-atlas-v1",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage))),
      version: 1,
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<State> | null;
        return {
          ...currentState,
          ...persisted,
          progress: {
            ...currentState.progress,
            ...persisted?.progress,
          },
        };
      },
    }
  )
);
