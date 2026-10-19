// src/app/manager/appraisal/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ClipboardList, Loader2, RefreshCw } from "lucide-react";
import { getAppraisals } from "@/lib/api/hris";
import type { AppraisalReview } from "@/lib/api/types/hrisTypes";

const STAGE_LABELS: Record<string, string> = {
  GOAL_SETTING: "Goals Proposed",
  SELF_ASSESSMENT: "Self-Assessment Open",
  SELF_ASSESSMENT_SUBMITTED: "Self-Assessment Submitted",
  MANAGER_REVIEW: "Awaiting Your Review",
  HR_APPROVAL: "Pending HR Approval",
  ACKNOWLEDGMENT: "Awaiting Acknowledgment",
  COMPLETED: "Completed",
  IN_PROGRESS: "In Progress",
  NOT_STARTED: "Not Started",
};

const stagePillClass = (stage: string) => {
  switch (stage) {
    case "MANAGER_REVIEW":
      return "bg-[#EEF6FC] text-[#2183C6] border border-[#B9DCF3]";
    case "HR_APPROVAL":
      return "bg-[#FEF0C7] text-[#B54708] border border-[#FEDF89]";
    case "ACKNOWLEDGMENT":
    case "COMPLETED":
      return "bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5]";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
};

const getName = (r: AppraisalReview) =>
  r.employee?.name ?? r.employeeName ?? r.name ?? "Unknown Employee";

const getRole = (r: AppraisalReview) =>
  r.employee?.role ?? r.role ?? r.employee?.employeeId ?? "—";

const getDepartment = (r: AppraisalReview) =>
  typeof r.department === "object" && r.department !== null
    ? (r.department.name ?? "—")
    : ((r.department as string | null | undefined) ?? "—");

export default function ManagerAppraisalPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<AppraisalReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getAppraisals({ limit: 100 })
      .then((res) => {
        setReviews(Array.isArray(res?.data) ? res.data : []);
      })
      .catch((err: unknown) => {
        const apiMsg = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message;
        setError(apiMsg || "Failed to load appraisals.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const awaitingCount = reviews.filter((r) => r.stage === "MANAGER_REVIEW")
    .length;
  const completedCount = reviews.filter(
    (r) => r.stage === "COMPLETED" || r.stage === "ACKNOWLEDGMENT",
  ).length;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Appraisal</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review your team&apos;s performance appraisals.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-2xl font-bold text-slate-900">{reviews.length}</p>
          <p className="mt-1 text-sm text-slate-500">Team Appraisals</p>
        </div>
        <div className="rounded-xl border border-[#B9DCF3] bg-[#EEF6FC] p-5">
          <p className="text-2xl font-bold text-[#2183C6]">{awaitingCount}</p>
          <p className="mt-1 text-sm text-slate-600">Awaiting Your Review</p>
        </div>
        <div className="rounded-xl border border-[#A6F4C5] bg-[#ECFDF3] p-5">
          <p className="text-2xl font-bold text-[#027A48]">{completedCount}</p>
          <p className="mt-1 text-sm text-slate-600">Completed</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
            <Loader2 size={18} className="animate-spin text-[#2183C6]" />
            <span>Loading appraisals...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-between gap-3 p-5 text-sm text-red-700">
            <span className="flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </span>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-1 font-semibold underline"
            >
              <RefreshCw size={13} />
              Retry
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
            <ClipboardList size={28} className="text-slate-300" />
            <p className="text-sm">No appraisals assigned to you yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map((r, idx) => {
                  const id = r.appraisalId || r.id || "";
                  const stage = r.stage || r.status || "";
                  const name = getName(r);
                  const initials =
                    name
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "EP";
                  const canReview = stage === "MANAGER_REVIEW";

                  return (
                    <tr
                      key={id || idx}
                      onClick={() =>
                        id && router.push(`/manager/appraisal/${id}`)
                      }
                      className={
                        id ? "cursor-pointer hover:bg-slate-50/80" : ""
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF6FC] text-xs font-semibold text-[#2183C6]">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900">
                              {name}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {getRole(r)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {getDepartment(r)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${stagePillClass(stage)}`}
                        >
                          {STAGE_LABELS[stage] || stage || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {r.score !== null && r.score !== undefined ? (
                          <span className="font-bold text-[#2183C6]">
                            {r.score}%
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {id && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/manager/appraisal/${id}`);
                            }}
                            className={
                              canReview
                                ? "rounded-lg bg-[#2183C6] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1b6aa2]"
                                : "rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            }
                          >
                            {canReview ? "Review" : "View"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}