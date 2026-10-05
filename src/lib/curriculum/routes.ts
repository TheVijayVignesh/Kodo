import { LECTURE_BY_ID } from "@/lib/curriculum/lectures/index";
import type { LectureId } from "@/lib/curriculum/types";

export function lectureHref(id: LectureId): string {
  const lecture = LECTURE_BY_ID[id];
  return lecture.module === 3 ? `/modules/3/${id}` : `/modules/1/${id}`;
}
