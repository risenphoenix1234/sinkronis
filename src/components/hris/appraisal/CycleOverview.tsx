// components/appraisal/CycleOverview.tsx
"use client";

import {
  ActiveAppraisalCycle,
  AppraisalsOverviewActiveCycle,
  AppraisalsOverviewData,
} from "@/lib/api/types/hrisTypes";
import { AlertCircle } from "lucide-react";

interface CycleOverviewProps {
  cycle: AppraisalsOverviewActiveCycle | ActiveAppraisalCycle | null;
  overview?: AppraisalsOverviewData | null;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCreateCycle?: () => void;
  onViewAll?: () => void;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    const cleanDateStr = dateStr.split("T")[0];
    const [y, m, d] = cleanDateStr.split("-").map(Number);
    if (!y || !m || !d) return dateStr;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function CycleOverview({
  cycle,
  overview,
  loading,
  error,
  onRetry,
  onCreateCycle,
  onViewAll,
}: CycleOverviewProps) {
  if (error) {
    return (
      <div className="mt-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="font-semibold underline hover:text-red-900"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-6 animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="h-5 w-48 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-64 rounded bg-slate-100" />
        <div className="mt-6 h-2 w-full rounded-full bg-slate-100" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-50 p-4" />
          ))}
        </div>
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-xs">
        <h3 className="font-semibold text-gray-800">
          No active appraisal cycle
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Start a new cycle to begin collecting goals and performance reviews.
        </p>
        {onCreateCycle && (
          <button
            onClick={onCreateCycle}
            className="mt-4 rounded-lg bg-[#2183C6] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1b6ea7] transition"
          >
            + New Cycle
          </button>
        )}
      </div>
    );
  }

  const submissionDeadline =
    "submissionDeadline" in cycle &&
    typeof cycle.submissionDeadline === "string"
      ? cycle.submissionDeadline
      : null;
  const periodTo =
    "periodTo" in cycle && typeof cycle.periodTo === "string"
      ? cycle.periodTo
      : null;
  const rawDeadline =
    "deadline" in cycle && typeof cycle.deadline === "string"
      ? cycle.deadline
      : null;
  const deadlineStr = submissionDeadline
    ? formatDate(submissionDeadline)
    : periodTo
      ? formatDate(periodTo)
      : rawDeadline
        ? formatDate(rawDeadline)
        : "—";

  const templateStr =
    "template" in cycle &&
    typeof cycle.template === "object" &&
    cycle.template !== null &&
    "name" in cycle.template &&
    typeof (cycle.template as { name: unknown }).name === "string"
      ? (cycle.template as { name: string }).name
      : "template" in cycle && typeof cycle.template === "string"
        ? cycle.template
        : "Standard Performance Review";

  const workflow =
    (cycle &&
    "workflow" in cycle &&
    cycle.workflow &&
    typeof cycle.workflow === "object"
      ? (cycle.workflow as Record<string, number>)
      : undefined) ||
    (cycle &&
    "workflowCounts" in cycle &&
    cycle.workflowCounts &&
    typeof cycle.workflowCounts === "object"
      ? (cycle.workflowCounts as Record<string, number>)
      : undefined) ||
    (overview?.activeCycle?.workflow as Record<string, number> | undefined) ||
    (overview?.workflow as Record<string, number> | undefined) ||
    {};

  const goalsProposed = workflow.goalsProposed ?? workflow.GOAL_SETTING ?? 0;
  const selfAssessmentOpen =
    workflow.selfAssessmentOpen ?? workflow.SELF_ASSESSMENT ?? 0;
  const underManagerReview =
    workflow.underManagerReview ?? workflow.MANAGER_REVIEW ?? 0;
  const pendingHRApproval =
    workflow.pendingHRApproval ??
    workflow.pendingHrApproval ??
    workflow.HR_APPROVAL ??
    0;
  const acknowledged =
    workflow.acknowledged ??
    workflow.ACKNOWLEDGMENT ??
    workflow.COMPLETED ??
    0;

  const acknowledgedCount =
    ("acknowledgedEmployees" in cycle &&
    typeof cycle.acknowledgedEmployees === "number"
      ? cycle.acknowledgedEmployees
      : null) ??
    ("progress" in cycle &&
    typeof cycle.progress === "object" &&
    cycle.progress &&
    "acknowledged" in cycle.progress
      ? Number((cycle.progress as { acknowledged?: number }).acknowledged)
      : null) ??
    acknowledged;

  const totalEmployeesCount =
    ("totalEmployees" in cycle && typeof cycle.totalEmployees === "number"
      ? cycle.totalEmployees
      : null) ??
    ("progress" in cycle &&
    typeof cycle.progress === "object" &&
    cycle.progress &&
    "totalEmployees" in cycle.progress
      ? Number((cycle.progress as { totalEmployees?: number }).totalEmployees)
      : null) ??
    (overview?.analytics?.totalEmployees ?? 0);

  const acknowledgedPct =
    "acknowledgedPercentage" in cycle &&
    typeof cycle.acknowledgedPercentage === "number"
      ? Math.round(cycle.acknowledgedPercentage)
      : "progress" in cycle &&
          typeof cycle.progress === "object" &&
          cycle.progress !== null &&
          "percentage" in cycle.progress &&
          typeof (cycle.progress as { percentage?: number }).percentage ===
            "number"
        ? Math.round((cycle.progress as { percentage: number }).percentage)
        : totalEmployeesCount > 0
          ? Math.round((acknowledgedCount / totalEmployeesCount) * 100)
          : 0;

  const progressLabel =
    totalEmployeesCount > 0
      ? `${acknowledgedCount} of ${totalEmployeesCount} acknowledged (${acknowledgedPct}%)`
      : `${acknowledgedPct}% acknowledged`;

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Active Cycle: {String(cycle.name ?? "—")}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Deadline: {deadlineStr} · Template: {templateStr}
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-[#2183C6] hover:underline"
        >
          View all →
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#12B76A] transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, acknowledgedPct))}%` }}
          />
        </div>

        <p className="mt-1.5 text-xs text-gray-500 font-normal">
          {progressLabel}
        </p>
      </div>

      {/* 5 Stage Blocks matching Figma */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {/* Goals Proposed */}
        <div className="rounded-xl bg-[#FEF6EE] p-4">
          <p className="text-2xl font-bold text-gray-900">{goalsProposed}</p>
          <p className="mt-1 text-xs text-gray-600">Goals Proposed</p>
        </div>

        {/* Self-Assessment Open */}
        <div className="rounded-xl bg-[#FEF6EE] p-4">
          <p className="text-2xl font-bold text-gray-900">{selfAssessmentOpen}</p>
          <p className="mt-1 text-xs text-gray-600">Self-Assessment Open</p>
        </div>

        {/* Under Manager Review */}
        <div className="rounded-xl bg-[#F9F5FF] p-4">
          <p className="text-2xl font-bold text-gray-900">{underManagerReview}</p>
          <p className="mt-1 text-xs text-gray-600">Under Manager Review</p>
        </div>

        {/* Pending HR Approval */}
        <div className="rounded-xl bg-[#FEF6EE] p-4">
          <p className="text-2xl font-bold text-gray-900">{pendingHRApproval}</p>
          <p className="mt-1 text-xs text-gray-600">Pending HR Approval</p>
        </div>

        {/* Acknowledged */}
        <div className="rounded-xl bg-[#ECFDF3] p-4">
          <p className="text-2xl font-bold text-gray-900">{acknowledged}</p>
          <p className="mt-1 text-xs text-gray-600">Acknowledged</p>
        </div>
      </div>
    </div>
  );
}
