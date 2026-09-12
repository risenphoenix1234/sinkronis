"use client";

import { useState } from "react";
import SectionHeader from "./SectionHeader";
import type {
  TemplateSection,
  AppraisalKeyResult,
} from "@/lib/api/types/hrisTypes";

type BehaviourTableProps = {
  section?: TemplateSection;
  editable?: boolean;
  onSectionWeightChange?: (weight: number) => void;
  onObjectiveChange?: (
    objIndex: number,
    field: "title" | "weight",
    value: string | number,
  ) => void;
  onKeyResultChange?: (
    objIndex: number,
    krIndex: number,
    field: keyof AppraisalKeyResult,
    value: string | number,
  ) => void;
};

export default function BehaviourTable({
  section,
  editable = false,
  onSectionWeightChange,
  onObjectiveChange,
  onKeyResultChange,
}: BehaviourTableProps) {
  const [achievedById, setAchievedById] = useState<Record<string, string>>({});
  const [commentById, setCommentById] = useState<Record<string, string>>({});

  const objectives = section?.objectives ?? [];
  const inputCls =
    "w-full rounded border border-[#E2E8F0] px-2 py-1 text-sm outline-none focus:border-[#7B22A8]";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="SECTION B: BEHAVIOURAL OBJECTIVES"
          weight={`${section?.weight ?? 0}%`}
          color="purple"
        />
        {editable && (
          <div className="flex items-center gap-2 px-4">
            <span className="text-xs text-slate-400">Section weight</span>
            <input
              type="number"
              value={section?.weight ?? 0}
              onChange={(e) => onSectionWeightChange?.(Number(e.target.value))}
              className={`${inputCls} w-16`}
            />
          </div>
        )}
      </div>

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
                KPI%
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
                Comment
              </th>
            </tr>
          </thead>

          <tbody>
            {objectives.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-8 text-center text-sm text-slate-400"
                >
                  No behavioural objectives defined for this template.
                </td>
              </tr>
            ) : (
              objectives.flatMap((objective, objIndex) =>
                objective.keyResults.map((kr, i) => (
                  <tr
                    key={kr.id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="px-6 py-5 font-semibold text-[#7B22A8]">
                      {i === 0 ? (
                        editable ? (
                          <input
                            type="text"
                            value={objective.title}
                            onChange={(e) =>
                              onObjectiveChange?.(
                                objIndex,
                                "title",
                                e.target.value,
                              )
                            }
                            className={inputCls}
                          />
                        ) : (
                          objective.title
                        )
                      ) : (
                        ""
                      )}
                    </td>

                    <td className="px-4 py-5 text-sm text-slate-600">
                      {i === 0 &&
                        (editable ? (
                          <input
                            type="number"
                            value={objective.weight}
                            onChange={(e) =>
                              onObjectiveChange?.(
                                objIndex,
                                "weight",
                                Number(e.target.value),
                              )
                            }
                            className={`${inputCls} w-16`}
                          />
                        ) : (
                          `${objective.weight}%`
                        ))}
                    </td>

                    <td className="px-4 py-5">
                      {editable ? (
                        <input
                          type="text"
                          value={kr.description}
                          onChange={(e) =>
                            onKeyResultChange?.(
                              objIndex,
                              i,
                              "description",
                              e.target.value,
                            )
                          }
                          className={inputCls}
                        />
                      ) : (
                        <span className="rounded-full bg-[#7B22A8] px-3 py-1 text-xs font-semibold text-white">
                          {kr.description}
                        </span>
                      )}
                    </td>

                    <td className="max-w-sm px-4 py-5 text-sm text-slate-600">
                      {editable ? (
                        <input
                          type="number"
                          value={kr.kpiWeight}
                          onChange={(e) =>
                            onKeyResultChange?.(
                              objIndex,
                              i,
                              "kpiWeight",
                              Number(e.target.value),
                            )
                          }
                          className={`${inputCls} w-16`}
                        />
                      ) : (
                        `${kr.kpiWeight}%`
                      )}
                    </td>

                    <td className="max-w-sm px-4 py-5 text-sm text-slate-600">
                      {editable ? (
                        <input
                          type="number"
                          value={kr.target}
                          onChange={(e) =>
                            onKeyResultChange?.(
                              objIndex,
                              i,
                              "target",
                              Number(e.target.value),
                            )
                          }
                          className={`${inputCls} w-20`}
                        />
                      ) : (
                        kr.target
                      )}
                    </td>

                    <td className="px-4 py-5 text-sm text-slate-500">
                      {editable ? (
                        <input
                          type="text"
                          value={kr.initiatives}
                          onChange={(e) =>
                            onKeyResultChange?.(
                              objIndex,
                              i,
                              "initiatives",
                              e.target.value,
                            )
                          }
                          className={inputCls}
                        />
                      ) : (
                        kr.initiatives
                      )}
                    </td>

                    <td className="px-4 py-5">
                      <input
                        type="text"
                        value={achievedById[kr.id] ?? ""}
                        onChange={(e) =>
                          setAchievedById((prev) => ({
                            ...prev,
                            [kr.id]: e.target.value,
                          }))
                        }
                        placeholder="—"
                        className="w-20 rounded border border-[#E2E8F0] px-2 py-1 text-sm outline-none focus:border-[#7B22A8]"
                      />
                    </td>

                    <td className="px-4 py-5">
                      <input
                        type="text"
                        value={commentById[kr.id] ?? ""}
                        onChange={(e) =>
                          setCommentById((prev) => ({
                            ...prev,
                            [kr.id]: e.target.value,
                          }))
                        }
                        placeholder="Comment…"
                        className="w-full min-w-[140px] rounded border border-[#E2E8F0] px-2 py-1 text-sm outline-none focus:border-[#7B22A8]"
                      />
                    </td>
                  </tr>
                )),
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between bg-[#FAF4FF] px-6 py-4">
        <span className="font-semibold text-[#7B22A8]">
          TOTAL BEHAVIOURAL (target weight)
        </span>
        <span className="text-xl font-bold text-[#7B22A8]">
          {section?.weight ?? 0}%
        </span>
      </div>
    </div>
  );
}
