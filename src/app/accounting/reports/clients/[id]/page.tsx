// src/app/accounting/reports/clients/[id]/page.tsx

import { notFound } from "next/navigation";
import ReportBreadcrumb from "@/components/reports/ReportBreadcrumb";
import EntityDetailHeader from "@/components/reports/EntityDetailHeader";
import InvoiceReportTable from "@/components/reports/InvoiceReportTable";
import ExportActions from "@/components/reports/ExportActions";
import { getEntityDetail } from "@/lib/reports-data";

type ClientReportPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ClientReportPage({
  params,
}: ClientReportPageProps) {
  const { id } = await params;

  // Swap for a real API call later, e.g. fetch(`/api/clients/${id}/report`)
  const result = await getEntityDetail("client", id);
  if (!result) notFound();

  const { entity, invoices } = result;

  return (
    <section className="space-y-4 p-6">
      <ReportBreadcrumb
        backHref="/accounting/reports"
        crumbs={[
          { label: "Reports", href: "/accounting/reports" },
          { label: "Clients", href: "/accounting/reports" },
          { label: entity.name },
        ]}
      />

      <EntityDetailHeader entity={entity} />

      <InvoiceReportTable invoices={invoices} showClient={false} />

      <ExportActions label={`Export ${invoices.length} invoices as:`} />
    </section>
  );
}