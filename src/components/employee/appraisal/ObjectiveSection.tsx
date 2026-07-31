"use client";

import { Section } from "@/types/employee/appraisal";
import ObjectiveRow from "./ObjectiveRow";

interface Props {
  section: Section;
}

export default function ObjectiveSection({ section }: Props) {
  const headerColor =
    section.color === "blue"
      ? "bg-[#EAF3FF] border-blue-200"
      : "bg-[#F6EEFF] border-purple-200";

  const badgeColor = section.color === "blue" ? "bg-blue-600" : "bg-purple-600";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}

      <div className={`${headerColor} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-md px-3 py-1 text-xs font-semibold text-white ${badgeColor}`}
            >
              {section.title}
            </span>

            <h2 className="font-semibold text-gray-900">{section.subtitle}</h2>
          </div>

          <div className="rounded-md bg-white px-4 py-2 text-sm font-semibold">
            Weight {section.weight}%
          </div>
        </div>
      </div>

      <table className="w-full">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-6 py-4 text-left">KPI</th>

            <th className="px-6 py-4 text-left">Weight</th>

            <th className="px-6 py-4 text-left">Target</th>

            <th className="px-6 py-4 text-left">Achievement</th>

            <th className="px-6 py-4 text-center">Manager</th>

            <th className="px-6 py-4 text-center">HR</th>

            <th className="px-6 py-4 text-center">Comment</th>
          </tr>
        </thead>

        <tbody>
          {section.objectives.map((objective) => (
            <ObjectiveRow key={objective.id} objective={objective} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
