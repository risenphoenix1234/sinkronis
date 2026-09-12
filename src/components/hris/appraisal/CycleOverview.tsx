// components/appraisal/CycleOverview.tsx

import { ActiveAppraisalCycle } from "@/lib/api/types/hrisTypes";

interface CycleOverviewProps {
  cycle: ActiveAppraisalCycle | null;
  loading: boolean;
  onCreateCycle?: () => void; // opens AppraisalModal's "New Cycle" flow
}

export default function CycleOverview({
  cycle,
  loading,
  onCreateCycle,
}: CycleOverviewProps) {
  if (loading) {
    return (
      <div className="mt-6 rounded-lg border bg-white p-5">
        <p className="text-sm text-slate-400">Loading active cycle…</p>
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="mt-6 rounded-lg border border-dashed bg-white p-8 text-center">
        <h3 className="font-semibold text-slate-800">
          No active appraisal cycle
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Start a new cycle to begin collecting goals and reviews.
        </p>
        {onCreateCycle && (
          <button
            onClick={onCreateCycle}
            className="mt-4 rounded-md bg-[#2388D0] px-4 py-2 text-sm font-medium text-white"
          >
            New Cycle
          </button>
        )}
      </div>
    );
  }

  // ⚠️ Field names below are best guesses — cycle.name, .deadline, .template,
  // .acknowledgmentPercentage, .workflowCounts.* are UNCONFIRMED since we've
  // never seen a real populated response (activeCycle is always null so far).
  // Fix these once a real cycle exists and you can inspect the actual JSON.
  const acknowledgedPct = cycle.acknowledgmentPercentage ?? 0;
  const workflow = cycle.workflowCounts ?? {};

  return (
    <div className="mt-6 rounded-lg border bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">
            Active Cycle: {String(cycle.name ?? "—")}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Deadline: {String(cycle.deadline ?? "—")} · Template:{" "}
            {String(cycle.template ?? "—")}
          </p>
        </div>

        <button className="text-sm font-medium text-blue-600">
          View all →
        </button>
      </div>

      <div className="mt-6">
        <div className="h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-green-600"
            style={{ width: `${acknowledgedPct}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-500">
          {acknowledgedPct}% acknowledged
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-5">
        <StatusBox
          count={String(workflow.goalsProposed ?? 0)}
          label="Goals Proposed"
          bg="bg-yellow-50"
          color="text-yellow-700"
        />

        <StatusBox
          count={String(workflow.selfAssessmentOpen ?? 0)}
          label="Self-Assessment Open"
          bg="bg-yellow-50"
          color="text-yellow-700"
        />

        <StatusBox
          count={String(workflow.underManagerReview ?? 0)}
          label="Under Manager Review"
          bg="bg-purple-50"
          color="text-purple-700"
        />

        <StatusBox
          count={String(workflow.pendingHrApproval ?? 0)}
          label="Pending HR Approval"
          bg="bg-yellow-50"
          color="text-yellow-700"
        />

        <StatusBox
          count={String(workflow.acknowledged ?? 0)}
          label="Acknowledged"
          bg="bg-green-50"
          color="text-green-700"
        />
      </div>
    </div>
  );
}

function StatusBox({
  count,
  label,
  bg,
  color,
}: {
  count: string;
  label: string;
  bg: string;
  color: string;
}) {
  return (
    <div className={`rounded-md p-4 ${bg}`}>
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
      <p className="mt-2 text-xs text-slate-500">{label}</p>
    </div>
  );
}
