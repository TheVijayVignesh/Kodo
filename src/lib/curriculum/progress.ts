import { MODULE_1, MODULE_2, MODULE_3, LECTURE_BY_ID } from "@/lib/curriculum/lectures/index";
import type { LectureId } from "@/lib/curriculum/types";

export type NodeStatus = "locked" | "available" | "in_progress" | "completed";
type CurriculumModule = typeof MODULE_1 | typeof MODULE_2 | typeof MODULE_3;

const modules: CurriculumModule[] = [MODULE_1, MODULE_2, MODULE_3];

/**
 * Resolve which module a lecture belongs to, and its index within that module.
 */
function moduleAndIndex(id: LectureId): { module: CurriculumModule; index: number } | null {
  for (const module of modules) {
    const index = module.lectures.findIndex((l) => l.id === id);
    if (index >= 0) return { module, index };
  }
  return null;
}

export function getLectureStatus(
  id: LectureId,
  progress: Record<string, { visited?: boolean; completed?: boolean }>
): NodeStatus {
  const found = moduleAndIndex(id);
  if (!found) return "available";
  // Lectures unlock sequentially within their own module; later modules
  // remain gated on completion of the previous module's final lecture.
  const { module, index } = found;
  // Gate M2 on M1 completion
  if (module === MODULE_2) {
    const lastM1 = MODULE_1.lectures[MODULE_1.lectures.length - 1];
    if (!progress[lastM1.id]?.completed) return "locked";
  }
  // Gate M3 on M2 completion
  if (module === MODULE_3) {
    const lastM2 = MODULE_2.lectures[MODULE_2.lectures.length - 1];
    if (!progress[lastM2.id]?.completed) return "locked";
  }
  for (let i = 0; i < index; i++) {
    const prevId = module.lectures[i].id;
    if (!progress[prevId]?.visited) return "locked";
  }
  const p = progress[id];
  if (p?.completed) return "completed";
  if (p?.visited) return "in_progress";
  return "available";
}

export function lectureProgressPct(
  id: LectureId,
  progress: Record<string, { visited?: boolean; completed?: boolean; exercisesPassed?: string[] }>,
  exerciseCount: number
): number {
  const p = progress[id];
  if (!p) return 0;
  if (p.completed) return 100;
  const visited = p.visited ? 0.15 : 0;
  const ex = exerciseCount > 0 ? ((p.exercisesPassed?.length ?? 0) / exerciseCount) * 0.85 : 0;
  return Math.min(100, Math.round((visited + ex) * 100));
}

export function getModuleProgress(
  progress: Record<string, { visited?: boolean; completed?: boolean; exercisesPassed?: string[] }>,
  lectureIds: LectureId[],
  exerciseCounts: Record<LectureId, number>
): number {
  let total = 0;
  let earned = 0;
  for (const id of lectureIds) {
    const ex = exerciseCounts[id] ?? 0;
    total += 1 + ex;
    const p = progress[id];
    if (p?.completed) earned += 1 + ex;
    else {
      if (p?.visited) earned += 0.15;
      earned += Math.min(ex, p?.exercisesPassed?.length ?? 0);
    }
  }
  return total === 0 ? 0 : Math.round((earned / total) * 100);
}

export function nextLecture(id: LectureId): LectureId | null {
  const found = moduleAndIndex(id);
  if (!found || found.index === found.module.lectures.length - 1) return null;
  return found.module.lectures[found.index + 1].id;
}

export function prevLecture(id: LectureId): LectureId | null {
  const found = moduleAndIndex(id);
  if (!found || found.index === 0) return null;
  return found.module.lectures[found.index - 1].id;
}

export function getLecture(id: LectureId) {
  return LECTURE_BY_ID[id];
}
