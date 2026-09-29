"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { ConductRecord } from "@/lib/api/types/hrisTypes";
import { getConductRecords, normalizeConductRecord } from "@/lib/api/hris";
import { resolveDepartmentName } from "@/utils/department";
import SuspensionDrawer from "@/components/hris/conduct/SuspensionDrawer";

interface EmployeeConductSuspensionProps {
  records?: ConductRecord[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onClose?: () => void;
  onSelectRecord?: (record: ConductRecord) => void;
}

function extractConductRecords(res: unknown): ConductRecord[] {
  let list: ConductRecord[] = [];
  if (Array.isArray(res)) {
    list = res as ConductRecord[];
  } else if (res && typeof res === "object") {
    const payload = (res as { data?: unknown }).data;
    if (Array.isArray(payload)) {
      list = payload as ConductRecord[];
    } else if (payload && typeof payload === "object") {
      const nested =
        (payload as { records?: unknown; items?: unknown }).records ??
        (payload as { items?: unknown }).items;
      if (Array.isArray(nested)) list = nested as ConductRecord[];
    }
  }
  return list.map(normalizeConductRecord);
}

export default function EmployeeConductSuspension({
  records: externalRecords,
  loading: externalLoading,
  error: externalError,
  onRetry,
  onClose,
  onSelectRecord,
}: EmployeeConductSuspensionProps = {}) {
  const [internalRecords, setInternalRecords] = useState<ConductRecord[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isSuspensionProfileOpen, setIsSuspensionProfileOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ConductRecord | null>(null);

  const isControlled = externalRecords !== undefined;
  const records = isControlled ? externalRecords : internalRecords;
  const loading = externalLoading !== undefined ? externalLoading : internalLoading;
  const error = externalError !== undefined ? externalError : internalError;

  const fetchRecords = () => {
    if (isControlled) {
      onRetry?.();
      return;
    }
    setInternalLoading(true);
    setInternalError(null);
    getConductRecords({ type: "SUSPENSION" })
      .then((res) => {
        setInternalRecords(extractConductRecords(res));
      })
      .catch((err) => {
        console.error("Failed to load conduct suspensions:", err);
        const msg =
          typeof err === "object" && err !== null && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
              "Failed to load conduct suspensions."
            : "Failed to load conduct suspensions.";
        setInternalError(msg);
      })
      .finally(() => {
        setInternalLoading(false);
      });
  };

  useEffect(() => {
    if (!isControlled) {
      fetchRecords();
    }
  }, [isControlled]);

  const handleRowClick = (record: ConductRecord) => {
    setSelectedRecord(record);
    if (onSelectRecord) {
      onSelectRecord(record);
    } else {
      setIsSuspensionProfileOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white space-y-6 p-6">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] text-left text-xs text-[#6B7280]">
              <th className="py-4 font-medium">Employee ID</th>
              <th className="py-4 font-medium">Name ↕</th>
              <th className="py-4 font-medium">Role ↕</th>
              <th className="py-4 font-medium">Department ↕</th>
              <th className="py-4 font-medium">Suspension Type ↕</th>
              <th className="py-4 font-medium">From</th>
              <th className="py-4 font-medium">To</th>
              <th className="py-4 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-slate-500">
                  Loading suspension records...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <p className="text-sm font-medium text-red-600">{error}</p>
                  <button
                    onClick={fetchRecords}
                    className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Retry
                  </button>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12">
                  <EmptyState
                    title="No active suspensions"
                    subtitle="There are no suspension records on file."
                  />
                </td>
              </tr>
            ) : (
              records.map((record, index) => {
                const empId = record.employeeId || record.employee?.employeeId || "—";
                const empName = record.employeeName || record.employee?.name || "—";
                const empRole = record.role || record.employee?.role || "—";
                const empDept = resolveDepartmentName(record.department);
                const suspensionType = record.queryType
                  ? record.queryType.replace(/_/g, " ")
                  : "—";
                const fromDate = record.duration?.startDate || record.date || "—";
                const toDate = record.duration?.endDate || "—";

                return (
                  <tr
                    key={record.id || index}
                    onClick={() => handleRowClick(record)}
                    className="border-b border-[#F3F4F6] text-sm text-[#374151] hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="py-5 font-medium text-blue-600">{empId}</td>
                    <td className="font-medium text-slate-800">{empName}</td>
                    <td className="text-slate-600">{empRole}</td>
                    <td>{empDept}</td>
                    <td>{suspensionType}</td>
                    <td>{fromDate}</td>
                    <td>{toDate}</td>
                    <td>
                      <StatusBadge status={record.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {isSuspensionProfileOpen && (
          <SuspensionDrawer
            open={isSuspensionProfileOpen}
            suspension={selectedRecord}
            onClose={() => {
              setIsSuspensionProfileOpen(false);
              setSelectedRecord(null);
            }}
          />
        )}
      </div>

      {/* Bottom */}
      <div className="mt-auto flex justify-end pt-16">
        <button
          onClick={onClose}
          className="h-11 rounded border border-[#E5E7EB] px-6 text-sm text-[#374151] hover:bg-slate-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
