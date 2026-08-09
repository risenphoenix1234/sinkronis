import SectionHeader from "./SectionHeader";

interface ManagerBehaviour {
  competency: string;
  weight: string;
  expectation: string;
  managerAssessment: string;
  result: string;
  comment: string;
}

const behaviours: ManagerBehaviour[] = [
  {
    competency: "Communication",
    weight: "5%",
    expectation: "Communicates clearly and keeps stakeholders informed.",
    managerAssessment:
      "Provides regular updates and communicates effectively with the team.",
    result: "4.5%",
    comment: "Strong communication. Could improve follow-up speed.",
  },
  {
    competency: "Teamwork",
    weight: "5%",
    expectation: "Collaborates effectively across departments.",
    managerAssessment:
      "Works well with Finance, HR and other operational teams.",
    result: "5%",
    comment: "Excellent team player and consistently supportive.",
  },
  {
    competency: "Leadership",
    weight: "5%",
    expectation: "Takes ownership and provides guidance to team members.",
    managerAssessment:
      "Demonstrates ownership and supports junior team members.",
    result: "4%",
    comment: "Good leadership. More delegation would improve effectiveness.",
  },
  {
    competency: "Innovation",
    weight: "5%",
    expectation: "Identifies opportunities to improve processes.",
    managerAssessment: "Introduced reporting improvements and process changes.",
    result: "4.3%",
    comment: "Shows initiative and contributes useful ideas.",
  },
];

export default function ManagerBehaviourTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <SectionHeader
        title="SECTION B : BEHAVIOURAL OBJECTIVES"
        weight="20%"
        color="purple"
      />

      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full border-collapse">
          <thead className="bg-[#FAFAFC]">
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Competency
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                WT.
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Expected Behaviour
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Manager Assessment
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Result%
              </th>

              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Comment
              </th>
            </tr>
          </thead>

          <tbody>
            {behaviours.map((row, index) => (
              <tr
                key={`${row.competency}-${index}`}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-6 py-5 align-top font-semibold text-[#7B22A8]">
                  {row.competency}
                </td>

                <td className="px-4 py-5 align-top">
                  <span className="inline-flex rounded-full bg-[#7B22A8] px-3 py-1 text-[11px] font-semibold text-white">
                    {row.weight}
                  </span>
                </td>

                <td className="max-w-[260px] px-4 py-5 align-top text-sm leading-6 text-slate-600">
                  {row.expectation}
                </td>

                <td className="max-w-[300px] px-4 py-5 align-top text-sm leading-6 text-slate-600">
                  {row.managerAssessment}
                </td>

                <td className="px-4 py-5 align-top font-bold text-[#A16207]">
                  {row.result}
                </td>

                <td className="max-w-[260px] px-4 py-5 align-top text-sm leading-6 text-slate-500">
                  {row.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between bg-[#FAF4FF] px-6 py-4">
        <span className="text-sm font-semibold text-[#7B22A8]">
          TOTAL BEHAVIOURAL SCORE
        </span>

        <span className="text-xl font-bold text-[#7B22A8]">18.5%</span>
      </div>
    </div>
  );
}
