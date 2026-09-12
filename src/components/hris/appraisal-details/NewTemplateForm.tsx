"use client";

import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

import AppraisalSignOff from "./AppraisaalSignOff";
import { WeightItem } from "./WeightItems";
import { ObjectivesSection } from "./ObjectivesSections";
import Input from "@/components/ui/Input";

import {
  createKeyResult,
  createObjective,
  quarters,
} from "@/data/hris/appraisal";

import type { KeyResult, Objective } from "@/types/hris/appraisal";
import { createAppraisalTemplate } from "@/lib/api/hris";
import type {
  CreateAppraisalTemplatePayload,
  TemplateSectionInput,
  ObjectiveInput,
  KeyResultInput,
} from "@/lib/api/types/hrisTypes";

type NewTemplateProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

type Section = "A" | "B";

const initialObjectives = (): Objective[] => [createObjective()];

export default function NewTemplate({
  isOpen,
  onClose,
  onCreated,
}: NewTemplateProps) {
  const [activeQuarter, setActiveQuarter] = useState("Q1");
  const [activeSection, setActiveSection] = useState<Section>("A");

  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");

  const [objectivesA, setObjectivesA] =
    useState<Objective[]>(initialObjectives());
  const [objectivesB, setObjectivesB] =
    useState<Objective[]>(initialObjectives());

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const sumWeight = (objectives: Objective[]) =>
    objectives.reduce(
      (total, objective) => total + Number(objective.weight || 0),
      0,
    );

  const sectionAWeight = sumWeight(objectivesA);
  const sectionBWeight = sumWeight(objectivesB);
  const grandTotal = sectionAWeight + sectionBWeight;

  const canSave =
    templateName.trim().length > 0 &&
    grandTotal === 100 &&
    sectionAWeight > 0 &&
    sectionBWeight > 0;

  // ---- Section A (KRA) handlers ----
  const addObjectiveA = () => setObjectivesA((c) => [...c, createObjective()]);
  const addKeyResultA = (objectiveId: number) =>
    setObjectivesA((c) =>
      c.map((o) =>
        o.id === objectiveId
          ? { ...o, keyResults: [...o.keyResults, createKeyResult()] }
          : o,
      ),
    );
  const updateObjectiveA = (
    objectiveId: number,
    field: "name" | "weight",
    value: string,
  ) =>
    setObjectivesA((c) =>
      c.map((o) => (o.id === objectiveId ? { ...o, [field]: value } : o)),
    );
  const updateKeyResultA = (
    objectiveId: number,
    keyResultId: number,
    field: keyof KeyResult,
    value: string,
  ) =>
    setObjectivesA((c) =>
      c.map((o) =>
        o.id !== objectiveId
          ? o
          : {
              ...o,
              keyResults: o.keyResults.map((kr) =>
                kr.id === keyResultId ? { ...kr, [field]: value } : kr,
              ),
            },
      ),
    );

  // ---- Section B (BEHAVIOURAL) handlers — same shape, separate array ----
  const addObjectiveB = () => setObjectivesB((c) => [...c, createObjective()]);
  const addKeyResultB = (objectiveId: number) =>
    setObjectivesB((c) =>
      c.map((o) =>
        o.id === objectiveId
          ? { ...o, keyResults: [...o.keyResults, createKeyResult()] }
          : o,
      ),
    );
  const updateObjectiveB = (
    objectiveId: number,
    field: "name" | "weight",
    value: string,
  ) =>
    setObjectivesB((c) =>
      c.map((o) => (o.id === objectiveId ? { ...o, [field]: value } : o)),
    );
  const updateKeyResultB = (
    objectiveId: number,
    keyResultId: number,
    field: keyof KeyResult,
    value: string,
  ) =>
    setObjectivesB((c) =>
      c.map((o) =>
        o.id !== objectiveId
          ? o
          : {
              ...o,
              keyResults: o.keyResults.map((kr) =>
                kr.id === keyResultId ? { ...kr, [field]: value } : kr,
              ),
            },
      ),
    );

  // Converts this form's local Objective[] shape into the API's ObjectiveInput[]
  const toObjectiveInputs = (objectives: Objective[]): ObjectiveInput[] =>
    objectives.map((o) => ({
      title: o.name,
      weight: Number(o.weight || 0),
      keyResults: o.keyResults.map((kr): KeyResultInput => ({
        description: kr.description, // confirmed field name, no fallback needed
        kpiWeight: Number(kr.weight || 0),
        target: Number(kr.target || 0),
        initiatives: kr.initiatives,
      })),
    }));

  const handleSave = async () => {
    if (!canSave) return;

    setSaving(true);
    setSaveError(null);

    const sections: TemplateSectionInput[] = [
      {
        section: "KRA",
        weight: sectionAWeight,
        objectives: toObjectiveInputs(objectivesA),
      },
      {
        section: "BEHAVIOURAL",
        weight: sectionBWeight,
        objectives: toObjectiveInputs(objectivesB),
      },
    ];

    const payload: CreateAppraisalTemplatePayload = {
      name: templateName.trim(),
      description: description.trim(),
      isDefault: false,
      sections,
      reflectionQuestions: [],
      managerReviewQuestions: [],
      quarterScoring: true,
      signOffTypes: ["EMPLOYEE"],
    };

    try {
      await createAppraisalTemplate(payload);
      onCreated?.();
      onClose();
    } catch (err) {
      console.error(
        "Create template failed:",
        axios.isAxiosError(err) ? err.response?.data : err,
      );
      setSaveError(
        axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Couldn't save this template.")
          : "Couldn't save this template.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-template-title"
    >
      {/* Modal */}
      <div className="flex max-h-[95vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl sm:max-h-[92vh]">
        {/* Header */}
        <header className="shrink-0 border-b border-[#E5E9EF] px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1
                id="new-template-title"
                className="text-base font-bold text-[#1F2937] sm:text-lg"
              >
                New Template — OKR / KRA Builder
              </h1>

              <p className="mt-1 text-sm text-[#8492A6] sm:text-sm">
                Build objectives and key results for both KRA and Behavioural
                sections. Grand total must equal 100%.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="hidden h-8 rounded border border-[#E5E9EF] bg-white px-4 text-xs font-medium text-[#344054] transition hover:bg-gray-50 sm:block"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave || saving}
                className={`h-8 rounded px-3 text-sm font-medium transition sm:px-4 ${
                  canSave && !saving
                    ? "bg-[#2388D0] text-white hover:bg-[#1976B8]"
                    : "cursor-not-allowed bg-[#F2F4F7] text-[#BFC7D1]"
                }`}
              >
                {saving ? "Saving…" : "Save Template"}
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded text-[#667085] transition hover:bg-gray-100 hover:text-[#1F2937]"
              >
                <X size={17} />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto">
          <div className="px-4 py-4 sm:px-5 sm:py-5">
            {/* Template Information */}
            <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                name="Template Name *"
                placeholder="e.g. Leadership OKR Review"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />

              <Input
                name="Description"
                placeholder="When to use this template..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </section>

            {/* Weight Summary */}
            <section className="mt-4 flex flex-col gap-3 rounded border border-[#E8C968] bg-[#FFF4CC] px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <WeightItem
                  color="bg-[#2388D0]"
                  label="Section A"
                  value={sectionAWeight}
                />
                <WeightItem
                  color="bg-purple-600"
                  label="Section B"
                  value={sectionBWeight}
                />
              </div>

              <strong className="text-[#806000]">
                Grand Total: {grandTotal}% — must equal 100%
              </strong>
            </section>

            {saveError && (
              <p className="mt-3 rounded bg-red-50 px-3 py-2 text-sm text-red-600">
                {saveError}
              </p>
            )}

            {/* Quarters */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-[#475467]">Show quarters:</span>

              {quarters.map((quarter) => (
                <button
                  key={quarter}
                  type="button"
                  onClick={() => setActiveQuarter(quarter)}
                  className={`h-7 rounded-full px-3 text-sm font-semibold transition ${
                    activeQuarter === quarter
                      ? "bg-[#2388D0] text-white"
                      : "bg-[#F2F4F7] text-[#98A2B3] hover:bg-[#E5E7EB]"
                  }`}
                >
                  {quarter}
                </button>
              ))}

              <span className="text-sm text-[#98A2B3]">
                Q1–Q4 data filled during reviews
              </span>
            </div>

            {/* Section Tabs */}
            <div className="mt-5 flex overflow-x-auto border-b border-[#D9DEE7]">
              <SectionTab
                active={activeSection === "A"}
                onClick={() => setActiveSection("A")}
                color="blue"
                label="Section A: Objectives (KRA)"
                value={`${sectionAWeight}%`}
              />

              <SectionTab
                active={activeSection === "B"}
                onClick={() => setActiveSection("B")}
                color="purple"
                label="Section B: Behavioural Objectives"
                value={`${sectionBWeight}%`}
              />
            </div>

            {/* Section Content — both sections now use the same builder */}
            {activeSection === "A" ? (
              <ObjectivesSection
                objectives={objectivesA}
                sectionAWeight={sectionAWeight}
                onAddObjective={addObjectiveA}
                onAddKeyResult={addKeyResultA}
                onUpdateObjective={updateObjectiveA}
                onUpdateKeyResult={updateKeyResultA}
              />
            ) : (
              <ObjectivesSection
                objectives={objectivesB}
                sectionAWeight={sectionBWeight}
                onAddObjective={addObjectiveB}
                onAddKeyResult={addKeyResultB}
                onUpdateObjective={updateObjectiveB}
                onUpdateKeyResult={updateKeyResultB}
              />
            )}

            {/* Sign Off */}
            <div className="mt-5">
              <AppraisalSignOff />
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="flex shrink-0 gap-2 border-t border-[#E5E9EF] bg-white p-3 sm:hidden">
          <button
            type="button"
            onClick={onClose}
            className="h-9 flex-1 rounded border border-[#E5E9EF] bg-white text-sm font-medium text-[#344054]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave || saving}
            className={`h-9 flex-1 rounded text-sm font-medium ${
              canSave && !saving
                ? "bg-[#2388D0] text-white"
                : "cursor-not-allowed bg-[#F2F4F7] text-[#BFC7D1]"
            }`}
          >
            {saving ? "Saving…" : "Save Template"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section Tab                                                                */
/* -------------------------------------------------------------------------- */

type SectionTabProps = {
  active: boolean;
  onClick: () => void;
  color: "blue" | "purple";
  label: string;
  value: string;
};

function SectionTab({ active, onClick, color, label, value }: SectionTabProps) {
  const isBlue = color === "blue";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative shrink-0 px-3 pb-2 text-sm font-semibold transition sm:px-4 ${
        active
          ? isBlue
            ? "text-[#2388D0]"
            : "text-purple-700"
          : "text-[#8492A6]"
      }`}
    >
      {label}

      <span
        className={`ml-2 rounded-full px-2 py-1 text-base ${
          active
            ? isBlue
              ? "bg-[#2388D0] text-white"
              : "bg-purple-600 text-white"
            : "bg-[#F2F4F7] text-[#98A2B3]"
        }`}
      >
        {value}
      </span>

      {active && (
        <span
          className={`absolute bottom-0 left-0 h-[2px] w-full ${
            isBlue ? "bg-[#2388D0]" : "bg-purple-600"
          }`}
        />
      )}
    </button>
  );
}
