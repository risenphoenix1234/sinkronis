"use client";

import { X } from "lucide-react";

interface ViewMyAppraisalProps {
  open: boolean;
  onClose: () => void;
}

const appraisalScores = [
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

export default function ViewMyAppraisal({
  open,
  onClose,
}: ViewMyAppraisalProps) {
  if (!open) return null;

  const finalScore = 83;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Q1 2026 Review
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Jan – Mar 2026 • Completed 15 Apr 2026
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-2 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {appraisalScores.map((item) => (
            <div key={item.title}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-gray-600">{item.title}</p>

                <span className="text-sm font-semibold text-gray-800">
                  {item.score}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${item.score}%`,
                  }}
                />
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-green-200 bg-green-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Final Score</p>
              </div>

              <div className="text-right">
                <h3 className="text-3xl font-bold text-green-700">
                  {finalScore}%
                </h3>

                <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Meets Expectations
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
