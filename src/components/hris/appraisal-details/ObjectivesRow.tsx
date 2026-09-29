import { KeyResult, Objective } from "@/types/hris/appraisal";
import { GRID_COLUMNS } from "./ObjectivesSections";
import { KeyResultRow } from "./KeyResultRow";

export type ObjectiveRowProps = {
  objective: Objective;
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
  onAddKeyResult: (objectiveId: number) => void;
};

export function ObjectiveRow({
  objective,
  onUpdateObjective,
  onUpdateKeyResult,
  onAddKeyResult,
}: ObjectiveRowProps) {
  return (
    <div className="border-t border-[#E5E9EF]">
      <div className={`${GRID_COLUMNS} items-center bg-[#F8FBFE] px-2 py-2`}>
        <div className="border-l-2 border-[#2388D0] pl-3">
          <input
            value={objective.name}
            onChange={(event) =>
              onUpdateObjective(objective.id, "name", event.target.value)
            }
            placeholder="Objective name"
            className="h-7 w-[140px] rounded border border-[#D9E2EC] bg-white px-2 text-[9px] outline-none focus:border-[#2388D0]"
          />
        </div>

        <input
          type="number"
          min="0"
          max="100"
          value={objective.weight}
          onChange={(event) =>
            onUpdateObjective(objective.id, "weight", event.target.value)
          }
          className="h-7 w-10 rounded border border-[#D9E2EC] px-1 text-center text-[9px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0"
        />

        <div className="text-[8px] text-[#8492A6]">
          {objective.keyResults.length} KR
          <button
            type="button"
            onClick={() => onAddKeyResult(objective.id)}
            className="ml-2 font-semibold text-[#2388D0]"
          >
            + Add KR
          </button>
        </div>
      </div>

      {objective.keyResults.map((keyResult, index) => (
        <KeyResultRow
          key={keyResult.id}
          objectiveId={objective.id}
          keyResult={keyResult}
          index={index}
          onUpdate={onUpdateKeyResult}
        />
      ))}
    </div>
  );
}
