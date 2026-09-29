// app/reports/projects/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiFolder } from "react-icons/fi";
import EntityHeader from "@/components/EntityHeader";
import InvoiceTable from "@/components/InvoiceTable";
import { exportCsv, exportPdf, getProjectDetail, naira, sumInvoices } from "@/lib/api/accounting";
import { EntityDetail } from "@/lib/api/types/accounting.types";
export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<EntityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProjectDetail(params.id)
      .then((res) => {
        if (!cancelled) setDetail(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load project");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link href="/accounting/reports" className="hover:text-slate-600">
          Reports
        </Link>
        <span>/</span>
        <Link href="/accounting/reports" className="hover:text-slate-600">
          Projects
        </Link>
        <span>/</span>
        <span className="text-slate-600">{detail?.name ?? "Details"}</span>
      </div>

      <Link
        href="/reports"
        className="flex w-fit items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
      >
        <FiArrowLeft size={14} /> Back
      </Link>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
          Couldn&apos;t load this project: {error}
        </div>
      )}

      {loading && <p className="text-center text-sm text-slate-400">Loading project…</p>}

      {detail && !loading && (
        <>
          <EntityHeader
            detail={detail}
            icon={<FiFolder size={18} />}
            onDownloadReport={() => exportPdf({ projectId: detail.id })}
          />
          <div>
            <p className="mb-3 text-sm text-slate-500">
              {detail.invoices.length} invoices found · Total:{" "}
              <span className="font-medium text-slate-800">{naira(sumInvoices(detail.invoices))}</span>
            </p>
            <InvoiceTable
              invoices={detail.invoices}
              linkClients
              linkAgents
              onDownloadCsv={() => exportCsv({ projectId: detail.id })}
              onDownloadPdf={() => exportPdf({ projectId: detail.id })}
            />
          </div>
        </>
      )}
    </section>
  );
}
