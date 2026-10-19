"use client";

import { useState } from "react";
import ReassignReviewerModal from "./ReassignReviewerModal";
import { AppraisalSummary, AppraisalEmployee } from "@/lib/api/types/hrisTypes";
interface EmployeeCardProps {
  employee: AppraisalEmployee;
  appraisal: AppraisalSummary;
  statusOverride?: string;
  appraisalId?: string;
  canReassign?: boolean;
  onReassigned?: () => void;
}

function renderStatusBadge(status: string) {
  switch (status) {
    case "Not Started":
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          Not Started
        </span>
      );
    case "Goals Proposed":
    case "Pending HR Approval":
      return (
        <span className="inline-flex items-center rounded-full bg-[#FEF6EE] px-3 py-1 text-xs font-medium text-[#B54708] border border-[#FEDF89]">
          {status}
        </span>
      );
    case "Under Manager Review":
      return (
        <span className="inline-flex items-center rounded-full bg-[#F9F5FF] px-3 py-1 text-xs font-medium text-[#6941C6]">
          {status}
        </span>
      );
    case "Pending Acknowledgment":
    case "Acknowledgment":
    case "Acknowledgement":
      return (
        <span className="inline-flex items-center rounded-full bg-[#EFF8FF] px-3 py-1 text-xs font-medium text-[#175CD3] border border-[#B2DDFF]">
          Pending Acknowledgment
        </span>
      );
    case "Acknowledged":
    case "Completed":
      return (
        <span className="inline-flex items-center rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-medium text-[#027A48] border border-[#A6F4C5]">
          {status}
        </span>
      );
    case "Self-Assessment Submitted":
      return (
        <span className="inline-flex items-center rounded-full bg-[#F0F9FF] px-3 py-1 text-xs font-medium text-[#026AA2]">
          {status}
        </span>
      );
    case "Self-Assessment Open":
      return (
        <span className="inline-flex items-center rounded-full bg-[#FEF0C7] px-3 py-1 text-xs font-medium text-[#B54708]">
          Self-Assessment Open
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          {status}
        </span>
      );
  }
}

export default function EmployeeCard({
  employee,
  appraisal,
  statusOverride,
  appraisalId,
  canReassign = false,
  onReassigned,
}: EmployeeCardProps) {
  const [reassignOpen, setReassignOpen] = useState(false);
  const displayStatus = statusOverride || appraisal.statusLabel || "Not Started";
  const showScore =
    appraisal.overallScorePercent > 0 &&
    displayStatus !== "Not Started" &&
    displayStatus !== "Goal Setting" &&
    displayStatus !== "Goals Proposed" &&
    displayStatus !== "Self-Assessment Open" &&
    displayStatus !== "Self-Assessment" &&
    displayStatus !== "Under Manager Review" &&
    displayStatus !== "Manager Review" &&
    displayStatus !== "Pending HR Approval" &&
    displayStatus !== "HR Approval" &&
    displayStatus !== "Pending Acknowledgment" &&
    displayStatus !== "Acknowledgment" &&
    displayStatus !== "Acknowledgement" &&
    displayStatus !== "Acknowledged" &&
    displayStatus !== "Completed";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E7F2FD] text-base font-bold text-[#1677C8]">
            {employee.avatarInitials}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {employee.name}
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              {employee.title} · {employee.department} · Manager:{" "}
              {employee.managerName}
              {canReassign && appraisalId && (
                <button
                  type="button"
                  onClick={() => setReassignOpen(true)}
                  className="ml-2 font-semibold text-[#2183C6] hover:underline"
                >
                  Change reviewer
                </button>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            {renderStatusBadge(displayStatus)}

            <p className="mt-2 text-xs text-gray-400">
              {appraisal.cycleTitle} · {appraisal.templateName}
            </p>
          </div>

          {showScore && (
            <div className="border-l border-gray-200 pl-6">
              <h1 className="text-4xl font-bold text-[#026AA2]">
                {appraisal.overallScorePercent}%
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                {appraisal.overallRatingLabel}
              </p>
            </div>
                   )}
        </div>
      </div>

      {canReassign && appraisalId && (
        <ReassignReviewerModal
          open={reassignOpen}
          onClose={() => setReassignOpen(false)}
          appraisalId={appraisalId}
          currentManagerName={employee.managerName}
          onReassigned={onReassigned}
        />
      )}
    </div>
  );
}