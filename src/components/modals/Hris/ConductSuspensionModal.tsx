"use client";

import { suspensions } from "@/data/hris/conduct";
import { useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import AddEditSuspensionModal from "./AddEditSuspensionModal";

export default function ConductSuspensionModal() {
  const [isSuspensionProfileOpen, setIsSuspensionProfileOpen] = useState(false);

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
            {suspensions.map((employee, index) => (
              <tr
                key={index}
                onClick={(e) => setIsSuspensionProfileOpen(true)}
                className="border-b border-[#F3F4F6] text-sm text-[#374151]"
              >
                <td className="py-5">{employee.id}</td>

                <td>{employee.name}</td>

                <td>{employee.role}</td>

                <td>{employee.department}</td>

                <td>{employee.type}</td>

                <td>{employee.from}</td>

                <td>{employee.to}</td>

                <td>
                  <StatusBadge status={employee.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isSuspensionProfileOpen && (
          <AddEditSuspensionModal
            open={isSuspensionProfileOpen}
            onclose={() => setIsSuspensionProfileOpen(false)}
          />
        )}
      </div>

      {/* Bottom */}

      <div className="mt-auto flex justify-end pt-16">
        <button className="h-11 rounded border border-[#E5E7EB] px-6 text-sm text-[#374151]">
          Cancel
        </button>
      </div>
    </div>
  );
}
