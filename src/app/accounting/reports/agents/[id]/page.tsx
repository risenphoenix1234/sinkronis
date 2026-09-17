// src/app/accounting/reports/agents/[id]/page.tsx

import { notFound } from "next/navigation";
import ReportBreadcrumb from "@/components/reports/ReportBreadcrumb";
import EntityDetailHeader from "@/components/reports/EntityDetailHeader";
import InvoiceReportTable from "@/components/reports/InvoiceReportTable";
import ExportActions from "@/components/reports/ExportActions";
import { getEntityDetail } from "@/lib/reports-data";

type AgentReportPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AgentReportPage({
  params,
}: AgentReportPageProps) {
  const { id } = await params;

  // Swap for a real API call later, e.g. fetch(`/api/agents/${id}/report`)
  const result = await getEntityDetail("agent", id);
  if (!result) notFound();

  const { entity, invoices } = result;

  return (
    <section className="space-y-4 p-6">
      <ReportBreadcrumb
        backHref="/accounting/reports"
        crumbs={[
          { label: "Reports", href: "/accounting/reports" },
          { label: "Agents", href: "/accounting/reports" },
          { label: entity.name },
        ]}
      />

      <EntityDetailHeader entity={entity} />

      <InvoiceReportTable invoices={invoices} showAgent={false} />

      <ExportActions label={`Export ${invoices.length} invoices as:`} />
    </section>
  );
}