import Link from "next/link";
import SectionHeader from "./SectionHeader";

export default function SelfAssessmentHeader() {
  return (
    <>
      <div>
        <Link
          href="/employee/appraisal"
          className="text-sm font-medium text-slate-600 hover:text-blue-700 transition"
        >
          &larr; Back to appraisal overview
        </Link>
      </div>
      <SectionHeader
        title="Self-Assessment Form"
        subtitle="Q2 2026 Review • Deadline: 15 July 2026"
      />
    </>
  );
}
