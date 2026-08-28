import { MODULE_1, LECTURE_BY_ID, type LectureId } from "@/lib/curriculum/lectures";

export type NodeStatus = "locked" | "available" | "in_progress" | "completed";

export function getLectureStatus(
  id: LectureId,
  progress: Record<string, { visited?: boolean; completed?: boolean }>
): NodeStatus {
  const idx = MODULE_1.lectures.findIndex((l) => l.id === id);
  if (idx < 0) return "available";
  // Module 1 is the only active module; lectures unlock sequentially
  for (let i = 0; i < idx; i++) {
    const prevId = MODULE_1.lectures[i].id;
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
  const idx = MODULE_1.lectures.findIndex((l) => l.id === id);
  if (idx < 0 || idx === MODULE_1.lectures.length - 1) return null;
  return MODULE_1.lectures[idx + 1].id;
}

export function prevLecture(id: LectureId): LectureId | null {
  const idx = MODULE_1.lectures.findIndex((l) => l.id === id);
  if (idx <= 0) return null;
  return MODULE_1.lectures[idx - 1].id;
}

export function getLecture(id: LectureId) {
  return LECTURE_BY_ID[id];
}
