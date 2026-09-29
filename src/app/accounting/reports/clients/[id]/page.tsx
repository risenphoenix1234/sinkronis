"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiBriefcase } from "react-icons/fi";
import EntityHeader from "@/components/EntityHeader";
import InvoiceTable from "@/components/InvoiceTable";
import { getReports, exportReportsCsv, exportReportsPdf } from "@/lib/api/accounting";
import { EntityDetail } from "@/lib/api/types/accounting.types";

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<EntityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getReports()
      .then((res) => {
        if (cancelled) return;
        const invoices = (res.data.invoices ?? []).filter((inv) => inv.clientId === params.id);
        if (invoices.length === 0) {
          setError("No invoices found for this client.");
          setDetail(null);
        } else {
          setDetail({ id: params.id, name: invoices[0].client.name, invoices });
        }
      })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load client"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [params.id]);

  async function handleExport(kind: "csv" | "pdf") {
    try {
      const blob = await (kind === "csv" ? exportReportsCsv() : exportReportsPdf());
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `client-report.${kind}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError(`Failed to export ${kind.toUpperCase()}`);
    }
  }

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link href="/accounting/reports" className="hover:text-slate-600">Reports</Link>
        <span>/</span>
        <Link href="/accounting/reports" className="hover:text-slate-600">Clients</Link>
        <span>/</span>
        <span className="text-slate-600">{detail?.name ?? "Details"}</span>
      </div>

      <Link href="/accounting/reports" className="flex w-fit items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
        <FiArrowLeft size={14} /> Back
      </Link>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
          Couldn&apos;t load this client: {error}
        </div>
      )}

      {loading && <p className="text-center text-sm text-slate-400">Loading client…</p>}

      {detail && !loading && (
        <>
          <EntityHeader detail={detail} icon={<FiBriefcase size={18} />} onDownloadReport={() => handleExport("pdf")} />
          <InvoiceTable
            invoices={detail.invoices}
            linkAgents
            linkProjects
            onDownloadCsv={() => handleExport("csv")}
            onDownloadPdf={() => handleExport("pdf")}
          />
        </>
      )}
    </section>
  );
}