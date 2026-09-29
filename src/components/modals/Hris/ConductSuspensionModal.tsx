"use client";

import StatusBadge from "@/components/ui/StatusBadge";
import { Pencil } from "lucide-react";
import { ConductRecord } from "@/lib/api/types/hrisTypes";
import EmptyState from "@/components/shared/EmptyState";
import { resolveDepartmentName } from "@/utils/department";

interface Props {
  records: ConductRecord[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  selectedId?: string | null;
  onSelectRecord?: (record: ConductRecord) => void;
}

export default function ConductSuspensionModal({
  records,
  loading,
  error,
  onRetry,
  selectedId,
  onSelectRecord,
}: Props) {
  return (
    <div className="mt-4 overflow-hidden rounded-lg border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E5E7EB] text-left text-xs text-[#6B7280]">
            <th className="px-4 py-4 font-medium">Employee ID</th>
            <th className="px-4 py-4 font-medium">Name</th>
            <th className="px-4 py-4 font-medium">Role</th>
            <th className="px-4 py-4 font-medium">Department</th>
            <th className="px-4 py-4 font-medium">Suspension Type</th>
            <th className="px-4 py-4 font-medium">Status</th>
            <th className="px-4 py-4 font-medium"></th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={7}
                className="py-12 text-center text-sm text-slate-500"
              >
                Loading records...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={7} className="py-12 text-center">
                <p className="text-sm font-medium text-red-600">{error}</p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Retry
                  </button>
                )}
              </td>
            </tr>
          ) : records.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12">
                <EmptyState
                  title="No suspension records found"
                  subtitle="No suspensions match this search or filter."
                />
              </td>
            </tr>
          ) : (
            records.map((employee, index) => (
              <tr
                key={employee.id}
                onClick={() => onSelectRecord?.(employee)}
                className={`cursor-pointer border-b border-[#F3F4F6] text-sm text-[#374151] hover:bg-slate-50 transition ${
                  selectedId === employee.id
                    ? "bg-slate-100"
                    : index % 2 === 1
                      ? "bg-slate-50/60"
                      : ""
                }`}
              >
                <td className="px-4 py-5 text-blue-600 font-medium">
                  {employee.employeeId || employee.employee?.employeeId || "—"}
                </td>
                <td className="px-4 py-5 font-medium text-slate-800">
                  {employee.employeeName || employee.employee?.name || "—"}
                </td>
                <td className="px-4 py-5 text-slate-600">
                  {employee.role || employee.employee?.role || "—"}
                </td>
                <td className="px-4 py-5">{resolveDepartmentName(employee.department)}</td>
                <td className="px-4 py-5">
                  {employee.queryType ? employee.queryType.replace(/_/g, " ") : "—"}
                </td>
                <td className="px-4 py-5">
                  <StatusBadge status={employee.status} />
                </td>
                <td className="px-4 py-5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRecord?.(employee);
                    }}
                    className="text-slate-500 hover:text-blue-600 transition"
                  >
                    <Pencil size={15} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
