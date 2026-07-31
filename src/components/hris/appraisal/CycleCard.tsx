// components/CycleCard.tsx

import { Trash2 } from "lucide-react";
import { AppraisalCycle } from "@/types/hris/cycles";
import StatusBadge from "../../ui/StatusBadge";

interface Props {
  cycle: AppraisalCycle;
}

export default function CycleCard({ cycle }: Props) {
  return (
    <div className="bg-white border border-[#EAECF0] rounded-md p-5 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-[#101828]">{cycle.title}</h3>

            <StatusBadge status={cycle.status} />

            <span className="text-xs text-[#667085]">
              Template: {cycle.template}
            </span>
          </div>

          <p className="text-sm text-[#667085]">{cycle.description}</p>

          <p className="text-xs text-[#98A2B3]">{cycle.duration}</p>

          {cycle.status === "Active" && (
            <>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600"
                  style={{
                    width: `${cycle.progress}%`,
                  }}
                />
              </div>

              <p className="text-xs text-[#667085]">{cycle.acknowledged}</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 ml-6">
          {cycle.status === "Active" && (
            <button className="px-4 py-2 bg-[#EFF8FF] text-[#1570EF] rounded-md text-sm font-medium">
              View Reviews
            </button>
          )}

          <button>
            <Trash2 size={16} className="text-[#98A2B3]" />
          </button>
        </div>
      </div>
    </div>
  );
}
