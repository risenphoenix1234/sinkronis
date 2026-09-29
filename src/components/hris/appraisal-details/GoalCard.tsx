"use client";

import { useState } from "react";
import { Goal } from "@/lib/api/types/hrisTypes";

interface GoalCardProps {
  goal: Goal;
  onRate?: (goal: Goal) => void;
  editableEmployeeRating?: boolean;
  onEmployeeRatingChange?: (rating: number) => void;
  onEmployeeCommentChange?: (comment: string) => void;
  isManagerReview?: boolean;
  editableManagerRating?: boolean;
  onManagerRatingChange?: (rating: number) => void;
  onManagerCommentChange?: (comment: string) => void;
}

const RATING_LABELS: Record<number, string> = {
  5: "Outstanding",
  4: "Exceeds Expectations",
  3: "Meets Expectations",
  2: "Needs Improvement",
  1: "Unsatisfactory",
};

export default function GoalCard({
  goal,
  onRate,
  editableEmployeeRating = true,
  onEmployeeRatingChange,
  onEmployeeCommentChange,
  isManagerReview = false,
  editableManagerRating = false,
  onManagerRatingChange,
  onManagerCommentChange,
}: GoalCardProps) {
  const [empRating, setEmpRating] = useState<number>(goal.employeeRating ?? 0);
  const [empComment, setEmpComment] = useState<string>(
    goal.employeeComment ?? "",
  );
  const [mgrRating, setMgrRating] = useState<number>(goal.managerRating ?? 0);
  const [mgrComment, setMgrComment] = useState<string>(
    goal.managerComment ?? "",
  );

  const handleSelectEmpRating = (num: number) => {
    if (!editableEmployeeRating && isManagerReview) return;
    setEmpRating(num);
    onEmployeeRatingChange?.(num);
  };

  const handleEmpCommentChange = (text: string) => {
    setEmpComment(text);
    onEmployeeCommentChange?.(text);
  };

  const handleSelectMgrRating = (num: number) => {
    setMgrRating(num);
    onManagerRatingChange?.(num);
  };

  const handleMgrCommentChange = (text: string) => {
    setMgrComment(text);
    onManagerCommentChange?.(text);
  };

  const displayStatus =
    goal.status === "COMPLETED"
      ? "Completed"
      : goal.status === "ACTIVE"
        ? "In Progress"
        : "Not Started";

  const isEmpSubmitted = isManagerReview || !editableEmployeeRating;
  const ratingLabel = RATING_LABELS[empRating] || "";

  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-white p-5 space-y-4">
      {/* Title, Description & Status */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-slate-900 text-sm">{goal.title}</h3>
          {goal.description && (
            <p className="text-xs text-slate-500 leading-relaxed">
              {goal.description}
            </p>
          )}
          {goal.successCriteria && (
            <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-0.5">
              <span className="text-[#027A48] font-bold">✓</span>
              <span>{goal.successCriteria}</span>
            </p>
          )}
          {goal.targetDate && (
            <p className="text-[11px] text-slate-400 pt-0.5">
              Target: {goal.targetDate}
            </p>
          )}
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
            displayStatus === "Completed"
              ? "bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]"
              : displayStatus === "In Progress"
                ? "bg-[#FEF6EE] text-[#B54708] border-[#FEDF89]"
                : "bg-[#F2F4F7] text-[#344054] border-slate-200"
          }`}
        >
          {displayStatus}
        </span>
      </div>

      {/* 2-Column Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* EMPLOYEE Column */}
        <div className="space-y-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            EMPLOYEE
          </h5>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((num) => {
              const isFilled = isEmpSubmitted
                ? num <= empRating
                : empRating === num;
              return (
                <button
                  key={num}
                  type="button"
                  disabled={isEmpSubmitted}
                  onClick={() => handleSelectEmpRating(num)}
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md text-sm font-semibold transition border ${
                    isFilled
                      ? "bg-[#1677C8] text-white border-[#1677C8] shadow-xs"
                      : "bg-[#F8FAFC] text-slate-700 border-slate-200 hover:border-[#1677C8] hover:text-[#1677C8]"
                  } ${isEmpSubmitted ? "cursor-default" : "cursor-pointer"}`}
                >
                  {num}
                </button>
              );
            })}
            {ratingLabel && isEmpSubmitted && (
              <span className="text-xs font-semibold text-[#1677C8] ml-1">
                {ratingLabel}
              </span>
            )}
          </div>

          {/* Employee Comment */}
          {isEmpSubmitted ? (
            empComment ? (
              <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                {empComment}
              </p>
            ) : null
          ) : (
            <textarea
              rows={2}
              value={empComment}
              onChange={(e) => handleEmpCommentChange(e.target.value)}
              placeholder="Comment..."
              className="w-full max-w-md rounded-md border border-slate-200 p-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#1677C8] focus:ring-1 focus:ring-[#1677C8]/20 min-h-[60px] resize-y"
            />
          )}
        </div>

        {/* MANAGER Column */}
        <div className="space-y-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            MANAGER
          </h5>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((num) => {
              const isSelected = mgrRating === num;
              return (
                <button
                  key={num}
                  type="button"
                  disabled={!editableManagerRating}
                  onClick={() => handleSelectMgrRating(num)}
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md text-sm font-semibold transition border ${
                    isSelected
                      ? "bg-[#1677C8] text-white border-[#1677C8] shadow-xs"
                      : "bg-[#F8FAFC] text-slate-700 border-slate-200 hover:border-[#1677C8] hover:text-[#1677C8]"
                  } ${!editableManagerRating ? "cursor-default" : "cursor-pointer"}`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Manager Comment */}
          {editableManagerRating ? (
            <div className="pt-1">
              <textarea
                rows={2}
                value={mgrComment}
                onChange={(e) => handleMgrCommentChange(e.target.value)}
                placeholder="Comment..."
                className="w-full max-w-md rounded-md border border-slate-200 p-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#1677C8] focus:ring-1 focus:ring-[#1677C8]/20 min-h-[60px] resize-y"
              />
            </div>
          ) : (
            mgrComment ? (
              <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                {mgrComment}
              </p>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
