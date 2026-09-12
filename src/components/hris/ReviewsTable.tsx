"use client";

import { useRouter } from "next/navigation";
import { ClipboardList, ExternalLink, Loader2 } from "lucide-react";
import type { AppraisalReview } from "@/lib/api/types/hrisTypes";
import StatusBadge from "../ui/StatusBadge";

type ReviewsTableProps = {
  reviews: AppraisalReview[];
  loading: boolean;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
};

const COLUMN_COUNT = 7;

const STAGE_LABELS: Record<string, string> = {
  GOAL_SETTING: "Goal Setting",
  SELF_ASSESSMENT: "Self Assessment",
  MANAGER_REVIEW: "Manager Review",
  HR_APPROVAL: "HR Approval",
  ACKNOWLEDGMENT: "Acknowledgment",
  COMPLETED: "Completed",
  IN_PROGRESS: "In Progress",
};

export default function ReviewsTable({
  reviews,
  loading,
  onClearFilters,
  hasActiveFilters,
}: ReviewsTableProps) {
  const router = useRouter();

  const handleNavigate = (appraisalId: string) => {
    if (appraisalId) {
      router.push(`/hris/appraisal/${appraisalId}`);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Cycle</th>
              <th className="px-6 py-4">Stage / Status</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={COLUMN_COUNT} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-7 w-7 animate-spin text-sky-600" />
                    <p className="text-sm font-medium text-slate-500">
                      Loading appraisal reviews…
                    </p>
                  </div>
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT} className="px-6 py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-8 ring-sky-50/50">
                      <ClipboardList className="h-7 w-7" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      No appraisal reviews found
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                      {hasActiveFilters
                        ? "No reviews match your current search or filter criteria. Try adjusting your filters."
                        : "There are currently no performance reviews recorded. Start a cycle to initiate reviews."}
                    </p>
                    {hasActiveFilters && onClearFilters && (
                      <button
                        type="button"
                        onClick={onClearFilters}
                        className="mt-4 rounded-lg bg-sky-50 px-3.5 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-100 hover:text-sky-800"
                      >
                        Clear all filters
                      </button>
                    )}
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

                const cycleName =
                  typeof review.cycle === "object"
                    ? review.cycle?.name ?? "—"
                    : review.cycle ?? "—";

                const rawStage = review.stage || review.status || "";
                const displayStage = STAGE_LABELS[rawStage] || rawStage || "—";

                const scoreDisplay =
                  review.score !== null && review.score !== undefined
                    ? `${review.score}%`
                    : "—";

                const ratingDisplay =
                  review.rating ??
                  (review.ratingValue !== null && review.ratingValue !== undefined
                    ? `${review.ratingValue}/5`
                    : "—");

                const isHrApproval = review.stage === "HR_APPROVAL";

                return (
                  <tr
                    key={targetId || idx}
                    onClick={() => targetId && handleNavigate(targetId)}
                    className={`transition-colors ${
                      targetId
                        ? "cursor-pointer hover:bg-slate-50/80"
                        : "hover:bg-slate-50/40"
                    }`}
                  >
                    {/* Employee */}
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

                    {/* Department */}
                    <td className="px-6 py-4 text-slate-600">
                      {departmentName}
                    </td>

                    {/* Cycle */}
                    <td className="px-6 py-4 text-slate-600">
                      <span className="truncate max-w-[200px] inline-block font-mono text-xs">
                        {cycleName}
                      </span>
                    </td>

                    {/* Status / Stage */}
                    <td className="px-6 py-4">
                      <StatusBadge status={displayStage} />
                    </td>

                    {/* Score */}
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      {scoreDisplay}
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4 text-sky-700 font-medium">
                      {ratingDisplay}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      {targetId ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigate(targetId);
                          }}
                          className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition shadow-sm ${
                            isHrApproval
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : "border border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                          }`}
                        >
                          {isHrApproval ? "Approve" : review.action || "View"}
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
