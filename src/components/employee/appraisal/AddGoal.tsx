"use client";

import { X, Target } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddGoal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="h-full fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-8">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Q1 2026 Review
          </h2>

          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}

        <div className="border border-sky-300 m-5 rounded-lg">
          {/* Section Header */}

          <div className="flex items-center gap-2 border-b bg-slate-50 px-5 py-4">
            <Target className="h-4 w-4 text-sky-600" />

            <h3 className="text-sm font-semibold text-slate-700">Goals</h3>
          </div>

          <div className="space-y-5 p-5">
            {/* Notice */}

            <div className="rounded border border-sky-200 bg-sky-50 p-4 text-sm text-sky-700">
              Propose goals for Babatunde for this appraisal cycle. Add at least
              one goal then submit for employee confirmation.
            </div>

            {/* Goal Card */}

            <div className="rounded border bg-slate-50 p-5">
              {/* Goal Title */}

              <div className="mb-5">
                <label className="mb-2 block text-xs font-medium text-slate-600">
                  Goal Title *
                </label>

                <input
                  type="text"
                  placeholder="Improve Customer satisfaction"
                  className="w-full rounded border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              {/* Description */}

              <div className="mb-5">
                <label className="mb-2 block text-xs font-medium text-slate-600">
                  Description
                </label>

                <textarea
                  rows={4}
                  placeholder="What needs to be accomplished..."
                  className="w-full rounded border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500 resize-none"
                />
              </div>

              {/* Success Criteria */}

              <div className="mb-5">
                <label className="mb-2 block text-xs font-medium text-slate-600">
                  Success Criteria
                </label>

                <input
                  type="text"
                  placeholder="When i am done"
                  className="w-full rounded border border-slate-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              {/* Target Date */}

              <div className="mb-6">
                <label className="mb-2 block text-xs font-medium text-slate-600">
                  Target Date
                </label>

                <input
                  type="date"
                  className="w-40 rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
              </div>

              {/* Footer */}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="rounded border border-slate-300 bg-white px-5 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button className="rounded bg-sky-600 px-5 py-2 text-sm text-white hover:bg-sky-700">
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
