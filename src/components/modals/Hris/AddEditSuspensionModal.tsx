"use client";

import SuspensionDrawer from "../../hris/conduct/SuspensionDrawer";

interface AddEditSuspensionModalProps {
  open: boolean;
  onclose: () => void;
}

export default function AddEditSuspensionModal({
  open,
  onclose,
}: AddEditSuspensionModalProps) {
  if (!open) return null;
  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      {/* Modal Layer */}
      <div className="fixed inset-0 z-40 bg-black/50" />

      <SuspensionDrawer open={true} suspension={null} onClose={onclose} />
      <button
        onClick={onclose}
        className="h-11 rounded border border-[#E5E7EB] px-6 text-sm text-[#374151]"
      >
        Cancel
      </button>
    </div>
  );
}
