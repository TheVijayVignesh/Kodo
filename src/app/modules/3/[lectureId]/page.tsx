import { notFound } from "next/navigation";
import { LectureView } from "@/components/lecture/LectureView";
import { LECTURE_BY_ID } from "@/lib/curriculum/lectures/index";

export default async function Page({ params }: PageProps<"/modules/3/[lectureId]">) {
  const { lectureId } = await params;
  const lecture = LECTURE_BY_ID[lectureId as keyof typeof LECTURE_BY_ID];
  if (!lecture || lecture.module !== 3) notFound();
  return <LectureView lecture={lecture} />;
}
