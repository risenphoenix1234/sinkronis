// "use client";

// import { Eye, X } from "lucide-react";
// import AppraisalSignOff from "./AppraisaalSignOff";
// import BehaviourTable from "./BehaviourTable";
// import GrandTotal from "./GrandTotal";
// import ObjectivesTable from "./ObjectivesTable";
// import { employee } from "@/data/hris/appraisal";
// import { AppraisalHeader } from "./AppraisalHeader";
// import { TemplateHeader } from "./TemplateHeader";

// type TemplateViewProps = {
//   isOpen: boolean;
//   onClose: () => void;
// };

// export default function TemplateView({ isOpen, onClose }: TemplateViewProps) {
//   if (!isOpen) return null;
//   return (
//     <main className="min-h-screen bg-white text-[#1F2937]">
//       <TemplateHeader onClose={onClose} />

//       <div className="px-10 py-6">
//         <PreviewBanner />
//         <AppraisalHeader employee={employee} />
//       </div>

//       <div className="space-y-5 px-10 pb-10">
//         <ObjectivesTable />
//         <BehaviourTable />
//         <GrandTotal />
//         <AppraisalSignOff />
//       </div>
//     </main>
//   );
// }
// /* Preview Banner */

// function PreviewBanner() {
//   return (
//     <div className="flex min-h-[46px] items-center rounded-md border border-[#A8D5F5] bg-[#E7F4FF] px-5">
//       <Eye size={16} className="mr-3 shrink-0 text-[#2388D0]" strokeWidth={2} />

//       <p className="text-[13px] font-medium text-[#1670C2]">
//         Employee Self-Assessment Preview — type in Q1–Q4 achieved values to see
//         scores calculate live.
//       </p>
//     </div>
//   );
// }

"use client";

import { Eye } from "lucide-react";

import AppraisalSignOff from "./AppraisaalSignOff";
import BehaviourTable from "./BehaviourTable";
import GrandTotal from "./GrandTotal";
import ObjectivesTable from "./ObjectivesTable";
import { AppraisalHeader } from "./AppraisalHeader";
import { TemplateHeader } from "./TemplateHeader";

import { employee } from "@/data/hris/appraisal";

type TemplateViewProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TemplateView({ isOpen, onClose }: TemplateViewProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <main className="min-h-screen bg-white text-[#1F2937]">
        {/* Header */}
        <TemplateHeader onClose={onClose} />

        {/* Employee Preview */}
        <div className="px-4 py-5 sm:px-6 lg:px-10 lg:py-6">
          <PreviewBanner />

          <div className="mt-5">
            <AppraisalHeader employee={employee} />
          </div>
        </div>

        {/* Appraisal Content */}
        <div className="space-y-5 px-4 pb-8 sm:px-6 lg:px-10 lg:pb-10">
          <ObjectivesTable />

          <BehaviourTable />

          <GrandTotal />

          <AppraisalSignOff />
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Preview Banner                                                             */
/* -------------------------------------------------------------------------- */

function PreviewBanner() {
  return (
    <div className="flex min-h-[46px] items-center gap-3 rounded-md border border-[#A8D5F5] bg-[#E7F4FF] px-4 py-3 sm:px-5">
      <Eye size={16} strokeWidth={2} className="shrink-0 text-[#2388D0]" />

      <p className="text-xs font-medium leading-5 text-[#1670C2] sm:text-[13px]">
        Employee Self-Assessment Preview — type in Q1–Q4 achieved values to see
        scores calculate live.
      </p>
    </div>
  );
}
