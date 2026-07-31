"use client";

import { X } from "lucide-react";

interface Metric {
  title: string;
  score: number;
}

interface ViewAppraisalProps {
  open: boolean;
  onClose: () => void;
}

const metrics: Metric[] = [
  { title: "Revenue & Business Growth", score: 78 },
  { title: "Operational Excellence", score: 85 },
  { title: "Employee Experience", score: 82 },
  { title: "Collaboration", score: 88 },
  { title: "Leadership", score: 82 },
];

const ProgressItem = ({ title, score }: Metric) => (
  <div>
    <div className="mb-2 flex items-center justify-between text-sm">
      <span className="text-gray-600">{title}</span>
      <span className="font-semibold text-gray-900">{score}%</span>
    </div>

    <div className="h-1 overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-blue-500 transition-all"
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

export default function ViewAppraisal({ open, onClose }: ViewAppraisalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Q1 2026 Review
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Jan – Mar 2026 • Completed 15 Apr 2026
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Metrics */}
        <div className="mt-8 space-y-6">
          {metrics.map((metric) => (
            <ProgressItem key={metric.title} {...metric} />
          ))}
        </div>

        {/* Final Score */}
        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Final Score</p>
            </div>

            <div className="text-right">
              <h3 className="text-3xl font-bold text-green-600">83%</h3>

              <span className="mt-2 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                Meets Expectations
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
