"use client";

import { useState } from "react";

import ApplyForLeaveModal from "@/components/modals/Hris/ApplyForLeaveModal";
import LeaveSummaryCard from "@/components/hris/Leave/LeaveSummaryCard";
import LeaveTable from "@/components/hris/Leave/LeaveTable";
import LeaveTabs from "@/components/hris/Leave/LeaveTabs";

export default function LeaveManagementPage() {
  const [showModal, setShowModal] = useState(false);

  const summary = [
    {
      title: "Pending Requests",
      value: 2,
      color: "text-yellow-500",
    },
    {
      title: "Approved",
      value: 3,
      color: "text-green-600",
    },
    {
      title: "Rejected",
      value: 1,
      color: "text-red-500",
    },
  ];

  return (
    <section className="min-h-screen bg-[#f8f9fb] p-6 space-y-6">
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Leave Management</h1>

        <button
          onClick={() => setShowModal(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
        >
          + Apply for Leave
        </button>
      </div>

      {/* Summary Cards */}

      <div className="mb-6 grid md:grid-cols-3 gap-4">
        {summary.map((item) => (
          <LeaveSummaryCard
            key={item.title}
            title={item.title}
            value={item.value}
            color={item.color}
          />
        ))}
      </div>

      {/* Table */}

      <div className="rounded-md border bg-white p-5">
        <LeaveTabs />

        <LeaveTable />
      </div>

      {/* Modal */}

      <ApplyForLeaveModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </section>
  );
}
