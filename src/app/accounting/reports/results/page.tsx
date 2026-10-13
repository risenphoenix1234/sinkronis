// src/app/accounting/reports/results/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiDownload, FiX } from "react-icons/fi";
import InvoiceTable from "@/components/reports/InvoiceTable";
import { REPORT_FILTER_KEYS, exportCsv, exportPdf, filterLabels, getReports, naira } from "@/lib/api/accounting";
import { Invoice, ReportFilters, ReportPagination, ReportSummary } from "@/lib/api/types/accounting.types";

const PAGE_SIZE = 20;

function readFilters(params: URLSearchParams): ReportFilters {
  const filters: ReportFilters = {};
  REPORT_FILTER_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) filters[key] = value;
  });
  return filters;
}

function ReportsResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filtersKey = searchParams.toString();

  const activeFilters = REPORT_FILTER_KEYS.map((key) => [key, searchParams.get(key)] as const).filter(
    (entry): entry is [keyof ReportFilters, string] => Boolean(entry[1])
  );

  const [pageState, setPageState] = useState({ key: filtersKey, page: 1 });
  const page = pageState.key === filtersKey ? pageState.page : 1;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [pagination, setPagination] = useState<ReportPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getReports({ ...readFilters(new URLSearchParams(filtersKey)), page, limit: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setInvoices(res.data.invoices ?? []);
        setSummary(res.data.summary);
        setPagination(res.data.pagination ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load invoices");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filtersKey, page]);

  const clearAll = () => router.push("/accounting/reports/results");

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete(`${key}Label`);
    router.push(`/accounting/reports/results?${params.toString()}`);
  }

  async function handleExport(format: "csv" | "pdf") {
    setExporting(format);
    try {
      const filters = readFilters(new URLSearchParams(filtersKey));
      await (format === "csv" ? exportCsv(filters) : exportPdf(filters));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to export ${format.toUpperCase()}`);
    } finally {
      setExporting(null);
    }
  }

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link href="/accounting/reports" className="hover:text-slate-600">
          Reports
        </Link>
        <span>/</span>
        <span className="text-slate-600">Filtered Results</span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <Link
          href="/accounting/reports"
          className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <FiArrowLeft size={14} /> Back
        </Link>
        <button
          onClick={() => handleExport("pdf")}
          disabled={exporting !== null}
          className="flex items-center gap-2 whitespace-nowrap rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
        >
          <FiDownload size={14} /> {exporting === "pdf" ? "Preparing…" : "Download Report"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
          Couldn&apos;t load invoices: {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/accounting/reports" className="text-sm font-medium text-sky-600 hover:underline">
            Modify Filters
          </Link>
          <span className="text-slate-300">|</span>
          <button onClick={clearAll} className="text-sm text-slate-500 hover:underline">
            Clear all
          </button>
          {activeFilters.length > 0 && (
            <div className="ml-2 flex flex-wrap gap-2">
              {activeFilters.map(([key, value]) => {
                const label = searchParams.get(`${key}Label`) ?? value;
                return (
                  <button
                    key={key}
                    onClick={() => removeFilter(key)}
                    className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200"
                  >
                    {filterLabels[key] ?? key}: {label}
                    <FiX size={11} className="text-slate-400" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <p className="text-sm text-slate-500">
          <span className="font-medium text-slate-800">{pagination?.total ?? 0} invoices found</span>
          {summary && (
            <>
              {" · "}Paid: <span className="font-medium text-slate-800">{naira(summary.totalRevenue)}</span>
              {" · "}Outstanding: <span className="font-medium text-slate-800">{naira(summary.outstanding)}</span>
            </>
          )}
        </p>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-400">Loading invoices…</p>
      ) : (
        <InvoiceTable
          invoices={invoices}
          linkClients
          linkAgents
          linkProjects
          onDownloadCsv={() => handleExport("csv")}
          onDownloadPdf={() => handleExport("pdf")}
          page={page}
          totalPages={pagination?.totalPages ?? 1}
          onPageChange={(next) => setPageState({ key: filtersKey, page: next })}
        />
      )}
    </section>
  );
}

export default function ReportsResultsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading results...</div>}>
      <ReportsResultsContent />
    </Suspense>
  );
}