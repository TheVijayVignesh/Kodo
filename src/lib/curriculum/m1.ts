/**
 * Re-exports of all Module 1 lecture content. Each lecture file exports:
 *   - `lecture`: the full Lecture data
 *   - `quizzes`: array of Quiz
 *   - `exercises`: array of Exercise
 */
import { lecture as m1l01, quizzes as q01, exercises as e01 } from "./lectures/m1l01";
import { lecture as m1l02, quizzes as q02, exercises as e02 } from "./lectures/m1l02";
import { lecture as m1l03, quizzes as q03, exercises as e03 } from "./lectures/m1l03";
import { lecture as m1l04, quizzes as q04, exercises as e04 } from "./lectures/m1l04";
import { lecture as m1l05, quizzes as q05, exercises as e05 } from "./lectures/m1l05";
import { lecture as m1l06, quizzes as q06, exercises as e06 } from "./lectures/m1l06";
import { lecture as m1l07, quizzes as q07, exercises as e07 } from "./lectures/m1l07";
import { lecture as m1l08, quizzes as q08, exercises as e08 } from "./lectures/m1l08";
import { lecture as m1l09, quizzes as q09, exercises as e09 } from "./lectures/m1l09";

import type { Lecture, Quiz, Exercise, LectureId } from "./types";

const allLectures: Lecture[] = [m1l01, m1l02, m1l03, m1l04, m1l05, m1l06, m1l07, m1l08, m1l09];
const allQuizzes: Quiz[] = [...q01, ...q02, ...q03, ...q04, ...q05, ...q06, ...q07, ...q08, ...q09];
const allExercises: Exercise[] = [...e01, ...e02, ...e03, ...e04, ...e05, ...e06, ...e07, ...e08, ...e09];

export const LECTURE_BY_ID: Record<LectureId, Lecture> = Object.fromEntries(
  allLectures.map((l) => [l.id, l])
) as Record<LectureId, Lecture>;

export const QUIZ_BY_ID: Record<string, Quiz> = Object.fromEntries(allQuizzes.map((q) => [q.id, q]));

export const EXERCISE_BY_ID: Record<string, Exercise> = Object.fromEntries(
  allExercises.map((e) => [e.id, e])
);

export const EXERCISES_BY_LECTURE: Record<LectureId, Exercise[]> = Object.fromEntries(
  allLectures.map((l) => [l.id, allExercises.filter((e) => e.lectureId === l.id)])
) as Record<LectureId, Exercise[]>;

export const QUIZZES_BY_LECTURE: Record<LectureId, Quiz[]> = Object.fromEntries(
  allLectures.map((l) => [l.id, allQuizzes.filter((q) => q.id.startsWith(l.id))])
) as Record<LectureId, Quiz[]>;

export const EXERCISE_COUNT_BY_LECTURE: Record<LectureId, number> = Object.fromEntries(
  allLectures.map((l) => [l.id, EXERCISES_BY_LECTURE[l.id].length])
) as Record<LectureId, number>;

export const MODULE_1 = {
  id: "m1",
  number: 1,
  title: "Web Foundations",
  subtitle:
    "The platform, the languages, and the live document that runs in a browser. From the first HTML tag to a network round-trip.",
  estimatedMinutes: allLectures.reduce((sum, l) => sum + l.estimatedMinutes, 0),
  lectures: allLectures,
};
