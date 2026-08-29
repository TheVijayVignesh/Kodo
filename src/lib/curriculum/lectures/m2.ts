/**
 * Aggregator for Module 2 (React).
 *
 * Exports the lecture array, plus derived registries for quizzes,
 * the basic HTML/CSS/JS exercises (where used) and React-specific
 * exercises.
 */

import { lecture as m2l01, quizzes as q01, reactExercises as re01 } from "./m2l01";
import { lecture as m2l02, quizzes as q02, reactExercises as re02 } from "./m2l02";
import { lecture as m2l03, quizzes as q03, reactExercises as re03 } from "./m2l03";
import { lecture as m2l04, quizzes as q04, reactExercises as re04 } from "./m2l04";
import { lecture as m2l05, quizzes as q05, reactExercises as re05 } from "./m2l05";
import { lecture as m2l06, quizzes as q06, reactExercises as re06 } from "./m2l06";
import { lecture as m2l07, quizzes as q07, reactExercises as re07 } from "./m2l07";
import { lecture as m2l08, quizzes as q08, reactExercises as re08 } from "./m2l08";
import { lecture as m2l09, quizzes as q09, reactExercises as re09 } from "./m2l09";
import { lecture as m2l10, quizzes as q10, reactExercises as re10 } from "./m2l10";

import type { Lecture, Quiz, ReactExercise, LectureId } from "../types";

const allLectures: Lecture[] = [m2l01, m2l02, m2l03, m2l04, m2l05, m2l06, m2l07, m2l08, m2l09, m2l10];
const allQuizzes: Quiz[] = [...q01, ...q02, ...q03, ...q04, ...q05, ...q06, ...q07, ...q08, ...q09, ...q10];
const allReactExercises: ReactExercise[] = [...re01, ...re02, ...re03, ...re04, ...re05, ...re06, ...re07, ...re08, ...re09, ...re10];

export const M2_LECTURE_BY_ID: Record<string, Lecture> = Object.fromEntries(
  allLectures.map((l) => [l.id, l])
);

export const M2_QUIZ_BY_ID: Record<string, Quiz> = Object.fromEntries(allQuizzes.map((q) => [q.id, q]));

export const M2_REACT_EXERCISE_BY_ID: Record<string, ReactExercise> = Object.fromEntries(
  allReactExercises.map((e) => [e.id, e])
);

export const M2_REACT_EXERCISES_BY_LECTURE: Record<string, ReactExercise[]> = Object.fromEntries(
  allLectures.map((l) => [l.id, allReactExercises.filter((e) => e.lectureId === l.id)])
) as Record<string, ReactExercise[]>;

export const M2_REACT_EXERCISE_COUNT_BY_LECTURE: Record<string, number> = Object.fromEntries(
  allLectures.map((l) => [l.id, M2_REACT_EXERCISES_BY_LECTURE[l.id].length])
) as Record<string, number>;

export const M2_MODULE = {
  id: "m2",
  number: 2,
  title: "React",
  subtitle:
    "Components, props, state, and the modern single-page application. Building interactive UIs with React's declarative model.",
  estimatedMinutes: allLectures.reduce((s, l) => s + l.estimatedMinutes, 0),
  lectures: allLectures,
};
