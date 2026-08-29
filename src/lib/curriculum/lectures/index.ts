/**
 * Unified curriculum registry.
 *
 * Aggregates Module 1 (Web Foundations) and Module 2 (React) lecture
 * data, quizzes, basic exercises, and React-specific exercises. The
 * shape is stable: every consumer goes through the same exports.
 */

import { lecture as m1l01, quizzes as q01, exercises as e01 } from "./m1l01";
import { lecture as m1l02, quizzes as q02, exercises as e02 } from "./m1l02";
import { lecture as m1l03, quizzes as q03, exercises as e03 } from "./m1l03";
import { lecture as m1l04, quizzes as q04, exercises as e04 } from "./m1l04";
import { lecture as m1l05, quizzes as q05, exercises as e05 } from "./m1l05";
import { lecture as m1l06, quizzes as q06, exercises as e06 } from "./m1l06";
import { lecture as m1l07, quizzes as q07, exercises as e07 } from "./m1l07";
import { lecture as m1l08, quizzes as q08, exercises as e08 } from "./m1l08";
import { lecture as m1l09, quizzes as q09, exercises as e09 } from "./m1l09";

import { lecture as m2l01, quizzes as q10, reactExercises as re01 } from "./m2l01";
import { lecture as m2l02, quizzes as q11, reactExercises as re02 } from "./m2l02";
import { lecture as m2l03, quizzes as q12, reactExercises as re03 } from "./m2l03";
import { lecture as m2l04, quizzes as q13, reactExercises as re04 } from "./m2l04";
import { lecture as m2l05, quizzes as q14, reactExercises as re05 } from "./m2l05";
import { lecture as m2l06, quizzes as q15, reactExercises as re06 } from "./m2l06";
import { lecture as m2l07, quizzes as q16, reactExercises as re07 } from "./m2l07";
import { lecture as m2l08, quizzes as q17, reactExercises as re08 } from "./m2l08";
import { lecture as m2l09, quizzes as q18, reactExercises as re09 } from "./m2l09";
import { lecture as m2l10, quizzes as q19, reactExercises as re10 } from "./m2l10";

import type { Lecture, Quiz, Exercise, ReactExercise, LectureId } from "../types";

const m1Lectures: Lecture[] = [m1l01, m1l02, m1l03, m1l04, m1l05, m1l06, m1l07, m1l08, m1l09];
const m1Quizzes: Quiz[] = [...q01, ...q02, ...q03, ...q04, ...q05, ...q06, ...q07, ...q08, ...q09];
const m1Exercises: Exercise[] = [...e01, ...e02, ...e03, ...e04, ...e05, ...e06, ...e07, ...e08, ...e09];

const m2Lectures: Lecture[] = [m2l01, m2l02, m2l03, m2l04, m2l05, m2l06, m2l07, m2l08, m2l09, m2l10];
const m2Quizzes: Quiz[] = [...q10, ...q11, ...q12, ...q13, ...q14, ...q15, ...q16, ...q17, ...q18, ...q19];
const m2ReactExercises: ReactExercise[] = [...re01, ...re02, ...re03, ...re04, ...re05, ...re06, ...re07, ...re08, ...re09, ...re10];

const allLectures: Lecture[] = [...m1Lectures, ...m2Lectures];
const allQuizzes: Quiz[] = [...m1Quizzes, ...m2Quizzes];

export const LECTURE_BY_ID: Record<LectureId, Lecture> = Object.fromEntries(
  allLectures.map((l) => [l.id as LectureId, l])
) as Record<LectureId, Lecture>;

export const QUIZ_BY_ID: Record<string, Quiz> = Object.fromEntries(allQuizzes.map((q) => [q.id, q]));

export const EXERCISE_BY_ID: Record<string, Exercise> = Object.fromEntries(
  m1Exercises.map((e) => [e.id, e])
);

export const EXERCISES_BY_LECTURE: Record<LectureId, Exercise[]> = Object.fromEntries(
  m1Lectures.map((l) => [l.id as LectureId, m1Exercises.filter((e) => e.lectureId === l.id)])
) as Record<LectureId, Exercise[]>;

export const QUIZZES_BY_LECTURE: Record<LectureId, Quiz[]> = Object.fromEntries(
  allLectures.map((l) => [l.id as LectureId, allQuizzes.filter((q) => q.id.startsWith(l.id))])
) as Record<LectureId, Quiz[]>;

export const EXERCISE_COUNT_BY_LECTURE: Record<LectureId, number> = Object.fromEntries(
  m1Lectures.map((l) => [l.id as LectureId, EXERCISES_BY_LECTURE[l.id].length])
) as Record<LectureId, number>;

export const REACT_EXERCISE_BY_ID: Record<string, ReactExercise> = Object.fromEntries(
  m2ReactExercises.map((e) => [e.id, e])
);

export const REACT_EXERCISES_BY_LECTURE: Record<string, ReactExercise[]> = Object.fromEntries(
  m2Lectures.map((l) => [l.id, m2ReactExercises.filter((e) => e.lectureId === l.id)])
);

export const REACT_EXERCISE_COUNT_BY_LECTURE: Record<string, number> = Object.fromEntries(
  m2Lectures.map((l) => [l.id, REACT_EXERCISES_BY_LECTURE[l.id].length])
);

export const MODULE_1 = {
  id: "m1",
  number: 1,
  title: "Web Foundations",
  subtitle:
    "The platform, the languages, the document tree, and the network. From the first HTML tag to a network round-trip.",
  estimatedMinutes: m1Lectures.reduce((s, l) => s + l.estimatedMinutes, 0),
  lectures: m1Lectures,
};

export const MODULE_2 = {
  id: "m2",
  number: 2,
  title: "React",
  subtitle:
    "Components, props, state, and the modern single-page application. Building interactive UIs with React's declarative model.",
  estimatedMinutes: m2Lectures.reduce((s, l) => s + l.estimatedMinutes, 0),
  lectures: m2Lectures,
};

export const ALL_LECTURES = allLectures;
export const ALL_QUIZZES = allQuizzes;
export const ALL_EXERCISES = m1Exercises;
export const ALL_REACT_EXERCISES = m2ReactExercises;
