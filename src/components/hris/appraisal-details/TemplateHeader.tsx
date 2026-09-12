import { Eye, X } from "lucide-react";

type TemplateHeaderProps = {
  onClose: () => void;
  templateName: string;
  templateDescription?: string;
  editable?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  saving?: boolean;
  saveError?: string | null;
  onNameChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  isDefault?: boolean;
  onIsDefaultChange?: (value: boolean) => void;
  quarterScoring?: boolean;
  onQuarterScoringChange?: (value: boolean) => void;
};

export function TemplateHeader({
  onClose,
  templateName,
  templateDescription,
  editable = false,
  onSave,
  onCancel,
  saving = false,
  saveError = null,
  onNameChange,
  onDescriptionChange,
  isDefault = false,
  onIsDefaultChange,
  quarterScoring = false,
  onQuarterScoringChange,
}: TemplateHeaderProps) {
  return (
    <header className="border-b border-dashed border-[#E5E7EB] px-10 py-6">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          {editable ? (
            <>
              <input
                type="text"
                value={templateName}
                onChange={(e) => onNameChange?.(e.target.value)}
                className="w-full max-w-md rounded border border-[#D9DEE7] px-2 py-1 text-[20px] font-bold leading-6 text-[#1F2937] outline-none focus:border-[#2388D0]"
              />
              <textarea
                value={templateDescription ?? ""}
                onChange={(e) => onDescriptionChange?.(e.target.value)}
                rows={2}
                placeholder="Template description…"
                className="mt-2 w-full max-w-md rounded border border-[#D9DEE7] px-2 py-1 text-[13px] text-[#667085] outline-none focus:border-[#2388D0]"
              />
              <div className="mt-3 flex flex-wrap items-center gap-5">
                <label className="flex items-center gap-2 text-[13px] text-[#667085]">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => onIsDefaultChange?.(e.target.checked)}
                    className="h-4 w-4 rounded border-[#D9DEE7] text-[#2388D0] focus:ring-[#2388D0]"
                  />
                  Set as default template
                </label>

                <label className="flex items-center gap-2 text-[13px] text-[#667085]">
                  <input
                    type="checkbox"
                    checked={quarterScoring}
                    onChange={(e) => onQuarterScoringChange?.(e.target.checked)}
                    className="h-4 w-4 rounded border-[#D9DEE7] text-[#2388D0] focus:ring-[#2388D0]"
                  />
                  Enable quarterly scoring
                </label>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-[20px] font-bold leading-6 text-[#1F2937]">
                {templateName}
              </h1>
              {templateDescription && (
                <p className="mt-2 text-[13px] text-[#667085]">
                  {templateDescription}
                </p>
              )}
            </>
          )}

          {saveError && (
            <p className="mt-2 text-[12px] font-medium text-red-600">
              {saveError}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-5">
          {editable ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="h-[44px] rounded-lg border border-[#D9DEE7] px-4 text-[13px] font-medium text-[#667085] transition hover:bg-[#F8FAFC] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="h-[44px] rounded-lg bg-[#2388D0] px-5 text-[13px] font-semibold text-white transition hover:bg-[#1F78B8] disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          ) : (
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
          )}

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
