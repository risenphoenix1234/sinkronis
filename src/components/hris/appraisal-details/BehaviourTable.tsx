import { rows } from "@/data/hris/BehaviourTable";
import SectionHeader from "./SectionHeader";

export default function BehaviourTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <SectionHeader
        title="SECTION B: BEHAVIOURAL OBJECTIVES"
        weight="20%"
        color="purple"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#FAFAFC]">
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Objective
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                WT.
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Key Result
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                KPIs
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Target
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Initiatives
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Achieved
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Results
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Comment
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.objective}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="px-6 py-5 font-semibold text-[#7B22A8]">
                  {row.objective}
                </td>

                <td className="px-4 py-5 text-sm text-slate-600">
                  {row.weight}
                </td>

                <td className="px-4 py-5">
                  <span className="rounded-full bg-[#7B22A8] px-3 py-1 text-xs font-semibold text-white">
                    {row.keyResult}
                  </span>
                </td>

                <td className="max-w-sm px-4 py-5 text-sm text-slate-600">
                  {row.kpis}
                </td>

                <td className="max-w-sm px-4 py-5 text-sm text-slate-600">
                  {row.target}
                </td>

                <td className="px-4 py-5 font-bold text-[#A16207]">
                  {row.initiatives}
                </td>

                <td className="px-4 py-5 font-bold text-[#A16207]">
                  {row.achieved}
                </td>

                <td className="px-4 py-5 font-bold text-[#A16207]">
                  {row.results}
                </td>

                <td className="max-w-sm px-4 py-5 text-sm text-slate-600">
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
