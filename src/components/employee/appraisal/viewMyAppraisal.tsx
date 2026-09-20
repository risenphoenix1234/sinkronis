"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { getEmployeeAppraisalHistoryDetail } from "@/lib/api/employee";
import { HistoricalAppraisalDetailData } from "@/lib/api/types/employeeTypes";

export interface AppraisalDetailData {
  cycle: string;
  period: string;
  finalScore: number;
  rating: string;
  dateCompleted: string;
  scores?: Array<{ title: string; score: number }>;
}

interface ViewMyAppraisalProps {
  open: boolean;
  onClose: () => void;
  appraisalId?: string | null;
  appraisal?: AppraisalDetailData | null;
}

const defaultScores = [
  {
    title: "Revenue & Business Growth",
    score: 78,
  },
  {
    title: "Operational Excellence",
    score: 85,
  },
  {
    title: "Employee Experience",
    score: 82,
  },
  {
    title: "Collaboration",
    score: 88,
  },
  {
    title: "Leadership",
    score: 82,
  },
];

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    const cleanDateStr = dateStr.split("T")[0];
    const [y, m, d] = cleanDateStr.split("-").map(Number);
    if (!y || !m || !d) return dateStr;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ViewMyAppraisal({
  open,
  onClose,
  appraisalId,
  appraisal,
}: ViewMyAppraisalProps) {
  const [detail, setDetail] = useState<HistoricalAppraisalDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (open && appraisalId) {
      setLoading(true);
      setError(null);
      getEmployeeAppraisalHistoryDetail(appraisalId)
        .then((data) => {
          if (isMounted) {
            setDetail(data);
          }
        })
        .catch((err: unknown) => {
          if (isMounted) {
            console.error("Failed to load historical appraisal detail:", err);
            setError(
              err instanceof Error
                ? err.message
                : "Unable to load appraisal detail. Showing summary record.",
            );
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    } else if (!open) {
      setDetail(null);
      setError(null);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [open, appraisalId]);

  if (!open) return null;

  const cycle = detail?.cycle?.name ?? appraisal?.cycle ?? "Performance Review";
  const period = detail?.cycle
    ? `${formatDate(detail.cycle.periodFrom)} – ${formatDate(detail.cycle.periodTo)}`
    : (appraisal?.period ?? "Jan – Mar 2026");
  const dateCompleted =
    formatDate(
      detail?.acknowledgement?.acknowledgedAt ||
        detail?.hrApproval?.approvedAt ||
        detail?.goalsConfirmedAt,
    ) !== "—"
      ? formatDate(
          detail?.acknowledgement?.acknowledgedAt ||
            detail?.hrApproval?.approvedAt ||
            detail?.goalsConfirmedAt,
        )
      : (appraisal?.dateCompleted ?? "15 Apr 2026");

  const finalScore =
    detail?.finalScore != null
      ? Math.round(detail.finalScore)
      : (appraisal?.finalScore ?? 83);

  const rawRating = detail?.rating ?? appraisal?.rating ?? "Meets Expectations";
  const rating =
    typeof rawRating === "string"
      ? rawRating.replace(/_/g, " ")
      : "Meets Expectations";

  const isExceeds =
    rating.toLowerCase().includes("exceed") ||
    rating.toLowerCase().includes("outstanding") ||
    rating.toLowerCase().includes("above");

  const scores = appraisal?.scores ?? defaultScores;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{cycle}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {period} • Completed {dateCompleted}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-12 text-gray-400">
              <Loader2 className="h-7 w-7 animate-spin text-[#1683D8]" />
              <p className="text-xs font-medium text-gray-500">
                Loading completed appraisal details...
              </p>
            </div>
          ) : (
            <>
              {/* Performance Objectives / Criteria */}
              {detail?.criteria && detail.criteria.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Evaluation Criteria & Weights
                  </h4>
                  {detail.criteria.map((criterion, idx) => (
                    <div
                      key={criterion.section || idx}
                      className="rounded-lg border border-gray-100 bg-gray-50/50 p-3.5"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
                        <span>{criterion.section}</span>
                        <span className="text-[#1683D8]">
                          Weight: {criterion.weight}%
                        </span>
                      </div>
                      {criterion.objectives && criterion.objectives.length > 0 && (
                        <div className="mt-2.5 space-y-1.5 border-t border-gray-100 pt-2">
                          {criterion.objectives.map((obj) => (
                            <div
                              key={obj.id}
                              className="flex items-center justify-between text-xs text-gray-600"
                            >
                              <span>{obj.title}</span>
                              <span className="font-medium text-gray-500">
                                {obj.weight}%
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Goals Breakdown */}
              {detail?.goals && detail.goals.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Key Performance Goals
                  </h4>
                  {detail.goals.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-lg border border-gray-100 p-3.5 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-gray-900">
                          {g.title}
                        </span>
                        {g.managerRating != null && (
                          <span className="shrink-0 rounded bg-blue-50 px-2.5 py-0.5 font-medium text-blue-700">
                            Rating: {g.managerRating}/5
                          </span>
                        )}
                      </div>
                      {g.description && (
                        <p className="mt-1 text-gray-500">{g.description}</p>
                      )}
                      {g.managerComment && (
                        <p className="mt-1.5 text-gray-600">
                          <span className="font-medium text-gray-700">
                            Manager feedback:
                          </span>{" "}
                          "{g.managerComment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Default Score Bars when detailed criteria not present */}
              {(!detail?.criteria || detail.criteria.length === 0) &&
                (!detail?.goals || detail.goals.length === 0) && (
                  <div className="space-y-4">
                    {scores.map((item) => (
                      <div key={item.title}>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-sm text-gray-600">{item.title}</p>
                          <span className="text-sm font-semibold text-gray-800">
                            {item.score}%
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-[#1683D8] transition-all"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Manager Feedback Card */}
              {detail?.managerReview?.overallFeedback && (
                <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      Manager Review
                    </h4>
                    {detail.reviewer?.name && (
                      <span className="text-xs font-medium text-blue-700">
                        {detail.reviewer.name}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-700">
                    "{detail.managerReview.overallFeedback}"
                  </p>
                  {detail.managerReview.recommendation && (
                    <span className="mt-2 inline-block rounded bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-800">
                      {detail.managerReview.recommendation.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
              )}

              {/* Final Score Card */}
              <div
                className={`rounded-lg border p-5 ${
                  isExceeds
                    ? "border-green-200 bg-green-50"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Final Score
                    </p>
                    {detail?.stage && (
                      <span className="text-xs text-gray-500">
                        Stage: {detail.stage}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <h3
                      className={`text-3xl font-bold ${
                        isExceeds ? "text-green-700" : "text-[#1683D8]"
                      }`}
                    >
                      {finalScore}%
                    </h3>

                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        isExceeds
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-[#1683D8]"
                      }`}
                    >
                      {rating}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
