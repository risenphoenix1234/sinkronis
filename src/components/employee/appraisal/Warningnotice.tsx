"use client";

import { AlertTriangle } from "lucide-react";

export default function WarningNotice() {
  return (
    <div className="flex gap-4 rounded-xl border border-yellow-300 bg-yellow-50 p-5">
      <AlertTriangle className="text-yellow-600" size={24} />

      <div>
        <h3 className="font-semibold text-yellow-700">Important Notice</h3>

        <p className="mt-2 text-sm text-yellow-700 leading-6">
          Performance appraisals are confidential HR documents. Ensure all
          assessments are objective, evidence-based, and reviewed before
          submission.
        </p>
      </div>
    </div>
  );
}
