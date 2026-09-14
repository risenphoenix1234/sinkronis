"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

import AppraisalSignOff from "./AppraisaalSignOff";
import BehaviourTable from "./BehaviourTable";
import GrandTotal from "./GrandTotal";
import ObjectivesTable from "./ObjectivesTable";
import { AppraisalHeader } from "./AppraisalHeader";
import { TemplateHeader } from "./TemplateHeader";

import { employee } from "@/data/hris/appraisal";
import { updateAppraisalTemplate } from "@/lib/api/hris";
import type {
  AppraisalTemplate,
  AppraisalTemplatePayload,
  AppraisalKeyResult,
  TemplateSection,
  SignOffType,
} from "@/lib/api/types/hrisTypes";

type TemplateViewProps = {
  isOpen: boolean;
  onClose: () => void;
  template: AppraisalTemplate | null;
  mode?: "preview" | "edit";
  onSaved?: (updated: AppraisalTemplate) => void;
};

type DraftMeta = {
  name: string;
  description: string;
  isDefault: boolean;
  quarterScoring: boolean;
  signOffTypes: SignOffType[];
};

export default function TemplateView({
  isOpen,
  onClose,
  template,
  mode = "preview",
  onSaved,
}: TemplateViewProps) {
  const editable = mode === "edit";

  const [draft, setDraft] = useState<TemplateSection[] | null>(null);
  const [draftMeta, setDraftMeta] = useState<DraftMeta | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (template) {
      setDraft(structuredClone(template.configuration.sections));
      setDraftMeta({
        name: template.name,
        description: template.description ?? "",
        isDefault: template.isDefault,
        quarterScoring: template.configuration.quarterScoring,
        signOffTypes: template.configuration.signOffTypes,
      });
      setSaveError(null);
    } else {
      setDraft(null);
      setDraftMeta(null);
    }
  }, [template, mode]);

  if (!isOpen) return null;

  if (!template) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <p className="text-sm text-[#94A3B8]">Loading template…</p>
      </div>
    );
  }

  const sections = draft ?? template.configuration.sections;
  const meta = draftMeta ?? {
    name: template.name,
    description: template.description ?? "",
    isDefault: template.isDefault,
    quarterScoring: template.configuration.quarterScoring,
    signOffTypes: template.configuration.signOffTypes,
  };
  const kraSection = sections.find((s) => s.section === "KRA");
  const behaviouralSection = sections.find((s) => s.section === "BEHAVIOURAL");

  const updateSectionWeight = (sectionName: string, weight: number) => {
    setDraft((prev) =>
      (prev ?? sections).map((s) =>
        s.section === sectionName ? { ...s, weight } : s,
      ),
    );
  };

  const updateObjective = (
    sectionName: string,
    objIndex: number,
    field: "title" | "weight",
    value: string | number,
  ) => {
    setDraft((prev) =>
      (prev ?? sections).map((s) => {
        if (s.section !== sectionName) return s;
        const objectives = s.objectives.map((obj, i) =>
          i === objIndex ? { ...obj, [field]: value } : obj,
        );
        return { ...s, objectives };
      }),
    );
  };

  const updateKeyResult = (
    sectionName: string,
    objIndex: number,
    krIndex: number,
    field: keyof AppraisalKeyResult,
    value: string | number,
  ) => {
    setDraft((prev) =>
      (prev ?? sections).map((s) => {
        if (s.section !== sectionName) return s;
        const objectives = s.objectives.map((obj, i) => {
          if (i !== objIndex) return obj;
          const keyResults = obj.keyResults.map((kr, j) =>
            j === krIndex ? { ...kr, [field]: value } : kr,
          );
          return { ...obj, keyResults };
        });
        return { ...s, objectives };
      }),
    );
  };

  const updateMeta = <K extends keyof DraftMeta>(
    field: K,
    value: DraftMeta[K],
  ) => {
    setDraftMeta((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleCancel = () => {
    setDraft(structuredClone(template.configuration.sections));
    setDraftMeta({
      name: template.name,
      description: template.description ?? "",
      isDefault: template.isDefault,
      quarterScoring: template.configuration.quarterScoring,
      signOffTypes: template.configuration.signOffTypes,
    });
    setSaveError(null);
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);

    // reflectionQuestions/managerReviewQuestions: shape still unconfirmed
    // (Swagger example showed [{}]) — passed through unchanged until that's
    // verified with backend or the Schema tab.
    const payload: AppraisalTemplatePayload = {
      name: meta.name,
      description: meta.description,
      isDefault: meta.isDefault,
      sections: sections,
      reflectionQuestions: template.configuration.reflectionQuestions,
      managerReviewQuestions: template.configuration.managerReviewQuestions,
      quarterScoring: meta.quarterScoring,
      signOffTypes: meta.signOffTypes,
    };

    try {
      const updated = await updateAppraisalTemplate(template.id, payload);
      onSaved?.(updated);
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Failed to save template. Please check section weights and try again.";
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <main className="min-h-screen bg-white text-[#1F2937]">
        <TemplateHeader
          onClose={onClose}
          templateName={meta.name}
          templateDescription={meta.description}
          editable={editable}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
          saveError={saveError}
          onNameChange={(v) => updateMeta("name", v)}
          onDescriptionChange={(v) => updateMeta("description", v)}
          isDefault={meta.isDefault}
          onIsDefaultChange={(v) => updateMeta("isDefault", v)}
          quarterScoring={meta.quarterScoring}
          onQuarterScoringChange={(v) => updateMeta("quarterScoring", v)}
        />

        <div className="px-4 py-5 sm:px-6 lg:px-10 lg:py-6">
          {!editable && <PreviewBanner />}
          <div className="mt-5">
            <AppraisalHeader employee={employee} />
          </div>
        </div>

        <div className="space-y-5 px-4 pb-8 sm:px-6 lg:px-10 lg:pb-10">
          <ObjectivesTable
            section={kraSection}
            editable={editable}
            onSectionWeightChange={(w) => updateSectionWeight("KRA", w)}
            onObjectiveChange={(i, field, v) =>
              updateObjective("KRA", i, field, v)
            }
            onKeyResultChange={(oi, ki, field, v) =>
              updateKeyResult("KRA", oi, ki, field, v)
            }
          />

          <BehaviourTable
            section={behaviouralSection}
            editable={editable}
            onSectionWeightChange={(w) => updateSectionWeight("BEHAVIOURAL", w)}
            onObjectiveChange={(i, field, v) =>
              updateObjective("BEHAVIOURAL", i, field, v)
            }
            onKeyResultChange={(oi, ki, field, v) =>
              updateKeyResult("BEHAVIOURAL", oi, ki, field, v)
            }
          />

          <GrandTotal />

          <AppraisalSignOff
            signOffTypes={meta.signOffTypes}
            ratingScale={template.configuration.ratingScale}
            editable={editable}
            onSignOffTypesChange={(types) => updateMeta("signOffTypes", types)}
          />
        </div>
      </main>
    </div>
  );
}

function PreviewBanner() {
  return (
    <div className="flex min-h-[46px] items-center gap-3 rounded-md border border-[#A8D5F5] bg-[#E7F4FF] px-4 py-3 sm:px-5">
      <Eye size={16} strokeWidth={2} className="shrink-0 text-[#2388D0]" />
      <p className="text-xs font-medium leading-5 text-[#1670C2] sm:text-[13px]">
        Employee Self-Assessment Preview — type in Q1–Q4 achieved values to see
        scores calculate live.
      </p>
    </div>
  );
}
