"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  Loader2,
  Shield,
  ShieldCheck,
  ThumbsUp,
} from "lucide-react";
import { acknowledgeAppraisal } from "@/lib/api/hris";
import type { AcknowledgeAppraisalPayload } from "@/lib/api/types/hrisTypes";

export interface HRApprovalAndAcknowledgmentProps {
  appraisalId?: string;
  hrNotes?: string;
  employeeResponse?: string;
  isCompleted?: boolean;
  acknowledgedAt?: string | null;
  onEmployeeResponseChange?: (value: string) => void;
  onAcknowledge?: () => void;
  onSuccess?: (result: unknown) => void;
}

export default function HRApprovalAndAcknowledgment({
  appraisalId,
  hrNotes = "",
  employeeResponse,
  isCompleted = false,
  acknowledgedAt,
  onEmployeeResponseChange,
  onAcknowledge,
  onSuccess,
}: HRApprovalAndAcknowledgmentProps) {
  const [internalResponse, setInternalResponse] = useState(
    employeeResponse || "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(Boolean(isCompleted));

  useEffect(() => {
    if (isCompleted !== undefined) {
      setCompleted(isCompleted);
    }
  }, [isCompleted]);

  useEffect(() => {
    if (employeeResponse !== undefined) {
      setInternalResponse(employeeResponse);
    }
  }, [employeeResponse]);

  const currentResponse =
    employeeResponse !== undefined ? employeeResponse : internalResponse;

  const handleResponseChange = (val: string) => {
    if (onEmployeeResponseChange) {
      onEmployeeResponseChange(val);
    } else {
      setInternalResponse(val);
    }
  };

  const handleAcknowledgeClick = async () => {
    if (!appraisalId) {
      onAcknowledge?.();
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload: AcknowledgeAppraisalPayload = {
        ...(currentResponse.trim() ? { response: currentResponse.trim() } : {}),
      };

      const res = await acknowledgeAppraisal(appraisalId, payload);
      toast.success("Appraisal acknowledged and completed successfully.");
      setCompleted(true);
      onSuccess?.(res);
      onAcknowledge?.();
    } catch (err) {
      console.error("Failed to acknowledge appraisal:", err);
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
        const msg =
          resData?.message ||
          (err.response?.status === 403
            ? "Appraisal access is not permitted. Employee authorization required."
            : err.response?.status === 409
              ? "HR approval is not complete yet."
              : "Failed to acknowledge appraisal.");
        setSubmitError(msg);
        toast.error(msg);
      } else {
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to acknowledge appraisal.";
        setSubmitError(msg);
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ================= HR APPROVAL ================= */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dashed border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield
              size={18}
              strokeWidth={2}
              className="text-[#8A5800]"
            />

            <h2 className="text-sm font-semibold text-slate-900">
              HR Approval
            </h2>
          </div>

          {/* Approved badge */}
          <span className="rounded-full bg-[#ECFDF3] border border-[#A6F4C5] px-2.5 py-0.5 text-xs font-medium text-[#027A48]">
            Approved
          </span>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <label
            htmlFor="hr-notes"
            className="mb-1.5 block text-xs font-medium text-slate-500"
          >
            HR Notes (internal — not visible to employee)
          </label>

          <div
            id="hr-notes"
            className="min-h-[44px] rounded-md border border-dashed border-slate-200 bg-white px-3.5 py-2.5 text-xs leading-relaxed text-slate-700"
          >
            {hrNotes || "No notes recorded."}
          </div>
        </div>
      </section>

      {/* ================= EMPLOYEE ACKNOWLEDGMENT ================= */}
      <section
        className={`overflow-hidden rounded-xl bg-white shadow-xs border ${
          completed ? "border-slate-200" : "border-[#10753E]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dashed border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <ThumbsUp size={18} strokeWidth={2} className="text-[#10753E]" />

            <h2 className="text-sm font-semibold text-slate-900">
              Employee Acknowledgment
            </h2>
          </div>

          {/* Badge */}
          {completed ? (
            <span className="rounded-full bg-[#ECFDF3] border border-[#A6F4C5] px-2.5 py-0.5 text-xs font-medium text-[#027A48]">
              Acknowledged
            </span>
          ) : (
            <span className="rounded-full bg-[#EFF8FF] border border-[#B2DDFF] px-2.5 py-0.5 text-xs font-medium text-[#175CD3]">
              Awaiting Employee
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Notification banner (only when awaiting acknowledgement) */}
          {!completed && (
            <div className="rounded-lg border border-[#D1FADF] bg-[#ECFDF3] p-3">
              <p className="text-xs font-medium text-[#027A48] leading-relaxed">
                The employee has been notified to review and acknowledge their completed appraisal.
              </p>
            </div>
          )}

          {/* Employee Response */}
          <div>
            <label
              htmlFor="employee-response"
              className="mb-1.5 block text-xs font-medium text-slate-500"
            >
              Employee Response (optional)
            </label>

            {completed ? (
              <div
                id="employee-response"
                className="min-h-[44px] rounded-md border border-dashed border-slate-200 bg-white px-3.5 py-2.5 text-xs leading-relaxed text-slate-700"
              >
                {currentResponse || "No response provided."}
              </div>
            ) : (
              <textarea
                id="employee-response"
                value={currentResponse}
                onChange={(e) => handleResponseChange(e.target.value)}
                disabled={submitting}
                rows={3}
                placeholder="Employee may add a response or comments before acknowledging..."
                className="w-full resize-y rounded-lg border border-slate-200 bg-white p-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#10753E] focus:ring-1 focus:ring-[#10753E]/20 min-h-[90px] disabled:bg-slate-50"
              />
            )}
          </div>

          {/* Submit Error banner */}
          {submitError && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
              <span className="leading-relaxed">{submitError}</span>
            </div>
          )}

          {/* Action button (only when awaiting acknowledgement) */}
          {!completed && (
            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={handleAcknowledgeClick}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-[#10753E] hover:bg-[#0d5e32] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin text-white" />
                ) : (
                  <CheckCircle2 size={16} strokeWidth={2} />
                )}
                <span>Acknowledge &amp; Close Appraisal</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
