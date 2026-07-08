"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { leaveHistory } from "@/data/employee/leave";
import { useState } from "react";
import ApplyLeave from "@/components/modals/Employee/ApplyLeave";

type LeaveStatus = "Pending" | "Approved" | "Rejected";

const statusStyles: Record<LeaveStatus, string> = {
  Pending: "text-[#F59E0B]",
  Approved: "text-[#22C55E]",
  Rejected: "text-[#EF4444]",
};

export default function LeaveHistoryPage() {
  const [showModal, setShowModal] = useState(false);
  if (showModal) {
    return (
      <ApplyLeave isOpen={showModal} onClose={() => setShowModal(false)} />
    );
  }

  return (
    <section className="space-y-6 p-6 bg-white rounded-lg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-semibold text-[#1F2937]">
          Profile Leave History
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1684E0] hover:bg-[#1274c6] text-white px-5 py-3 rounded-md text-sm font-medium"
        >
          <Plus size={16} />
          Apply Leave
        </button>
      </div>

      {/* Employee Info */}
      <div className="mt-8 flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Image
            src="/avatar.png"
            alt="employee"
            width={50}
            height={50}
            className="rounded-full"
          />

          <div>
            <h3 className="font-semibold text-lg text-[#1F2937]">John Smith</h3>

            <p className="text-xs text-[#9CA3AF]">03546AE</p>
          </div>
        </div>

        <div className="border border-[#F97316] text-[#F97316] text-xs px-5 py-2 rounded-full">
          Employee
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 mt-8 px-4 py-3 text-xs text-[#9CA3AF] border-b">
        <span>Leave Type</span>
        <span>From</span>
        <span>To</span>
        <span className="text-center">Remaining Leave</span>
        <span className="text-right">Status</span>
      </div>

      {/* Table Rows */}
      <div className="mt-1">
        {leaveHistory.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-5 px-4 py-4 text-sm ${
              index % 2 === 1 ? "bg-[#F7F7FA]" : "bg-white"
            }`}
          >
            <span className="text-[#374151]">{item.leaveType}</span>

            <span className="text-[#6B7280]">{item.from}</span>

            <span className="text-[#6B7280]">{item.to}</span>

            <span className="text-center text-[#6B7280]">
              {item.remainingLeave}
            </span>

            <span
              className={`text-right font-medium ${statusStyles[item.status]}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-6">
        <button className="border border-gray-300 px-6 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </section>
  );
}
