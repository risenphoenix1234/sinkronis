"use client";

import { useState } from "react";
import { Check, X, AlertTriangle } from "lucide-react";

export default function ApprovalActions() {
  const [showReject, setShowReject] = useState(false);

  return (
    <>
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">
              Final Approval Decision
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Approve the appraisal to complete the HR review process.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowReject(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <X size={17} />
              Request Changes
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1677C8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1268AE]"
            >
              <Check size={17} />
              Approve Review
            </button>
          </div>
        </div>
      </section>

      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-start gap-4 border-b p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle size={20} className="text-red-600" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  Request Changes
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Explain what needs to be changed before this appraisal can be
                  approved.
                </p>
              </div>
            </div>

            <div className="p-6">
              <label
                htmlFor="change-reason"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Reason
              </label>

              <textarea
                id="change-reason"
                rows={5}
                placeholder="Enter the required changes..."
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReject(false)}
                  className="rounded-lg border px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => setShowReject(false)}
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Send Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
