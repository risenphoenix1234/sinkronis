"use client";

import { appraisalSections } from "@/data/employee/appraisal";
import SelfAssessmentHeader from "./SelfAssessmentHeader";
import EmployeeInfoCard from "./EmployeeInfoCard";
import ObjectiveSection from "./ObjectiveSection";
import FooterActions from "./FooterActions";
import GrandTotal from "./GrandTotal";
import OverallPerformance from "./OverallPerformance";
import ReflectionSection from "./ReflectionSection";
import SignOffSection from "./SignOffSection";
import WarningNotice from "./Warningnotice";

export default function SelfAssessmentPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] px-8 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <SelfAssessmentHeader />

        <EmployeeInfoCard />

        {appraisalSections.map((section) => (
          <ObjectiveSection key={section.id} section={section} />
        ))}

        <GrandTotal score={0} />

        <OverallPerformance />

        <ReflectionSection />

        <SignOffSection />

        <WarningNotice />

        <FooterActions />
      </div>
    </div>
  );
}
