// components/SuspensionDrawer.tsx

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuspensionDrawer() {
  const router = useRouter();
  return (
    <div className="fixed top-0 right-[320px] z-50 h-screen w-[420px] bg-white shadow-xl">
      <div className="h-full overflow-y-auto">
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
        <div className="space-y-4 p-5 text-sm">
          <InfoRow label="Role" value="IT Manager" />

          <InfoRow label="Email" value="chloedavis@gmail.com" />

          <InfoRow label="Department" value="IT Department" />

          <InfoRow label="Suspension Type" value="Administrative" />

          <InfoRow label="From" value="12.02.2025" />

          <InfoRow label="To" value="14.02.2025" />

          <div>
            <p className="text-[#667085] mb-2">Query Type</p>

            <div className="flex justify-between">
              <span className="font-medium">Disciplinary</span>

              <span className="font-medium">(QDRL20259)</span>
            </div>

            <div className="flex justify-between mt-2">
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
                Performance Related: You failed to finish your tasks twice in a
                row.
              </p>
            </div>
          </div>
        </div>

        {/* Floating Action */}
        <button className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#2196F3] text-white shadow-lg">
          <Plus size={18} />
        </button>
        <button
          onClick={() => router.back}
          className="absolute bottom-6 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#2196F3] text-white shadow-lg"
        >
          Back
        </button>
      </div>
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
