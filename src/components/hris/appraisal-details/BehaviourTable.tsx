import { rows } from "@/data/hris/BehaviourTable";
import SectionHeader from "./SectionHeader";

export default function BehaviourTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <SectionHeader
        title="SECTION B : BEHAVIOURAL OBJECTIVES"
        weight="20%"
        color="purple"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#FAFAFC]">
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Competency
              </th>

              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                WT.
              </th>

              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Expected Behaviour
              </th>

              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Achieved
              </th>

              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Result %
              </th>

              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Comment
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.competency}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="px-6 py-5 font-semibold text-[#7B22A8]">
                  {row.competency}
                </td>

                <td>
                  <span className="rounded-full bg-[#7B22A8] px-3 py-1 text-xs font-semibold text-white">
                    {row.weight}
                  </span>
                </td>

                <td className="max-w-sm py-5 text-sm text-slate-600">
                  {row.expectation}
                </td>

                <td className="max-w-sm py-5 text-sm text-slate-600">
                  {row.achieved}
                </td>

                <td className="font-bold text-[#A16207]">{row.result}</td>

                <td className="max-w-sm py-5 text-sm text-slate-600">
                  {row.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between bg-[#FAF4FF] px-6 py-4">
        <span className="font-semibold text-[#7B22A8]">
          TOTAL BEHAVIOURAL SCORE
        </span>

        <span className="text-xl font-bold text-[#7B22A8]">18.5%</span>
      </div>
    </div>
  );
}
