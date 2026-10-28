"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
  Save,
  Send,
  User,
} from "lucide-react";

import QuarterTabs from "./QuarterTabs";
import StatusBadge from "../appraisal/StatusBadge";
import ManagerObjectivesTable from "./ManagerObjectiveTable";
import ManagerBehaviourTable from "./ManagerBehaviourTable";
import GrandTotalReflection from "./GrandTotalReflection";
import GrandTotal from "./GrandTotal";
import { getManagerReview, submitManagerReview } from "@/lib/api/hris";
import type {
  GetManagerReviewData,
  SelfAssessmentTemplateSection,
  TemplateSection,
  ManagerReviewRecommendation,
  SubmitManagerReviewData,
  SubmitManagerReviewGoalRating,
  SubmitManagerReviewQuestionResponse,
  SubmitManagerReviewPayload,
} from "@/lib/api/types/hrisTypes";
import Loader from "@/components/ui/Loader";

export interface ManagerReviewProps {
  appraisalId?: string;
  data?: GetManagerReviewData | null;
  loading?: boolean;
  error?: string | null;
  pendingMessage?: string | null;
  onRetry?: () => void;
  onReviewSubmitted?: (result: SubmitManagerReviewData) => void;
}

export default function ManagerReview({
  appraisalId,
  data: externalData,
  loading: externalLoading,
  error: externalError,
  pendingMessage: externalPendingMessage,
  onRetry: externalOnRetry,
  onReviewSubmitted,
}: ManagerReviewProps = {}) {
  const [internalData, setInternalData] = useState<GetManagerReviewData | null>(
    null,
  );
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [internalPending, setInternalPending] = useState<string | null>(null);

  // Local submission state when review has just been submitted
  const [localSubmittedData, setLocalSubmittedData] =
    useState<SubmitManagerReviewData | null>(null);

  // Form State
  const [inputRatings, setInputRatings] = useState<
    Record<string, { rating?: number; comment?: string }>
  >({});
  const [inputResponses, setInputResponses] = useState<Record<string, string>>(
    {},
  );
  const [inputFeedback, setInputFeedback] = useState<string>("");
  const [inputRecommendation, setInputRecommendation] = useState<
    ManagerReviewRecommendation | ""
  >("");

  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isControlled =
    externalData !== undefined ||
    externalLoading !== undefined ||
    externalError !== undefined ||
    externalPendingMessage !== undefined;

  const data = isControlled ? externalData : internalData;
  const loading = isControlled ? Boolean(externalLoading) : internalLoading;
  const error = isControlled ? externalError : internalError;
  const pendingMessage = isControlled
    ? externalPendingMessage
    : internalPending;

  const fetchReview = useCallback(() => {
    if (!appraisalId || isControlled) return;
    setInternalLoading(true);
    setInternalError(null);
    setInternalPending(null);

    getManagerReview(appraisalId)
      .then((res) => {
        setInternalData(res);
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          setInternalPending(
            err.response.data?.message ||
              "Employee self-assessment has not been submitted yet.",
          );
        } else {
          const msg =
            err.response?.data?.message || "Failed to load manager review.";
          setInternalError(msg);
          toast.error(msg);
        }
      })
      .finally(() => {
        setInternalLoading(false);
      });
  }, [appraisalId, isControlled]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  // Prepopulate form state from existing manager review data (e.g. drafts)
  useEffect(() => {
    if (data?.managerReview) {
      const mr = data.managerReview;
      if (mr.overallFeedback) {
        setInputFeedback((prev) => prev || mr.overallFeedback || "");
      }
      if (mr.recommendation) {
        setInputRecommendation(
          (prev) => prev || (mr.recommendation as ManagerReviewRecommendation),
        );
      }
      if (mr.goalRatings && mr.goalRatings.length > 0) {
        const initialRatings: Record<
          string,
          { rating?: number; comment?: string }
        > = {};
        mr.goalRatings.forEach((g) => {
          initialRatings[g.goalId] = {
            rating: g.rating ?? undefined,
            comment: g.comment ?? "",
          };
        });
        setInputRatings((prev) => ({ ...initialRatings, ...prev }));
      }
      const resList = mr.responses || mr.managerReviewResponses;
      if (resList && resList.length > 0) {
        const initialResponses: Record<string, string> = {};
        resList.forEach((r) => {
          initialResponses[r.questionId] = r.response;
        });
        setInputResponses((prev) => ({ ...initialResponses, ...prev }));
      }
    }
  }, [data]);

  const handleRetry = () => {
    if (externalOnRetry) {
      externalOnRetry();
    } else {
      fetchReview();
    }
  };

  const handleRatingChange = (goalId: string, rating: number) => {
    setInputRatings((prev) => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        rating,
      },
    }));
  };

  const handleCommentChange = (goalId: string, comment: string) => {
    setInputRatings((prev) => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        comment,
      },
    }));
  };

  const handleResponseChange = (questionId: string, response: string) => {
    setInputResponses((prev) => ({
      ...prev,
      [questionId]: response,
    }));
  };

  const handleSaveOrSubmit = async (isSubmit: boolean) => {
    const targetId = appraisalId || data?.appraisalId;
    if (!targetId) {
      setSubmitError("Appraisal ID is missing.");
      return;
    }

    setSubmitError(null);

    // Validation for submission per Swagger schema description:
    // "overallFeedback, recommendation, all goals, and all required configured questions are mandatory when submit is true; drafts may be incomplete."
    if (isSubmit) {
      if (!inputFeedback || inputFeedback.trim().length < 3) {
        setSubmitError(
          "Overall feedback is required (at least 3 characters) to submit review.",
        );
        return;
      }
      if (!inputRecommendation) {
        setSubmitError(
          "Please select a recommendation (On Track, Exceeds Expectation, or Needs Improvement).",
        );
        return;
      }
      const goalsToRate = (data?.goals ?? []) as { id: string }[];
      const unrated = goalsToRate.filter(
        (g) => typeof inputRatings[g.id]?.rating !== "number",
      );
      if (unrated.length > 0) {
        setSubmitError("Rate every goal from 1 to 5 before submitting.");
        return;
      }
    }

    // Build goalRatings
    const goalRatingsPayload: SubmitManagerReviewGoalRating[] = Object.entries(
      inputRatings,
    )
      .filter(
        ([, val]) =>
          typeof val.rating === "number" && val.rating >= 1 && val.rating <= 5,
      )
      .map(([goalId, val]) => ({
        goalId,
        rating: val.rating as number,
        ...(val.comment ? { comment: val.comment.trim() } : {}),
      }));

    // Build responses
    const responsesPayload: SubmitManagerReviewQuestionResponse[] =
      Object.entries(inputResponses)
        .filter(([, val]) => val && val.trim().length > 0)
        .map(([questionId, response]) => ({
          questionId,
          response: response.trim(),
        }));

    const payload: SubmitManagerReviewPayload = {
      ...(goalRatingsPayload.length > 0
        ? { goalRatings: goalRatingsPayload }
        : {}),
      ...(responsesPayload.length > 0 ? { responses: responsesPayload } : {}),
      ...(inputFeedback.trim()
        ? { overallFeedback: inputFeedback.trim() }
        : {}),
      ...(inputRecommendation ? { recommendation: inputRecommendation } : {}),
      submit: isSubmit,
    };

    if (isSubmit) {
      setSubmitting(true);
    } else {
      setSavingDraft(true);
    }

    try {
      const response = await submitManagerReview(targetId, payload);
      if (isSubmit) {
        toast.success("Manager review submitted successfully!");
        setLocalSubmittedData(response);
        onReviewSubmitted?.(response);
        if (!isControlled) {
          fetchReview();
        }
      } else {
        toast.success("Manager review draft saved successfully.");
      }
    } catch (err) {
      console.error("Manager review submission error:", err);
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
        const validationMsg = Array.isArray(resData?.validationErrors)
          ? resData.validationErrors
              .map(
                (v: { field?: string; path?: string; message?: string }) =>
                  `${v.field || v.path || "Field"}: ${v.message || "Invalid value"}`,
              )
              .join("; ")
          : null;
        const errMsg =
          validationMsg ||
          resData?.message ||
          `Failed to ${isSubmit ? "submit" : "save"} manager review.`;
        setSubmitError(errMsg);
        toast.error(errMsg);
      } else {
        const errMsg =
          err instanceof Error
            ? err.message
            : `Failed to ${isSubmit ? "submit" : "save"} manager review.`;
        setSubmitError(errMsg);
        toast.error(errMsg);
      }
    } finally {
      setSubmitting(false);
      setSavingDraft(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF4FF]">
              <ClipboardCheck size={18} className="text-[#1677C8]" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Manager Review</h2>
            </div>
          </div>
          <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
          <Loader2 size={24} className="animate-spin text-[#1677C8]" />
          <Loader variant="section" label="Loading manager review" />
        </div>
      </section>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF4FF]">
              <ClipboardCheck size={18} className="text-[#1677C8]" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Manager Review</h2>
            </div>
          </div>
          <StatusBadge text="Error" color="yellow" />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1 font-semibold underline hover:text-red-900"
            >
              <RefreshCw size={12} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 3. Stage Locked / 409 Pending State
  if (pendingMessage) {
    return (
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF4FF]">
              <ClipboardCheck size={18} className="text-[#1677C8]" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Manager Review</h2>
            </div>
          </div>
          <StatusBadge text="Pending" color="yellow" />
        </div>

        <div className="p-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-5">
            <div className="flex items-start gap-3">
              <Clock size={20} className="mt-0.5 shrink-0 text-amber-600" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900">
                  Manager Review Pending
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-amber-800">
                  {pendingMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 4. Success / Interactive State
  const rawStatus = data?.managerReview?.status;
  const isSubmitted = Boolean(
    localSubmittedData?.managerReviewSubmittedAt ||
    data?.managerReview?.submittedAt ||
    rawStatus === "SUBMITTED" ||
    rawStatus === "COMPLETED" ||
    data?.stage === "PENDING_HR_APPROVAL" ||
    data?.stage === "HR_APPROVAL" ||
    data?.stage === "ACKNOWLEDGMENT" ||
    data?.stage === "ACKNOWLEDGEMENT" ||
    data?.stage === "COMPLETED",
  );

  const rawQuarter = data?.quarter;
  const activeQuarter: "Q1" | "Q2" | "Q3" | "Q4" =
    rawQuarter === "Q1" ||
    rawQuarter === "Q2" ||
    rawQuarter === "Q3" ||
    rawQuarter === "Q4"
      ? rawQuarter
      : "Q2";

  const statusText = isSubmitted
    ? "Completed"
    : rawStatus === "IN_PROGRESS"
      ? "In Progress"
      : rawStatus || "In Progress";

  const statusColor: "green" | "yellow" | "blue" =
    statusText === "Completed"
      ? "green"
      : statusText === "In Progress"
        ? "blue"
        : "yellow";

  const overallScore = data?.selfAssessment?.overallScore;

  // Extract sections if provided by template or selfAssessment
  const sections: SelfAssessmentTemplateSection[] =
    data?.selfAssessment?.sections ||
    data?.template?.configuration?.sections ||
    [];

  const kraSection = sections.find((s) => s.section === "KRA") || null;
  const behaviouralSection =
    sections.find((s) => s.section === "BEHAVIOURAL") || null;

  const calculateResultSum = (
    sec: SelfAssessmentTemplateSection | TemplateSection | null | undefined,
  ): number => {
    if (!sec?.objectives) return 0;
    let sum = 0;
    (
      sec.objectives as unknown as Array<{
        keyResults?: Array<{
          kpiWeight: number | string;
          target?: number | string | null;
          [key: string]: unknown;
        }>;
      }>
    ).forEach((obj) => {
      obj.keyResults?.forEach((kr) => {
        const ach =
          "achieved" in kr && (kr as Record<string, unknown>).achieved != null
            ? parseFloat(String((kr as Record<string, unknown>).achieved))
            : NaN;
        const tgt =
          "target" in kr && kr.target != null
            ? parseFloat(String(kr.target))
            : NaN;
        const kpi =
          typeof kr.kpiWeight === "number"
            ? kr.kpiWeight
            : parseFloat(String(kr.kpiWeight || 0));
        if (!isNaN(ach) && !isNaN(kpi)) {
          if (!isNaN(tgt) && tgt > 0) {
            sum += (ach / tgt) * kpi;
          } else {
            sum += (ach * kpi) / 100;
          }
        }
      });
    });
    return sum;
  };

  const managerGoals = (data?.goals ?? []) as {
    id: string;
    title: string;
    description?: string | null;
  }[];

  const kraSum = calculateResultSum(kraSection);
  const behSum = calculateResultSum(behaviouralSection);
  const dynamicTotal = kraSum + behSum;
  const grandTotalScore =
    dynamicTotal > 0
      ? Math.round(dynamicTotal)
      : overallScore != null
        ? overallScore
        : 0;
  const grandTotalRating =
    grandTotalScore > 120
      ? "Outstanding"
      : grandTotalScore > 100
        ? "Above Expectation"
        : grandTotalScore >= 80
          ? "Meets Expectation"
          : grandTotalScore >= 60
            ? "Below Expectation"
            : "Poor Performance";
    grandTotalScore > 120
      ? "Outstanding"
      : grandTotalScore > 100
        ? "Above Expectation"
        : grandTotalScore >= 80
          ? "Meets Expectation"
          : grandTotalScore >= 60
            ? "Below Expectation"
            : "Poor Performance";

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <User size={18} className="text-[#7A1E9E]" />
          <h2 className="font-semibold text-slate-800 text-base">
            Manager Review
          </h2>
        </div>

        {isSubmitted ? (
          <span className="inline-flex items-center rounded-full bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5] px-3.5 py-1 text-xs font-medium">
            Submitted
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-[#F9F5FF] text-[#6941C6] border border-[#E9D7FE] px-3.5 py-1 text-xs font-medium">
            In Progress
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-8 p-6">
        {/* Quarter */}
        <div>
          <QuarterTabs active={activeQuarter} />
        </div>

        {/* KRA Objectives Table */}
        <ManagerObjectivesTable
          section={kraSection}
          quarter={activeQuarter}
          goalRatings={data?.managerReview?.goalRatings}
          editable={!isSubmitted}
          onRatingChange={handleRatingChange}
          onCommentChange={handleCommentChange}
          inputRatings={inputRatings}
        />

        {/* Behaviour Table */}
        <ManagerBehaviourTable
          section={behaviouralSection}
          quarter={activeQuarter}
          editable={!isSubmitted}
          onCommentChange={handleCommentChange}
          inputRatings={inputRatings}
        />

        {managerGoals.length > 0 && (
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800">
              Goal Ratings
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Rate each goal from 1 to 5.
            </p>
            <div className="mt-4 space-y-4">
              {managerGoals.map((goal) => {
                const saved = data?.managerReview?.goalRatings?.find(
                  (g) => g.goalId === goal.id,
                );
                const shown = inputRatings[goal.id]?.rating ?? saved?.rating;
                return (
                  <div
                    key={goal.id}
                    className="rounded-lg border border-slate-100 bg-slate-50/50 p-4"
                  >
                    <p className="text-sm font-medium text-slate-800">
                      {goal.title}
                    </p>
                    {goal.description && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {goal.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleRatingChange(goal.id, n)}
                          className={`h-8 w-8 rounded-md border text-sm font-semibold transition disabled:cursor-not-allowed ${
                            shown === n
                              ? "border-[#2183C6] bg-[#2183C6] text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:border-[#2183C6]"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      disabled={isSubmitted}
                      value={
                        inputRatings[goal.id]?.comment ?? saved?.comment ?? ""
                      }
                      onChange={(e) =>
                        handleCommentChange(goal.id, e.target.value)
                      }
                      placeholder="Comment (optional)"
                      className="mt-3 w-full rounded border border-slate-200 px-3 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#2183C6] focus:outline-none focus:ring-1 focus:ring-[#2183C6]/20"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Grand Total Banner */}
        <GrandTotal
          quarter={activeQuarter}
          score={grandTotalScore}
          ratingLabel={grandTotalRating}
        />

        {/* Grand Total & Manager Reflection */}
        <GrandTotalReflection
          overallFeedback={data?.managerReview?.overallFeedback}
          recommendation={
            localSubmittedData?.recommendation ||
            data?.managerReview?.recommendation
          }
          overallScore={grandTotalScore}
          quarter={activeQuarter}
          responses={
            data?.managerReview?.responses ||
            data?.managerReview?.managerReviewResponses
          }
          employeeReflections={data?.selfAssessment?.reflections}
          reflectionQuestions={
            data?.template?.configuration?.managerReviewQuestions
          }
          editable={!isSubmitted}
          onResponseChange={handleResponseChange}
          onOverallFeedbackChange={setInputFeedback}
          onRecommendationChange={(rec) =>
            setInputRecommendation(rec as ManagerReviewRecommendation)
          }
          inputResponses={inputResponses}
          inputFeedback={inputFeedback}
          inputRecommendation={inputRecommendation}
        />

        {/* Error Alert */}
        {submitError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
            <span className="leading-relaxed">{submitError}</span>
          </div>
        )}

        {/* Action Controls for Manager Review */}
        {!isSubmitted && (
          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={() => handleSaveOrSubmit(true)}
              disabled={savingDraft || submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#7A1E9E] hover:bg-[#651883] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin text-white" />}
              Submit Manager Review
            </button>
            <button
              type="button"
              onClick={() => handleSaveOrSubmit(false)}
              disabled={savingDraft || submitting}
              className="ml-3 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingDraft && <Loader2 size={16} className="animate-spin" />}
              Save Draft
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
