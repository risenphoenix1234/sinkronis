import { Info } from "lucide-react";

export default function NotificationBanner() {
  return (
    <div className="mt-6 flex items-center justify-between rounded-lg border border-[#B2F0E9] bg-[#E8FFFB] px-5 py-3">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0BA5A4] text-white">
          <Info size={16} />
        </div>

        <p className="text-sm text-[#344054]">
          Payroll submission for the current Pay period is due in{" "}
          <span className="font-semibold">2 days.</span> Review and finalize all
          employee payroll details.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="rounded-md bg-[#06AED4] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0997b8]">
          More details
        </button>

        <button className="rounded-md border border-[#D0D5DD] bg-white px-4 py-2 text-sm font-medium text-[#475467] transition hover:bg-gray-50">
          Dismiss
        </button>
      </div>
    </div>
  );
}
