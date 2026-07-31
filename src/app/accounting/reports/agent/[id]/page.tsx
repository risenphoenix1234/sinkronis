// app/reports/agent/[id]/page.tsx
import { notFound } from "next/navigation";
import { getEntity } from "@/lib/reports-data";
import EntityReportDetail from "@/components/EntityReportDetail";

export default function AgentReportPage({ params }: { params: { id: string } }) {
  const detail = getEntity("agent", params.id);
  if (!detail) return notFound();
  return <EntityReportDetail detail={detail} />;
}