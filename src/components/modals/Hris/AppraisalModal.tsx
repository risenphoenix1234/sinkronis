"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { createAppraisalCycle, getAppraisalTemplates } from "@/lib/api/hris";
import type {
  AppraisalTemplateSummary,
  CreateAppraisalCyclePayload,
} from "@/lib/api/types/hrisTypes";

interface AppraisalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AppraisalModal({
  isOpen,
  onClose,
  onSuccess,
}: AppraisalModalProps) {
  const [cycleName, setCycleName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [launchMode, setLaunchMode] = useState<"SAVE_AS_DRAFT" | "LAUNCH_AS_ACTIVE">("SAVE_AS_DRAFT");

  const [templates, setTemplates] = useState<AppraisalTemplateSummary[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTemplatesLoading(true);
    getAppraisalTemplates()
      .then((res) => {
        setTemplates(res.data);
        if (res.data.length > 0 && !templateId) {
          setTemplateId(res.data[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch appraisal templates:", err);
      })
      .finally(() => setTemplatesLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cycleName.trim()) {
      toast.error("Please provide a cycle name");
      return;
    }
    if (!templateId) {
      toast.error("Please select a template");
      return;
    }
    if (!periodFrom || !periodTo) {
      toast.error("Please specify both start and end dates");
      return;
    }
    if (!submissionDeadline) {
      toast.error("Please specify a submission deadline");
      return;
    }

    const payload: CreateAppraisalCyclePayload = {
      cycleName: cycleName.trim(),
      templateId,
      periodFrom,
      periodTo,
      submissionDeadline,
      description: description.trim() || undefined,
      launchMode,
    };

    setSubmitting(true);
    try {
      await createAppraisalCycle(payload);
      toast.success(
        launchMode === "LAUNCH_AS_ACTIVE"
          ? "Appraisal cycle launched successfully!"
          : "Appraisal cycle saved as draft!",
      );
      // Reset form
      setCycleName("");
      setDescription("");
      setPeriodFrom("");
      setPeriodTo("");
      setSubmissionDeadline("");
      setLaunchMode("SAVE_AS_DRAFT");

      onSuccess?.();
      onClose();
    } catch (err) {
      const detail = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? err.message)
        : "Failed to create appraisal cycle";
      toast.error(detail);
      console.error("Error creating cycle:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
      <div className="relative max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between bg-white px-8 pt-7 pb-4 border-b">
          <div>
            <h2 className="text-[26px] font-semibold text-slate-800">
              Create Appraisal Cycle
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Define the period, select a template, and launch.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cycle Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cycle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cycleName}
                onChange={(e) => setCycleName(e.target.value)}
                placeholder="e.g. Q3 2026 Performance Review"
                required
                className="h-12 w-full rounded-md border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500"
              />
            </div>

            {/* Template Dropdown */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Template <span className="text-red-500">*</span>
              </label>

              {templatesLoading ? (
                <div className="flex h-12 items-center gap-2 rounded-md border border-slate-200 px-4 text-sm text-slate-400">
                  <Loader2 size={16} className="animate-spin" />
                  Loading templates…
                </div>
              ) : (
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  required
                  className="h-12 w-full rounded-md border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 bg-white"
                >
                  {templates.length === 0 ? (
                    <option value="">No templates available</option>
                  ) : (
                    templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Period From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={periodFrom}
                  onChange={(e) => setPeriodFrom(e.target.value)}
                  required
                  className="h-12 w-full rounded-md border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Period To <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={periodTo}
                  onChange={(e) => setPeriodTo(e.target.value)}
                  required
                  className="h-12 w-full rounded-md border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submission Deadline */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Submission Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={submissionDeadline}
                onChange={(e) => setSubmissionDeadline(e.target.value)}
                required
                className="h-12 w-full rounded-md border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe this review cycle..."
                className="w-full resize-none rounded-md border border-slate-200 p-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* Launch Status */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Launch Status
              </label>

              <div className="flex gap-8">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="launchStatus"
                    checked={launchMode === "SAVE_AS_DRAFT"}
                    onChange={() => setLaunchMode("SAVE_AS_DRAFT")}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">Save as Draft</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="launchStatus"
                    checked={launchMode === "LAUNCH_AS_ACTIVE"}
                    onChange={() => setLaunchMode("LAUNCH_AS_ACTIVE")}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">
                    Launch as Active
                  </span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="h-12 min-w-[120px] rounded-md border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 min-w-[180px] items-center justify-center gap-2 rounded-md bg-[#2388D0] px-6 text-sm font-medium text-white transition hover:bg-[#1a6ea8] disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing…</span>
                  </>
                ) : launchMode === "LAUNCH_AS_ACTIVE" ? (
                  "Launch Cycle"
                ) : (
                  "Save as Draft"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
