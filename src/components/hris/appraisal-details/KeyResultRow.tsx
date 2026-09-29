import { KeyResult } from "@/types/hris/appraisal";
import { GRID_COLUMNS } from "./ObjectivesSections";
import { ObjectiveRowProps } from "./ObjectivesRow";
import Input from "@/components/ui/Input";

type KeyResultRowProps = {
  objectiveId: number;
  keyResult: KeyResult;
  index: number;
  onUpdate: ObjectiveRowProps["onUpdateKeyResult"];
};

export function KeyResultRow({
  objectiveId,
  keyResult,
  index,
  onUpdate,
}: KeyResultRowProps) {
  const update = (field: keyof KeyResult, value: string) => {
    onUpdate(objectiveId, keyResult.id, field, value);
  };

  return (
    <div
      className={`${GRID_COLUMNS} items-center border-t border-[#E5E9EF] px-2 py-2`}
    >
      <span className="pl-3 text-[7px] uppercase text-[#98A2B3]">
        KR {index + 1}
      </span>

      <div />

      <Input
        value={keyResult.description}
        placeholder="Key result description..."
      />

      <Input type="number" value={keyResult.weight} />

      <Input value={keyResult.target} placeholder="e.g. 100" />

      <Input value={keyResult.initiatives} placeholder="Action plan..." />

      <Input disabled placeholder="—" className="bg-slate-100 cursor-not-allowed opacity-75" />
      <Input disabled placeholder="—" className="bg-slate-100 cursor-not-allowed opacity-75" />
      <Input disabled placeholder="Auto-filled" className="bg-slate-100 cursor-not-allowed opacity-75" />
    </div>
  );
}
