"use client";

import Button from "./Button";
import Card from "./Card";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ConfirmSubmitModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold">Submit Appraisal?</h2>

        <p className="mt-3 text-sm text-slate-600">
          Once submitted, you won't be able to edit your self-assessment until
          it is returned by your manager.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            className="bg-slate-200 text-slate-800 hover:bg-slate-300 disabled:opacity-50"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button loading={loading} disabled={loading} onClick={onConfirm}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
