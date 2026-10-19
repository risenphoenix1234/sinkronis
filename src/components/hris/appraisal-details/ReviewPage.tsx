"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ChevronLeft,
  Target,
  FileText,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Plus,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

import EmployeeCard from "./EmployeeCard";
import GoalCard from "./GoalCard";
import ProgressStepper from "./ProgressStepper";
import StatusBadge from "../appraisal/StatusBadge";
import QuarterTabs from "./QuarterTabs";
import ObjectivesTable from "./ObjectivesTable";
import GrandTotal from "./GrandTotal";
import ReflectionQuestions from "./ReflectionQuestions";
import BehaviourTable from "./BehaviourTable";
import ManagerReview from "./ManagerReview";
import HRApproval from "./HRApproval";
import HRApprovalAndAcknowledgment from "./HrApprovalAndAcknowledgement";
import AppraisalSignOff from "./AppraisaalSignOff";

import {
  getAppraisalDetail,
  getManagerReview,
  proposeAppraisalGoal,
  completeAppraisalGoals,
  confirmEmployeeGoals,
  deleteAppraisalGoal,
  submitSelfAssessment,
} from "@/lib/api/hris";
import ProposeGoalModal from "@/components/modals/Hris/ProposeGoalModal";
import CompleteGoalsModal from "@/components/modals/Hris/CompleteGoalsModal";
import RateAppraisalGoalModal from "@/components/modals/Hris/RateAppraisalGoalModal";
import type {
  AppraisalStatus,
  AppraisalSummary,
  AppraisalEmployee,
  AppraisalDetail,
  CreatedAppraisalGoalData,
  Goal,
  TemplateSection,
  UpdatedAppraisalGoalScoreData,
  GetManagerReviewData,
  SignOffType,
  RatingScaleEntry,
  ProposeAppraisalGoalPayload,
  SelfAssessmentPayload,
  AppraisalDetailSelfAssessment,
} from "@/lib/api/types/hrisTypes";

interface ReviewPageProps {
  appraisalId?: string;
}

/** Map the raw API response from getAppraisalDetail to the typed frontend shape. */
function mapAppraisalToEmployee(
  data: AppraisalDetail | Record<string, unknown>,
): AppraisalEmployee {
  const emp = ((data as AppraisalDetail).employee ?? {}) as unknown as Record<
    string,
    unknown
  >;
  const name = (emp.name as string) ?? "Unknown Employee";
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => (n as string)[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "EP";

  const rawDept =
    (data as Record<string, unknown>).department ?? emp.department ?? null;
  const deptName =
    typeof rawDept === "string"
      ? rawDept
      : ((rawDept as { name?: string })?.name ?? "—");

  const rawManager =
    (data as AppraisalDetail).reviewer ??
    (emp.manager as Record<string, unknown>) ??
    (data as Record<string, unknown>).manager ??
    null;
  const managerName =
    typeof rawManager === "string"
      ? rawManager
      : ((rawManager as { name?: string })?.name ?? "—");

  return {
    id: (emp.id as string) ?? undefined,
    name,
    title: (emp.role as string) ?? (emp.jobTitle as string) ?? "—",
    department: deptName,
    managerName,
    avatarInitials: initials,
  };
}

function mapAppraisalToSummary(
  data: AppraisalDetail | Record<string, unknown>,
): AppraisalSummary {
  const cycle = ((data as AppraisalDetail).cycle ?? {}) as unknown as Record<
    string,
    unknown
  >;
  const template = ((data as AppraisalDetail).template ??
    (data as Record<string, unknown>).templateSnapshot ??
    {}) as unknown as Record<string, unknown>;
  const templateMeta = (template.templateMetadata ?? {}) as Record<
    string,
    unknown
  >;

  const stage = (data.stage as string) ?? "GOAL_SETTING";
  const isAcknowledged =
    stage === "ACKNOWLEDGED" ||
    stage === "COMPLETED" ||
    Boolean((data as AppraisalDetail).acknowledgement?.acknowledged) ||
    Boolean((data as Record<string, unknown>).acknowledgedAt);

  const STAGE_LABELS: Record<string, string> = {
    GOAL_SETTING: "Goal Setting",
    SELF_ASSESSMENT: "Self Assessment",
    MANAGER_REVIEW: "Manager Review",
    PENDING_HR_APPROVAL: "Pending HR Approval",
    HR_APPROVAL: "HR Approval",
    ACKNOWLEDGMENT: isAcknowledged ? "Acknowledged" : "Pending Acknowledgment",
    ACKNOWLEDGEMENT: isAcknowledged ? "Acknowledged" : "Pending Acknowledgment",
    ACKNOWLEDGED: "Acknowledged",
    COMPLETED: "Acknowledged",
  };

  const normalizedStatus: AppraisalStatus =
    isAcknowledged
      ? "COMPLETED"
      : stage === "ACKNOWLEDGMENT"
        ? "ACKNOWLEDGEMENT"
        : stage === "HR_APPROVAL"
          ? "PENDING_HR_APPROVAL"
          : (stage as AppraisalStatus);

  const score =
    ((data as AppraisalDetail).finalScore as number) ??
    ((data as Record<string, unknown>).score as number) ??
    0;

  const rawRating = (data as AppraisalDetail).rating;
  const rawRatingValue = (data as AppraisalDetail).ratingValue;
  const ratingLabel =
    rawRating ?? (rawRatingValue ? `Rating: ${rawRatingValue}` : "Pending");

  return {
    id:
      (data.appraisalId as string) ??
      ((data as Record<string, unknown>).id as string) ??
      "",
    cycleTitle: (cycle.name as string) ?? "Performance Review",
    templateName:
      (templateMeta.name as string) ??
      (template.name as string) ??
      "Standard Review",
    status: normalizedStatus,
    statusLabel: STAGE_LABELS[stage] ?? stage,
    overallScorePercent: score,
    overallRatingLabel: ratingLabel,
  };
}

export default function ReviewPage({ appraisalId }: ReviewPageProps) {
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appraisalData, setAppraisalData] = useState<AppraisalDetail | null>(
    null,
  );
  const [managerReviewData, setManagerReviewData] =
    useState<GetManagerReviewData | null>(null);
  const [managerReviewLoading, setManagerReviewLoading] = useState(false);
  const [managerReviewError, setManagerReviewError] = useState<string | null>(
    null,
  );
  const [managerReviewPendingMessage, setManagerReviewPendingMessage] =
    useState<string | null>(null);
  const [showProposeGoalModal, setShowProposeGoalModal] = useState(false);
  const [showCompleteGoalsModal, setShowCompleteGoalsModal] = useState(false);
  const [goalToRate, setGoalToRate] = useState<Goal | null>(null);

  // Goal Setting state
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDesc, setNewGoalDesc] = useState("");
  const [newGoalCriteria, setNewGoalCriteria] = useState("");
  const [newGoalTargetDate, setNewGoalTargetDate] = useState("");
  const [submittingGoal, setSubmittingGoal] = useState(false);
  const submittingGoalRef = useRef(false);
  const [submittingComplete, setSubmittingComplete] = useState(false);
  const [confirmingGoals, setConfirmingGoals] = useState(false);
  const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);

  // Self-assessment state
  const [selectedQuarter, setSelectedQuarter] = useState<
    "Q1" | "Q2" | "Q3" | "Q4"
  >("Q2");
  const [achievedById, setAchievedById] = useState<Record<string, string>>({});
  const [commentById, setCommentById] = useState<Record<string, string>>({});
  const [reflectionAnswers, setReflectionAnswers] = useState<
    Record<string, string>
  >({});
  const [submittingSelfAssessment, setSubmittingSelfAssessment] =
    useState(false);

  const resetNewGoalForm = () => {
    setNewGoalTitle("");
    setNewGoalDesc("");
    setNewGoalCriteria("");
    setNewGoalTargetDate("");
  };

  const loadManagerReview = useCallback((id: string, currentStage?: string) => {
    if (!id) return;
    setManagerReviewLoading(true);
    setManagerReviewError(null);
    setManagerReviewPendingMessage(null);

    const reviewStages = [
      "MANAGER_REVIEW",
      "PENDING_HR_APPROVAL",
      "HR_APPROVAL",
      "ACKNOWLEDGMENT",
      "ACKNOWLEDGEMENT",
      "COMPLETED",
    ];

    if (currentStage && !reviewStages.includes(currentStage)) {
      setManagerReviewData(null);
      setManagerReviewPendingMessage(
        "Employee self-assessment has not been submitted yet. Manager review will become available once the self-assessment stage is completed.",
      );
      setManagerReviewLoading(false);
      return;
    }

    getManagerReview(id)
      .then((mr) => {
        setManagerReviewData(mr);
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          setManagerReviewData(null);
          setManagerReviewPendingMessage(
            err.response.data?.message ||
              "Employee self-assessment has not been submitted yet.",
          );
        } else {
          const msg =
            err.response?.data?.message || "Failed to load manager review.";
          setManagerReviewError(msg);
          toast.error(msg);
        }
      })
      .finally(() => {
        setManagerReviewLoading(false);
      });
  }, []);

  const handleGoalProposed = (newGoal: CreatedAppraisalGoalData) => {
    setAppraisalData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        goals: [...(prev.goals || []), newGoal],
      };
    });
  };

  const handleGoalScored = (updated: UpdatedAppraisalGoalScoreData) => {
    setAppraisalData((prev) => {
      if (!prev || !prev.goals) return prev;
      return {
        ...prev,
        goals: prev.goals.map((g) => {
          if (g.id === updated.id) {
            return {
              ...g,
              status: (updated.status as Goal["status"]) || g.status,
              managerRating: updated.rating ?? g.managerRating,
              managerComment: updated.comment ?? g.managerComment,
            };
          }
          return g;
        }),
      };
    });
  };

  const handleGoalsCompleted = (updated: AppraisalDetail) => {
    setAppraisalData((prev) => ({
      ...(prev || updated),
      ...updated,
      awaitingEmployeeConfirmation: true,
    }));
    setIsAwaitingConfirmation(true);
  };

  useEffect(() => {
    if (!appraisalId) return;
    setLoading(true);
    setError(null);
    getAppraisalDetail(appraisalId)
      .then((data) => {
        setAppraisalData(data);
        loadManagerReview(appraisalId, data.stage);
        const stage = data.stage;
        if (
          stage === "ACKNOWLEDGMENT" ||
          stage === "ACKNOWLEDGEMENT" ||
          stage === "ACKNOWLEDGED" ||
          stage === "COMPLETED" ||
          Boolean(data.acknowledgement?.acknowledged)
        ) {
          setIsApproved(true);
        }
        const isAwaiting = Boolean(
          data.awaitingEmployeeConfirmation ||
            (data as unknown as Record<string, unknown>).status ===
              "GOALS_PROPOSED",
        );
        setIsAwaitingConfirmation(isAwaiting);

        const rawQuarter = data.cycle?.quarter;
        if (
          rawQuarter === "Q1" ||
          rawQuarter === "Q2" ||
          rawQuarter === "Q3" ||
          rawQuarter === "Q4"
        ) {
          setSelectedQuarter(rawQuarter);
        }

        // Initialize self-assessment fields if already present
        if (data.selfAssessment) {
          type SectionItem = {
            objectives?: Array<{
              keyResults?: Array<{
                id: string;
                achieved?: number | null;
                comment?: string | null;
              }>;
            }>;
          };

          const sa = data.selfAssessment as AppraisalDetailSelfAssessment & {
            sections?: SectionItem[];
          };

          const initialAchieved: Record<string, string> = {};
          const initialComments: Record<string, string> = {};
          sa.sections?.forEach((sec: SectionItem) => {
            sec.objectives?.forEach((obj) => {
              obj.keyResults?.forEach((kr) => {
                if (kr.achieved != null)
                  initialAchieved[kr.id] = String(kr.achieved);
                if (kr.comment) initialComments[kr.id] = kr.comment;
              });
            });
          });
          setAchievedById(initialAchieved);
          setCommentById(initialComments);

          const initialReflections: Record<string, string> = {};
          data.selfAssessment.reflections?.forEach((r) => {
            initialReflections[r.questionId] = r.response;
          });
          setReflectionAnswers(initialReflections);
        }
      })
      .catch((err) => {
        console.error("Failed to load appraisal detail:", err);
        const errMsg =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to load appraisal details. Please try again.";
        setError(errMsg);
        toast.error(errMsg);
      })
      .finally(() => setLoading(false));
  }, [appraisalId, loadManagerReview]);

  const handleCreateGoal = async () => {
      if (!appraisalId || !newGoalTitle.trim() || submittingGoalRef.current)
      return;
    submittingGoalRef.current = true;
    setSubmittingGoal(true);
    try {
      const payload: ProposeAppraisalGoalPayload = {
        title: newGoalTitle.trim(),
        description: newGoalDesc.trim() || "",
        successCriteria: newGoalCriteria.trim() || "",
        targetDate: newGoalTargetDate.trim() || "",
      };
      const created = await proposeAppraisalGoal(appraisalId, payload);
      setAppraisalData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          goals: [...(prev.goals || []), created],
        };
      });
      toast.success("Goal added successfully!");
      setIsAddingGoal(false);
      resetNewGoalForm();
    } catch (err: unknown) {
      console.error("Failed to propose goal:", err);
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to add goal. Please try again.";
      toast.error(msg);
    } finally {
      submittingGoalRef.current = false;
      setSubmittingGoal(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!appraisalId) return;
    try {
      await deleteAppraisalGoal(appraisalId, goalId).catch(() => {
        // Continue if endpoint is not supported on backend
      });
      setAppraisalData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          goals: (prev.goals || []).filter((g) => g.id !== goalId),
        };
      });
      toast.success("Goal removed.");
    } catch (err) {
      console.error("Failed to remove goal:", err);
    }
  };

  const handleSubmitForConfirmation = async () => {
    if (!appraisalId) return;
    setSubmittingComplete(true);
    try {
      await completeAppraisalGoals(appraisalId);
      setAppraisalData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          awaitingEmployeeConfirmation: true,
        };
      });
      setIsAwaitingConfirmation(true);
      toast.success("Goals submitted for employee confirmation!");
    } catch (err: unknown) {
      console.error("Failed to submit goals for confirmation:", err);
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to submit goals for confirmation.";
      toast.error(msg);
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setIsAwaitingConfirmation(true);
      }
    } finally {
      setSubmittingComplete(false);
    }
  };

  const handleEmployeeConfirmsGoals = async () => {
    if (!appraisalId) return;
    setConfirmingGoals(true);
    try {
      await confirmEmployeeGoals(appraisalId);
      toast.success("Goals confirmed! Self-assessment is now open.");
      try {
        const refreshed = await getAppraisalDetail(appraisalId);
        setAppraisalData(refreshed);
        loadManagerReview(appraisalId, refreshed.stage);
        setIsAwaitingConfirmation(false);
      } catch {
        setAppraisalData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            stage: "SELF_ASSESSMENT",
            awaitingEmployeeConfirmation: false,
          };
        });
        setIsAwaitingConfirmation(false);
      }
    } catch (err: unknown) {
      console.error("Failed to confirm goals:", err);
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to confirm goals.";
      toast.error(msg);
    } finally {
      setConfirmingGoals(false);
    }
  };

  const currentStatus: AppraisalStatus = appraisalData
    ? ((mapAppraisalToSummary(appraisalData).status as AppraisalStatus) ??
      "GOAL_SETTING")
    : "GOAL_SETTING";

  const isGoalSettingStage = currentStatus === "GOAL_SETTING";
  const isSelfAssessmentStage = currentStatus === "SELF_ASSESSMENT";
  const isManagerReviewStage = currentStatus === "MANAGER_REVIEW";

  const kraSection = appraisalData?.criteria?.find(
    (c) => c.section === "KRA",
  ) as unknown as TemplateSection | undefined;
  const behaviouralSection = appraisalData?.criteria?.find(
    (c) => c.section === "BEHAVIOURAL",
  ) as unknown as TemplateSection | undefined;

  const rawQuarter = appraisalData?.cycle?.quarter;
  const activeQuarter: "Q1" | "Q2" | "Q3" | "Q4" | undefined =
    rawQuarter === "Q1" ||
    rawQuarter === "Q2" ||
    rawQuarter === "Q3" ||
    rawQuarter === "Q4"
      ? rawQuarter
      : undefined;

  const reflectionQuestions =
    appraisalData?.selfAssessment?.reflections &&
    appraisalData.selfAssessment.reflections.length > 0
      ? appraisalData.selfAssessment.reflections.map((r, i) => ({
          questionId: r.questionId,
          title: `Question ${i + 1}`,
        }))
      : undefined;

  const reflectionResponses = (
    appraisalData?.selfAssessment?.reflections ?? []
  ).reduce<Record<string, string>>((acc, r) => {
    acc[r.questionId] = r.response;
    return acc;
  }, {});

  const summary = appraisalData ? mapAppraisalToSummary(appraisalData) : null;
  const employeeName =
    (appraisalData?.employee as { name?: string })?.name || "Employee";
  const employeeFirstName = employeeName.split(" ")[0] || employeeName;

  const calculateSectionResultTotal = (
    sec: TemplateSection | undefined,
    achievedMap: Record<string, string>,
  ): number => {
    if (!sec?.objectives) return 0;
    let total = 0;
    sec.objectives.forEach((obj) => {
      obj.keyResults?.forEach((kr) => {
        const ach = achievedMap[kr.id];
        if (ach && ach.trim() !== "") {
          const achNum = parseFloat(ach);
          const kpiNum =
            typeof kr.kpiWeight === "number"
              ? kr.kpiWeight
              : parseFloat(String(kr.kpiWeight || 0));
          const targetNum =
            typeof kr.target === "number"
              ? kr.target
              : parseFloat(String(kr.target || 0));
          if (!isNaN(achNum) && !isNaN(kpiNum)) {
            if (!isNaN(targetNum) && targetNum > 0) {
              total += (achNum / targetNum) * kpiNum;
            } else {
              total += (achNum * kpiNum) / 100;
            }
          }
        }
      });
    });
    return total;
  };

  const kraResultSum = calculateSectionResultTotal(kraSection, achievedById);
  const behResultSum = calculateSectionResultTotal(
    behaviouralSection,
    achievedById,
  );
  const dynamicGrandTotal = kraResultSum + behResultSum;
  const hasCalculatedScore = dynamicGrandTotal > 0;
  const grandScore = hasCalculatedScore
    ? Math.round(dynamicGrandTotal)
    : appraisalData?.finalScore != null
      ? Math.round(appraisalData.finalScore)
      : null;
  const grandRatingLabel =
    grandScore != null
      ? grandScore >= 90
        ? "Exceeds Expectation"
        : grandScore >= 70
          ? "Meets Expectation"
          : grandScore >= 50
            ? "Needs Improvement"
            : "Unsatisfactory"
      : appraisalData?.rating || "Pending Evaluation";

  const handleSubmitSelfAssessment = async () => {
    if (!appraisalId) return;
    setSubmittingSelfAssessment(true);
    try {
      const kraObjectives = kraSection?.objectives ?? [];
      const behObjectives = behaviouralSection?.objectives ?? [];

      const buildSectionPayload = (
        secName: string,
        totalWeight: number,
        objs: typeof kraObjectives,
      ) => ({
        section: secName,
        totalWeight,
        objectives: objs.map((obj) => ({
          title: obj.title,
          weight: obj.weight,
          keyResults: obj.keyResults.map((kr) => ({
            keyResult: kr.description,
            kpiWeight: kr.kpiWeight,
            target:
              typeof kr.target === "number"
                ? kr.target
                : parseFloat(String(kr.target || 0)),
            achieved: parseFloat(achievedById[kr.id] || "0") || 0,
            comment: commentById[kr.id] || undefined,
          })),
        })),
      });

      const payload: SelfAssessmentPayload = {
        sections: [
          buildSectionPayload("KRA", kraSection?.weight ?? 80, kraObjectives),
          buildSectionPayload(
            "BEHAVIOURAL",
            behaviouralSection?.weight ?? 20,
            behObjectives,
          ),
        ],
        reflections: Object.entries(reflectionAnswers).map(
          ([questionId, response]) => ({
            questionId,
            response,
          }),
        ),
        submit: true,
      };

      await submitSelfAssessment(appraisalId, payload);
      toast.success("Self-assessment submitted successfully!");
      const refreshed = await getAppraisalDetail(appraisalId);
      setAppraisalData(refreshed);
      loadManagerReview(appraisalId, refreshed.stage);
    } catch (err: unknown) {
      console.error("Failed to submit self-assessment:", err);
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to submit self-assessment.";
      toast.error(msg);
    } finally {
      setSubmittingSelfAssessment(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="mx-auto space-y-6">
        {/* Back to Reviews */}
        <button
          type="button"
          onClick={() => router.push("/hris/appraisal")}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-normal text-slate-600 transition hover:text-slate-900"
        >
          <ChevronLeft size={16} />
          Back to Reviews
        </button>

        {loading ? (
          <div className="flex h-64 items-center justify-center rounded-xl border bg-white">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border bg-white text-center">
            <AlertCircle className="text-red-400" size={32} />
            <p className="text-sm font-medium text-slate-600">{error}</p>
            <button
              type="button"
              onClick={() => {
                if (!appraisalId) return;
                setLoading(true);
                setError(null);
                getAppraisalDetail(appraisalId)
                  .then((data) => setAppraisalData(data))
                  .catch((err) => {
                    const msg =
                      axios.isAxiosError(err) && err.response?.data?.message
                        ? err.response.data.message
                        : "Failed to load appraisal details. Please try again.";
                    setError(msg);
                    toast.error(msg);
                  })
                  .finally(() => setLoading(false));
              }}
              className="rounded-md bg-blue-600 px-4 py-2 text-xs text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : !appraisalData ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border bg-white text-center">
            <p className="text-sm font-medium text-slate-600">
              No appraisal record found.
            </p>
          </div>
        ) : (
          <>
            {/* Employee Card */}
            <EmployeeCard
              appraisalId={appraisalId}
              canReassign
              onReassigned={() => {
                if (!appraisalId) return;
                getAppraisalDetail(appraisalId)
                  .then((fresh) => {
                    setAppraisalData(fresh);
                    loadManagerReview(appraisalId, fresh?.stage);
                  })
                  .catch(() => undefined);
              }}
              employee={mapAppraisalToEmployee(appraisalData)}
              appraisal={mapAppraisalToSummary(appraisalData)}
              statusOverride={
                isGoalSettingStage
                  ? isAwaitingConfirmation
                    ? "Goals Proposed"
                    : "Not Started"
                  : isSelfAssessmentStage
                    ? "Self-Assessment Open"
                    : isManagerReviewStage
                      ? "Under Manager Review"
                      : undefined
              }
            />

            {/* Progress Stepper */}
            <ProgressStepper currentStatus={currentStatus} />

            {/* Goals Card */}
            {isGoalSettingStage ? (
              /* Goals Flow (Figma Match for Goal Setting) */
              <div className="rounded-xl border border-[#B9E6FE] bg-white shadow-xs overflow-hidden">
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <Target className="text-[#1677C8]" size={18} />
                    <h2 className="font-semibold text-slate-800 text-base">
                      Goals
                    </h2>
                  </div>

                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3.5 py-1 text-xs font-medium",
                      isAwaitingConfirmation
                        ? "bg-[#FEF6EE] text-[#B54708]"
                        : "bg-[#F2F4F7] text-[#475467]",
                    )}
                  >
                    {isAwaitingConfirmation
                      ? "Awaiting Employee Confirmation"
                      : "Awaiting Manager Input"}
                  </span>
                </div>

                {/* Card Body */}
                <div className="space-y-4 p-6">
                  {/* Alert Banner */}
                  {!isAwaitingConfirmation ? (
                    <div className="rounded-lg border border-[#B9E6FE] bg-[#F0F9FF] px-4 py-3 text-xs sm:text-sm text-[#026AA2]">
                      Propose goals for {employeeFirstName} for this appraisal
                      cycle. Add at least one goal then submit for employee
                      confirmation.
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 rounded-lg border border-[#FEDF89] bg-[#FFFAEB] px-4 py-3 text-xs sm:text-sm text-[#B54708]">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-[#F79009]" />
                      <span>
                        Goals have been submitted for employee review. Once the
                        employee confirms, the self-assessment will open.
                      </span>
                    </div>
                  )}

                  {/* Goals List */}
                  {appraisalData.goals && appraisalData.goals.length > 0 && (
                    <div className="space-y-3">
                      {appraisalData.goals.map((g) => (
                        <div
                          key={g.id}
                          className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 bg-white px-5 py-3.5"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-800">
                              {g.title}
                            </span>
                            {g.description && (
                              <span className="text-xs text-slate-500 mt-0.5">
                                {g.description}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-[#F2F4F7] px-2.5 py-0.5 text-xs font-medium text-[#344054]">
                              {g.status === "ACTIVE"
                                ? "In Progress"
                                : g.status === "COMPLETED"
                                  ? "Completed"
                                  : "Not Started"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteGoal(g.id)}
                              className="text-slate-400 hover:text-slate-600 transition"
                              title="Remove Goal"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Add Goal Form */}
                  {isAddingGoal ? (
                    <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                          Goal Title *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Improve customer satisfaction score"
                          value={newGoalTitle}
                          onChange={(e) => setNewGoalTitle(e.target.value)}
                          className="w-full rounded-md border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#2183C6] focus:ring-1 focus:ring-[#2183C6]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          placeholder="What needs to be accomplished..."
                          value={newGoalDesc}
                          onChange={(e) => setNewGoalDesc(e.target.value)}
                          className="w-full rounded-md border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#2183C6] focus:ring-1 focus:ring-[#2183C6] resize-y"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                          Success Criteria
                        </label>
                        <input
                          type="text"
                          placeholder="How will we know this goal is achieved?"
                          value={newGoalCriteria}
                          onChange={(e) => setNewGoalCriteria(e.target.value)}
                          className="w-full rounded-md border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#2183C6] focus:ring-1 focus:ring-[#2183C6]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                          Target Date
                        </label>
                        <input
                          type="date"
                          value={newGoalTargetDate}
                          onChange={(e) => setNewGoalTargetDate(e.target.value)}
                          className="w-48 rounded-md border border-slate-200 px-3.5 py-2 text-sm text-slate-700 focus:outline-none focus:border-[#2183C6] focus:ring-1 focus:ring-[#2183C6]"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingGoal(false);
                            resetNewGoalForm();
                          }}
                          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          disabled={!newGoalTitle.trim() || submittingGoal}
                          onClick={handleCreateGoal}
                          className={cn(
                            "rounded-md px-4 py-2 text-xs font-medium transition shadow-xs flex items-center gap-1.5",
                            newGoalTitle.trim() && !submittingGoal
                              ? "bg-[#2183C6] hover:bg-[#1b6aa2] text-white"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed",
                          )}
                        >
                          {submittingGoal && (
                            <Loader2 size={13} className="animate-spin" />
                          )}
                          Add Goal
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Dashed Add Goal Button */
                    <button
                      type="button"
                      onClick={() => setIsAddingGoal(true)}
                      className="w-full rounded-lg border border-dashed border-[#84CAFF] py-3 text-center text-xs font-medium text-[#1677C8] hover:bg-sky-50/50 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      Add Goal
                    </button>
                  )}

                  {/* Bottom Actions */}
                  {!isAwaitingConfirmation ? (
                    appraisalData.goals &&
                    appraisalData.goals.length > 0 && (
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleSubmitForConfirmation}
                          disabled={submittingComplete}
                          className="rounded-lg bg-[#2183C6] hover:bg-[#1b6aa2] text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition flex items-center gap-2"
                        >
                          {submittingComplete && (
                            <Loader2 size={14} className="animate-spin" />
                          )}
                          Submit Goals for Employee Confirmation
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAwaitingConfirmation(false);
                        }}
                        className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-xs font-medium transition"
                      >
                        Edit Goals
                      </button>

                      <button
                        type="button"
                        onClick={handleEmployeeConfirmsGoals}
                        disabled={confirmingGoals}
                        className="rounded-lg bg-[#027A48] hover:bg-[#05603a] text-white px-5 py-2 text-xs font-semibold shadow-sm transition flex items-center gap-2"
                      >
                        {confirmingGoals ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}
                        Employee Confirms Goals
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Goals Card (Locked during Self-Assessment and subsequent stages — Figma Image 1) */
              <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <Target className="text-[#1677C8]" size={18} />
                    <h2 className="font-semibold text-slate-800 text-base">
                      Goals
                    </h2>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-[#ECFDF3] text-[#027A48] px-3 py-1 text-xs font-medium">
                    Locked
                  </span>
                </div>

                <div className="space-y-4 p-6">
                  {appraisalData.goals && appraisalData.goals.length > 0 ? (
                    appraisalData.goals.map((g) => (
                      <GoalCard
                        key={g.id}
                        goal={g as unknown as Goal}
                        isManagerReview={isManagerReviewStage}
                        editableEmployeeRating={isSelfAssessmentStage}
                        editableManagerRating={isManagerReviewStage}
                        onRate={(goal) => setGoalToRate(goal)}
                      />
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center bg-slate-50/50">
                      <p className="text-sm font-medium text-slate-600">
                        No performance goals found.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Self-Assessment Section (Figma Images 2, 3, 4) */}
            {isSelfAssessmentStage ? (
              <section className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <FileText className="text-[#D97706]" size={18} />
                    <h2 className="font-semibold text-slate-800 text-base">
                      Self-Assessment
                    </h2>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-[#FEF0C7] text-[#B54708] px-3.5 py-1 text-xs font-medium">
                    In Progress
                  </span>
                </div>

                <div className="space-y-8 p-6">
                  {/* Quarter Selector */}
                  <QuarterTabs
                    active={selectedQuarter}
                    onChange={(q) => setSelectedQuarter(q)}
                  />

                  {/* Section A: Objectives (KRA) */}
                  <ObjectivesTable
                    section={kraSection}
                    quarter={selectedQuarter}
                    achievedById={achievedById}
                    commentById={commentById}
                    editable={true}
                    onAchievedChange={(krId, val) =>
                      setAchievedById((prev) => ({ ...prev, [krId]: val }))
                    }
                    onCommentChange={(krId, val) =>
                      setCommentById((prev) => ({ ...prev, [krId]: val }))
                    }
                  />

                  {/* Section B: Behavioural Objectives */}
                  <BehaviourTable
                    section={behaviouralSection}
                    quarter={selectedQuarter}
                    achievedById={achievedById}
                    commentById={commentById}
                    editable={true}
                    onAchievedChange={(krId, val) =>
                      setAchievedById((prev) => ({ ...prev, [krId]: val }))
                    }
                    onCommentChange={(krId, val) =>
                      setCommentById((prev) => ({ ...prev, [krId]: val }))
                    }
                  />

                  {/* Grand Total */}
                  <GrandTotal
                    quarter={selectedQuarter}
                    score={grandScore}
                    ratingLabel={grandRatingLabel}
                  />

                  {/* Reflection Questions */}
                  <ReflectionQuestions
                    questions={reflectionQuestions}
                    responseById={reflectionAnswers}
                    onResponseChange={(qId, val) =>
                      setReflectionAnswers((prev) => ({ ...prev, [qId]: val }))
                    }
                  />

                  {/* Submit Action */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled={submittingSelfAssessment}
                      onClick={handleSubmitSelfAssessment}
                      className="rounded-lg bg-[#8A5800] hover:bg-[#734900] text-white px-6 py-2.5 text-sm font-semibold shadow-sm transition flex items-center gap-2"
                    >
                      {submittingSelfAssessment && (
                        <Loader2 size={16} className="animate-spin" />
                      )}
                      Submit Self-Assessment
                    </button>
                  </div>
                </div>
              </section>
            ) : (
              !isGoalSettingStage && (
                <>
                  {/* Self Assessment (Submitted View — Figma Images 2 & 3) */}
                  <section className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <FileText className="text-[#D97706]" size={18} />
                        <h2 className="font-semibold text-slate-800 text-base">
                          Self-Assessment
                        </h2>
                      </div>

                      <span className="inline-flex items-center rounded-full bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5] px-3.5 py-1 text-xs font-medium">
                        Submitted
                      </span>
                    </div>

                    <div className="space-y-8 p-6">
                      <QuarterTabs active={activeQuarter} />
                      <ObjectivesTable
                        section={kraSection}
                        quarter={activeQuarter}
                        editable={false}
                      />
                      <BehaviourTable
                        section={behaviouralSection}
                        quarter={activeQuarter}
                        editable={false}
                      />
                      <GrandTotal
                        quarter={activeQuarter}
                        score={grandScore}
                        ratingLabel={grandRatingLabel}
                      />
                      <ReflectionQuestions
                        questions={reflectionQuestions}
                        responseById={reflectionResponses}
                      />
                    </div>
                  </section>

                  {/* Manager Review */}
                  <ManagerReview
                    appraisalId={appraisalId}
                    data={managerReviewData}
                    loading={managerReviewLoading}
                    error={managerReviewError}
                    pendingMessage={managerReviewPendingMessage}
                    onRetry={() => {
                      if (appraisalId) {
                        loadManagerReview(appraisalId, appraisalData?.stage);
                      }
                    }}
                    onReviewSubmitted={(result) => {
                      if (appraisalId) {
                        getAppraisalDetail(appraisalId)
                          .then((data) => {
                            setAppraisalData(data);
                            loadManagerReview(appraisalId, data.stage);
                          })
                          .catch(() => {
                            loadManagerReview(appraisalId, result.stage);
                          });
                      }
                    }}
                  />

                  {/* HR Approval, Acknowledgement & Sign-Off (Downstream Stages) */}
                  {(currentStatus === "PENDING_HR_APPROVAL" ||
                    currentStatus === "ACKNOWLEDGEMENT" ||
                    currentStatus === "COMPLETED") && (
                    <>
                      {!isApproved ? (
                        <HRApproval
                          appraisalId={appraisalId}
                          onDecisionRecorded={(result) => {
                            if (appraisalId) {
                              getAppraisalDetail(appraisalId)
                                .then((data) => {
                                  setAppraisalData(data);
                                  loadManagerReview(appraisalId, data.stage);
                                })
                                .catch(() => {
                                  loadManagerReview(appraisalId, result.stage);
                                });
                            }
                            if (result.decision === "APPROVED") {
                              setIsApproved(true);
                            }
                          }}
                          onReturnForRevision={() => {
                            if (appraisalId) {
                              getAppraisalDetail(appraisalId)
                                .then((data) => {
                                  setAppraisalData(data);
                                  loadManagerReview(appraisalId, data.stage);
                                })
                                .catch((err) => console.error(err));
                            }
                          }}
                          onApprove={() => {
                            setIsApproved(true);
                          }}
                        />
                      ) : (
                        <HRApprovalAndAcknowledgment
                          appraisalId={appraisalId}
                          hrNotes={
                            ((appraisalData as unknown as Record<string, unknown>)
                              ?.hrNotes as string) || undefined
                          }
                          employeeResponse={
                            appraisalData?.acknowledgement?.response ||
                            appraisalData?.acknowledgedResponse ||
                            undefined
                          }
                          isCompleted={
                            appraisalData?.stage === "COMPLETED" ||
                            appraisalData?.status === "COMPLETED" ||
                            Boolean(appraisalData?.acknowledgement?.acknowledged)
                          }
                          acknowledgedAt={
                            appraisalData?.acknowledgement?.acknowledgedAt ||
                            appraisalData?.timestamps?.acknowledgedAt ||
                            undefined
                          }
                          onSuccess={() => {
                            if (appraisalId) {
                              getAppraisalDetail(appraisalId)
                                .then((updated) => {
                                  setAppraisalData(updated);
                                  loadManagerReview(appraisalId, updated.stage);
                                })
                                .catch(console.error);
                            }
                          }}
                        />
                      )}

                      {/* Appraisal Sign-Off (Rendered only when sign-offs are explicitly configured and present) */}
                      {Boolean(
                        appraisalData?.signOffs &&
                          appraisalData.signOffs.length > 0,
                      ) && (
                        <AppraisalSignOff
                          appraisalId={appraisalId}
                          signOffTypes={
                            (
                              (
                                appraisalData?.template as unknown as Record<
                                  string,
                                  unknown
                                >
                              )?.configuration as { signOffTypes?: SignOffType[] }
                            )?.signOffTypes || ["EMPLOYEE", "MANAGER", "HR"]
                          }
                          ratingScale={
                            (appraisalData?.ratingScale as unknown as RatingScaleEntry[]) ||
                            []
                          }
                          signOffs={appraisalData?.signOffs}
                          onSignOffSuccess={() => {
                            if (appraisalId) {
                              getAppraisalDetail(appraisalId)
                                .then((data) => {
                                  setAppraisalData(data);
                                  loadManagerReview(appraisalId, data.stage);
                                })
                                .catch(console.error);
                            }
                          }}
                        />
                      )}
                    </>
                  )}
                </>
              )
            )}
          </>
        )}

        {appraisalId && (
          <ProposeGoalModal
            open={showProposeGoalModal}
            onClose={() => setShowProposeGoalModal(false)}
            appraisalId={appraisalId}
            cycle={appraisalData?.cycle}
            onGoalProposed={handleGoalProposed}
          />
        )}

        {appraisalId && (
          <CompleteGoalsModal
            open={showCompleteGoalsModal}
            onClose={() => setShowCompleteGoalsModal(false)}
            appraisalId={appraisalId}
            goalCount={appraisalData?.goals?.length || 0}
            onSuccess={handleGoalsCompleted}
          />
        )}

        {appraisalId && goalToRate && (
          <RateAppraisalGoalModal
            open={!!goalToRate}
            onClose={() => setGoalToRate(null)}
            appraisalId={appraisalId}
            goal={goalToRate}
            onSuccess={handleGoalScored}
          />
        )}
      </div>
    </div>
  );
}
