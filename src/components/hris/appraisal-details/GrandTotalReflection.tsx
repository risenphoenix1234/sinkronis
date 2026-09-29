"use client";

import type { ManagerReviewRecommendation } from "@/lib/api/types/hrisTypes";

export interface GrandTotalReflectionProps {
  overallFeedback?: string | null;
  recommendation?: string | null;
  overallScore?: number | null;
  quarter?: string | null;
  responses?: Array<{ questionId: string; response: string }> | null;
  employeeReflections?: Array<{ questionId: string; response: string }> | null;
  reflectionQuestions?: Array<{ id: string; question: string }> | null;
  editable?: boolean;
  onResponseChange?: (questionId: string, response: string) => void;
  onOverallFeedbackChange?: (feedback: string) => void;
  onRecommendationChange?: (rec: ManagerReviewRecommendation | string) => void;
  inputResponses?: Record<string, string>;
  inputFeedback?: string;
  inputRecommendation?: ManagerReviewRecommendation | string | "";
}

const DEFAULT_MANAGER_QUESTIONS = [
  {
    id: "mq1",
    question:
      "1. What is this employee's most significant contribution this period?",
    placeholder: "Describe their key achievements and impacts...",
    empQuestionIndex: 0,
  },
  {
    id: "mq2",
    question:
      "2. What is one key area where this employee should focus on improving?",
    placeholder:
      "Be constructive and specific — include recommended actions...",
    empQuestionIndex: 1,
  },
  {
    id: "mq3",
    question:
      "3. What development opportunities do you recommend for this employee?",
    placeholder:
      "Training, mentorship, stretch assignments, role changes, etc...",
    empQuestionIndex: 2,
  },
];

const RECOMMENDATION_OPTIONS: Array<{
  value: string;
  label: string;
}> = [
  { value: "PROMOTE", label: "Promote" },
  { value: "ON_TRACK", label: "On Track" },
  { value: "NEEDS_IMPROVEMENT", label: "Needs Improvement" },
  { value: "PERFORMANCE_REVIEW", label: "Performance Review" },
];

export default function GrandTotalReflection({
  overallFeedback = "",
  recommendation,
  employeeReflections,
  reflectionQuestions,
  editable = true,
  onResponseChange,
  onOverallFeedbackChange,
  onRecommendationChange,
  inputResponses = {},
  inputFeedback = "",
  inputRecommendation,
}: GrandTotalReflectionProps = {}) {
  // Map questions with employee responses
  const questionsToDisplay =
    reflectionQuestions && reflectionQuestions.length > 0
      ? reflectionQuestions.map((q, idx) => {
          const empMatch = employeeReflections?.[idx]?.response;
          return {
            id: q.id,
            question: q.question.match(/^\d+\./)
              ? q.question
              : `${idx + 1}. ${q.question}`,
            placeholder:
              idx === 1
                ? "Be constructive and specific — include recommended actions..."
                : idx === 2
                  ? "Training, mentorship, stretch assignments, role changes, etc..."
                  : "Enter your response...",
            empResponse: empMatch || "No employee response recorded.",
          };
        })
      : DEFAULT_MANAGER_QUESTIONS.map((q, idx) => ({
          id: q.id,
          question: q.question,
          placeholder: q.placeholder,
          empResponse:
            employeeReflections?.[idx]?.response ||
            "No employee response recorded.",
        }));

  const currentRecommendationValue =
    inputRecommendation !== undefined && inputRecommendation !== ""
      ? inputRecommendation
      : recommendation || "";

  const feedbackValue =
    inputFeedback !== undefined ? inputFeedback : overallFeedback || "";

  return (
    <div className="space-y-6">
      {/* 3 Feedback Questions */}
      <div className="space-y-6">
        {questionsToDisplay.map((item) => {
          const qVal = inputResponses[item.id] ?? "";

          return (
            <div key={item.id} className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-800">
                {item.question}
              </h3>

              {/* EMPLOYEE SAID Box */}
              <div className="rounded-lg border border-dashed border-slate-200 bg-[#FAFAFC] p-3.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  EMPLOYEE SAID
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.empResponse}
                </p>
              </div>

              {/* Manager Response Textarea */}
              {editable ? (
                <textarea
                  rows={3}
                  value={qVal}
                  onChange={(e) => onResponseChange?.(item.id, e.target.value)}
                  placeholder={item.placeholder}
                  className="w-full rounded-md border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#7A1E9E] focus:ring-1 focus:ring-[#7A1E9E]/20 min-h-[75px] resize-y"
                />
              ) : (
                <div className="rounded-md border border-dashed border-slate-200 bg-white p-3 text-sm text-slate-700 min-h-[48px]">
                  {qVal || "Not yet provided."}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Feedback + Recommendation (Two Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* Left: Overall Feedback */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800">
            Overall Feedback
          </label>
          {editable ? (
            <textarea
              rows={4}
              value={feedbackValue}
              onChange={(e) => onOverallFeedbackChange?.(e.target.value)}
              placeholder="Provide a comprehensive summary of this employee's performance..."
              className="w-full rounded-md border border-slate-200 p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#7A1E9E] focus:ring-1 focus:ring-[#7A1E9E]/20 min-h-[105px] resize-y"
            />
          ) : (
            <div className="rounded-md border border-dashed border-slate-200 bg-white p-3 text-sm text-slate-700 min-h-[48px]">
              {feedbackValue || "No overall feedback provided."}
            </div>
          )}
        </div>

        {/* Right: Recommendation */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800">
            Recommendation
          </label>

          {editable ? (
            <div className="space-y-2.5 pt-1">
              {RECOMMENDATION_OPTIONS.map((opt) => {
                const isChecked =
                  currentRecommendationValue === opt.value ||
                  currentRecommendationValue?.toUpperCase() === opt.value;

                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 cursor-pointer select-none text-sm ${
                      isChecked
                        ? "text-slate-900 font-semibold"
                        : "text-slate-700 font-normal"
                    }`}
                    onClick={() => {
                      if (editable) onRecommendationChange?.(opt.value);
                    }}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${
                        isChecked
                          ? "border-[#1677C8] bg-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isChecked && (
                        <span className="h-2 w-2 rounded-full bg-[#1677C8]" />
                      )}
                    </span>
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="pt-1">
              {(() => {
                const upper = String(currentRecommendationValue || "").toUpperCase();
                const label =
                  RECOMMENDATION_OPTIONS.find(
                    (opt) =>
                      opt.value === currentRecommendationValue ||
                      opt.value === upper,
                  )?.label ||
                  currentRecommendationValue ||
                  "Promote";

                if (upper === "NEEDS_IMPROVEMENT" || upper === "NEEDS IMPROVEMENT") {
                  return (
                    <span className="inline-flex items-center rounded-full bg-[#FEF0C7] text-[#B54708] border border-[#FEDF89] px-3.5 py-1 text-xs font-semibold">
                      {label}
                    </span>
                  );
                }
                if (upper === "ON_TRACK" || upper === "ON TRACK") {
                  return (
                    <span className="inline-flex items-center rounded-full bg-[#F0F9FF] text-[#026AA2] border border-[#B9E6FE] px-3.5 py-1 text-xs font-semibold">
                      {label}
                    </span>
                  );
                }
                if (upper === "PERFORMANCE_REVIEW" || upper === "PERFORMANCE REVIEW") {
                  return (
                    <span className="inline-flex items-center rounded-full bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA] px-3.5 py-1 text-xs font-semibold">
                      {label}
                    </span>
                  );
                }
                return (
                  <span className="inline-flex items-center rounded-full bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5] px-3.5 py-1 text-xs font-semibold">
                    {label}
                  </span>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
