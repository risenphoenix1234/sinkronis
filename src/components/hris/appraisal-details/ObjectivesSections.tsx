import { KeyResult, Objective } from "@/types/hris/appraisal";
import { Plus } from "lucide-react";
import { ObjectiveRow } from "./ObjectivesRow";

export const GRID_COLUMNS =
  "grid min-w-[1050px] grid-cols-[215px_55px_255px_55px_75px_125px_75px_75px_100px]";

type ObjectivesSectionProps = {
  objectives: Objective[];
  sectionAWeight: number;
  onAddObjective: () => void;
  onAddKeyResult: (objectiveId: number) => void;
  onUpdateObjective: (
    objectiveId: number,
    field: "name" | "weight",
    value: string,
  ) => void;
  onUpdateKeyResult: (
    objectiveId: number,
    keyResultId: number,
    field: keyof KeyResult,
    value: string,
  ) => void;
};

export function ObjectivesSection({
  objectives,
  sectionAWeight,
  onAddObjective,
  onAddKeyResult,
  onUpdateObjective,
  onUpdateKeyResult,
}: ObjectivesSectionProps) {
  return (
    <section className="overflow-x-auto border-x border-b border-[#E5E9EF]">
      <div
        className={`${GRID_COLUMNS} items-center bg-[#F4F8FC] px-2 py-2 text-xs font-bold uppercase tracking-wide text-[#8492A6]`}
      >
        <span>Objective</span>
        <span>Total WT.</span>
        <span>Key Result</span>
        <span>KPI WT.</span>
        <span>Target</span>
        <span>Initiatives</span>
        <span>Q1 ACH.</span>
        <span>Q1 %</span>
        <span>Comment</span>
      </div>

      {objectives.map((objective) => (
        <ObjectiveRow
          key={objective.id}
          objective={objective}
          onUpdateObjective={onUpdateObjective}
          onUpdateKeyResult={onUpdateKeyResult}
          onAddKeyResult={onAddKeyResult}
        />
      ))}

      <div className="p-3">
        <button
          type="button"
          onClick={onAddObjective}
          className="flex h-7 w-full items-center justify-center gap-2 rounded border border-dashed border-[#8EC5EA] text-sm font-medium text-[#2388D0] transition hover:bg-[#F4FAFF]"
        >
          <Plus size={11} />
          Add Objectives (KRA)
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-[#E5E9EF] bg-[#FAFBFC] px-4 py-3">
        <span className="text-sm font-bold uppercase text-[#8492A6]">
          Total Section A
        </span>

        <span className="text-base font-bold text-[#2388D0]">
          {sectionAWeight}%
        </span>
      </div>
    </section>
  );
}
