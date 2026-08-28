import { ModuleView } from "@/components/module/ModuleView";

export default async function Page({ params }: PageProps<"/modules/[id]">) {
  const { id } = await params;
  const num = Number(id) as 1 | 2;
  return <ModuleView moduleId={num === 2 ? 2 : 1} />;
}
