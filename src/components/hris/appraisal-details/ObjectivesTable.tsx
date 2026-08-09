import SectionHeader from "./SectionHeader";

const rows = [
  {
    objective: "Revenue & Business Growth",
    weight: "30%",
    keyResult: "Achieve monthly sales target",
    kpi: "20%",
    target: 100,
    initiatives:
      "Weekly pipeline review; pursue 3 enterprise prospects; partner with marketing.",
    achieved: 75,
    result: "15%",
    comment: "Achieved 75% of monthly target — pipeline improving.",
  },

  {
    objective: "",
    weight: "",
    keyResult: "Onboard 3 new clients per quarter",
    kpi: "10%",
    target: 3,
    initiatives: "Referral programme activation.",
    achieved: 1,
    result: "3.3%",
    comment: "Only one client onboarded.",
  },

  {
    objective: "Operational Excellence",
    weight: "30%",
    keyResult: "Reduce process turnaround time",
    kpi: "15%",
    target: 15,
    initiatives: "Process mapping workshop.",
    achieved: 8,
    result: "8%",
    comment: "Below target.",
  },

  {
    objective: "",
    weight: "",
    keyResult: "Complete projects on schedule",
    kpi: "15%",
    target: 100,
    initiatives: "Weekly sprint planning.",
    achieved: 80,
    result: "12%",
    comment: "80% completed.",
  },

  {
    objective: "Customer & Stakeholder Experience",
    weight: "20%",
    keyResult: "Maintain CSAT score ≥85%",
    kpi: "10%",
    target: 85,
    initiatives: "Monthly customer feedback.",
    achieved: 78,
    result: "9.2%",
    comment: "Below target.",
  },

  {
    objective: "",
    weight: "",
    keyResult: "Resolve escalations within 24 hrs",
    kpi: "10%",
    target: 24,
    initiatives: "Escalation playbook.",
    achieved: 16,
    result: "6.7%",
    comment: "Average resolution 16 hrs.",
  },
];

export default function ObjectivesTable() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <SectionHeader title="SECTION A : OBJECTIVES (KRA)" weight="80%" />

      <table className="w-full">
        <thead className="bg-[#F9FAFB]">
          <tr className="text-left text-[11px] uppercase text-slate-400">
            <th className="px-6 py-4">Objective</th>
            <th>WT.</th>
            <th>Key Result</th>
            <th>KPI%</th>
            <th>Target</th>
            <th>Initiatives</th>
            <th>Achieved</th>
            <th>Result%</th>
            <th>Comment</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b last:border-none">
              <td className="px-6 py-5 font-semibold text-[#1677C8]">
                {row.objective}
              </td>

              <td>
                {row.weight && (
                  <span className="rounded-full bg-[#1677C8] px-3 py-1 text-xs font-semibold text-white">
                    {row.weight}
                  </span>
                )}
              </td>

              <td>{row.keyResult}</td>

              <td className="font-semibold text-[#1677C8]">{row.kpi}</td>

              <td>{row.target}</td>

              <td className="max-w-xs text-sm text-slate-500">
                {row.initiatives}
              </td>

              <td className="font-semibold">{row.achieved}</td>

              <td className="font-bold text-[#A16207]">{row.result}</td>

              <td className="max-w-sm text-sm text-slate-500">{row.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between bg-[#EEF7FF] px-6 py-4">
        <span className="font-semibold text-[#1677C8]">TOTAL KRA — Q2</span>

        <span className="text-xl font-bold text-[#1677C8]">54.2%</span>
      </div>
    </div>
  );
}
