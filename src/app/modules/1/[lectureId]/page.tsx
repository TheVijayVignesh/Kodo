import { notFound } from "next/navigation";
import { LECTURE_BY_ID } from "@/lib/curriculum/m1";
import { LectureView } from "@/components/lecture/LectureView";

export default async function Page({ params }: PageProps<"/modules/1/[lectureId]">) {
  const { lectureId } = await params;
  const lecture = LECTURE_BY_ID[lectureId as keyof typeof LECTURE_BY_ID];
  if (!lecture) notFound();
  return <LectureView lecture={lecture} />;
}
