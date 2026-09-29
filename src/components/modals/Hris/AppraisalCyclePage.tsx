"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { getAppraisalCycles } from "@/lib/api/hris";
import CycleCard from "../../hris/appraisal/CycleCard";
import type { AppraisalCycleSummary } from "@/lib/api/types/hrisTypes";

type FilterStatus = "ALL" | "ACTIVE" | "DRAFT" | "COMPLETED";

export default function AppraisalCyclePage() {
  const [cycles, setCycles] = useState<AppraisalCycleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");

  const loadCycles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params =
        statusFilter !== "ALL" ? { status: statusFilter } : undefined;
      const res = await getAppraisalCycles(params);
      setCycles(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load appraisal cycles:", err);
      const apiMsg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Couldn't load appraisal cycles. Try again.";
      setError(apiMsg);
      toast.error(apiMsg);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadCycles();
  }, [loadCycles]);

  const handleDeleted = (cycleId: string) => {
    setCycles((prev) => prev.filter((c) => c.id !== cycleId));
  };

  const handleChanged = () => {
    loadCycles();
  };

  // const tabs: { label: string; value: FilterStatus }[] = [
  //   { label: "All Cycles", value: "ALL" },
  //   { label: "Active", value: "ACTIVE" },
  //   { label: "Draft", value: "DRAFT" },
  //   { label: "Completed", value: "COMPLETED" },
  // ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] space-y-5">
      {/* Filter Tabs */}
      {/* <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
              statusFilter === tab.value
                ? "bg-[#2388D0] text-white"
                : "bg-white text-[#667085] border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div> */}

      <div className="space-y-4">
        {loading && (
          <div className="py-8 text-center text-sm text-[#94A3B8]">
            Loading appraisal cycles…
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={loadCycles}
              className="font-semibold underline hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && cycles.length === 0 && (
          <div className="rounded-md border border-dashed border-[#E5E9EF] bg-white py-12 text-center text-sm text-[#94A3B8]">
            No {statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""}{" "}
            appraisal cycles found.
          </div>
        )}

        {!loading &&
          !error &&
          cycles.map((cycle) => (
            <CycleCard
              key={cycle.id}
              cycle={cycle}
              onDeleted={handleDeleted}
              onChanged={handleChanged}
            />
          ))}
      </div>
    </div>
  );
}
