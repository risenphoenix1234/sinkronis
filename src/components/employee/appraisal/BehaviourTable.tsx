import Card from "./Card";
import BehaviourRow from "./BehaviourRow";
import BehaviourSummary from "./BehaviourSummary";

import { BehaviourObjective } from "@/types/employee/appraisal";
import EmptyBehaviour from "./EmptyBehavior";

interface Props {
  behaviours: BehaviourObjective[];
}

export default function BehaviourTable({ behaviours }: Props) {
  const totalWeight = behaviours.reduce((sum, item) => sum + item.wt, 0);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between bg-purple-600 px-6 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
          Section B • Behavioural Objectives
        </h2>

        <span className="rounded-full px-3 py-1 text-xs font-medium text-white">
          Total Weight: {totalWeight}%
        </span>
      </div>

      {behaviours.length === 0 ? (
        <EmptyBehaviour />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full  text-slate-500">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold uppercase">
                    Objective
                  </th>

                  <th className="p-3 text-left text-xs font-semibold uppercase">
                    wt.
                  </th>

                  <th className="p-3 text-left text-xs font-semibold uppercase">
                    Key Result
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase">
                    kpis
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase">
                    target
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase">
                    Initiatives
                  </th>

                  <th className="p-3 text-left text-xs font-semibold uppercase">
                    q1 ach.
                  </th>

                  <th className="p-3 text-left text-xs font-semibold uppercase">
                    q1%
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase">
                    q2 ach.
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase">
                    q1%
                  </th>
                  <th className="p-3 text-left text-xs font-semibold uppercase">
                    Comment
                  </th>
                </tr>
              </thead>

              <tbody>
                {behaviours.map((behaviour) => (
                  <BehaviourRow key={behaviour.id} behaviour={behaviour} />
                ))}
              </tbody>
            </table>
          </div>

          <BehaviourSummary totalWeight={totalWeight} />
        </>
      )}
    </Card>
  );
}
