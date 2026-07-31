"use client";

import SuspensionDrawer from "../../hris/conduct/SuspensionDrawer";
import UserProfileCard from "../../hris/conduct/UserProfileCard";

const suspensionData = [
  {
    id: "003546AE",
    name: "Chloe Davis",
    role: "IT Manager",
    department: "IT Department",
    type: "Administrative",
    from: "12.02.2025",
  },
];
interface AddEditSuspensionModalProps {
  open: boolean;
  onclose: () => void;
}

export default function AddEditSuspensionModal({
  open,
  onclose,
}: AddEditSuspensionModalProps) {
  if (!open) return;
  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      {/* Modal Layer */}
      <div className="fixed inset-0 z-40 bg-black/50" />

      <SuspensionDrawer />
      <UserProfileCard />
      <button
        onClick={onclose}
        className="h-11 rounded border border-[#E5E7EB] px-6 text-sm text-[#374151]"
      >
        Cancel
      </button>
    </div>
  );
}
