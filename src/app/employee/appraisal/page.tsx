// src/app/employee/appraisal/page.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import AppraisalTable from "@/components/modals/Employee/AppraisalTable";

export default function EmployeeAppraisalPage() {
  const [kpis, setKpis] = useState<string[]>([
    "Customer Service Delivery: Ensure Internal employees satisfaction index of 95%",
    "Law enforcement agencies: Ensure zero infractions with law enforcement agencies",
    "Accidents: zero records of accidents",
    "Passenger satisfaction: Ensure 95% Passengers satisfaction rate/feedback",
    "Payvis: Check Payvis website on a weekly basis to confirm possible traffic offense bookings",
  ]);

  const [open, setOpen] = useState(false);
  const [newKpi, setNewKpi] = useState("");

  const removeKpi = (index: number) => {
    setKpis((prev) => prev.filter((_, i) => i !== index));
  };

  const addKpi = () => {
    if (!newKpi.trim()) return;

    setKpis((prev) => [...prev, newKpi]);
    setNewKpi("");
  };

  if (open) {
    return <AppraisalTable isOpen={open} onClose={() => setOpen(false)} />;
  }
  return (
    <section className="min-h-screen bg-white p-6 space-y-6">
      {/* Title */}
      <h1 className="text-[32px] font-semibold text-[#1D2939] mb-8">
        Appraisal
      </h1>

      <div className="max-w-[700px]">
        {/* Objective */}
        <div className="mb-6">
          <label className="block text-[11px] font-medium text-[#344054] mb-2">
            Objective
          </label>

          <input
            type="text"
            defaultValue="Customer Service/ Compliance with Road Safety"
            className="w-full h-[40px] rounded border border-[#D0D5DD] px-3 text-sm text-[#344054] outline-none"
          />
        </div>

        {/* KPI Section */}
        <div className="mb-6">
          <label className="block text-[11px] font-medium text-[#344054] mb-2">
            Monthly Key Performance Indicators
          </label>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Add task"
              value={newKpi}
              onChange={(e) => setNewKpi(e.target.value)}
              className="flex-1 h-[40px] rounded border border-[#344054] px-3 text-sm outline-none"
            />

            <button
              onClick={addKpi}
              className="h-[40px] px-5 rounded bg-[#1684E0] text-white text-sm font-medium hover:bg-[#1474c5]"
            >
              Add
            </button>
          </div>

          {/* KPI List */}
          <div className="mt-4">
            {kpis.map((kpi, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-[#EAECF0] py-2"
              >
                <div className="flex items-start gap-2 text-sm text-[#475467]">
                  <span>•</span>
                  <span>{kpi}</span>
                </div>

                <button
                  onClick={() => removeKpi(index)}
                  className="text-[#667085] hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Comments */}
        <div>
          <label className="block text-[11px] font-medium text-[#344054] mb-2">
            Employee Comments
          </label>

          <textarea
            placeholder="Notes"
            rows={4}
            className="w-full rounded border border-[#D0D5DD] px-3 py-3 text-sm text-[#344054] outline-none resize-none"
          />
        </div>
      </div>

      {/* Footer Button + Modal */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setOpen(true)}
          className="h-[42px] px-6 rounded bg-[#1684E0] text-white text-sm font-medium hover:bg-[#1474c5]"
        >
          Create Appraisal
        </button>
      </div>
    </section>
  );
}
