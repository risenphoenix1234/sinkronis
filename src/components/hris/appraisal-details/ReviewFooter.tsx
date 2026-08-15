import { ArrowLeft, Download } from "lucide-react";

export default function ReviewFooter() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
      >
        <ArrowLeft size={17} />
        Back to Reviews
      </button>

      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-gray-50"
      >
        <Download size={17} />
        Download Review
      </button>
    </div>
  );
}
