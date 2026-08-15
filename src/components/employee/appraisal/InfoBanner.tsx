import { Info } from "lucide-react";

export default function InfoBanner() {
  return (
    <div className="flex items-start gap-3 rounded-md border border-blue-200 bg-blue-50 px-4 py-3">
      <Info size={18} className="mt-0.5 shrink-0 text-blue-600" />

      <p className="text-sm text-blue-700">
        Self-assessment is open. Enter your achieved values below and submit
        before the deadline.
      </p>
    </div>
  );
}
