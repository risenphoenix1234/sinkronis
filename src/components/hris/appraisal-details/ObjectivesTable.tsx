"use client";

import SectionHeader from "./SectionHeader";
import type {
  TemplateSection,
  AppraisalKeyResult,
} from "@/lib/api/types/hrisTypes";

type ObjectivesTableProps = {
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
  // NEW — self-assessment inputs, keyed by kr.id, lifted to parent
  achievedById?: Record<string, string>;
  commentById?: Record<string, string>;
  onAchievedChange?: (krId: string, value: string) => void;
  onCommentChange?: (krId: string, value: string) => void;
};

const SECTION_LABEL: Record<string, string> = {
  KRA: "SECTION A : OBJECTIVES (KRA)",
  BEHAVIOURAL: "SECTION B : BEHAVIOURAL COMPETENCIES",
};

export default function ObjectivesTable({
  section,
  editable = false,
  onSectionWeightChange,
  onObjectiveChange,
  onKeyResultChange,
  achievedById = {},
  commentById = {},
  onAchievedChange,
  onCommentChange,
}: ObjectivesTableProps) {
  const objectives = section?.objectives ?? [];
  const sectionKey = section?.section ?? "KRA";
  const inputCls =
    "w-full rounded border border-[#E2E8F0] px-2 py-1 text-sm outline-none focus:border-[#2388D0]";

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="flex items-center justify-between">
        <SectionHeader
          title={SECTION_LABEL[sectionKey] ?? sectionKey}
          weight={`${section?.weight ?? 0}%`}
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
            <th>Comment</th>
          </tr>
        </thead>

        <tbody>
          {objectives.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-6 py-8 text-center text-sm text-slate-400"
              >
                No {sectionKey} objectives defined for this template.
              </td>
            </tr>
          ) : (
            objectives.flatMap((objective, objIndex) =>
              objective.keyResults.map((kr, i) => (
                <tr key={kr.id} className="border-b last:border-none">
                  <td className="px-6 py-5 font-semibold text-[#1677C8]">
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

                  <td>
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
                        <span className="rounded-full bg-[#1677C8] px-3 py-1 text-xs font-semibold text-white">
                          {objective.weight}%
                        </span>
                      ))}
                  </td>

                  <td>
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
                      kr.description
                    )}
                  </td>

                  <td className="font-semibold text-[#1677C8]">
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

                  <td>
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

                  <td className="max-w-xs text-sm text-slate-500">
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

                  <td>
                    <input
                      type="text"
                      value={achievedById[kr.id] ?? ""}
                      onChange={(e) =>
                        onAchievedChange?.(kr.id, e.target.value)
                      }
                      placeholder="—"
                      className="w-20 rounded border border-[#E2E8F0] px-2 py-1 text-sm outline-none focus:border-[#2388D0]"
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={commentById[kr.id] ?? ""}
                      onChange={(e) => onCommentChange?.(kr.id, e.target.value)}
                      placeholder="Comment…"
                      className="w-full min-w-[140px] rounded border border-[#E2E8F0] px-2 py-1 text-sm outline-none focus:border-[#2388D0]"
                    />
                  </td>
                </tr>
              )),
            )
          )}
        </tbody>
      </table>

      <div className="flex justify-between bg-[#EEF7FF] px-6 py-4">
        <span className="font-semibold text-[#1677C8]">
          TOTAL {sectionKey} (target weight)
        </span>
        <span className="text-xl font-bold text-[#1677C8]">
          {section?.weight ?? 0}%
        </span>
      </div>
    </div>
  );
}
