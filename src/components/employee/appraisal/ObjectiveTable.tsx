import { Objective } from "@/types/employee/appraisal";
import Card from "./Card";
import ObjectiveRow from "./ObjectiveRow";
import Button from "./Button";
import { Plus, Target } from "lucide-react";
import { useState } from "react";
import AddGoalsModal from "./AddGoalModal";

interface Props {
  objectives: Objective[];
}

export default function ObjectiveTable({ objectives }: Props) {
  const [openModal, setOpenModal] = useState(false);
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between bg-blue-600 px-6 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
          Section A • Objectives (KRA)
        </h2>

        <div className="flex items-center gap-4">
          <span className="text-xs text-blue-100">Total Weight: 60%</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full text-slate-500">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left text-xs font-semibold uppercase">
                Objective
              </th>

              <th className="p-3 text-left text-xs font-semibold uppercase">
                WT.
              </th>

              <th className="p-3 text-left text-xs font-semibold uppercase">
                KEY RESULT
              </th>

              <th className="p-3 text-left text-xs font-semibold uppercase">
                KPIS
              </th>

              <th className="p-3 text-left text-xs font-semibold uppercase">
                TARGET
              </th>

              <th className="p-3 text-left text-xs font-semibold uppercase">
                INITIATIVES
              </th>

              <th className="p-3 text-left text-xs font-semibold uppercase">
                Q1 ACH.
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase">
                Q1%
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase">
                Q2 ACH.
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase">
                Q2%
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase">
                COMMENT
              </th>
            </tr>
          </thead>

          <tbody>
            {objectives.map((objective) => (
              <ObjectiveRow key={objective.id} objective={objective} />
            ))}
          </tbody>
        </table>
      </div>
      {/* <EmptyObjectives /> */}
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-5 rounded-full bg-slate-100 p-5">
          <Target size={40} className="text-slate-500" />
        </div>

        <h3 className="text-lg font-semibold text-slate-700">
          No goal set yet!
        </h3>

        <p className="mt-2 max-w-md text-center text-sm text-slate-500">
          Start your appraisal by adding your work objectives.
        </p>

        <div className="mt-6">
          <Button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center gap-2"
          >
            <Plus size={16} />
            Add Your Goals
          </Button>
        </div>
      </div>
      <AddGoalsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />{" "}
    </Card>
  );
}
