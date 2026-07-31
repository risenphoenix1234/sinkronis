"use client";

import { X } from "lucide-react";

interface AppraisalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppraisalModal({
  isOpen,
  onClose,
}: AppraisalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
      <div className="relative w-full max-w-[680px] rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-7">
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
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 pt-6">
          <form className="space-y-5">
            {/* Cycle Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cycle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Q3 2026 Performance Review"
                className="h-12 w-full rounded-md border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500"
              />
            </div>

            {/* Template */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Template <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                className="h-12 w-full rounded-md border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500"
              />

              <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                6 competencies • 4 self-assessment questions • 3 manager
                questions
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Period From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="h-12 w-full rounded-md border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Period To <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
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
                className="h-12 w-full rounded-md border border-slate-200 px-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                rows={4}
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
                    name="status"
                    defaultChecked
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">Save as Draft</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">
                    Launch as Active
                  </span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="h-12 min-w-[120px] rounded-md border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="h-12 min-w-[180px] rounded-md bg-slate-100 px-6 text-sm font-medium text-slate-400"
              >
                Save as Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
