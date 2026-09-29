"use client";

import { Plus, X, AlertCircle } from "lucide-react";
import axios from "axios";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";

import { createAppraisalTemplate } from "@/lib/api/hris";
import type { CreateAppraisalTemplatePayload } from "@/lib/api/types/hrisTypes";

type SectionKey = "A" | "B";
type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

interface KeyResult {
  id: string;
  description: string;
  weight: number; // percentage points, contributes to the parent objective's total
  target: string;
  initiatives: string;
  q1Achieved: string; // filled during reviews, not at template-creation time
  q1Percent: number | null; // filled during reviews
  comment: string; // filled during reviews
}

interface Objective {
  id: string;
  name: string;
  keyResults: KeyResult[];
}

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;

function makeKeyResult(): KeyResult {
  return {
    id: nextId("kr"),
    description: "",
    weight: 0,
    target: "",
    initiatives: "",
    q1Achieved: "",
    q1Percent: null,
    comment: "",
  };
}

function makeObjective(index: number): Objective {
  return {
    id: nextId("obj"),
    name: "",
    keyResults: [makeKeyResult()],
  };
}

const QUARTERS: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];

const RATING_SCALE = [
  {
    score: 5,
    label: "Outstanding",
    range: ">121%",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    subtext: "text-emerald-500",
  },
  {
    score: 4,
    label: "Above Expectation",
    range: "101–120%",
    bg: "bg-sky-50",
    text: "text-sky-700",
    subtext: "text-sky-500",
  },
  {
    score: 3,
    label: "Meets Expectation",
    range: "80–100%",
    bg: "bg-slate-50",
    text: "text-slate-700",
    subtext: "text-slate-400",
  },
  {
    score: 2,
    label: "Below Expectation",
    range: "60–79%",
    bg: "bg-amber-50",
    text: "text-amber-700",
    subtext: "text-amber-500",
  },
  {
    score: 1,
    label: "Poor Performance",
    range: "<59%",
    bg: "bg-rose-50",
    text: "text-rose-700",
    subtext: "text-rose-500",
  },
] as const;

const SIGNOFF_ROLES = [
  { key: "appraisee", label: "Appraisee" },
  { key: "manager", label: "Line Manager / MD" },
  { key: "hr", label: "HR Representative" },
] as const;

interface NewTemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const objectiveWeight = (o: Objective) =>
  o.keyResults.reduce((sum, kr) => sum + (Number(kr.weight) || 0), 0);

export default function NewTemplateForm({
  isOpen,
  onClose,
  onCreated,
}: NewTemplateFormProps) {
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>("A");
  const [activeQuarter, setActiveQuarter] = useState<Quarter>("Q1");

  const [objectivesA, setObjectivesA] = useState<Objective[]>([
    makeObjective(0),
  ]);
  const [objectivesB, setObjectivesB] = useState<Objective[]>([
    makeObjective(0),
  ]);

  useEffect(() => {
    if (!isOpen) return;
    setTemplateName("");
    setDescription("");
    setIsDefault(false);
    setSaveError(null);
    setActiveSection("A");
    setActiveQuarter("Q1");
    setObjectivesA([makeObjective(0)]);
    setObjectivesB([makeObjective(0)]);
  }, [isOpen]);

  const sectionATotal = useMemo(
    () => objectivesA.reduce((sum, o) => sum + objectiveWeight(o), 0),
    [objectivesA],
  );
  const sectionBTotal = useMemo(
    () => objectivesB.reduce((sum, o) => sum + objectiveWeight(o), 0),
    [objectivesB],
  );
  const grandTotal = sectionATotal + sectionBTotal;
  const isBalanced = grandTotal === 100;
  const canSave = templateName.trim().length > 0 && isBalanced;
  const [saving, setSaving] = useState(false);

  const objectives = activeSection === "A" ? objectivesA : objectivesB;
  const setObjectives = activeSection === "A" ? setObjectivesA : setObjectivesB;

  const updateObjectiveName = (objectiveId: string, name: string) => {
    setObjectives((prev) =>
      prev.map((o) => (o.id === objectiveId ? { ...o, name } : o)),
    );
  };

  const addObjective = () => {
    setObjectives((prev) => [...prev, makeObjective(prev.length)]);
  };

  const addKeyResult = (objectiveId: string) => {
    setObjectives((prev) =>
      prev.map((o) =>
        o.id === objectiveId
          ? { ...o, keyResults: [...o.keyResults, makeKeyResult()] }
          : o,
      ),
    );
  };

  const updateKeyResult = <K extends keyof KeyResult>(
    objectiveId: string,
    keyResultId: string,
    field: K,
    value: KeyResult[K],
  ) => {
    setObjectives((prev) =>
      prev.map((o) =>
        o.id === objectiveId
          ? {
              ...o,
              keyResults: o.keyResults.map((kr) =>
                kr.id === keyResultId ? { ...kr, [field]: value } : kr,
              ),
            }
          : o,
      ),
    );
  };

  const toSection = (
    section: "KRA" | "BEHAVIOURAL",
    sectionObjectives: Objective[],
  ): CreateAppraisalTemplatePayload["sections"][number] => ({
    section,
    weight: sectionObjectives.reduce(
      (sum, objective) => sum + objectiveWeight(objective),
      0,
    ),
    objectives: sectionObjectives.map((objective) => ({
      title: objective.name.trim(),
      weight: objectiveWeight(objective),
      keyResults: objective.keyResults.map((keyResult) => ({
        description: keyResult.description.trim(),
        kpiWeight: Number(keyResult.weight) || 0,
        target: Number(keyResult.target) || 0,
        initiatives: keyResult.initiatives.trim(),
      })),
    })),
  });

  const handleSave = async () => {
    if (!canSave) return;

    const payload: CreateAppraisalTemplatePayload = {
      name: templateName.trim(),
      description: description.trim(),
      isDefault,
      sections: [
        toSection("KRA", objectivesA),
        toSection("BEHAVIOURAL", objectivesB),
      ],
      reflectionQuestions: [],
      managerReviewQuestions: [],
      quarterScoring: true,
      signOffTypes: ["EMPLOYEE", "MANAGER", "HR"],
    };

    setSaving(true);
    setSaveError(null);
    try {
      await createAppraisalTemplate(payload);
      toast.success("Appraisal template created successfully");
      setTemplateName("");
      setDescription("");
      setIsDefault(false);
      setObjectivesA([makeObjective(0)]);
      setObjectivesB([makeObjective(0)]);
      onCreated?.();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ||
          (Array.isArray(err.response?.data?.validationErrors)
            ? err.response?.data?.validationErrors[0]?.message
            : null) ||
          err.message
        : "Failed to create appraisal template";
      setSaveError(message);
      toast.error(message);
      console.error("Create appraisal template failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-template-title"
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-8 py-5">
          <div>
            <h1
              id="new-template-title"
              className="text-lg font-semibold text-slate-900"
            >
              New Template — OKR / KRA Builder
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Build objectives and key results. All KPI weights must total 100%.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave || saving}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-400 transition enabled:bg-blue-600 enabled:text-white enabled:hover:bg-blue-700 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Template"}
            </button>
            <button
              onClick={onClose}
              disabled={saving}
              aria-label="Close"
              className="text-slate-400 transition hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-6">
            {/* Error Banner */}
            {saveError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{saveError}</span>
              </div>
            )}

            {/* Template name / description */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTemplateName(e.target.value)
                  }
                  placeholder="e.g. Leadership OKR Review"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDescription(e.target.value)
                  }
                  placeholder="When to use this template..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Set as Default Template Toggle */}
            <div className="flex items-center gap-2">
              <input
                id="template-is-default"
                type="checkbox"
                checked={isDefault}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setIsDefault(e.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="template-is-default"
                className="cursor-pointer text-sm text-slate-700"
              >
                Set as organization default template
              </label>
            </div>

            {/* Weight summary bar */}
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="flex items-center gap-5 text-sm">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Section A: {sectionATotal}%
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Section B: {sectionBTotal}%
                </span>
              </div>
              <span
                className={`text-sm font-semibold ${isBalanced ? "text-emerald-700" : "text-amber-800"}`}
              >
                Grand Total: {grandTotal}% — must equal 100%
              </span>
            </div>

            {/* Quarters */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">
                Show quarters:
              </span>
              <div className="flex gap-2">
                {QUARTERS.map((q) => {
                  const isActive = q === activeQuarter;
                  const isEnabled = q === "Q1";
                  return (
                    <button
                      key={q}
                      disabled={!isEnabled}
                      onClick={() => isEnabled && setActiveQuarter(q)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : isEnabled
                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            : "cursor-not-allowed bg-slate-100 text-slate-300"
                      }`}
                    >
                      {q}
                    </button>
                  );
                })}
              </div>
              <span className="text-xs text-slate-400">
                Q1–Q4 data filled during reviews
              </span>
            </div>

            {/* Section tabs */}
            <div className="flex gap-6 border-b border-slate-200">
              <SectionTab
                label="Section A: Objectives (KRA)"
                percent={sectionATotal}
                isActive={activeSection === "A"}
                onClick={() => setActiveSection("A")}
              />
              <SectionTab
                label="Section B: Behavioural Objectives"
                percent={sectionBTotal}
                isActive={activeSection === "B"}
                onClick={() => setActiveSection("B")}
              />
            </div>

            {/* Objectives table */}
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="grid grid-cols-[1.4fr_0.6fr_1.4fr_0.6fr_0.8fr_1.2fr_0.7fr_0.6fr_1fr] gap-2 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <span>Objective</span>
                <span>Total Wt.</span>
                <span>Key Result</span>
                <span>KPI Wt.</span>
                <span>Target</span>
                <span>Initiatives</span>
                <span>{activeQuarter} Ach.</span>
                <span>{activeQuarter} %</span>
                <span>Comment</span>
              </div>

              <div className="divide-y divide-slate-100">
                {objectives.map((objective, index) => {
                  const weight = objectiveWeight(objective);
                  return (
                    <div
                      key={objective.id}
                      className="border-l-4 border-blue-500 bg-blue-50/40"
                    >
                      <div className="grid grid-cols-[1.4fr_0.6fr_1.4fr_0.6fr_0.8fr_1.2fr_0.7fr_0.6fr_1fr] items-center gap-2 px-4 py-3">
                        <input
                          value={objective.name}
                          onChange={(e) =>
                            updateObjectiveName(objective.id, e.target.value)
                          }
                          placeholder={`Objective ${index + 1} name`}
                          className="border-none bg-transparent text-sm font-medium text-blue-700 placeholder-blue-400 outline-none"
                        />
                        <span className="text-sm text-slate-600">
                          {weight}%
                        </span>
                        <span className="text-xs text-slate-400">
                          {objective.keyResults.length} KR
                          <button
                            onClick={() => addKeyResult(objective.id)}
                            className="ml-2 text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            + Add KR
                          </button>
                        </span>
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>

                      {objective.keyResults.map((kr) => (
                        <div
                          key={kr.id}
                          className="grid grid-cols-[1.4fr_0.6fr_1.4fr_0.6fr_0.8fr_1.2fr_0.7fr_0.6fr_1fr] items-center gap-2 px-4 pb-3"
                        >
                          <span />
                          <span />
                          <input
                            value={kr.description}
                            onChange={(e) =>
                              updateKeyResult(
                                objective.id,
                                kr.id,
                                "description",
                                e.target.value,
                              )
                            }
                            placeholder="Key result description..."
                            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={kr.weight}
                              onChange={(e) =>
                                updateKeyResult(
                                  objective.id,
                                  kr.id,
                                  "weight",
                                  Number(e.target.value) || 0,
                                )
                              }
                              className="w-14 rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0"
                            />
                            <span className="text-xs text-slate-400">%</span>
                          </div>
                          <input
                            value={kr.target}
                            onChange={(e) =>
                              updateKeyResult(
                                objective.id,
                                kr.id,
                                "target",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. 100"
                            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          />
                          <input
                            value={kr.initiatives}
                            onChange={(e) =>
                              updateKeyResult(
                                objective.id,
                                kr.id,
                                "initiatives",
                                e.target.value,
                              )
                            }
                            placeholder="Action plan..."
                            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          />
                          <input
                            disabled
                            placeholder="—"
                            className="cursor-not-allowed rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-xs text-slate-300 outline-none"
                          />
                          <input
                            disabled
                            placeholder="—%"
                            className="cursor-not-allowed rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-xs text-slate-300 outline-none"
                          />
                          <input
                            disabled
                            placeholder="Auto-filled during review"
                            className="cursor-not-allowed rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-xs text-slate-300 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={addObjective}
                className="flex w-full items-center justify-center gap-1.5 border-t border-slate-200 py-3 text-sm font-medium text-blue-600 transition hover:bg-blue-50/50"
              >
                <Plus size={14} />
                Add Objectives (KRA)
              </button>

              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Section {activeSection}
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {activeSection === "A" ? sectionATotal : sectionBTotal}%
                </span>
              </div>
            </div>

            {/* Rating scale */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Rating Scale
              </p>
              <div className="grid grid-cols-5 gap-3">
                {RATING_SCALE.map((r) => (
                  <div key={r.score} className={`rounded-xl px-4 py-3 ${r.bg}`}>
                    <p className={`text-2xl font-bold ${r.text}`}>{r.score}</p>
                    <p className={`text-xs font-medium ${r.text}`}>{r.label}</p>
                    <p className={`mt-1 text-xs ${r.subtext}`}>{r.range}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign-off */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Sign-off
              </p>
              <div className="divide-y divide-dashed divide-slate-200 border-l-2 border-dashed border-slate-300 pl-4">
                {SIGNOFF_ROLES.map((role) => (
                  <div key={role.key} className="grid grid-cols-2 gap-4 py-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Name
                      </label>
                      <input
                        disabled
                        placeholder="Auto-filled"
                        className="w-full cursor-not-allowed rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-300 outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Signature &amp; Date
                      </label>
                      <input
                        disabled
                        placeholder="Captured at sign-off"
                        className="w-full cursor-not-allowed rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-300 outline-none"
                      />
                    </div>
                    <p className="col-span-2 -mt-2 text-xs font-medium text-slate-600">
                      {role.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTab({
  label,
  percent,
  isActive,
  onClick,
}: {
  label: string;
  percent: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition ${
        isActive
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-slate-500 hover:text-slate-700"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
          isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400"
        }`}
      >
        {percent}%
      </span>
    </button>
  );
}
