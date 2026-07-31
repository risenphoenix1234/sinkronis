"use client";

import { RatingBadge } from "@/components/employee/appraisal/PhaseStepper";
import { appraisalData } from "@/data/employee/appraisal";

interface AppraisalTableProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function AppraisalTable({
  isOpen,
  onClose,
}: AppraisalTableProps) {
  if (!isOpen) return null;
  return (
    <section className="bg-white p-6 min-h-screen space-y-6">
      <h1 className="mb-8 text-[32px] font-semibold text-[#1D2939]">
        Appraisal
      </h1>

      <div className="overflow-x-auto border border-[#EAECF0] rounded-md">
        <table className="w-full min-w-[1200px] border-collapse">
          <thead>
            <tr className="border-b border-[#EAECF0] bg-white">
              <th className="border-r border-[#EAECF0] px-3 py-3 text-left text-[11px] font-medium text-[#667085]">
                Objective
              </th>

              <th className="border-r border-[#EAECF0] px-3 py-3 text-left text-[11px] font-medium text-[#667085]">
                Monthly Key Performance Indicators
              </th>

              <th className="border-r border-[#EAECF0] px-3 py-3 text-left text-[11px] font-medium text-[#667085]">
                Employee's Rating
              </th>

              <th className="border-r border-[#EAECF0] px-3 py-3 text-left text-[11px] font-medium text-[#667085]">
                Employee's Comment
              </th>

              <th className="border-r border-[#EAECF0] px-3 py-3 text-left text-[11px] font-medium text-[#667085]">
                Line Manager's Grade
              </th>

              <th className="px-3 py-3 text-left text-[11px] font-medium text-[#667085]">
                Line Manager's Comment
              </th>
            </tr>
          </thead>

          <tbody>
            {appraisalData.map((item, index) => (
              <tr key={index} className="align-top border-b border-[#EAECF0]">
                {/* Objective */}
                <td className="border-r border-[#EAECF0] p-3 text-xs text-[#344054] w-[220px]">
                  {item.objective}
                </td>

                {/* KPI */}
                <td className="border-r border-[#EAECF0] p-3 w-[450px]">
                  <ul className="space-y-2">
                    {item.kpis.map((kpi, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-[#344054] flex gap-2"
                      >
                        <span>-</span>
                        <span>{kpi}</span>
                      </li>
                    ))}
                  </ul>
                </td>

                {/* Employee Rating */}
                <td className="border-r border-[#EAECF0] p-3 w-[120px]">
                  <RatingBadge score={item.employeeRating} />
                </td>

                {/* Employee Comment */}
                <td className="border-r border-[#EAECF0] p-3 text-xs text-[#344054] w-[250px]">
                  {item.employeeComment}
                </td>

                {/* Manager Rating */}
                <td className="border-r border-[#EAECF0] p-3 w-[120px]">
                  <RatingBadge score={item.managerRating} />
                </td>

                {/* Manager Comment */}
                <td className="p-3 text-xs text-[#344054] w-[250px]">
                  {item.managerComment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
