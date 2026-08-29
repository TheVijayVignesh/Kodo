import { ExamView } from "@/components/exam/ExamView";
import { PAPERS } from "@/lib/exam/papers";

export const metadata = {
  title: "Exam Hall — Kōdo",
  description: "The original 50-mark paper and a generated practice paper with worked solutions.",
};

export default function Page() {
  return <ExamView papers={PAPERS} />;
}
