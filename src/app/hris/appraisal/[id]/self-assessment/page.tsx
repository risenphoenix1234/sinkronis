"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import type { TemplateSection } from "@/lib/api/types/hrisTypes";
import type { ReflectionQuestionDef } from "@/components/hris/appraisal-details/ReflectionQuestions";
import ObjectivesTable from "@/components/hris/appraisal-details/ObjectivesTable";
import BehaviourTable from "@/components/hris/appraisal-details/BehaviourTable";
import ReflectionQuestions from "@/components/hris/appraisal-details/ReflectionQuestions";
import { getSelfAssessment, submitSelfAssessment } from "@/lib/api/hris";

interface SelfAssessmentFormProps {
  appraisalId?: string;
}

export default function SelfAssessmentPage(props: SelfAssessmentFormProps) {
  const params = useParams();
  const router = useRouter();

  const routeAppraisalId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  const appraisalId = props.appraisalId || routeAppraisalId;

  // Data from GET /self-assessment
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [reflectionQuestions, setReflectionQuestions] = useState<
    ReflectionQuestionDef[]
  >([]);
  const [stage, setStage] = useState<string>("");
  const [quarter, setQuarter] = useState<string | null>(null);

  // Loading / error state
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // KRA section achieved + comment inputs (keyed by kr.id)
  const [achievedById, setAchievedById] = useState<Record<string, string>>({});
  const [commentById, setCommentById] = useState<Record<string, string>>({});

  // Behavioural section achieved + comment inputs (keyed by kr.id)
  const [behaviouralAchievedById, setBehaviouralAchievedById] = useState<
    Record<string, string>
  >({});
  const [behaviouralCommentById, setBehaviouralCommentById] = useState<
    Record<string, string>
  >({});

  // Reflection question responses (keyed by questionId)
  const [responseById, setResponseById] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchSelfAssessment = () => {
    if (!appraisalId) return;
    setLoading(true);
    setLoadError(null);

    getSelfAssessment(appraisalId)
      .then((data) => {
        // Map configuration sections → TemplateSection[] shape expected by ObjectivesTable / BehaviourTable
        const mapped: TemplateSection[] = (
          data.template?.configuration?.sections ?? []
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
        }));
        setSections(mapped);

        // Map reflectionQuestions from top-level (convenience copy)
        const mappedQuestions: ReflectionQuestionDef[] = (
          data.reflectionQuestions ?? []
        ).map((q) => ({
          questionId: q.id,
          title: q.question,
        }));
        setReflectionQuestions(mappedQuestions);

        setStage(data.stage ?? "");
        setQuarter(data.quarter ?? null);
      })
      .catch((err) => {
        console.error("Failed to load self-assessment:", err);
        const apiMsg = axios.isAxiosError(err)
          ? err.response?.data?.message
          : null;
        const msg =
          apiMsg ?? "Failed to load self-assessment. Please try again.";
        setLoadError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSelfAssessment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appraisalId]);

  const handleSubmit = async () => {
    if (!appraisalId) return;
    setSubmitting(true);
    setSubmitError(null);

    const kraSection = sections.find((s) => s.section === "KRA");
    const behaviouralSection = sections.find(
      (s) => s.section === "BEHAVIOURAL",
    );

    const buildSectionPayload = (
      section: TemplateSection,
      achById: Record<string, string>,
      cmtById: Record<string, string>,
    ) => ({
      section: section.section,
      totalWeight: section.weight,
      objectives: section.objectives.map((objective) => ({
        title: objective.title,
        weight: objective.weight,
        keyResults: objective.keyResults.map((kr) => ({
          keyResult: kr.description,
          kpiWeight: kr.kpiWeight,
          target: kr.target,
          achieved: Number(achById[kr.id] ?? 0),
          comment: cmtById[kr.id] ?? "",
        })),
      })),
    });

    const sectionsPayload = [
      ...(kraSection
        ? [buildSectionPayload(kraSection, achievedById, commentById)]
        : []),
      ...(behaviouralSection
        ? [
            buildSectionPayload(
              behaviouralSection,
              behaviouralAchievedById,
              behaviouralCommentById,
            ),
          ]
        : []),
    ];

    // Only include reflections that have content
    const reflections = Object.entries(responseById)
      .filter(([, response]) => response.trim().length > 0)
      .map(([questionId, response]) => ({
        questionId,
        response: response.trim(),
      }));

    const payload = {
      sections: sectionsPayload,
      ...(reflections.length > 0 ? { reflections } : {}),
      submit: true,
    };

    try {
      const result = await submitSelfAssessment(appraisalId, payload);
      toast.success(`Self-assessment submitted! Stage: ${result.stage}`);
      router.push(`/hris/appraisal/${appraisalId}`);
    } catch (err) {
      const detail = axios.isAxiosError(err) ? err.response?.data : null;
      const message =
        detail?.validationErrors
          ?.map(
            (v: { field: string; message: string }) =>
              `${v.field}: ${v.message}`,
          )
          .join("; ") ??
        detail?.message ??
        "Something went wrong submitting your self-assessment.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const kraSection = sections.find((s) => s.section === "KRA");
  const behaviouralSection = sections.find((s) => s.section === "BEHAVIOURAL");

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="space-y-6">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.push(`/hris/appraisal/${appraisalId || ""}`)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to Appraisal Details
        </button>

        {/* Header */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Employee Self-Assessment
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Review objectives, evaluate progress against targets, and submit
                your assessment.
              </p>
            </div>
            {(stage || quarter) && (
              <div className="flex shrink-0 items-center gap-2">
                {quarter && (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    {quarter}
                  </span>
                )}
                {stage && (
                  <span className="rounded-full border border-[#2183C6]/20 bg-[#2183C6]/5 px-3 py-1 text-xs font-semibold text-[#2183C6]">
                    {stage.replace(/_/g, " ")}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex h-48 items-center justify-center rounded-xl border bg-white">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : loadError ? (
          /* Load Error State */
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border bg-white py-16 text-center">
            <AlertCircle className="text-red-400" size={36} />
            <p className="text-sm font-medium text-slate-600">{loadError}</p>
            <button
              type="button"
              onClick={fetchSelfAssessment}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCcw size={14} />
              Retry
            </button>
          </div>
        ) : sections.length === 0 ? (
          /* Empty State */
          <div className="rounded-xl border border-dashed bg-white p-8 text-center text-sm text-slate-500">
            No self-assessment sections configured for this appraisal cycle.
          </div>
        ) : (
          <div className="space-y-6">
            {/* KRA Objectives */}
            {kraSection && (
              <ObjectivesTable
                section={kraSection}
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

            {/* Behavioural Objectives */}
            {behaviouralSection && (
              <BehaviourTable
                section={behaviouralSection}
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

            {/* Reflection Questions */}
            <div className="rounded-xl border bg-white p-6">
              <ReflectionQuestions
                questions={
                  reflectionQuestions.length > 0
                    ? reflectionQuestions
                    : undefined
                }
                responseById={responseById}
                onResponseChange={(questionId, value) =>
                  setResponseById((p) => ({ ...p, [questionId]: value }))
                }
              />
            </div>

            {/* Submit Error Banner */}
            {submitError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1677C8] px-6 py-2.5 font-semibold text-white transition hover:bg-[#125fa0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Submit Self-Assessment
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
