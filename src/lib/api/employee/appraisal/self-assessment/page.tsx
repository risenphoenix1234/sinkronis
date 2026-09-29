"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import ConfirmSubmitModal from "@/components/employee/appraisal/ConfirmSubmitModal";
import { useSelfAssessment } from "@/components/employee/appraisal/UseSelfAssessment";
import SelfAssessmentHeader from "@/components/employee/appraisal/SelfAssessmentHeader";
import InfoBanner from "@/components/employee/appraisal/InfoBanner";
import EmployeeInformation from "@/components/employee/appraisal/EmployeeInfo";
import ObjectiveTable from "@/components/employee/appraisal/ObjectiveTable";
import BehaviourTable from "@/components/employee/appraisal/BehaviourTable";
import GrandTotal from "@/components/employee/appraisal/GrandTotal";
import OverallRating from "@/components/employee/appraisal/OverallRating";
import ReflectionQuestions from "@/components/employee/appraisal/ReflectionQuestion";
import SignOff from "@/components/employee/appraisal/SignOff";
import FooterAction from "@/components/employee/appraisal/FooterActions";
import {
  getEmployeeSelfAssessment,
  saveEmployeeSelfAssessmentDraft,
  submitEmployeeSelfAssessment,
} from "@/lib/api/employee";
import {
  EmployeeSelfAssessmentData,
  SaveSelfAssessmentDraftPayload,
  SubmitSelfAssessmentPayload,
} from "@/lib/api/types/employeeTypes";

export default function SelfAssessmentPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { loading, saveDraft, submit } = useSelfAssessment();
  const [selfAssessmentData, setSelfAssessmentData] =
    useState<EmployeeSelfAssessmentData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const appraisalId = params?.get("appraisalId");
    if (appraisalId) {
      setLoadingData(true);
      getEmployeeSelfAssessment(appraisalId)
        .then((data) => setSelfAssessmentData(data))
        .catch((err) => {
          console.error("Could not fetch self-assessment from API:", err);
        })
        .finally(() => setLoadingData(false));
    }
  }, []);

  const activeEmployee = selfAssessmentData?.header
    ? {
        id: selfAssessmentData.header.employee?.id || "",
        name: selfAssessmentData.header.employee?.name || "",
        department: "—",
        jobTitle: "—",
        supervisor: selfAssessmentData.header.supervisor?.name || "",
        employmentDate: "—",
        reviewPeriod: selfAssessmentData.quarter || "",
      }
    : {
        id: "",
        name: "",
        department: "—",
        jobTitle: "—",
        supervisor: "",
        employmentDate: "—",
        reviewPeriod: "",
      };

  const activeQuestions = selfAssessmentData?.reflectionQuestions?.length
    ? selfAssessmentData.reflectionQuestions.map((q, idx) => ({
        id: idx + 1,
        title: q.question,
        description: `Question ID: ${q.id}`,
        answer: "",
      }))
    : [];

  const activeObjectives = selfAssessmentData?.goals?.length
    ? selfAssessmentData.goals.map((g, idx) => ({
        id: idx + 1,
        title: g.title,
        weight: "100%",
        kpis: [
          {
            id: idx + 1,
            description: g.description || g.successCriteria || "",
            kpiWeight: "100%",
            target: g.targetDate || "—",
            q1Ach: g.employeeRating ? `${g.employeeRating}` : "—",
            q2Ach: g.managerRating ? `${g.managerRating}` : "—",
            comment: g.employeeComment || g.managerComment || "—",
          },
        ],
      }))
    : [];

  const handleSaveDraft = async () => {
    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const appraisalId =
      selfAssessmentData?.appraisalId || params?.get("appraisalId");

    if (appraisalId) {
      setSavingDraft(true);
      try {
        const payload: SaveSelfAssessmentDraftPayload = {
          sections: [
            {
              section: "KRA",
              totalWeight: 100,
              objectives: (selfAssessmentData?.goals || []).map((obj) => ({
                title: obj.title,
                weight: 100,
                keyResults: [
                  {
                    keyResult:
                      obj.successCriteria ||
                      obj.description ||
                      obj.title,
                    kpiWeight: 100,
                    target: typeof obj.targetDate === "number" ? obj.targetDate : 100,
                    comment: obj.employeeComment || undefined,
                  },
                ],
              })),
            },
          ],
          reflections: activeQuestions.map((q) => ({
            questionId: String(q.id).startsWith("question_")
              ? String(q.id)
              : `question_${q.id}`,
            response: q.answer || "",
          })),
        };

        await saveEmployeeSelfAssessmentDraft(appraisalId, payload);
        toast.success("Employee self-assessment draft saved successfully.");
      } catch (err: unknown) {
        console.error("Failed to save draft:", err);
        const apiMsg = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message;
        toast.error(
          apiMsg ||
            (err instanceof Error
              ? err.message
              : "Failed to save draft. Please try again."),
        );
      } finally {
        setSavingDraft(false);
      }
    } else {
      try {
        await saveDraft();
        toast.success("Draft saved successfully.");
      } catch {
        toast.error("Failed to save draft.");
      }
    }
  };

  const handleSubmit = async () => {
    const params =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : null;
    const appraisalId =
      selfAssessmentData?.appraisalId || params?.get("appraisalId");

    setSubmitting(true);
    try {
      if (appraisalId) {
        const payload: SubmitSelfAssessmentPayload = {
          sections: [
            {
              section: "KRA",
              totalWeight: 100,
              objectives: (selfAssessmentData?.goals || []).map((obj) => ({
                title: obj.title || "Goal",
                weight: 100,
                keyResults: [
                  {
                    keyResult:
                      obj.successCriteria ||
                      obj.description ||
                      obj.title,
                    kpiWeight: 100,
                    target: typeof obj.targetDate === "number" ? obj.targetDate : 100,
                    achieved: obj.employeeRating || 0,
                    comment: obj.employeeComment || undefined,
                  },
                ],
              })),
            },
          ],
          reflections: selfAssessmentData?.reflectionQuestions?.length
            ? selfAssessmentData.reflectionQuestions.map((rq, idx) => ({
                questionId: rq.id,
                response:
                  activeQuestions[idx]?.answer || "",
              }))
            : activeQuestions.map((q) => ({
                questionId: String(q.id).startsWith("question_")
                  ? String(q.id)
                  : `question_${q.id}`,
                response: q.answer || "",
              })),
        };

        await submitEmployeeSelfAssessment(appraisalId, payload);
        toast.success("Employee self-assessment submitted successfully.");
        setOpen(false);
        router.push("/employee/appraisal?submitted=true");
      } else {
        await submit();
        toast.success("Self-assessment submitted successfully.");
        setOpen(false);
        router.push("/employee/appraisal?submitted=true");
      }
    } catch (err: unknown) {
      console.error("Failed to submit self-assessment:", err);
      const apiMsg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(
        apiMsg ||
          (err instanceof Error
            ? err.message
            : "Failed to submit self-assessment. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-slate-50 p-6 pb-28">
        <div className="mx-auto space-y-6">
          <SelfAssessmentHeader />

          {loadingData && (
            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <span>Loading assigned self-assessment template snapshot...</span>
            </div>
          )}

          <InfoBanner />

          <EmployeeInformation employee={activeEmployee} />

          <ObjectiveTable objectives={activeObjectives} />

          <BehaviourTable behaviours={[]} />

          <GrandTotal />

          <OverallRating />

          <ReflectionQuestions questions={activeQuestions} />

          <SignOff
            employeeName={activeEmployee.name}
            managerName={activeEmployee.supervisor}
          />

          <FooterAction
            disableSubmit={loading || savingDraft || submitting}
            loading={loading || savingDraft || submitting}
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
