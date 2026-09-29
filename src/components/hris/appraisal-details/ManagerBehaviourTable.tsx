"use client";

import type {
  SelfAssessmentTemplateSection,
  TemplateSection,
} from "@/lib/api/types/hrisTypes";

export interface ManagerBehaviourTableProps {
  section?: SelfAssessmentTemplateSection | TemplateSection | null;
  quarter?: string;
  totalScore?: string | number | null;
  editable?: boolean;
  onCommentChange?: (goalId: string, comment: string) => void;
  inputRatings?: Record<string, { rating?: number; comment?: string }>;
}

export default function ManagerBehaviourTable({
  section,
  quarter = "Q2",
  editable = true,
  onCommentChange,
  inputRatings = {},
}: ManagerBehaviourTableProps = {}) {
  const objectives = section?.objectives ?? [];
  const sectionWeight = section?.weight ?? 20;

  const calculateResultPercent = (
    achievedStr: string | undefined,
    target: number | string | undefined,
    kpiWeight: number | string | undefined,
  ): string => {
    if (!achievedStr || achievedStr.trim() === "" || achievedStr === "—")
      return "—";
    const achievedNum = parseFloat(achievedStr);
    const kpiNum =
      typeof kpiWeight === "number"
        ? kpiWeight
        : parseFloat(String(kpiWeight ?? 0));
    if (isNaN(achievedNum) || isNaN(kpiNum)) return "—";

    const targetNum =
      typeof target === "number" ? target : parseFloat(String(target ?? 0));
    if (!isNaN(targetNum) && targetNum > 0) {
      const calc = (achievedNum / targetNum) * kpiNum;
      return `${Number.isInteger(calc) ? calc : calc.toFixed(1)}%`;
    }
    const calc = (achievedNum * kpiNum) / 100;
    return `${Number.isInteger(calc) ? calc : calc.toFixed(1)}%`;
  };

  let totalResultSum = 0;
  let hasAnyAchieved = false;

  const rows = objectives.flatMap((objective, objIndex) =>
    (objective.keyResults ?? []).map((kr, i) => {
      const isFirstRow = i === 0;
      const krId = kr.id;

      const rawTarget =
        "target" in kr && kr.target != null && String(kr.target) !== ""
          ? kr.target
          : "—";

      const rawInitiatives =
        "initiatives" in kr && kr.initiatives ? kr.initiatives : "—";

      const rawAchieved =
        "achieved" in kr && (kr as Record<string, unknown>).achieved != null
          ? String((kr as Record<string, unknown>).achieved)
          : "";

      const rawDescription =
        "description" in kr
          ? kr.description
          : (kr as unknown as { keyResult: string }).keyResult || "Key Result";

      const resultPct = calculateResultPercent(
        rawAchieved,
        rawTarget,
        kr.kpiWeight,
      );

      if (rawAchieved && rawAchieved.trim() !== "" && rawAchieved !== "—") {
        hasAnyAchieved = true;
        const val = parseFloat(resultPct.replace("%", ""));
        if (!isNaN(val)) totalResultSum += val;
      }

      const currentComment =
        inputRatings[krId]?.comment ??
        ("comment" in kr && (kr as Record<string, unknown>).comment
          ? String((kr as Record<string, unknown>).comment)
          : "");

      return {
        krId,
        objective,
        objIndex,
        isFirstRow,
        rawDescription,
        kpiWeight: kr.kpiWeight,
        rawTarget,
        rawInitiatives,
        rawAchieved,
        resultPct,
        currentComment,
      };
    }),
  );

  const displayFooterTotal =
    hasAnyAchieved && totalResultSum > 0
      ? `${Number.isInteger(totalResultSum) ? totalResultSum : totalResultSum.toFixed(1)}%`
      : `${sectionWeight}%`;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#7A1E9E] px-6 py-3 text-white">
        <h2 className="text-xs font-semibold uppercase tracking-wide">
          SECTION B: BEHAVIOURAL OBJECTIVES
        </h2>
        <span className="text-xs font-medium">
          Total weight: {sectionWeight}%
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#FAFAFC] border-b border-slate-200">
            <tr className="text-[11px] uppercase font-semibold text-slate-400">
              <th className="px-6 py-3.5">Objective</th>
              <th className="px-3 py-3.5">WT.</th>
              <th className="px-4 py-3.5">Key Result</th>
              <th className="px-3 py-3.5">KPI%</th>
              <th className="px-3 py-3.5">Target</th>
              <th className="px-4 py-3.5">Initiatives</th>
              <th className="px-3 py-3.5">Emp. Achieved</th>
              <th className="px-3 py-3.5">Result%</th>
              <th className="px-4 py-3.5">Manager Comment</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-8 text-center text-sm text-slate-400"
                >
                  No behavioural objectives defined for this review.
                </td>
              </tr>
            ) : (
              rows.map(
                ({
                  krId,
                  objective,
                  objIndex,
                  isFirstRow,
                  rawDescription,
                  kpiWeight,
                  rawTarget,
                  rawInitiatives,
                  rawAchieved,
                  resultPct,
                  currentComment,
                }) => (
                  <tr
                    key={krId || `${objIndex}-${rawDescription}`}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Objective */}
                    <td className="px-6 py-4 align-top">
                      {isFirstRow ? (
                        <div className="border-l-[3px] border-[#7A1E9E] pl-2.5 font-semibold text-[#7A1E9E] text-sm leading-tight">
                          {objective.title}
                        </div>
                      ) : null}
                    </td>

                    {/* Weight */}
                    <td className="px-3 py-4 align-top">
                      {isFirstRow ? (
                        <span className="inline-block rounded-full bg-[#7A1E9E] px-2.5 py-0.5 text-xs font-semibold text-white">
                          {objective.weight}%
                        </span>
                      ) : null}
                    </td>

                    {/* Key Result */}
                    <td className="px-4 py-4 text-sm text-slate-700 max-w-xs align-top">
                      {rawDescription}
                    </td>

                    {/* KPI% */}
                    <td className="px-3 py-4 text-sm font-semibold text-[#7A1E9E] align-top whitespace-nowrap">
                      {kpiWeight}%
                    </td>

                    {/* Target */}
                    <td className="px-3 py-4 text-sm text-slate-400 align-top whitespace-nowrap">
                      {rawTarget}
                    </td>

                    {/* Initiatives */}
                    <td className="px-4 py-4 text-xs text-slate-500 max-w-xs align-top leading-relaxed">
                      {rawInitiatives}
                    </td>

                    {/* Emp. Achieved */}
                    <td className="px-3 py-4 text-sm font-semibold text-slate-800 align-top whitespace-nowrap">
                      {rawAchieved || "—"}
                    </td>

                    {/* Result% */}
                    <td className="px-3 py-4 text-sm font-semibold text-slate-800 align-top whitespace-nowrap">
                      {resultPct}
                    </td>

                    {/* Manager Comment */}
                    <td className="px-4 py-4 align-top min-w-[150px] max-w-xs">
                      {editable ? (
                        <input
                          type="text"
                          value={currentComment}
                          onChange={(e) =>
                            onCommentChange?.(krId, e.target.value)
                          }
                          placeholder="Manager comment..."
                          className="w-full rounded border border-slate-200 px-3 py-1 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#7A1E9E] focus:ring-1 focus:ring-[#7A1E9E]/20"
                        />
                      ) : (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {currentComment || "—"}
                        </p>
                      )}
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between border-t border-[#E9D7FE] bg-[#FAF5FF] px-6 py-3.5">
        <span className="text-xs font-bold text-[#7A1E9E] uppercase tracking-wider">
          TOTAL BEHAVIOURAL – {quarter}
        </span>
        <span className="text-sm font-bold text-[#7A1E9E]">
          {displayFooterTotal}
        </span>
      </div>
    </div>
  );
}
