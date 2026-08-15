import SectionHeader from "./SectionHeader";

export default function SelfAssessmentHeader() {
  return (
    <>
      <div>
        <a href="#" className="text-black hover:text-blue-700 ">
          &larr; Back to approval overview
        </a>
      </div>
      <SectionHeader
        title="Self-Assessment Form"
        subtitle="Q2 2026 Review • Deadline: 15 July 2026"
      />
    </>
  );
}
