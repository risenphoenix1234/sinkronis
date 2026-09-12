"use client";

import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { Pencil } from "lucide-react";
import { ConductRecord } from "@/lib/api/types/hrisTypes";
import EmptyState from "@/components/shared/EmptyState";

interface Props {
  records: ConductRecord[];
  loading: boolean;
}

export default function ConductSuspensionModal({ records, loading }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
              <td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                Loading records...
              </td>
            </tr>
          ) : records.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12">
                <EmptyState
                  title="No suspension records"
                  subtitle="No suspensions have been issued yet."
                />
              </td>
            </tr>
          ) : (
            records.map((employee, index) => (
              <tr
                key={employee.id}
                className={`border-b border-[#F3F4F6] text-sm text-[#374151] ${
                  selectedId === employee.id ? "bg-slate-100" : index % 2 === 1 ? "bg-slate-50/60" : ""
                }`}
              >
                <td className="px-4 py-5">{employee.employeeId}</td>

                <td className="px-4 py-5">{employee.employeeName}</td>

                <td className="px-4 py-5">{employee.role}</td>

                <td className="px-4 py-5">{employee.department}</td>

                <td className="px-4 py-5">{employee.queryType}</td>

                <td className="px-4 py-5">
                  <StatusBadge status={employee.status} />
                </td>

                <td className="px-4 py-5">
                  <button
                    onClick={() => setSelectedId(employee.id)}
                    className="text-slate-500 hover:text-blue-600"
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
