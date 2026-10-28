"use client";

import { AppraisalReview } from "@/lib/api/types/hrisTypes";
import { useRouter } from "next/navigation";
import { ClipboardList } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Loader from "@/components/ui/Loader";

interface EmployeeTableProps {
  reviews: AppraisalReview[];
  loading: boolean;
  cycleName?: string | null;
}

const STAGE_LABELS: Record<string, string> = {
  GOAL_SETTING: "Goals Proposed",
  SELF_ASSESSMENT: "Self-Assessment Open",
  SELF_ASSESSMENT_SUBMITTED: "Self-Assessment Submitted",
  MANAGER_REVIEW: "Under Manager Review",
  HR_APPROVAL: "Pending HR Approval",
  ACKNOWLEDGMENT: "Acknowledged",
  COMPLETED: "Completed",
  IN_PROGRESS: "In Progress",
  NOT_STARTED: "Not Started",
};

function renderStatusPill(status: string) {
  switch (status) {
    case "Acknowledged":
    case "Completed":
      return (
        <span className="inline-flex items-center rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-medium text-[#027A48]">
          {status}
        </span>
      );
    case "Pending HR Approval":
    case "Goals Proposed":
      return (
        <span className="inline-flex items-center rounded-full bg-[#FEF6EE] px-3 py-1 text-xs font-medium text-[#B54708]">
          {status}
        </span>
      );
    case "Under Manager Review":
      return (
        <span className="inline-flex items-center rounded-full bg-[#F9F5FF] px-3 py-1 text-xs font-medium text-[#6941C6]">
          {status}
        </span>
      );
    case "Self-Assessment Submitted":
    case "Self-Assessment Open":
      return (
        <span className="inline-flex items-center rounded-full bg-[#F0F9FF] px-3 py-1 text-xs font-medium text-[#026AA2]">
          {status}
        </span>
      );
    case "Not Started":
      return (
        <span className="text-xs font-normal text-slate-500">Not Started</span>
      );
    default:
      return <StatusBadge status={status} />;
  }
}

export default function EmployeeTable({
  reviews,
  loading,
  cycleName,
}: EmployeeTableProps) {
  const router = useRouter();

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-base font-bold text-gray-900">
          All Employees{cycleName ? ` — ${cycleName}` : ""}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-white text-xs font-medium text-slate-500">
              <th className="px-6 py-4 font-normal">Employee</th>
              <th className="px-6 py-4 font-normal">Department</th>
              <th className="px-6 py-4 font-normal">Manager</th>
              <th className="px-6 py-4 font-normal">Status</th>
              <th className="px-6 py-4 font-normal">Score</th>
              <th className="px-6 py-4 font-normal">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-slate-400"
                ><Loader variant="inline" label="Loading employee reviews" /></td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                      <ClipboardList className="h-6 w-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      No appraisal reviews yet
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Start an appraisal cycle to initiate performance reviews
                      for your team.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              reviews.map((review, idx) => {
                const targetId = review.appraisalId || review.id || "";
                const employeeName =
                  review.employee?.name ??
                  review.employeeName ??
                  review.name ??
                  "Unknown Employee";
                const employeeRole =
                  review.employee?.role ??
                  review.role ??
                  review.employee?.employeeId ??
                  "—";
                const initials =
                  employeeName
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "EP";

                const departmentName =
                  typeof review.department === "object"
                    ? (review.department?.name ?? "—")
                    : (review.department ?? "—");

                const managerName =
                  typeof review.manager === "object"
                    ? (review.manager?.name ?? "—")
                    : (review.manager ?? "—");

                const rawStage = review.stage || review.status || "";
                const displayStatus = STAGE_LABELS[rawStage] || rawStage || "—";
                const scoreDisplay =
                  review.score !== null && review.score !== undefined ? (
                    <span className="font-bold text-[#026AA2]">
                      {review.score}%
                    </span>
                  ) : (
                    <span className="font-normal text-slate-400">—</span>
                  );

                const isApprove =
                  review.stage === "HR_APPROVAL" ||
                  displayStatus === "Pending HR Approval" ||
                  (Boolean(review.action) &&
                    review.action?.trim().toUpperCase() === "APPROVE");

                const isSetGoals =
                  displayStatus === "Not Started" ||
                  review.stage === "NOT_STARTED" ||
                  (Boolean(review.action) &&
                    review.action?.trim().toUpperCase() === "SET_GOALS");

                return (
                  <tr
                    key={targetId || idx}
                    onClick={() =>
                      targetId && router.push(`/hris/appraisal/${targetId}`)
                    }
                    className={`transition-colors ${
                      targetId
                        ? "cursor-pointer hover:bg-slate-50/80"
                        : "hover:bg-slate-50/40"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {employeeName}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {employeeRole}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {departmentName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{managerName}</td>

                    <td className="px-6 py-4">
                      {renderStatusPill(displayStatus)}
                    </td>

                    <td className="px-6 py-4">{scoreDisplay}</td>

                    <td className="px-6 py-4">
                      {targetId ? (
                        isApprove ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/hris/appraisal/${targetId}`);
                            }}
                            className="rounded-lg bg-[#6941C6] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#5a36aa] transition"
                          >
                            Approve
                          </button>
                        ) : isSetGoals ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/hris/appraisal/${targetId}`);
                            }}
                            className="rounded-lg bg-[#F0F9FF] px-4 py-1.5 text-xs font-semibold text-[#026AA2] hover:bg-sky-100 transition"
                          >
                            Set Goals
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/hris/appraisal/${targetId}`);
                            }}
                            className="rounded-lg bg-[#F0F9FF] px-4 py-1.5 text-xs font-semibold text-[#026AA2] hover:bg-sky-100 transition"
                          >
                            View
                          </button>
                        )
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
