"use client";

import { ArrowLeft, Target } from "lucide-react";

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
import { useState } from "react";
import HRApprovalAndAcknowledgment from "./HrApprovalAndAcknowledgement";

export default function ReviewPage() {
  const [isApproved, setIsApproved] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="mx-auto space-y-6">
        {/* Back to Reviews */}
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to Reviews
        </button>
        {/* Employee Card */}
        <EmployeeCard />
        {/* Progress Stepper */}
        <ProgressStepper />
        {/* Goals */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-2">
              <Target className="text-[#1677C8]" size={18} />

              <h2 className="font-semibold text-slate-800">Goals</h2>
            </div>

            <StatusBadge text="Locked" />
          </div>

          <div className="p-6">
            <GoalCard />
          </div>
        </div>
        {/* Self Assessment */}
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <h2 className="font-semibold text-slate-800">Self Assessment</h2>

            <StatusBadge text="Submitted" />
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
        
        {/* HRApproval & HrApprovalAndAcknowledgement*/}
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
      </div>
    </div>
  );
}
