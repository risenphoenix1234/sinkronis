// src/components/reports/EntityHeader.tsx
"use client";

import { FiDownload } from "react-icons/fi";
import { EntityDetail } from "@/lib/api/types/accounting.types";
import { naira } from "@/lib/api/accounting";

interface EntityHeaderProps {
  detail: EntityDetail;
  icon: React.ReactNode;
  onDownloadReport: () => void;
}

export default function EntityHeader({ detail, icon, onDownloadReport }: EntityHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-600">{icon}</span>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{detail.name}</h1>
          <p className="text-sm text-slate-500">
            {detail.pagination.total} invoices · {naira(detail.summary.totalRevenue)} paid ·{" "}
            {naira(detail.summary.outstanding)} outstanding
          </p>
        </div>
      </div>
      <button
        onClick={onDownloadReport}
        className="flex items-center gap-1.5 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
      >
        <FiDownload size={14} /> Download Report
      </button>
    </div>
  );
}