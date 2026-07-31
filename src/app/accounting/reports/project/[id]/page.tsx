// app/reports/project/[id]/page.tsx
import { notFound } from "next/navigation";
import { getEntity } from "@/lib/reports-data";
import EntityReportDetail from "@/components/EntityReportDetail";

export default function ProjectReportPage({ params }: { params: { id: string } }) {
  const detail = getEntity("project", params.id);
  if (!detail) return notFound();
  return <EntityReportDetail detail={detail} />;
}