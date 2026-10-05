import { ModuleView } from "@/components/module/ModuleView";
import { notFound } from "next/navigation";

export default async function Page({ params }: PageProps<"/modules/[id]">) {
  const { id } = await params;
  if (id !== "1" && id !== "2" && id !== "3") notFound();
  return <ModuleView moduleId={Number(id) as 1 | 2 | 3} />;
}
