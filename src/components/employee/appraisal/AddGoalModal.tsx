"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Info,
  Plus,
  Trash2,
  Copy,
  X,
} from "lucide-react";

export interface ModalKeyResult {
  id: number;
  keyResult: string;
  initiatives: string;
  target: string;
  comments: string;
}

export interface ModalObjective {
  id: number;
  title: string;
  weight: number;
  expanded: boolean;
  keyResults: ModalKeyResult[];
}

interface AddGoalsModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (objectives: ModalObjective[]) => void;
}

export default function AddGoalsModal({
  open,
  onClose,
  onSave,
}: AddGoalsModalProps) {
  const [cycle, setCycle] = useState("Q1 2026 - Q2 2026");

  const [department, setDepartment] = useState("Engineering");

  const [objectives, setObjectives] = useState<ModalObjective[]>([
    {
      id: 1,
      title: "Revenue & Business Growth",
      weight: 30,
      expanded: true,

      keyResults: [
        {
          id: 1,
          keyResult: "Achieve monthly headcount target for new hires",

          initiatives:
            "Weekly talent pipeline review with external recruiters; partner with 3 staffing agencies",

          target: "100",

          comments:
            "Weekly talent pipeline review with external recruiters; partner with 3 staffing agencies",
        },

        {
          id: 2,

          keyResult: "Reduce average time-to-hire",

          initiatives: "Streamline interview process; implement ATS automation",

          target: "80",

          comments:
            "Weekly talent pipeline review with external recruiters; partner with 3 staffing agencies",
        },
      ],
    },

    {
      id: 2,
      title: "Operational Excellence",
      weight: 40,
      expanded: false,

      keyResults: [],
    },

    {
      id: 3,
      title: "Employee Experience",
      weight: 30,
      expanded: false,

      keyResults: [],
    },
  ]);

  if (!open) return null;

  const totalWeight = objectives.reduce((sum, item) => sum + item.weight, 0);

  const toggleObjective = (id: number) => {
    setObjectives((prev) =>
      prev.map((objective) =>
        objective.id === id
          ? {
              ...objective,
              expanded: !objective.expanded,
            }
          : objective,
      ),
    );
  };

  const addKeyResult = (objectiveId: number) => {
    setObjectives((prev) =>
      prev.map((objective) =>
        objective.id === objectiveId
          ? {
              ...objective,
              expanded: true,
              keyResults: [
                ...objective.keyResults,
                {
                  id: Date.now(),
                  keyResult: "",
                  initiatives: "",
                  target: "",
                  comments: "",
                },
              ],
            }
          : objective,
      ),
    );
  };

  const removeKeyResult = (objectiveId: number, keyResultId: number) => {
    setObjectives((prev) =>
      prev.map((objective) =>
        objective.id === objectiveId
          ? {
              ...objective,
              keyResults: objective.keyResults.filter(
                (item) => item.id !== keyResultId,
              ),
            }
          : objective,
      ),
    );
  };

  const updateKeyResult = (
    objectiveId: number,
    keyResultId: number,
    field: keyof ModalKeyResult,
    value: string,
  ) => {
    setObjectives((prev) =>
      prev.map((objective) =>
        objective.id === objectiveId
          ? {
              ...objective,
              keyResults: objective.keyResults.map((item) =>
                item.id === keyResultId
                  ? {
                      ...item,
                      [field]: value,
                    }
                  : item,
              ),
            }
          : objective,
      ),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-start justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold">Add Your Goals</h2>

            <p className="mt-1 text-sm text-slate-500">
              Define objectives and key results.
            </p>
          </div>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto p-6">
          {/* Top Selects */}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Appraisal Cycle
              </label>

              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              >
                <option>Q1 2026 - Q2 2026</option>

                <option>Q3 2026 - Q4 2026</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Department
              </label>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              >
                <option>Engineering</option>
                <option>HR</option>
                <option>Finance</option>
                <option>Operations</option>
              </select>
            </div>
          </div>

          {/* Objectives */}

          <div className="mt-8 space-y-5">
            {objectives.map((objective) => (
              <div
                key={objective.id}
                className="overflow-hidden rounded-lg border"
              >
                {/* Accordion Header */}

                <button
                  onClick={() => toggleObjective(objective.id)}
                  className="flex w-full items-center justify-between bg-slate-50 px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    {objective.expanded ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}

                    <span className="font-semibold text-blue-600">
                      Objective {objective.id}
                    </span>

                    <span className="font-medium">{objective.title}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      Weight: {objective.weight}%
                    </span>

                    <Trash2
                      size={16}
                      className="cursor-pointer text-gray-400"
                    />
                  </div>
                </button>

                {/* Accordion Content */}

                {objective.expanded && (
                  <div className="space-y-6 p-5">
                    {objective.keyResults.map((keyResult, index) => (
                      <div
                        key={keyResult.id}
                        className="rounded-lg border bg-white p-5"
                      >
                        <div className="mb-5 flex items-center justify-between">
                          <h4 className="font-semibold">
                            Key Result {index + 1}
                          </h4>

                          <div className="flex gap-3">
                            <Copy
                              size={16}
                              className="cursor-pointer text-gray-400"
                            />

                            <Trash2
                              size={16}
                              onClick={() =>
                                removeKeyResult(objective.id, keyResult.id)
                              }
                              className="cursor-pointer text-red-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="mb-1 block text-sm">
                              Key Result
                            </label>

                            <input
                              value={keyResult.keyResult}
                              onChange={(e) =>
                                updateKeyResult(
                                  objective.id,
                                  keyResult.id,
                                  "keyResult",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded border px-3 py-2"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm">
                              Initiatives
                            </label>

                            <textarea
                              rows={3}
                              value={keyResult.initiatives}
                              onChange={(e) =>
                                updateKeyResult(
                                  objective.id,
                                  keyResult.id,
                                  "initiatives",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded border px-3 py-2"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm">
                              Target (100 max)
                            </label>

                            <input
                              value={keyResult.target}
                              onChange={(e) =>
                                updateKeyResult(
                                  objective.id,
                                  keyResult.id,
                                  "target",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded border px-3 py-2"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm">
                              Comments
                            </label>

                            <textarea
                              rows={3}
                              value={keyResult.comments}
                              onChange={(e) =>
                                updateKeyResult(
                                  objective.id,
                                  keyResult.id,
                                  "comments",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded border px-3 py-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addKeyResult(objective.id)}
                      className="flex items-center gap-2 text-sm font-medium text-blue-600"
                    >
                      <Plus size={16} />
                      Add Key Result
                    </button>
                  </div>
                )}
              </div>
            ))}
            {/* Add Objective */}

            <button
              onClick={() => {
                setObjectives((prev) => [
                  ...prev,
                  {
                    id: prev.length + 1,
                    title: "New Objective",
                    weight: 0,
                    expanded: true,
                    keyResults: [],
                  },
                ]);
              }}
              className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <Plus size={16} />
              Add Objective
            </button>

            {/* Employee Assessment Info */}

            <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                <Info size={18} className="mt-0.5 text-blue-600" />

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Employee Assessment
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Employees will submit their Q1 and Q2 achievements during
                    the appraisal period. Scores will be calculated
                    automatically against the configured KPI Weight. Employees
                    cannot modify objectives, key results or targets.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="border-t bg-white">
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />

                <span className="font-medium text-slate-700">
                  Total Weight: {totalWeight}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    onSave?.(objectives);
                    onClose();
                  }}
                  disabled={totalWeight !== 100}
                  className={`rounded-md px-6 py-2.5 text-sm font-medium text-white transition ${
                    totalWeight === 100
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "cursor-not-allowed bg-gray-300"
                  }`}
                >
                  Save Goals
                </button>
              </div>
            </div>

            {totalWeight !== 100 && (
              <div className="border-t bg-red-50 px-6 py-3 text-sm text-red-600">
                Total objective weight must equal 100% before saving.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
