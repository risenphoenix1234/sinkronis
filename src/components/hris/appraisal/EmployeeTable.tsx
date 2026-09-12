"use client";

import { AppraisalReview } from "@/lib/api/types/hrisTypes";
import { useRouter } from "next/navigation";
import { ClipboardList, ExternalLink } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

interface EmployeeTableProps {
  reviews: AppraisalReview[];
  loading: boolean;
}

const STAGE_LABELS: Record<string, string> = {
  GOAL_SETTING: "Goal Setting",
  SELF_ASSESSMENT: "Self Assessment",
  MANAGER_REVIEW: "Manager Review",
  HR_APPROVAL: "HR Approval",
  ACKNOWLEDGMENT: "Acknowledgment",
  COMPLETED: "Completed",
  IN_PROGRESS: "In Progress",
};

export default function EmployeeTable({
  reviews,
  loading,
}: EmployeeTableProps) {
  const router = useRouter();

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="font-semibold text-slate-800">All Employees</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Manager</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                  Loading employee reviews…
                </td>
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
                      Start an appraisal cycle to initiate performance reviews for your team.
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
                const initials = employeeName
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "EP";

                const departmentName =
                  typeof review.department === "object"
                    ? review.department?.name ?? "—"
                    : review.department ?? "—";

                const managerName =
                  typeof review.manager === "object"
                    ? review.manager?.name ?? "—"
                    : review.manager ?? "—";

                const rawStage = review.stage || review.status || "";
                const displayStatus = STAGE_LABELS[rawStage] || rawStage || "—";
                const scoreDisplay =
                  review.score !== null && review.score !== undefined
                    ? `${review.score}%`
                    : "—";

                return (
                  <tr
                    key={targetId || idx}
                    onClick={() => targetId && router.push(`/hris/appraisal/${targetId}`)}
                    className={`transition-colors ${
                      targetId ? "cursor-pointer hover:bg-slate-50/80" : "hover:bg-slate-50/40"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700 shadow-sm">
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

                    <td className="px-6 py-4 text-slate-600">{departmentName}</td>
                    <td className="px-6 py-4 text-slate-600">{managerName}</td>

                    <td className="px-6 py-4">
                      <StatusBadge status={displayStatus} />
                    </td>

                    <td className="px-6 py-4 font-semibold text-sky-600">
                      {scoreDisplay}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {targetId ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/hris/appraisal/${targetId}`);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300"
                        >
                          View
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </button>
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
