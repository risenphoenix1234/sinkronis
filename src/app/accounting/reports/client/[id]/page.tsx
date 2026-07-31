// app/reports/client/[id]/page.tsx
import { notFound } from "next/navigation";
import { getEntity } from "@/lib/reports-data";
import EntityReportDetail from "@/components/EntityReportDetail";

export default function ClientReportPage({ params }: { params: { id: string } }) {
  const detail = getEntity("client", params.id);
  if (!detail) return notFound();
  return <EntityReportDetail detail={detail} />;
}