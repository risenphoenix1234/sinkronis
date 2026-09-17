// src/app/accounting/reports/filtered/page.tsx

import ReportBreadcrumb from "@/components/reports/ReportBreadcrumb";
import InvoiceReportTable from "@/components/reports/InvoiceReportTable";
import ExportActions from "@/components/reports/ExportActions";
import { getFilteredInvoices, ReportFilters } from "@/lib/reports-data";

type FilteredResultsPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function FilteredResultsPage({
  searchParams,
}: FilteredResultsPageProps) {
  const params = await searchParams;

  const filters: ReportFilters = {
    client: params.client,
    agent: params.agent,
    itemService: params.itemService,
    project: params.project,
    status: params.status,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
  };

  // Swap this for a real API call later, e.g.
  // const invoices = await fetch(`/api/reports/filtered?${searchParamsString}`)
  const invoices = await getFilteredInvoices(filters);

  const total = invoices.reduce((sum, row) => sum + row.total, 0);

  return (
    <section className="space-y-4 p-6">
      <ReportBreadcrumb
        backHref="/accounting/reports"
        crumbs={[
          { label: "Reports", href: "/accounting/reports" },
          { label: "Filtered Results" },
        ]}
      />

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3">
        <p className="text-sm text-slate-600">
          {invoices.length} invoice{invoices.length !== 1 && "s"} found ·
          Total: ₦{total.toLocaleString()}
        </p>
      </div>

      <InvoiceReportTable invoices={invoices} />

      <ExportActions label={`Export ${invoices.length} invoices as:`} />
    </section>
  );
}