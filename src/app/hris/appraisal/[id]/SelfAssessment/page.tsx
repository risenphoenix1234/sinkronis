"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
import type { TemplateSection } from "@/lib/api/types/hrisTypes";
import ObjectivesTable from "@/components/hris/appraisal-details/ObjectivesTable";
import { getAppraisalDetail, submitSelfAssessment } from "@/lib/api/hris";

interface SelfAssessmentFormProps {
  appraisalId?: string;
  sections?: TemplateSection[];
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

  const [sections, setSections] = useState<TemplateSection[]>(
    props.sections ?? [],
  );
  const [loading, setLoading] = useState(false);
  const [achievedById, setAchievedById] = useState<Record<string, string>>({});
  const [commentById, setCommentById] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (props.sections && props.sections.length > 0) {
      setSections(props.sections);
      return;
    }

    if (appraisalId) {
      setLoading(true);
      getAppraisalDetail(appraisalId)
        .then((detail: any) => {
          const fetchedSections =
            detail?.templateSnapshot?.sections ??
            detail?.template?.sections ??
            [];
          setSections(fetchedSections);
        })
        .catch((err) => {
          console.error("Failed to load appraisal sections:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [appraisalId, props.sections]);

  const handleSubmit = async () => {
    if (!appraisalId) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      sections: sections.map((section) => ({
        section: section.section,
        totalWeight: section.weight,
        objectives: section.objectives.map((objective) => ({
          title: objective.title,
          weight: objective.weight,
          keyResults: objective.keyResults.map((kr) => ({
            keyResult: kr.description,
            kpiWeight: kr.kpiWeight,
            target: kr.target,
            comment: commentById[kr.id] ?? "",
          })),
        })),
      })),
      submit: true,
    };

    try {
      await submitSelfAssessment(appraisalId, payload);
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
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <button
          type="button"
          onClick={() => router.push(`/hris/appraisal/${appraisalId || ""}`)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to Appraisal Details
        </button>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">
            Employee Self-Assessment
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review objectives, evaluate progress against targets, and submit
            your assessment.
          </p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center rounded-xl border bg-white">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : sections.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white p-8 text-center text-sm text-slate-500">
            No self-assessment sections configured for this appraisal cycle.
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((section) => (
              <ObjectivesTable
                key={section.section}
                section={section}
                achievedById={achievedById}
                commentById={commentById}
                onAchievedChange={(krId, value) =>
                  setAchievedById((p) => ({ ...p, [krId]: value }))
                }
                onCommentChange={(krId, value) =>
                  setCommentById((p) => ({ ...p, [krId]: value }))
                }
              />
            ))}

            {error && (
              <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-lg bg-[#1677C8] px-6 py-2.5 font-semibold text-white transition hover:bg-[#125fa0] disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit Self-Assessment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
