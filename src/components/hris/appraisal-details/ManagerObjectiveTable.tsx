import SectionHeader from "./SectionHeader";

interface ManagerObjective {
  objective: string;
  weight: string;
  keyResult: string;
  kpi: string;
  target: string;
  initiatives: string;
  achieved: string;
  result: string;
  comment: string;
}

const managerObjectives: ManagerObjective[] = [
  {
    objective: "Revenue & Business Growth",
    weight: "30%",
    keyResult: "Achieve monthly sales target",
    kpi: "20%",
    target: "100",
    initiatives:
      "Weekly pipeline review; pursue 3 enterprise prospects; partner with marketing on campaigns.",
    achieved: "75",
    result: "15%",
    comment:
      "Achieved 75% of target. Pipeline improved toward the end of the quarter.",
  },
  {
    objective: "",
    weight: "",
    keyResult: "Onboard 3 new clients per quarter",
    kpi: "10%",
    target: "3",
    initiatives: "Referral programme activation and targeted outreach.",
    achieved: "1",
    result: "3.3%",
    comment:
      "One client onboarded. More consistent prospect follow-up is required.",
  },
  {
    objective: "Operational Excellence",
    weight: "30%",
    keyResult: "Reduce process turnaround time",
    kpi: "15%",
    target: "15",
    initiatives: "Process mapping and implementation of improved workflows.",
    achieved: "8",
    result: "8%",
    comment:
      "Some improvements were delivered, but the target was not fully achieved.",
  },
  {
    objective: "",
    weight: "",
    keyResult: "Complete projects on schedule",
    kpi: "15%",
    target: "100",
    initiatives: "Weekly sprint planning and project status reviews.",
    achieved: "80",
    result: "12%",
    comment: "Most projects were completed on schedule.",
  },
  {
    objective: "Customer & Stakeholder Experience",
    weight: "20%",
    keyResult: "Maintain CSAT score ≥85%",
    kpi: "10%",
    target: "85",
    initiatives: "Monthly customer feedback and service improvement sessions.",
    achieved: "78",
    result: "9.2%",
    comment:
      "Customer satisfaction improved but remained below the agreed target.",
  },
  {
    objective: "",
    weight: "",
    keyResult: "Resolve escalations within 24 hrs",
    kpi: "10%",
    target: "24",
    initiatives: "Escalation playbook and weekly issue review.",
    achieved: "16",
    result: "6.7%",
    comment: "Average resolution time was 16 hours.",
  },
];

export default function ManagerObjectivesTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <SectionHeader title="SECTION A : OBJECTIVES (KRA)" weight="80%" />

      <div className="overflow-x-auto">
        <table className="min-w-[1250px] w-full border-collapse">
          <thead className="bg-[#F8FAFC]">
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Objective
              </th>

              <th className="px-3 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                WT.
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Key Result
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                KPI%
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Target
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Initiatives
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Achieved
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Result%
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Manager Comment
              </th>
            </tr>
          </thead>

          <tbody>
            {managerObjectives.map((row, index) => (
              <tr
                key={`${row.keyResult}-${index}`}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-6 py-5 align-top">
                  {row.objective && (
                    <span className="font-semibold text-[#1677C8]">
                      {row.objective}
                    </span>
                  )}
                </td>

                <td className="px-3 py-5 align-top">
                  {row.weight && (
                    <span className="inline-flex rounded-full bg-[#1677C8] px-3 py-1 text-[11px] font-semibold text-white">
                      {row.weight}
                    </span>
                  )}
                </td>

                <td className="px-4 py-5 align-top text-sm text-slate-700">
                  {row.keyResult}
                </td>

                <td className="px-4 py-5 align-top font-semibold text-[#1677C8]">
                  {row.kpi}
                </td>

                <td className="px-4 py-5 align-top text-sm text-slate-700">
                  {row.target}
                </td>

                <td className="max-w-[260px] px-4 py-5 align-top text-sm leading-6 text-slate-500">
                  {row.initiatives}
                </td>

                <td className="px-4 py-5 align-top font-semibold text-slate-700">
                  {row.achieved}
                </td>

                <td className="px-4 py-5 align-top font-bold text-[#A16207]">
                  {row.result}
                </td>

                <td className="max-w-[280px] px-4 py-5 align-top text-sm leading-6 text-slate-500">
                  {row.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between bg-[#EEF7FF] px-6 py-4">
        <span className="text-sm font-semibold text-[#1677C8]">
          TOTAL KRA — Q2
        </span>

        <span className="text-xl font-bold text-[#1677C8]">54.2%</span>
      </div>
    </div>
  );
}
