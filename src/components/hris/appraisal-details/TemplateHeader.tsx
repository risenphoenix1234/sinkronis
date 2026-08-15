import { Eye, X } from "lucide-react";

type TemplateHeaderProps = {
  onClose: () => void;
};

export function TemplateHeader({ onClose }: TemplateHeaderProps) {
  return (
    <header className="border-b border-dashed border-[#E5E7EB] px-10 py-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[20px] font-bold leading-6 text-[#1F2937]">
            Standard Performance Review
          </h1>

          <p className="mt-2 text-[13px] text-[#667085]">
            General-purpose OKR/KRA template suitable for all roles.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <div className="flex h-[52px] overflow-hidden rounded-lg border border-[#D9DEE7]">
            <button
              type="button"
              className="min-w-[120px] bg-[#F8FAFC] px-4 text-[13px] font-medium text-[#667085]"
            >
              Template View
            </button>

            <button
              type="button"
              className="flex min-w-[52px] items-center justify-center gap-1 bg-[#2388D0] px-3 text-white"
            >
              <Eye size={15} />

              <span className="text-[12px]">Employee</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close template view"
            className="text-[#667085] transition hover:text-[#1F2937]"
          >
            <X size={21} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
