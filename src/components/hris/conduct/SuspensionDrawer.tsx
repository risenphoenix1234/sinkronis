// components/SuspensionDrawer.tsx

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserProfileCard from "./UserProfileCard";

type SuspensionDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function SuspensionDrawer({
  open,
  onClose,
}: SuspensionDrawerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/20">
      <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-[480px] flex-col bg-white shadow-2xl">
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[#EAECF0] p-4">
            <img src="/avatar.png" alt="" className="h-10 w-10 rounded-full" />

            <div>
              <h2 className="font-semibold text-[#101828]">Chloe Davis</h2>

              <p className="text-xs text-[#667085]">Employee ID</p>

              <p className="text-sm font-medium">003546AE</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 p-5 pb-20 text-sm">
            <InfoRow label="Role" value="IT Manager" />

            <InfoRow label="Email" value="chloedavis@gmail.com" />

            <InfoRow label="Department" value="IT Department" />

            <InfoRow label="Suspension Type" value="Administrative" />

            <InfoRow label="From" value="12.02.2025" />

            <InfoRow label="To" value="14.02.2025" />

            <div>
              <p className="mb-2 text-[#667085]">Query Type</p>

              <div className="flex justify-between">
                <span className="font-medium">Disciplinary</span>

                <span className="font-medium">(QDRL20259)</span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="font-medium">Conditional</span>

                <span className="font-medium">(QDL20258)</span>
              </div>
            </div>

            <div>
              <p className="mb-3 text-[#667085]">Notes</p>

              <div className="rounded-lg border border-[#EAECF0] p-3">
                <div className="flex justify-between">
                  <span className="font-semibold">HR</span>

                  <span className="text-xs text-[#667085]">
                    09.02.2025 10:09PM
                  </span>
                </div>

                <p className="mt-2 text-[#667085]">
                  Performance Related: You failed to finish your tasks twice in
                  a row.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action */}
        <button
          onClick={() => setIsOpen(true)}
          className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#2196F3] text-white shadow-lg"
        >
          <Plus size={18} />
        </button>

        <button
          onClick={() => {
            onClose();
            router.back();
          }}
          className="absolute bottom-6 left-6 flex h-10 items-center justify-center rounded-full bg-[#2196F3] px-5 text-sm font-medium text-white shadow-lg"
        >
          Back
        </button>
      </div>
      <UserProfileCard open={isOpen} onClose={()=> setIsOpen(false)} />
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div>
      <p className="text-[#667085]">{label}</p>

      <p className="mt-1 font-medium text-[#101828]">{value}</p>
    </div>
  );
}
