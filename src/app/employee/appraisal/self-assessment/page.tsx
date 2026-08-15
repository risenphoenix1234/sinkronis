"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

import FooterActions from "@/components/employee/appraisal/FooterActions";
import ConfirmSubmitModal from "@/components/employee/appraisal/ConfirmSubmitModal";
import { useSelfAssessment } from "@/components/employee/appraisal/UseSelfAssessment";
import {
  behaviourObjectives,
  employee,
  objectives,
  reflectionQuestions,
} from "@/data/employee/appraisal";
import { validateSelfAssessment } from "@/lib/validation";
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
export default function SelfAssessmentPage() {
  const [open, setOpen] = useState(false);

  const { loading, saveDraft, submit } = useSelfAssessment();

  const completed = 7;
  const total = 10;

  const handleSubmit = async () => {
    const validation = validateSelfAssessment(
      employee,
      objectives,
      reflectionQuestions,
    );

    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        toast.error(error);
      });

      return;
    }

    await submit();
  };

  toast.success("Draft saved successfully.");

  toast.success("Self-assessment submitted.");

  toast.error("Please complete all required fields.");
  return (
    <>
      <main className="min-h-screen bg-slate-50 p-6 pb-28">
        <div className="mx-auto space-y-6">
          <SelfAssessmentHeader />

          <InfoBanner />

          <EmployeeInformation employee={employee} />

          <ObjectiveTable objectives={objectives} />

          <BehaviourTable behaviours={behaviourObjectives} />

          <GrandTotal />

          <OverallRating />

          <ReflectionQuestions questions={reflectionQuestions} />

          <SignOff />

          <FooterAction
            disableSubmit={true}
            onSaveDraft={() => console.log("Draft Saved")}
            onSubmit={() => console.log("Submitted")}
          />
        </div>
      </main>
      <ConfirmSubmitModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleSubmit}
      />
    </>
  );
}
