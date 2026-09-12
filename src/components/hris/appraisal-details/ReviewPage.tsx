"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Target, Loader2 } from "lucide-react";

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

import { getAppraisalDetail, getAppraisalReviews } from "@/lib/api/hris";
import type {
  AppraisalStatus,
  AppraisalSummary,
  AppraisalEmployee,
  Goal,
  AppraisalReview,
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

export default function ReviewPage({ appraisalId }: ReviewPageProps) {
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appraisalData, setAppraisalData] = useState<any>(null);

  useEffect(() => {
    if (!appraisalId) return;
    setLoading(true);
    getAppraisalReviews().then((res) => {
      console.log("appraisal review sample:", res.data[0]);
      setReviews(res.data);
    });
    getAppraisalDetail(appraisalId)
      .then((data) => {
        setAppraisalData(data);
      })
      .catch((err) => {
        console.error("Failed to load appraisal detail:", err);
      })
      .finally(() => setLoading(false));
  }, [appraisalId]);

  const employee: AppraisalEmployee =
    appraisalData?.employee ?? defaultEmployee;
  const summary: AppraisalSummary = appraisalData?.summary ?? defaultSummary;
  const currentStatus: AppraisalStatus =
    (summary.status as AppraisalStatus) ?? "GOAL_SETTING";
  const goal: Goal = appraisalData?.goal ?? defaultGoal;

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
function setReviews(data: AppraisalReview[]) {
  throw new Error("Function not implemented.");
}

