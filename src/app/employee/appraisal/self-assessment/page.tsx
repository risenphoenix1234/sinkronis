// src/app/employee/appraisal/self-assessment/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import ConfirmSubmitModal from "@/components/employee/appraisal/ConfirmSubmitModal";
import SelfAssessmentHeader from "@/components/employee/appraisal/SelfAssessmentHeader";
import InfoBanner from "@/components/employee/appraisal/InfoBanner";
import EmployeeInformation from "@/components/employee/appraisal/EmployeeInfo";
import GrandTotal from "@/components/hris/appraisal-details/GrandTotal";
import OverallRating from "@/components/employee/appraisal/OverallRating";
import SignOff from "@/components/employee/appraisal/SignOff";
import FooterAction from "@/components/employee/appraisal/FooterActions";
import ObjectivesTable from "@/components/hris/appraisal-details/ObjectivesTable";
import BehaviourTable from "@/components/hris/appraisal-details/BehaviourTable";
import ReflectionQuestions from "@/components/hris/appraisal-details/ReflectionQuestions";
import type { ReflectionQuestionDef } from "@/components/hris/appraisal-details/ReflectionQuestions";
import type { TemplateSection } from "@/lib/api/types/hrisTypes";
import {
  getEmployeeSelfAssessment,
  saveEmployeeSelfAssessmentDraft,
  submitEmployeeSelfAssessment,
} from "@/lib/api/employee";
import {
  EmployeeSelfAssessmentData,
  SelfAssessmentDraftSection,
} from "@/lib/api/types/employeeTypes";

interface TemplateKeyResult {
  id: string;
  description: string;
  initiatives?: string | null;
  kpiWeight: number;
  target: number | string;
}

interface TemplateObjective {
  id: string;
  title: string;
  weight: number;
  keyResults?: TemplateKeyResult[];
}

interface TemplateConfigSection {
  section: string;
  weight: number;
  objectives: TemplateObjective[];
}

interface HeaderEmployee {
  id?: string;
  name?: string;
  role?: string;
  department?: string;
  startDate?: string;
}

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function SelfAssessmentPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [appraisalId, setAppraisalId] = useState("");
  const [data, setData] = useState<EmployeeSelfAssessmentData | null>(null);
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [questions, setQuestions] = useState<ReflectionQuestionDef[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [achievedById, setAchievedById] = useState<Record<string, string>>({});
  const [commentById, setCommentById] = useState<Record<string, string>>({});
  const [behaviouralAchievedById, setBehaviouralAchievedById] = useState<
    Record<string, string>
  >({});
  const [behaviouralCommentById, setBehaviouralCommentById] = useState<
    Record<string, string>
  >({});
  const [responseById, setResponseById] = useState<Record<string, string>>({});

  const load = useCallback((id: string) => {
    setLoadingData(true);
    setLoadError(null);
    getEmployeeSelfAssessment(id)
      .then((res) => {
        setData(res);
        const template = res.template as
          | { configuration?: { sections?: TemplateConfigSection[] } }
          | undefined;
        const mapped: TemplateSection[] = (
          template?.configuration?.sections ?? []
        ).map((s) => ({
          section: s.section as "KRA" | "BEHAVIOURAL",
          weight: s.weight,
          objectives: s.objectives.map((obj) => ({
            id: obj.id,
            title: obj.title,
            weight: obj.weight,
            keyResults: (obj.keyResults ?? []).map((kr) => ({
              id: kr.id,
              description: kr.description,
              initiatives: kr.initiatives ?? "",
              kpiWeight: kr.kpiWeight,
              target: kr.target,
            })),
          })),
        })) as TemplateSection[];
        setSections(mapped);
        setQuestions(
          (res.reflectionQuestions ?? []).map((q) => ({
            questionId: q.id,
            title: q.question,
          })) as ReflectionQuestionDef[],
        );
      })
      .catch((err: unknown) => {
        const apiMsg = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message;
        setLoadError(apiMsg || "Failed to load self-assessment.");
      })
      .finally(() => setLoadingData(false));
  }, []);

  useEffect(() => {
    const id =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("appraisalId") || ""
        : "";
    setAppraisalId(id);
    if (id) load(id);
  }, [load]);

  const kraSection = sections.find((s) => s.section === "KRA");
  const behaviouralSection = sections.find((s) => s.section === "BEHAVIOURAL");

  const buildSection = (
    section: TemplateSection,
    achById: Record<string, string>,
    cmtById: Record<string, string>,
  ): SelfAssessmentDraftSection => ({
    section: section.section,
    totalWeight: section.weight,
    objectives: section.objectives.map((objective) => ({
      title: objective.title,
      weight: objective.weight,
      keyResults: objective.keyResults.map((kr) => ({
        keyResult: kr.description,
        kpiWeight: kr.kpiWeight,
        target: Number(kr.target) || 0,
        achieved: Number(achById[kr.id] ?? 0) || 0,
        comment: cmtById[kr.id] ?? "",
      })),
    })),
  });

  const buildPayload = () => {
    const payloadSections: SelfAssessmentDraftSection[] = [
      ...(kraSection ? [buildSection(kraSection, achievedById, commentById)] : []),
      ...(behaviouralSection
        ? [
            buildSection(
              behaviouralSection,
              behaviouralAchievedById,
              behaviouralCommentById,
            ),
          ]
        : []),
    ];
    const reflections = Object.entries(responseById)
      .filter(([, response]) => response.trim().length > 0)
      .map(([questionId, response]) => ({
        questionId,
        response: response.trim(),
      }));
    return {
      sections: payloadSections,
      ...(reflections.length > 0 ? { reflections } : {}),
    };
  };

  const errorMessage = (err: unknown, fallback: string) => {
    const detail = (
      err as {
        response?: {
          data?: {
            message?: string;
            validationErrors?: { field: string; message: string }[];
          };
        };
      }
    )?.response?.data;
    return (
      detail?.validationErrors
        ?.map((v) => `${v.field}: ${v.message}`)
        .join("; ") ||
      detail?.message ||
      fallback
    );
  };

  const handleSaveDraft = async () => {
    if (!appraisalId) return;
    setSavingDraft(true);
    try {
      await saveEmployeeSelfAssessmentDraft(appraisalId, buildPayload());
      toast.success("Draft saved successfully.");
    } catch (err: unknown) {
      toast.error(errorMessage(err, "Failed to save draft."));
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmit = async () => {
    if (!appraisalId) return;
    setSubmitting(true);
    try {
      await submitEmployeeSelfAssessment(appraisalId, buildPayload());
      toast.success("Self-assessment submitted successfully.");
      setOpen(false);
      router.push("/employee/appraisal?submitted=true");
    } catch (err: unknown) {
      setOpen(false);
      toast.error(errorMessage(err, "Failed to submit self-assessment."));
    } finally {
      setSubmitting(false);
    }
  };

  const header = data?.header as
    | { employee?: HeaderEmployee; supervisor?: { name?: string } | null }
    | undefined;

  const activeEmployee = {
    id: header?.employee?.id || "",
    name: header?.employee?.name || "",
    department: header?.employee?.department || "—",
    jobTitle: header?.employee?.role || "—",
    supervisor: header?.supervisor?.name || "—",
    employmentDate: formatDate(header?.employee?.startDate),
    reviewPeriod: data?.quarter || "",
  };

  const sectionTotal = (
    section: TemplateSection | undefined,
    achById: Record<string, string>,
  ) =>
    (section?.objectives ?? []).reduce(
      (sum, objective) =>
        sum +
        objective.keyResults.reduce((s, kr) => {
          const target = Number(kr.target) || 0;
          const achieved = Number(achById[kr.id] ?? 0) || 0;
          return target > 0 ? s + (achieved / target) * kr.kpiWeight : s;
        }, 0),
      0,
    );

  const grandScore = Math.round(
    sectionTotal(kraSection, achievedById) +
      sectionTotal(behaviouralSection, behaviouralAchievedById),
  );

  const grandRating =
    grandScore > 120
      ? "Outstanding"
      : grandScore > 100
        ? "Above Expectation"
        : grandScore >= 80
          ? "Meets Expectation"
          : grandScore >= 60
            ? "Below Expectation"
            : "Poor Performance";

  const busy = savingDraft || submitting;

  return (
    <>
      <main className="min-h-screen bg-slate-50 p-6 pb-28">
        <div className="mx-auto space-y-6">
          <SelfAssessmentHeader />

          {loadingData && (
            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <span>Loading assigned self-assessment template...</span>
            </div>
          )}

          {loadError && (
            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <span>{loadError}</span>
              <button
                type="button"
                onClick={() => appraisalId && load(appraisalId)}
                className="font-medium underline"
              >
                Retry
              </button>
            </div>
          )}

          <InfoBanner />

          <EmployeeInformation employee={activeEmployee} />

          {kraSection && (
            <ObjectivesTable
              section={kraSection}
              editable
              quarter={data?.quarter || undefined}
              achievedById={achievedById}
              commentById={commentById}
              onAchievedChange={(krId, value) =>
                setAchievedById((p) => ({ ...p, [krId]: value }))
              }
              onCommentChange={(krId, value) =>
                setCommentById((p) => ({ ...p, [krId]: value }))
              }
            />
          )}

          {behaviouralSection && (
            <BehaviourTable
              section={behaviouralSection}
              editable
              quarter={data?.quarter || undefined}
              achievedById={behaviouralAchievedById}
              commentById={behaviouralCommentById}
              onAchievedChange={(krId, value) =>
                setBehaviouralAchievedById((p) => ({ ...p, [krId]: value }))
              }
              onCommentChange={(krId, value) =>
                setBehaviouralCommentById((p) => ({ ...p, [krId]: value }))
              }
            />
          )}

            <GrandTotal
            quarter={data?.quarter}
            score={grandScore > 0 ? grandScore : null}
            ratingLabel={grandScore > 0 ? grandRating : null}
          />

          <OverallRating />

          {questions.length > 0 && (
            <div className="rounded-xl border bg-white p-6">
              <ReflectionQuestions
                questions={questions}
                responseById={responseById}
                onResponseChange={(questionId, value) =>
                  setResponseById((p) => ({ ...p, [questionId]: value }))
                }
              />
            </div>
          )}

          <SignOff
            employeeName={activeEmployee.name}
            managerName={activeEmployee.supervisor}
          />

          <FooterAction
            disableSubmit={busy || sections.length === 0}
            loading={busy}
            onSaveDraft={handleSaveDraft}
            onSubmit={() => setOpen(true)}
          />
        </div>
      </main>
      <ConfirmSubmitModal
        open={open}
        loading={submitting}
        onClose={() => setOpen(false)}
        onConfirm={handleSubmit}
      />
    </>
  );
}