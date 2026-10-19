"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Eye,
  FileText,
  HelpCircle,
  Loader2,
  Save,
  Send,
  Star,
  UserCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import ViewMyAppraisal, {
  AppraisalDetailData,
} from "@/components/employee/appraisal/viewMyAppraisal";
import AddGoalModal from "@/components/employee/appraisal/AddGoalModal";
import RateGoalModal from "@/components/employee/appraisal/RateGoalModal";
import AcknowledgeAppraisalModal from "@/components/employee/appraisal/AcknowledgeAppraisalModal";
import {
  getEmployeeAppraisalDetail,
  getEmployeeAppraisalGoals,
  getEmployeeAppraisalHistory,
  getEmployeeAppraisalOverview,
  getEmployeeSelfAssessment,
  saveEmployeeSelfAssessmentDraft,
  submitEmployeeSelfAssessment,
  acknowledgeEmployeeAppraisal,
} from "@/lib/api/employee";
import { confirmEmployeeGoals } from "@/lib/api/hris";
import {
  EmployeeAppraisalDetailData,
  EmployeeAppraisalGoalsData,
  EmployeeAppraisalHistoryItem,
  EmployeeAppraisalPagination,
  EmployeeSelfAssessmentData,
  HistoricalAppraisalGoal,
  SaveSelfAssessmentDraftPayload,
  SubmitSelfAssessmentPayload,
  AcknowledgeAppraisalPayload,
} from "@/lib/api/types/employeeTypes";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    const cleanDateStr = dateStr.split("T")[0];
    const [y, m, d] = cleanDateStr.split("-").map(Number);
    if (!y || !m || !d) return dateStr;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getCycleName(item: EmployeeAppraisalHistoryItem): string {
  if (item.cycleName) return item.cycleName;
  if (typeof item.cycle === "string" && item.cycle) return item.cycle;
  if (typeof item.cycle === "object" && item.cycle?.name)
    return item.cycle.name;
  return "Performance Review";
}

function getPeriod(item: EmployeeAppraisalHistoryItem): string {
  if (item.period) return item.period;
  if (item.periodStart && item.periodEnd) {
    return `${formatDate(item.periodStart)} – ${formatDate(item.periodEnd)}`;
  }
  if (
    typeof item.cycle === "object" &&
    item.cycle?.periodFrom &&
    item.cycle?.periodTo
  ) {
    return `${formatDate(item.cycle.periodFrom)} – ${formatDate(item.cycle.periodTo)}`;
  }
  return "—";
}

function getFinalScore(item: EmployeeAppraisalHistoryItem): number | null {
  if (item.finalScore != null && !isNaN(Number(item.finalScore))) {
    return Math.round(Number(item.finalScore));
  }
  if (item.ratingValue != null && !isNaN(Number(item.ratingValue))) {
    return Number(item.ratingValue);
  }
  return null;
}

function getRatingLabel(item: EmployeeAppraisalHistoryItem): string {
  if (typeof item.rating === "object" && item.rating) {
    return item.rating.label || item.rating.key || "Completed";
  }
  if (typeof item.rating === "string" && item.rating) {
    return item.rating;
  }
  return "Completed";
}

function getDateCompleted(item: EmployeeAppraisalHistoryItem): string {
  const rawDate =
    item.dateCompleted ||
    item.completedAt ||
    (typeof item.cycle === "object" ? item.cycle?.submissionDeadline : null);
  return formatDate(rawDate);
}

const STAGE_ORDER: Array<{ key: string; step: number; title: string }> = [
  { key: "GOAL_SETTING", step: 1, title: "Goal Setting" },
  { key: "SELF_ASSESSMENT", step: 2, title: "Self-Assessment" },
  { key: "MANAGER_REVIEW", step: 3, title: "Manager Review" },
  { key: "HR_APPROVAL", step: 4, title: "HR Approval" },
  { key: "ACKNOWLEDGMENT", step: 5, title: "Acknowledgment" },
];

function computePhases(activeAppraisal: EmployeeAppraisalDetailData | null) {
  if (!activeAppraisal) {
    return STAGE_ORDER.map((phase) => ({
      ...phase,
      status: "upcoming" as const,
    }));
  }

  const currentStage = activeAppraisal.stage?.toUpperCase();
  const historyMap = new Map<string, string | null | undefined>();
  activeAppraisal.workflowHistory?.forEach((step) => {
    historyMap.set(step.stage.toUpperCase(), step.completedAt);
  });

  const currentIndex = STAGE_ORDER.findIndex((p) => p.key === currentStage);

  return STAGE_ORDER.map((phase, idx) => {
    if (historyMap.has(phase.key) && historyMap.get(phase.key)) {
      return { ...phase, status: "completed" as const };
    }
    if (phase.key === currentStage) {
      return { ...phase, status: "active" as const };
    }
    if (currentIndex !== -1) {
      if (idx < currentIndex) return { ...phase, status: "completed" as const };
      if (idx === currentIndex) return { ...phase, status: "active" as const };
      return { ...phase, status: "upcoming" as const };
    }
    return { ...phase, status: "upcoming" as const };
  });
}

export default function EmployeeAppraisalPage() {
  const [selectedAppraisalId, setSelectedAppraisalId] = useState<string | null>(
    null,
  );
  const [selectedAppraisal, setSelectedAppraisal] =
    useState<AppraisalDetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [confirmingGoals, setConfirmingGoals] = useState(false);
  const [isRateGoalOpen, setIsRateGoalOpen] = useState(false);
  const [isAcknowledgeModalOpen, setIsAcknowledgeModalOpen] = useState(false);
  const [selectedGoalForRating, setSelectedGoalForRating] =
    useState<HistoricalAppraisalGoal | null>(null);

  // Active Appraisal State
  const [activeAppraisal, setActiveAppraisal] =
    useState<EmployeeAppraisalDetailData | null>(null);
  const [activeGoalsData, setActiveGoalsData] =
    useState<EmployeeAppraisalGoalsData | null>(null);
  const [selfAssessmentData, setSelfAssessmentData] =
    useState<EmployeeSelfAssessmentData | null>(null);
  const [loadingActive, setLoadingActive] = useState<boolean>(true);
  const [activeError, setActiveError] = useState<string | null>(null);

  const handleOpenRateGoal = (goal: HistoricalAppraisalGoal) => {
    setSelectedGoalForRating(goal);
    setIsRateGoalOpen(true);
  };

  const handleGoalUpdated = (updatedGoal: HistoricalAppraisalGoal) => {
    setActiveGoalsData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        goals: (prev.goals || []).map((g) =>
          g.id === updatedGoal.id ? updatedGoal : g,
        ),
      };
    });
    if (activeAppraisal?.appraisalId) {
      getEmployeeAppraisalGoals(activeAppraisal.appraisalId)
        .then((g) => setActiveGoalsData(g))
        .catch(() => {});
    }
  };

  const [savingDraft, setSavingDraft] = useState(false);

  const handleSaveSelfAssessmentDraft = async () => {
    const targetAppraisalId =
      activeAppraisal?.appraisalId || selfAssessmentData?.appraisalId;
    if (!targetAppraisalId) {
      toast.error("No active appraisal found to save draft.");
      return;
    }

    setSavingDraft(true);
    try {
      const payload: SaveSelfAssessmentDraftPayload = {
        sections: [
          {
            section: "KRA",
            totalWeight: 100,
            objectives: (activeGoalsData?.goals?.length
              ? activeGoalsData.goals
              : selfAssessmentData?.goals?.length
                ? selfAssessmentData.goals
                : [
                    {
                      id: "goal-default",
                      title: "Operational efficiency",
                      description: "Performance objectives",
                      successCriteria: "Reduce average order-processing time",
                    },
                  ]
            ).map((g) => ({
              title: g.title,
              weight: 100,
              keyResults: [
                {
                  keyResult:
                    g.successCriteria ||
                    g.description ||
                    "Operational key results",
                  kpiWeight: 100,
                  target: 24,
                  comment:
                    g.employeeComment ||
                    "Draft note; achieved value can be added later.",
                },
              ],
            })),
          },
        ],
        reflections: (selfAssessmentData?.reflectionQuestions || []).map(
          (rq) => ({
            questionId: rq.id,
            response: "Draft response in progress.",
          }),
        ),
      };

      await saveEmployeeSelfAssessmentDraft(targetAppraisalId, payload);
      toast.success("Employee self-assessment draft saved successfully");
    } catch (err: unknown) {
      console.error("Failed to save self-assessment draft:", err);
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
  };

  const [submittingAssessment, setSubmittingAssessment] = useState(false);

  const handleSubmitSelfAssessment = async () => {
    const targetAppraisalId =
      activeAppraisal?.appraisalId || selfAssessmentData?.appraisalId;
    if (!targetAppraisalId) {
      toast.error("No active appraisal found to submit.");
      return;
    }

    setSubmittingAssessment(true);
    try {
      const payload: SubmitSelfAssessmentPayload = {
        sections: [
          {
            section: "KRA",
            totalWeight: 100,
            objectives: (activeGoalsData?.goals?.length
              ? activeGoalsData.goals
              : selfAssessmentData?.goals?.length
                ? selfAssessmentData.goals
                : [
                    {
                      id: "goal-default",
                      title: "Operational efficiency",
                      description: "Performance objectives",
                      successCriteria: "Reduce average order-processing time",
                    },
                  ]
            ).map((g) => ({
              title: g.title,
              weight: 100,
              keyResults: [
                {
                  keyResult:
                    g.successCriteria ||
                    g.description ||
                    "Operational key results",
                  kpiWeight: 100,
                  target: 24,
                  achieved: 22,
                  comment:
                    g.employeeComment ||
                    "Average processing time fell to 22 hours.",
                },
              ],
            })),
          },
        ],
        reflections: (selfAssessmentData?.reflectionQuestions || []).map(
          (rq) => ({
            questionId: rq.id,
            response:
              "I automated two approval steps and documented the new workflow.",
          }),
        ),
      };

      await submitEmployeeSelfAssessment(targetAppraisalId, payload);
      toast.success("Employee self-assessment submitted successfully.");
      fetchActiveAppraisal();
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
      setSubmittingAssessment(false);
    }
  };

  // Past Appraisal History State
  const [history, setHistory] = useState<EmployeeAppraisalHistoryItem[]>([]);
  const [pagination, setPagination] =
    useState<EmployeeAppraisalPagination | null>(null);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const fetchActiveAppraisal = useCallback(async () => {
    setLoadingActive(true);
    setActiveError(null);
    try {
      const urlParams =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const queryAppraisalId = urlParams?.get("appraisalId");
      const querySubmitted = urlParams?.get("submitted");

      if (querySubmitted === "true") {
        toast.success("Employee self-assessment submitted successfully.");
        if (typeof window !== "undefined") {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete("submitted");
          window.history.replaceState({}, "", newUrl.toString());
        }
      }

      if (queryAppraisalId) {
        const detail = await getEmployeeAppraisalDetail(queryAppraisalId);
        setActiveAppraisal(detail);
        getEmployeeAppraisalGoals(queryAppraisalId)
          .then((gRes) => setActiveGoalsData(gRes))
          .catch(() => setActiveGoalsData(null));
        getEmployeeSelfAssessment(queryAppraisalId)
          .then((saRes) => setSelfAssessmentData(saRes))
          .catch(() => setSelfAssessmentData(null));
        return;
      }

      const overview = await getEmployeeAppraisalOverview();
      const current = overview?.currentAppraisal;
      const raw = current as
        | {
            id?: string;
            appraisalId?: string;
            cycleName?: string;
            periodStart?: string;
            periodEnd?: string;
            deadline?: string;
            status?: string;
            currentPhase?: string;
            goalsConfirmed?: boolean;
            goalsConfirmedAt?: string | null;
            goals?: HistoricalAppraisalGoal[];
            actions?: { canEditGoals?: boolean };
          }
        | null
        | undefined;
      const currentId = raw?.appraisalId ?? raw?.id;
      if (raw && currentId) {
        setActiveAppraisal({
          ...(current as EmployeeAppraisalDetailData),
          appraisalId: currentId,
          stage: raw.currentPhase,
          status: raw.status,
          cycle: {
            name: raw.cycleName,
            periodFrom: raw.periodStart,
            periodTo: raw.periodEnd,
            submissionDeadline: raw.deadline,
          },
        } as EmployeeAppraisalDetailData);
        setActiveGoalsData({
          appraisalId: currentId,
          goals: raw.goals ?? [],
          goalsConfirmed: raw.goalsConfirmed ?? false,
          goalsConfirmedAt: raw.goalsConfirmedAt ?? null,
          editable: raw.actions?.canEditGoals ?? false,
        });
        if (raw.currentPhase && raw.currentPhase !== "GOAL_SETTING") {
          getEmployeeSelfAssessment(currentId)
            .then((saRes) => setSelfAssessmentData(saRes))
            .catch(() => setSelfAssessmentData(null));
        } else {
          setSelfAssessmentData(null);
        }
      } else if (current) {
        setActiveAppraisal(current);
        setActiveGoalsData(null);
        setSelfAssessmentData(null);
      } else {
        setActiveAppraisal(null);
        setActiveGoalsData(null);
        setSelfAssessmentData(null);
      }
    } catch (err: unknown) {
      console.error("Failed to load active appraisal:", err);
      const apiMsg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setActiveError(
        apiMsg ||
          (err instanceof Error
            ? err.message
            : "Failed to load active appraisal."),
      );
    } finally {
      setLoadingActive(false);
    }
  }, []);

  const fetchAppraisalHistory = useCallback(async () => {
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await getEmployeeAppraisalHistory({ page: 1, limit: 10 });
      setHistory(res.data || []);
      setPagination(res.pagination || null);
    } catch (err: unknown) {
      console.error("Failed to load appraisal history:", err);
      setHistoryError(
        err instanceof Error
          ? err.message
          : "Failed to load appraisal history. Please try again.",
      );
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveAppraisal();
    fetchAppraisalHistory();
  }, [fetchActiveAppraisal, fetchAppraisalHistory]);

  const handleView = (item: EmployeeAppraisalHistoryItem) => {
    const rawId = item.appraisalId || item.id;
    setSelectedAppraisalId(rawId ? String(rawId) : null);
    setSelectedAppraisal({
      cycle: getCycleName(item),
      period: getPeriod(item),
      finalScore: getFinalScore(item) ?? 0,
      rating: getRatingLabel(item),
      dateCompleted: getDateCompleted(item),
    });
    setIsModalOpen(true);
  };

  const handleViewActive = () => {
    if (!activeAppraisal) return;
    setSelectedAppraisalId(activeAppraisal.appraisalId);
    setSelectedAppraisal({
      cycle: activeAppraisal.cycle?.name || "Active Appraisal Review",
      period: activeAppraisal.cycle
        ? `${formatDate(activeAppraisal.cycle.periodFrom)} – ${formatDate(activeAppraisal.cycle.periodTo)}`
        : "—",
      finalScore:
        activeAppraisal.finalScore != null
          ? Math.round(activeAppraisal.finalScore)
          : 0,
      rating: activeAppraisal.rating || "In Progress",
      dateCompleted: activeAppraisal.cycle?.submissionDeadline
        ? formatDate(activeAppraisal.cycle.submissionDeadline)
        : "—",
    });
    setIsModalOpen(true);
  };

  const phases = useMemo(
    () => computePhases(activeAppraisal),
    [activeAppraisal],
  );

  const getCalloutDetails = () => {
    if (!activeAppraisal) {
      return {
        title: "No Active Appraisal Cycle",
        description:
          "There is no performance review cycle currently active. Past appraisal reviews can be viewed below.",
        action: null,
      };
    }

    const stage = activeAppraisal.stage?.toUpperCase();
    switch (stage) {
      case "GOAL_SETTING":
        return {
          title: "Current Phase: Goal Setting",
          description:
            "Review and finalize your performance objectives and key results for this quarter.",
          action: (
            <button
              type="button"
              onClick={handleViewActive}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#1683D8] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1270B8]"
            >
              Review Goals →
            </button>
          ),
        };
      case "SELF_ASSESSMENT":
        return {
          title: "Current Phase: Self-Assessment",
          description:
            'Click "Begin Self-Assessment" to open the full OKR appraisal form and enter your achieved values for each quarter.',
          action: (
            <Link
              href={
                activeAppraisal?.appraisalId
                  ? `/employee/appraisal/self-assessment?appraisalId=${activeAppraisal.appraisalId}`
                  : "/employee/appraisal/self-assessment"
              }
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#1683D8] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1270B8]"
            >
              Begin Self-Assessment →
            </Link>
          ),
        };
      case "MANAGER_REVIEW":
        return {
          title: "Current Phase: Manager Review",
          description:
            "Your self-assessment has been submitted and is currently being evaluated by your reviewer.",
          action: (
            <button
              type="button"
              onClick={handleViewActive}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#1683D8] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1270B8]"
            >
              View Submission →
            </button>
          ),
        };
      case "HR_APPROVAL":
        return {
          title: "Current Phase: HR Approval",
          description:
            "Manager review is complete. Your appraisal is pending final review and approval by HR.",
          action: (
            <button
              type="button"
              onClick={handleViewActive}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#1683D8] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1270B8]"
            >
              View Progress →
            </button>
          ),
        };
      case "ACKNOWLEDGMENT":
        return {
          title: "Current Phase: Acknowledgment",
          description:
            "Your appraisal review has been approved by HR. Please review the final ratings and submit your formal acknowledgment.",
          action: (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAcknowledgeModalOpen(true)}
                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
              >
                Acknowledge Appraisal →
              </button>
              <button
                type="button"
                onClick={handleViewActive}
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                Review Details
              </button>
            </div>
          ),
        };
      case "COMPLETED":
        return {
          title: "Appraisal Completed",
          description:
            "This appraisal cycle is fully completed and signed off. You can review your final results.",
          action: (
            <button
              type="button"
              onClick={handleViewActive}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#1683D8] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1270B8]"
            >
              View Results →
            </button>
          ),
        };
      default:
        return {
          title: `Current Phase: ${activeAppraisal.stage?.replace(/_/g, " ") || "In Progress"}`,
          description:
            "Track your review progress as it moves through each evaluation phase.",
          action: (
            <button
              type="button"
              onClick={handleViewActive}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#1683D8] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1270B8]"
            >
              View Details →
            </button>
          ),
        };
    }
  };

  const callout = getCalloutDetails();

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 sm:px-10">
      <div className="space-y-6 ">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D2433] sm:text-3xl">
            My Appraisal
          </h1>
          <p className="mt-1 text-sm text-[#98A2B3]">
            Track your performance goals and appraisal cycles
          </p>
        </header>

        {/* Active Appraisal Cycle Card */}
        <section className="mt-6 rounded-xl border border-[#EAECF0] bg-white p-6 shadow-sm sm:p-7">
          {loadingActive ? (
            <div className="animate-pulse space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-48 rounded bg-gray-200" />
                  <div className="h-3.5 w-64 rounded bg-gray-200" />
                </div>
                <div className="h-6 w-24 rounded-full bg-gray-200" />
              </div>
              <div className="h-8 w-full rounded bg-gray-100" />
              <div className="h-16 w-full rounded-lg bg-gray-100" />
            </div>
          ) : (
            <>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[#1D2433]">
                    {activeAppraisal?.cycle?.name ||
                      (activeAppraisal
                        ? "Performance Review"
                        : "No Active Appraisal Cycle")}
                  </h2>
                  <p className="mt-1 text-xs text-[#667085]">
                    {activeAppraisal?.cycle
                      ? `Period: ${formatDate(activeAppraisal.cycle.periodFrom)} – ${formatDate(activeAppraisal.cycle.periodTo)} · Deadline: ${formatDate(activeAppraisal.cycle.submissionDeadline)}`
                      : activeAppraisal
                        ? "Review cycle currently in progress"
                        : "There is no review cycle currently scheduled for you."}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {activeGoalsData && (
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        activeGoalsData.goalsConfirmed
                          ? "border-[#ABEFC6] bg-[#ECFDF3] text-[#027A48]"
                          : "border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]"
                      }`}
                    >
                      {activeGoalsData.goalsConfirmed
                        ? `Goals Confirmed${
                            activeGoalsData.goalsConfirmedAt
                              ? ` • ${formatDate(activeGoalsData.goalsConfirmedAt)}`
                              : ""
                          }`
                        : "Goals Pending Confirmation"}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                      activeAppraisal?.status?.toUpperCase() === "COMPLETED"
                        ? "border-[#ABEFC6] bg-[#ECFDF3] text-[#027A48]"
                        : activeAppraisal
                          ? "border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]"
                          : "border-gray-200 bg-gray-100 text-gray-600"
                    }`}
                  >
                    {activeAppraisal?.status
                      ? activeAppraisal.status.replace(/_/g, " ")
                      : activeAppraisal
                        ? "In Progress"
                        : "Inactive"}
                  </span>
                </div>
              </div>

              {activeError && (
                <div className="mt-4 flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{activeError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={fetchActiveAppraisal}
                    className="font-medium underline hover:text-amber-900"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Stepper */}
              <div className="mt-8 flex items-center justify-between">
                {phases.map((phase, idx) => {
                  const isLast = idx === phases.length - 1;
                  const isCompleted = phase.status === "completed";
                  const isActive = phase.status === "active";

                  return (
                    <div key={phase.step} className="flex flex-1 items-center">
                      {/* Step node */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                            isCompleted
                              ? "bg-[#1683D8] text-white"
                              : isActive
                                ? "border-2 border-[#1683D8] bg-white font-bold text-[#1683D8]"
                                : "border-2 border-[#D0D5DD] bg-white text-[#98A2B3]"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-4 w-4 stroke-[2.5] text-white" />
                          ) : (
                            phase.step
                          )}
                        </div>
                        <span
                          className={`mt-2 whitespace-nowrap text-xs text-center ${
                            isActive
                              ? "font-bold text-[#1D2433]"
                              : isCompleted
                                ? "font-medium text-[#475467]"
                                : "font-medium text-[#98A2B3]"
                          }`}
                        >
                          {phase.title}
                        </span>
                      </div>

                      {/* Connector Line */}
                      {!isLast && (
                        <div
                          className={`mx-2 mb-6 h-[2px] flex-1 ${
                            isCompleted ? "bg-[#1683D8]" : "bg-[#E4E7EC]"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Goals Preview */}
              {activeGoalsData?.goals && activeGoalsData.goals.length > 0 && (
                <div className="mt-8 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Performance Goals ({activeGoalsData.goals.length})
                      </h4>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Quarterly key results and success criteria
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddGoalOpen(true)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#1683D8] px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-[#1270B8]"
                      >
                        + Add Goal
                      </button>
                      <button
                        type="button"
                        onClick={handleViewActive}
                        className="text-xs font-semibold text-[#1683D8] hover:underline"
                      >
                        View All Goals →
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {activeGoalsData.goals.map((goal) => {
                      const statusUpper = goal.status?.toUpperCase();
                      const statusStyle =
                        statusUpper === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : statusUpper === "IN_PROGRESS"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-gray-100 text-gray-600 border-gray-200";

                      return (
                        <div
                          key={goal.id}
                          className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-3.5 text-xs shadow-xs"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1.5">
                              <p className="font-semibold text-gray-900">
                                {goal.title}
                              </p>
                              {goal.status && (
                                <span
                                  className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-medium ${statusStyle}`}
                                >
                                  {goal.status.replace(/_/g, " ")}
                                </span>
                              )}
                            </div>
                            {goal.description && (
                              <p className="mt-1 text-gray-500">
                                {goal.description}
                              </p>
                            )}
                            {goal.successCriteria && (
                              <p className="mt-1 text-gray-600">
                                <span className="font-medium text-gray-700">
                                  Success Criteria:
                                </span>{" "}
                                {goal.successCriteria}
                              </p>
                            )}
                            {goal.targetDate && (
                              <p className="mt-1 text-[11px] text-gray-400">
                                Target Date: {formatDate(goal.targetDate)}
                              </p>
                            )}
                            {goal.employeeComment && (
                              <p className="mt-1.5 rounded bg-gray-50 p-2 text-[11px] text-gray-600 italic border border-gray-100">
                                <span className="font-medium not-italic text-gray-700">
                                  My note:
                                </span>{" "}
                                "{goal.employeeComment}"
                              </p>
                            )}
                          </div>

                          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
                            {typeof goal.employeeRating === "number" &&
                            goal.employeeRating > 0 ? (
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                                <Star
                                  size={13}
                                  className="fill-amber-400 text-amber-500"
                                />
                                <span>
                                  Self-Rating: {goal.employeeRating}/5
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-gray-400 italic">
                                Not rated
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenRateGoal(goal)}
                              className="inline-flex items-center gap-1 rounded border border-[#1683D8] bg-[#F0F7FE] px-2.5 py-1 text-[11px] font-medium text-[#1683D8] transition hover:bg-[#E0EFFE]"
                            >
                              {typeof goal.employeeRating === "number" &&
                              goal.employeeRating > 0
                                ? "Edit Assessment"
                                : "Assess Goal"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeGoalsData &&
                !activeGoalsData.goalsConfirmed &&
                (activeGoalsData.goals?.length ?? 0) > 0 && (
                  <div className="mt-6 flex items-center justify-between rounded-lg border border-[#FEDF89] bg-[#FFFAEB] p-4">
                    <p className="text-xs font-medium text-[#B54708]">
                      Your manager has proposed these goals. Confirm them to
                      start your self-assessment.
                    </p>
                    <button
                      type="button"
                      disabled={confirmingGoals}
                      onClick={async () => {
                        const id = activeGoalsData.appraisalId;
                        if (!id || confirmingGoals) return;
                        setConfirmingGoals(true);
                        try {
                          await confirmEmployeeGoals(id);
                          toast.success("Goals confirmed.");
                          await fetchActiveAppraisal();
                        } catch (err: unknown) {
                          const apiMsg = (
                            err as {
                              response?: { data?: { message?: string } };
                            }
                          )?.response?.data?.message;
                          toast.error(apiMsg || "Failed to confirm goals.");
                        } finally {
                          setConfirmingGoals(false);
                        }
                      }}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#1683D8] px-3.5 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-[#1270B8] disabled:opacity-60"
                    >
                      {confirmingGoals ? "Confirming..." : "Confirm Goals"}
                    </button>
                  </div>
                )}

              {/* Empty Goals Banner with Add Goal Button */}
              {activeAppraisal &&
                (!activeGoalsData?.goals ||
                  activeGoalsData.goals.length === 0) && (
                  <div className="mt-8 flex items-center justify-between rounded-lg border border-dashed border-gray-300 bg-gray-50/60 p-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        No performance goals added yet
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-500">
                        Define quarterly key objectives and success criteria to
                        align with your reviewer.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddGoalOpen(true)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#1683D8] px-3.5 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-[#1270B8]"
                    >
                      + Add Goal
                    </button>
                  </div>
                )}

              {/* Self-Assessment Overview Snapshot */}
              {selfAssessmentData && (
                <div className="mt-8 rounded-lg border border-purple-200 bg-purple-50/40 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                          <FileText size={14} />
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                          Self-Assessment Form Snapshot
                        </h4>
                        {selfAssessmentData.quarter && (
                          <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                            {selfAssessmentData.quarter}
                          </span>
                        )}
                        <span className="rounded border border-purple-200 bg-white px-2 py-0.5 text-[10px] font-medium text-purple-700">
                          {selfAssessmentData.stage?.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        Employee:{" "}
                        <span className="font-semibold text-gray-900">
                          {selfAssessmentData.header?.employee?.name ||
                            "Ada Okafor"}
                        </span>{" "}
                        · Supervisor:{" "}
                        <span className="font-semibold text-gray-900">
                          {selfAssessmentData.header?.supervisor?.name ||
                            "Chidi Eze"}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveSelfAssessmentDraft}
                        disabled={savingDraft || submittingAssessment}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-white px-3 py-1.5 text-xs font-medium text-purple-700 shadow-xs transition hover:bg-purple-50 disabled:opacity-50"
                      >
                        {savingDraft ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Saving Draft...</span>
                          </>
                        ) : (
                          <>
                            <Save size={13} />
                            <span>Save Draft</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmitSelfAssessment}
                        disabled={submittingAssessment || savingDraft}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-purple-700 disabled:opacity-50"
                      >
                        {submittingAssessment ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send size={13} />
                            <span>Submit Assessment</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={
                          activeAppraisal?.appraisalId
                            ? `/employee/appraisal/self-assessment?appraisalId=${activeAppraisal.appraisalId}`
                            : "/employee/appraisal/self-assessment"
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1683D8] hover:underline"
                      >
                        Open Full Form →
                      </Link>
                    </div>
                  </div>

                  {/* Reflection Questions Preview */}
                  {selfAssessmentData.reflectionQuestions &&
                    selfAssessmentData.reflectionQuestions.length > 0 && (
                      <div className="mt-3.5 space-y-2 border-t border-purple-100 pt-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-900">
                          Assigned Reflection Questions (
                          {selfAssessmentData.reflectionQuestions.length})
                        </p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {selfAssessmentData.reflectionQuestions.map((rq) => (
                            <div
                              key={rq.id}
                              className="flex items-start gap-2 rounded-md border border-purple-100 bg-white p-2.5 text-xs text-gray-800 shadow-xs"
                            >
                              <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {rq.question}
                                </p>
                                <span className="mt-0.5 block text-[10px] text-gray-400">
                                  ID: {rq.id}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Rating Scale Legend */}
                  {selfAssessmentData.ratingScale &&
                    selfAssessmentData.ratingScale.length > 0 && (
                      <div className="mt-3 border-t border-purple-100 pt-2.5">
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-purple-900">
                          Rating Scale Criteria
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {selfAssessmentData.ratingScale.map((rs) => (
                            <span
                              key={rs.key || rs.value}
                              className="inline-flex items-center gap-1 rounded border border-purple-100 bg-white px-2.5 py-1 text-[11px] text-gray-700 shadow-xs"
                            >
                              <span className="font-bold text-purple-700">
                                {rs.value}
                              </span>
                              <span>
                                –{" "}
                                {rs.key
                                  ?.replace(/_/g, " ")
                                  .toLowerCase()
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Current Phase Callout Box */}
              <div className="mt-8 flex flex-col justify-between gap-4 rounded-lg border border-[#B2DDFF] bg-[#F0F7FE] p-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold text-[#1683D8]">
                    {callout.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#475467]">
                    {callout.description}
                  </p>
                </div>

                {callout.action}
              </div>
            </>
          )}
        </section>

        {/* Past Appraisals Section */}
        <section className="mt-6 rounded-xl border border-[#EAECF0] bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1D2433]">
              Past Appraisals
            </h2>
            {pagination && pagination.total > 0 && (
              <span className="text-xs font-medium text-[#667085]">
                Total: {pagination.total}
              </span>
            )}
          </div>

          {historyError && (
            <div className="mt-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{historyError}</span>
              </div>
              <button
                type="button"
                onClick={fetchAppraisalHistory}
                className="font-medium underline hover:text-red-900"
              >
                Retry
              </button>
            </div>
          )}

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EAECF0] text-xs font-semibold text-[#667085]">
                  <th className="py-3 pr-4 font-semibold">Cycle</th>
                  <th className="py-3 pr-4 font-semibold">Period</th>
                  <th className="py-3 pr-4 font-semibold">Final Score</th>
                  <th className="py-3 pr-4 font-semibold">Rating</th>
                  <th className="py-3 pr-4 font-semibold">Date Completed</th>
                  <th className="py-3 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EAECF0]">
                {loadingHistory
                  ? Array.from({ length: 2 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="py-4 pr-4">
                          <div className="h-4 w-28 rounded bg-gray-200" />
                        </td>
                        <td className="py-4 pr-4">
                          <div className="h-4 w-24 rounded bg-gray-200" />
                        </td>
                        <td className="py-4 pr-4">
                          <div className="h-4 w-12 rounded bg-gray-200" />
                        </td>
                        <td className="py-4 pr-4">
                          <div className="h-6 w-24 rounded-full bg-gray-200" />
                        </td>
                        <td className="py-4 pr-4">
                          <div className="h-4 w-20 rounded bg-gray-200" />
                        </td>
                        <td className="py-4">
                          <div className="h-4 w-12 rounded bg-gray-200" />
                        </td>
                      </tr>
                    ))
                  : history.length > 0
                    ? history.map((item, index) => {
                        const ratingLabel = getRatingLabel(item);
                        const isExceeds =
                          ratingLabel.toLowerCase().includes("exceed") ||
                          ratingLabel.toLowerCase().includes("outstanding") ||
                          ratingLabel.toLowerCase().includes("above");
                        const score = getFinalScore(item);

                        return (
                          <tr
                            key={item.id || item.appraisalId || index}
                            className={`transition ${
                              index % 2 === 1
                                ? "bg-[#F8F9FB] hover:bg-[#F2F4F7]"
                                : "hover:bg-[#F9FAFB]"
                            }`}
                          >
                            <td className="py-4 pr-4 text-sm font-bold text-[#1D2433]">
                              {getCycleName(item)}
                            </td>
                            <td className="py-4 pr-4 text-sm text-[#475467]">
                              {getPeriod(item)}
                            </td>
                            <td className="py-4 pr-4 text-sm font-bold text-[#1D2433]">
                              {score != null ? `${score}%` : "—"}
                            </td>
                            <td className="py-4 pr-4">
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                  isExceeds
                                    ? "border border-[#ABEFC6]/60 bg-[#ECFDF3] text-[#027A48]"
                                    : "border border-[#B2DDFF]/60 bg-[#EFF8FF] text-[#175CD3]"
                                }`}
                              >
                                {ratingLabel}
                              </span>
                            </td>
                            <td className="py-4 pr-4 text-sm text-[#475467]">
                              {getDateCompleted(item)}
                            </td>
                            <td className="py-4">
                              <button
                                type="button"
                                onClick={() => handleView(item)}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1683D8] transition hover:text-[#1270B8]"
                              >
                                <Eye size={15} />
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    : null}
              </tbody>
            </table>

            {!loadingHistory && history.length === 0 && (
              <div className="py-12 text-center text-[#98A2B3]">
                <svg
                  className="mx-auto mb-3 h-10 w-10 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <p className="text-sm font-medium text-[#1D2433]">
                  No past appraisals found
                </p>
                <p className="mt-1 text-xs text-[#98A2B3]">
                  Completed appraisal reviews and performance history will
                  appear here.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* View Details Modal */}
        <ViewMyAppraisal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAppraisalId(null);
          }}
          appraisalId={selectedAppraisalId}
          appraisal={selectedAppraisal}
          onAppraisalUpdated={() => {
            fetchActiveAppraisal();
            fetchAppraisalHistory();
          }}
        />

        {/* Add Goal Modal */}
        {activeAppraisal?.appraisalId && (
          <AddGoalModal
            open={isAddGoalOpen}
            onClose={() => setIsAddGoalOpen(false)}
            appraisalId={activeAppraisal.appraisalId}
            onGoalCreated={(newGoal) => {
              setActiveGoalsData((prev) =>
                prev
                  ? {
                      ...prev,
                      goals: [...(prev.goals || []), newGoal],
                    }
                  : {
                      appraisalId: activeAppraisal.appraisalId,
                      goals: [newGoal],
                    },
              );
              getEmployeeAppraisalGoals(activeAppraisal.appraisalId)
                .then((g) => setActiveGoalsData(g))
                .catch(() => {});
            }}
          />
        )}

        {/* Rate Goal Modal */}
        {(activeAppraisal?.appraisalId || activeGoalsData?.appraisalId) && (
          <RateGoalModal
            open={isRateGoalOpen}
            onClose={() => {
              setIsRateGoalOpen(false);
              setSelectedGoalForRating(null);
            }}
            appraisalId={
              activeAppraisal?.appraisalId || activeGoalsData?.appraisalId || ""
            }
            goal={selectedGoalForRating}
            onGoalUpdated={handleGoalUpdated}
          />
        )}

        {/* Acknowledge Appraisal Modal */}
        {activeAppraisal?.appraisalId && (
          <AcknowledgeAppraisalModal
            open={isAcknowledgeModalOpen}
            onClose={() => setIsAcknowledgeModalOpen(false)}
            appraisalId={activeAppraisal.appraisalId}
            appraisalTitle={activeAppraisal.cycle?.name}
            finalScore={activeAppraisal.finalScore}
            rating={activeAppraisal.rating}
            onAcknowledged={() => {
              fetchActiveAppraisal();
              fetchAppraisalHistory();
            }}
          />
        )}
      </div>
    </div>
  );
}
