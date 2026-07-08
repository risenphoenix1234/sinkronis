// components/appraisal-details/ReviewTimeline.tsx

import { Check } from "lucide-react";

const steps = [
  "Goal Setting",
  "Self-Assessment",
  "Manager Review",
  "HR Approval",
  "Acknowledgment",
];

export default function ReviewTimeline() {
  return (
    <div className="rounded-lg border bg-white px-8 py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white">
                <Check size={18} />
              </div>

              <p className="mt-2 text-xs text-slate-600">{step}</p>
            </div>

            {index !== steps.length - 1 && (
              <div className="mx-4 h-[2px] flex-1 bg-green-700" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
