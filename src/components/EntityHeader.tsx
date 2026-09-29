"use client";

import { ReactNode } from "react";
import { FiDownload } from "react-icons/fi";
import { EntityDetail } from "@/lib/api/types/accounting.types";

interface EntityHeaderProps {
  detail: EntityDetail;
  icon: ReactNode;
  onDownloadReport?: () => void;
}

const naira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function EntityHeader({
  detail,
  icon,
  onDownloadReport,
}: EntityHeaderProps) {
  const totalInvoices = detail.invoices.length;

  const revenuePaid = detail.invoices.reduce(
    (sum, invoice) => sum + invoice.paidAmount,
    0
  );

  const outstanding = detail.invoices.reduce(
    (sum, invoice) => sum + invoice.balanceDue,
    0
  );

  const vatCharged = detail.invoices.reduce(
    (sum, invoice) => sum + invoice.vat,
    0
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            {icon}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {detail.name}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Client invoice report
            </p>
          </div>
        </div>

        <div className="flex items-start gap-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-right sm:grid-cols-4">
            <div>
              <p className="text-xs text-slate-400">Total Invoices</p>
              <p className="text-sm font-semibold text-slate-800">
                {totalInvoices}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Revenue Paid</p>
              <p className="text-sm font-semibold text-emerald-600">
                {naira(revenuePaid)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Outstanding</p>
              <p
                className={`text-sm font-semibold ${
                  outstanding > 0
                    ? "text-rose-600"
                    : "text-emerald-600"
                }`}
              >
                {outstanding > 0 ? naira(outstanding) : "NO"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">VAT Charged</p>
              <p className="text-sm font-semibold text-sky-600">
                {naira(vatCharged)}
              </p>
            </div>
          </div>

          <button
            onClick={onDownloadReport}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
          >
            <FiDownload size={14} />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}