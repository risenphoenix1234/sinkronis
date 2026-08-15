import { CheckCircle2, ClipboardCheck } from "lucide-react";

import QuarterTabs from "./QuarterTabs";
import StatusBadge from "../appraisal/StatusBadge";
import ManagerObjectivesTable from "./ManagerObjectiveTable";
import ManagerBehaviourTable from "./ManagerBehaviourTable";
import GrandTotalReflection from "./GrandTotalReflection";

export default function ManagerReview() {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF4FF]">
            <ClipboardCheck size={18} className="text-[#1677C8]" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">Manager Review</h2>
          </div>
        </div>

        <StatusBadge text="Completed" color="green" />
      </div>

      {/* Content */}
      <div className="space-y-8 p-6">
        {/* Quarter */}
        <div className="flex items-center justify-between">
          <QuarterTabs active="Q2" />

          <div className="flex items-center gap-2 text-xs text-green-700">
            <CheckCircle2 size={16} />

            <span>Manager review submitted</span>
          </div>
        </div>

        {/* KRA */}
        <ManagerObjectivesTable />

        {/* Behaviour */}
        <ManagerBehaviourTable />

        {/* Manager overall score */}
        <div className="flex items-center justify-between rounded-lg bg-[#232C39] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white">
              GRAND TOTAL - Q2
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-[#D8A72C]">65.8%</span>

            <StatusBadge text="Below Expectation" color="yellow" />
          </div>
        </div>

        <GrandTotalReflection />
      </div>
    </section>
  );
}
