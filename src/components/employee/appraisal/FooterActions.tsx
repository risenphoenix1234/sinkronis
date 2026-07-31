"use client";

export default function FooterActions() {
  return (
    <div className="flex justify-end gap-4">
      <button className="rounded-lg border border-gray-300 px-6 py-3 font-medium">
        Save Draft
      </button>

      <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700">
        Submit Appraisal
      </button>
    </div>
  );
}
