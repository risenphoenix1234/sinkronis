// src/components/reports/EntityReportView.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiBriefcase, FiFolder, FiUser } from "react-icons/fi";
import EntityHeader from "@/components/reports/EntityHeader";
import InvoiceTable from "@/components/reports/InvoiceTable";
import { entityFilters, exportCsv, exportPdf, getEntityReport } from "@/lib/api/accounting";
import { EntityDetail, ReportEntityKind } from "@/lib/api/types/accounting.types";

const PAGE_SIZE = 20;

const CONFIG: Record<
  ReportEntityKind,
  { breadcrumb: string; icon: React.ReactNode; linkClients: boolean; linkAgents: boolean; linkProjects: boolean }
> = {
  client: { breadcrumb: "Clients", icon: <FiBriefcase size={18} />, linkClients: false, linkAgents: true, linkProjects: true },
  agent: { breadcrumb: "Agents", icon: <FiUser size={18} />, linkClients: true, linkAgents: false, linkProjects: true },
  project: { breadcrumb: "Projects", icon: <FiFolder size={18} />, linkClients: true, linkAgents: true, linkProjects: false },
};

export default function EntityReportView({ kind, id }: { kind: ReportEntityKind; id: string }) {
  const config = CONFIG[kind];
  const [detail, setDetail] = useState<EntityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getEntityReport(kind, id, { page, limit: PAGE_SIZE })
      .then((res) => {
        if (!cancelled) setDetail(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load report");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [kind, id, page]);

  async function handleExport(format: "csv" | "pdf") {
    try {
      const filters = entityFilters(kind, id);
      await (format === "csv" ? exportCsv(filters) : exportPdf(filters));
    } catch {
      setError(`Failed to export ${format.toUpperCase()}`);
    }
  }

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link href="/accounting/reports" className="hover:text-slate-600">
          Reports
        </Link>
        <span>/</span>
        <Link href="/accounting/reports" className="hover:text-slate-600">
          {config.breadcrumb}
        </Link>
        <span>/</span>
        <span className="text-slate-600">{detail?.name ?? "Details"}</span>
      </div>

      <Link
        href="/accounting/reports"
        className="flex w-fit items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
      >
        <FiArrowLeft size={14} /> Back
      </Link>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
          Couldn&apos;t load this report: {error}
        </div>
      )}

      {loading && !detail && <p className="text-center text-sm text-slate-400">Loading…</p>}

      {detail && (
        <>
          <EntityHeader detail={detail} icon={config.icon} onDownloadReport={() => handleExport("pdf")} />
          <InvoiceTable
            invoices={detail.invoices}
            linkClients={config.linkClients}
            linkAgents={config.linkAgents}
            linkProjects={config.linkProjects}
            onDownloadCsv={() => handleExport("csv")}
            onDownloadPdf={() => handleExport("pdf")}
            page={page}
            totalPages={detail.pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}