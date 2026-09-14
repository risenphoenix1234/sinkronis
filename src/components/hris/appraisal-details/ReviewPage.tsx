"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Target, Loader2, AlertCircle } from "lucide-react";

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

import { getAppraisalDetail } from "@/lib/api/hris";
import type {
  AppraisalStatus,
  AppraisalSummary,
  AppraisalEmployee,
  Goal,
} from "@/lib/api/types/hrisTypes";

interface ReviewPageProps {
  appraisalId?: string;
}

const defaultEmployee: AppraisalEmployee = {
  name: "Employee Name",
  title: "Role Title",
  department: "Department",
  managerName: "Manager Name",
  avatarInitials: "EN",
};

const defaultSummary: AppraisalSummary = {
  id: "review-detail",
  cycleTitle: "Performance Review",
  templateName: "Standard Performance Review",
  status: "GOAL_SETTING",
  statusLabel: "Goal Setting",
  overallScorePercent: 0,
  overallRatingLabel: "Pending",
};

const defaultGoal: Goal = {
  id: "default-goal-1",
  title: "Strategic Performance Objective",
  description:
    "Align core departmental targets and key deliverables for the appraisal cycle.",
  successCriteria:
    "Complete deliverables within schedule and exceed baseline quality metrics.",
  targetDate: new Date().toISOString(),
  status: "IN_PROGRESS",
};

/** Map the raw API response from getAppraisalDetail to the typed frontend shape. */
function mapAppraisalToEmployee(data: Record<string, unknown>): AppraisalEmployee {
  const emp = (data.employee ?? {}) as Record<string, unknown>;
  const name = (emp.name as string) ?? "Unknown Employee";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => (n as string)[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "EP";

  const dept = (data.department ?? emp.department ?? {}) as Record<string, unknown>;
  const manager = (data.manager ?? {}) as Record<string, unknown>;

  return {
    id: (emp.id as string) ?? undefined,
    name,
    title: (emp.role as string) ?? (emp.jobTitle as string) ?? "—",
    department: (dept.name as string) ?? "—",
    managerName: (manager.name as string) ?? "—",
    avatarInitials: initials,
  };
}

function mapAppraisalToSummary(data: Record<string, unknown>): AppraisalSummary {
  const cycle = (data.cycle ?? {}) as Record<string, unknown>;
  const template = (data.template ?? data.templateSnapshot ?? {}) as Record<string, unknown>;
  const templateMeta = (template.templateMetadata ?? {}) as Record<string, unknown>;

  const stage = (data.stage as string) ?? "GOAL_SETTING";
  const STAGE_LABELS: Record<string, string> = {
    GOAL_SETTING: "Goal Setting",
    SELF_ASSESSMENT: "Self Assessment",
    MANAGER_REVIEW: "Manager Review",
    PENDING_HR_APPROVAL: "Pending HR Approval",
    HR_APPROVAL: "HR Approval",
    ACKNOWLEDGEMENT: "Acknowledgement",
    COMPLETED: "Completed",
  };

  return {
    id: (data.appraisalId as string) ?? (data.id as string) ?? "",
    cycleTitle: (cycle.name as string) ?? "Performance Review",
    templateName:
      (templateMeta.name as string) ?? (template.name as string) ?? "Standard Review",
    status: stage as AppraisalStatus,
    statusLabel: STAGE_LABELS[stage] ?? stage,
    overallScorePercent: (data.score as number) ?? 0,
    overallRatingLabel: (data.rating as string) ?? "Pending",
  };
}

function mapAppraisalToGoal(data: Record<string, unknown>): Goal {
  // The API can return a goals array or a single goal object
  const goals = data.goals as unknown[];
  if (Array.isArray(goals) && goals.length > 0) {
    const g = goals[0] as Record<string, unknown>;
    return {
      id: (g.id as string) ?? "goal-1",
      title: (g.title as string) ?? "Goal",
      description: (g.description as string) ?? "",
      successCriteria: (g.successCriteria as string) ?? "",
      targetDate: (g.targetDate as string) ?? new Date().toISOString(),
      status: ((g.status as string) ?? "IN_PROGRESS") as Goal["status"],
      employeeRating: g.employeeRating as number | undefined,
      employeeComment: g.employeeComment as string | undefined,
      managerRating: g.managerRating as number | undefined,
      managerComment: g.managerComment as string | undefined,
    };
  }
  return defaultGoal;
}

export default function ReviewPage({ appraisalId }: ReviewPageProps) {
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appraisalData, setAppraisalData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!appraisalId) return;
    setLoading(true);
    setError(null);
    getAppraisalDetail(appraisalId)
      .then((data) => {
        // getAppraisalDetail returns response.data.data (the unwrapped payload)
        setAppraisalData(data as Record<string, unknown>);
      })
      .catch((err) => {
        console.error("Failed to load appraisal detail:", err);
        setError("Failed to load appraisal details. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [appraisalId]);

  const employee: AppraisalEmployee = appraisalData
    ? mapAppraisalToEmployee(appraisalData)
    : defaultEmployee;

  const summary: AppraisalSummary = appraisalData
    ? mapAppraisalToSummary(appraisalData)
    : defaultSummary;

  const currentStatus: AppraisalStatus =
    (summary.status as AppraisalStatus) ?? "GOAL_SETTING";

  const goal: Goal = appraisalData
    ? mapAppraisalToGoal(appraisalData)
    : defaultGoal;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="mx-auto space-y-6">
        {/* Back to Reviews */}
        <button
          type="button"
          onClick={() => router.push("/hris/appraisal")}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft size={18} />
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
                  .then((data) => setAppraisalData(data as Record<string, unknown>))
                  .catch(() => setError("Failed to load appraisal details. Please try again."))
                  .finally(() => setLoading(false));
              }}
              className="rounded-md bg-blue-600 px-4 py-2 text-xs text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Employee Card */}
            <EmployeeCard employee={employee} appraisal={summary} />

            {/* Progress Stepper */}
            <ProgressStepper currentStatus={currentStatus} />

            {/* Goals */}
            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div className="flex items-center gap-2">
                  <Target className="text-[#1677C8]" size={18} />
                  <h2 className="font-semibold text-slate-800">Goals</h2>
                </div>

                <StatusBadge text={goal.status} color="yellow" />
              </div>

              <div className="p-6">
                <GoalCard goal={goal} />
              </div>
            </div>

            {/* Self Assessment */}
            <section className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <h2 className="font-semibold text-slate-800">
                  Self Assessment
                </h2>
                <StatusBadge text="Submitted" color="green" />
              </div>

              <div className="space-y-8 p-6">
                <QuarterTabs />
                <ObjectivesTable />
                <BehaviourTable />
                <GrandTotal />
                <ReflectionQuestions />
              </div>
            </section>

            {/* Manager Review */}
            <ManagerReview />

            {/* HR Approval & Acknowledgement */}
            {!isApproved ? (
              <HRApproval
                onReturnForRevision={() => {
                  console.log("Returned for revision");
                }}
                onApprove={() => {
                  setIsApproved(true);
                }}
              />
            ) : (
              <HRApprovalAndAcknowledgment />
            )}
          </>
        )}
      </div>
    </div>
  );
}
