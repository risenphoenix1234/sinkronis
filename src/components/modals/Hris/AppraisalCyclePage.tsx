// app/appraisal/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { getAppraisalCycles } from "@/lib/api/hris";
import CycleCard from "../../hris/appraisal/CycleCard";
import { AppraisalCycleSummary } from "@/lib/api/types/hrisTypes";

export default function AppraisalCyclePage() {
  const [cycles, setCycles] = useState<AppraisalCycleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCycles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAppraisalCycles();
      setCycles(res.data);
    } catch (err) {
      console.error("Failed to load appraisal cycles:", err);
      setError("Couldn't load appraisal cycles. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCycles();
  }, [loadCycles]);

  const handleDeleted = (cycleId: string) => {
    setCycles((prev) => prev.filter((c) => c.id !== cycleId));
  };

  // Launch/complete mutate status server-side — simplest correct approach is
  // just refetching the list rather than hand-patching local state, since the
  // list endpoint is the only one whose shape we trust for rendering rows.
  const handleChanged = () => {
    loadCycles();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] space-y-6">
      <div className="mt-6 space-y-4">
        {loading && (
          <p className="text-sm text-[#667085]">Loading appraisal cycles…</p>
        )}

        {!loading && error && (
          <div className="text-sm text-red-600 flex items-center gap-3">
            <span>{error}</span>
            <button onClick={loadCycles} className="underline">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && cycles.length === 0 && (
          <p className="text-sm text-[#667085]">No appraisal cycles yet.</p>
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
