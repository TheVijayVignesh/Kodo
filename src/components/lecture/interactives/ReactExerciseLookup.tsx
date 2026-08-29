"use client";

import { REACT_EXERCISE_BY_ID } from "@/lib/curriculum/lectures/index";
import { ReactExercise as ReactExerciseRenderer } from "./ReactExercise";

/**
 * Looks up the React exercise data and renders the playground.
 * Mounted as the `ReactExercise` interactive key.
 */
export function ReactExerciseLookup({ exerciseId }: { exerciseId: string }) {
  const ex = REACT_EXERCISE_BY_ID[exerciseId];
  if (!ex) {
    return (
      <div className="paper p-4 text-fg-faint text-sm">
        React exercise <code className="font-mono">{exerciseId}</code> not found.
      </div>
    );
  }
  return <ReactExerciseRenderer exercise={ex} />;
}
