// app/payroll/payees/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Download } from "lucide-react";
import { naira, PaymentStatus } from "@/types/payroll/payee-data";
import { usePayees } from "@/context/payroll/PayeeContext";
import Documents from "@/components/payroll/payee/Documents";
import DocumentsTable from "@/components/employee/profile/DocumentsTable";

const typeStyles: Record<string, string> = {
  Director: "bg-[#f3e8ff] text-[#9333ea]",
  Vendor: "bg-[#dbeafe] text-[#1d4ed8]",
  "Board Member": "bg-[#fef3c7] text-[#a16207]",
  Contractor: "bg-[#dcfce7] text-[#15803d]",
};

const statusBadgeStyles: Record<string, string> = {
  Active: "bg-[#dcfce7] text-[#15803d]",
  Inactive: "bg-[#f3f4f6] text-[#6b7280]",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  Paid: "bg-[#dcfce7] text-[#15803d]",
  Pending: "bg-[#fef3c7] text-[#a16207]",
  Failed: "bg-[#fee2e2] text-[#dc2626]",
};

const tabs = ["Payment History", "Documents"];

export default function PayeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("Payment History");
  const [editOpen, setEditOpen] = useState(false);
  const { getPayeeById, updatePayee } = usePayees();

  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const payee = getPayeeById(idParam as string);
  if (!payee) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] p-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 flex items-center gap-2 text-sm text-[#667085] transition hover:text-[#1683d8]"
        >
          <ChevronLeft size={16} />
          Back to Payees
        </button>
        <p className="text-sm text-[#9ca3af]">Payee not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-5 flex items-center gap-2 text-sm text-[#667085] transition hover:text-[#1683d8]"
      >
        <ChevronLeft size={16} />
        Back to Payees
      </button>

      {/* Header card */}
      <section className="rounded-lg border border-[#e5e7eb] bg-white px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f3e8ff] text-lg font-semibold text-[#9333ea]">
              {payee.name.charAt(0)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-semibold text-[#1f2937]">
                  {payee.name}
                </h1>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${typeStyles[payee.type] ?? "bg-[#f3f4f6] text-[#6b7280]"}`}
                >
                  {payee.type}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadgeStyles[payee.status]}`}
                >
                  {payee.status}
                </span>
              </div>

              <p className="mt-1 text-sm text-[#6b7280]">
                {payee.email}
                {payee.phone ? ` · ${payee.phone}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#98a2b3]">
                Monthly Payment
              </p>
              <p className="mt-1 text-lg font-bold text-[#1683d8]">
                {naira(payee.amount)}
              </p>
              {payee.taxable && (
                <span className="mt-1 inline-block rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-[11px] font-medium text-[#a16207]">
                  Taxable
                </span>
              )}
            </div>

            <button
              onClick={() => setEditOpen(true)}
              className="h-10 rounded-md bg-[#e0f2fe] px-5 text-sm font-medium text-[#1683d8] hover:bg-[#cfeaf9]"
            >
              Edit
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="mt-6 border-b border-[#e5e7eb]">
        <div className="flex">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-3 text-sm font-medium transition ${
                  isActive
                    ? "text-[#1683d8]"
                    : "text-[#6b7280] hover:text-[#1f2937]"
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#1683d8]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "Payment History" && (
        <section className="mt-6 rounded-lg border border-[#e5e7eb] bg-white">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-base font-semibold text-[#1f2937]">
              Payment History
            </h2>
            <button className="flex items-center gap-2 rounded-md border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">
              <Download size={14} />
              Export
            </button>
          </div>

          {payee.paymentHistory.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-[#9ca3af]">
              No payment history yet.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y border-[#e5e7eb] text-xs text-[#6b7280]">
                  <th className="px-6 py-3 font-medium">Period</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Payment Date</th>
                  <th className="px-6 py-3 font-medium">Reference</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payee.paymentHistory.map((record, index) => (
                  <tr
                    key={record.reference}
                    className={`border-b border-[#f0f0f0] last:border-b-0 ${
                      index % 2 === 1 ? "bg-[#f9fafb]" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-[#1f2937]">
                      {record.period}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#1f2937]">
                      {naira(record.amount)}
                    </td>
                    <td className="px-6 py-4 text-[#6b7280]">
                      {record.paymentDate}
                    </td>
                    <td className="px-6 py-4">
                      <button className="font-medium text-[#1683d8] hover:underline">
                        {record.reference}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${paymentStatusStyles[record.status]}`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {activeTab === "Documents" && (
        <div className="mt-6 ">
          <Documents />
        </div>
      )}
    </div>
  );
}
