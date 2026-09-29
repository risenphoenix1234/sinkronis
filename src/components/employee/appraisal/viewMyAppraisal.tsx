"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import {
  getEmployeeAppraisalDetail,
  getEmployeeAppraisalGoals,
  getEmployeeAppraisalHistoryDetail,
  getEmployeeSelfAssessment,
} from "@/lib/api/employee";
import {
  EmployeeAppraisalGoalsData,
  EmployeeSelfAssessmentData,
  HistoricalAppraisalDetailData,
} from "@/lib/api/types/employeeTypes";
import AcknowledgeAppraisalModal from "./AcknowledgeAppraisalModal";

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
  onAppraisalUpdated?: () => void;
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
  onAppraisalUpdated,
}: ViewMyAppraisalProps) {
  const [detail, setDetail] = useState<HistoricalAppraisalDetailData | null>(
    null,
  );
  const [goalsData, setGoalsData] = useState<EmployeeAppraisalGoalsData | null>(
    null,
  );
  const [selfAssessment, setSelfAssessment] =
    useState<EmployeeSelfAssessmentData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAcknowledgeOpen, setIsAcknowledgeOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (open && appraisalId) {
      setLoading(true);
      setError(null);

      // Fetch goals data in parallel
      getEmployeeAppraisalGoals(appraisalId)
        .then((data) => {
          if (isMounted) {
            setGoalsData(data);
          }
        })
        .catch(() => {
          // Non-blocking if goals endpoint fails
        });

      // Fetch self-assessment form data in parallel
      getEmployeeSelfAssessment(appraisalId)
        .then((data) => {
          if (isMounted) {
            setSelfAssessment(data);
          }
        })
        .catch(() => {
          // Non-blocking if self-assessment endpoint fails
        });

      getEmployeeAppraisalHistoryDetail(appraisalId)
        .catch(async () => {
          return await getEmployeeAppraisalDetail(appraisalId);
        })
        .then((data) => {
          if (isMounted) {
            setDetail(data);
          }
        })
        .catch((err: unknown) => {
          if (isMounted) {
            console.error("Failed to load appraisal detail:", err);
            const apiMsg = (
              err as { response?: { data?: { message?: string } } }
            )?.response?.data?.message;
            setError(
              apiMsg ||
                (err instanceof Error
                  ? err.message
                  : "Unable to load appraisal detail. Showing summary record."),
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
      setGoalsData(null);
      setSelfAssessment(null);
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
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-xl bg-white shadow-2xl">
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
              {/* Employee & Reviewer Header Info (if available from API) */}
              {(detail?.employee || detail?.reviewer) && (
                <div className="grid grid-cols-1 gap-3 rounded-lg border border-gray-100 bg-gray-50/60 p-3.5 sm:grid-cols-2 text-xs">
                  {detail?.employee && (
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                        Employee
                      </span>
                      <p className="mt-0.5 font-medium text-gray-900">
                        {detail.employee.name || "—"}
                        {detail.employee.employeeCode && (
                          <span className="ml-1 text-gray-500">
                            ({detail.employee.employeeCode})
                          </span>
                        )}
                      </p>
                      <p className="text-gray-600">
                        {detail.employee.role || ""}{" "}
                        {detail.employee.department &&
                          `• ${detail.employee.department}`}
                      </p>
                    </div>
                  )}
                  {detail?.reviewer && (
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                        Reviewer
                      </span>
                      <p className="mt-0.5 font-medium text-gray-900">
                        {detail.reviewer.name || "—"}
                      </p>
                      <p className="text-gray-600">
                        {detail.reviewer.role || ""}
                      </p>
                    </div>
                  )}
                </div>
              )}

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
                      {criterion.objectives &&
                        criterion.objectives.length > 0 && (
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
              {(goalsData?.goals && goalsData.goals.length > 0) ||
              (detail?.goals && detail.goals.length > 0) ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Key Performance Goals
                    </h4>
                    {goalsData && (
                      <div className="flex items-center gap-2">
                        {goalsData.goalsConfirmed ? (
                          <span className="rounded bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-800">
                            Goals Confirmed
                            {goalsData.goalsConfirmedAt
                              ? ` • ${formatDate(goalsData.goalsConfirmedAt)}`
                              : ""}
                          </span>
                        ) : (
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                            Goals Pending Confirmation
                          </span>
                        )}
                        {goalsData.editable && (
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-800">
                            Editable
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {(goalsData?.goals || detail?.goals || []).map((g) => (
                    <div
                      key={g.id}
                      className="rounded-lg border border-gray-100 p-3.5 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-gray-900">
                          {g.title}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {g.status && (
                            <span className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                              {g.status}
                            </span>
                          )}
                          {g.employeeRating != null && (
                            <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                              Self: {g.employeeRating}/5
                            </span>
                          )}
                          {g.managerRating != null && (
                            <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                              Manager: {g.managerRating}/5
                            </span>
                          )}
                        </div>
                      </div>
                      {g.description && (
                        <p className="mt-1 text-gray-500">{g.description}</p>
                      )}
                      {g.successCriteria && (
                        <p className="mt-1 text-gray-600">
                          <span className="font-medium text-gray-700">
                            Success Criteria:
                          </span>{" "}
                          {g.successCriteria}
                        </p>
                      )}
                      {g.targetDate && (
                        <p className="mt-1 text-[11px] text-gray-400">
                          Target Date: {formatDate(g.targetDate)}
                        </p>
                      )}
                      {g.employeeComment && (
                        <p className="mt-1.5 text-gray-600">
                          <span className="font-medium text-gray-700">
                            Employee note:
                          </span>{" "}
                          "{g.employeeComment}"
                        </p>
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

              {/* Self Assessment Reflections */}
              {detail?.selfAssessment?.reflections &&
                detail.selfAssessment.reflections.length > 0 && (
                  <div className="space-y-3 rounded-lg border border-purple-100 bg-purple-50/40 p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                        Self-Assessment Reflections
                      </h4>
                      {detail.selfAssessment.status && (
                        <span className="rounded bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-800">
                          {detail.selfAssessment.status}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 pt-1">
                      {detail.selfAssessment.reflections.map((ref, idx) => (
                        <div key={ref.questionId || idx} className="text-xs">
                          <p className="font-medium text-gray-700">
                            {ref.questionId
                              .replace(/^question_/, "")
                              .replace(/_/g, " ")}
                            :
                          </p>
                          <p className="mt-0.5 text-gray-600 italic">
                            "{ref.response}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Live Self-Assessment Questions if historical reflections not yet submitted */}
              {(!detail?.selfAssessment?.reflections ||
                detail.selfAssessment.reflections.length === 0) &&
                selfAssessment?.reflectionQuestions &&
                selfAssessment.reflectionQuestions.length > 0 && (
                  <div className="space-y-3 rounded-lg border border-purple-100 bg-purple-50/40 p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                        Self-Assessment Reflection Questions
                      </h4>
                      {selfAssessment.quarter && (
                        <span className="rounded bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-800">
                          {selfAssessment.quarter}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 pt-1">
                      {selfAssessment.reflectionQuestions.map((q) => (
                        <div key={q.id} className="text-xs">
                          <p className="font-medium text-gray-800">
                            • {q.question}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

              {/* HR Approval & Acknowledgement */}
              {(detail?.hrApproval || detail?.acknowledgement) && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {detail?.hrApproval?.decision && (
                    <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-3 text-xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        HR Approval
                      </span>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          {detail.hrApproval.decision}
                        </span>
                        {detail.hrApproval.approvedAt && (
                          <span className="text-[11px] text-gray-500">
                            {formatDate(detail.hrApproval.approvedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {detail?.acknowledgement && (
                    <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-3 text-xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Acknowledgement
                      </span>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          {detail.acknowledgement.acknowledged
                            ? "Acknowledged"
                            : "Pending"}
                        </span>
                        {detail.acknowledgement.acknowledgedAt && (
                          <span className="text-[11px] text-gray-500">
                            {formatDate(detail.acknowledgement.acknowledgedAt)}
                          </span>
                        )}
                      </div>
                      {detail.acknowledgement.response && (
                        <p className="mt-1 text-[11px] italic text-gray-600">
                          "{detail.acknowledgement.response}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Workflow History */}
              {detail?.workflowHistory && detail.workflowHistory.length > 0 && (
                <div className="space-y-2 rounded-lg border border-gray-100 bg-gray-50/50 p-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Workflow History
                  </h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                    {detail.workflowHistory.map((step, idx) => (
                      <div
                        key={step.stage || idx}
                        className="rounded border border-gray-200 bg-white p-2"
                      >
                        <p className="font-medium text-gray-800">
                          {step.stage.replace(/_/g, " ")}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-500">
                          {step.completedAt
                            ? formatDate(step.completedAt)
                            : "In Progress"}
                        </p>
                      </div>
                    ))}
                  </div>
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

              {/* Pending Acknowledgment Action Banner */}
              {detail?.stage?.toUpperCase() === "ACKNOWLEDGMENT" &&
                !detail?.acknowledgement?.acknowledged && (
                  <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50/90 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                        Action Required: Acknowledge Appraisal
                      </h4>
                      <p className="mt-0.5 text-xs text-emerald-700">
                        Your appraisal has been approved by HR. Please record
                        your formal acknowledgment to complete this cycle.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAcknowledgeOpen(true)}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-emerald-700"
                    >
                      <CheckCircle2 size={14} />
                      <span>Acknowledge Appraisal</span>
                    </button>
                  </div>
                )}
            </>
          )}
        </div>
      </div>

      {appraisalId && (
        <AcknowledgeAppraisalModal
          open={isAcknowledgeOpen}
          onClose={() => setIsAcknowledgeOpen(false)}
          appraisalId={appraisalId}
          appraisalTitle={detail?.cycle?.name || appraisal?.cycle}
          finalScore={finalScore}
          rating={rating}
          onAcknowledged={(ackData) => {
            setDetail((prev) =>
              prev
                ? {
                    ...prev,
                    stage: "COMPLETED",
                    status: "COMPLETED",
                    acknowledgement: {
                      acknowledged: true,
                      response:
                        ackData.acknowledgedResponse ||
                        "I acknowledge this appraisal.",
                      acknowledgedAt:
                        ackData.acknowledgedAt || new Date().toISOString(),
                    },
                  }
                : prev,
            );
            if (onAppraisalUpdated) {
              onAppraisalUpdated();
            }
          }}
        />
      )}
    </div>
  );
}
