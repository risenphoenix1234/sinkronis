// import { Badge } from "@/components/modals/Hris/AppraisalSettingPage";
// import { Template } from "@/types/hris/appraisal";
// import { Check, Eye, Pencil, Trash2 } from "lucide-react";

// export function TemplateCard({ template }: { template: Template }) {
//   return (
//     <div className="border border-[#E5E9EF] bg-white px-4 py-4">
//       <div className="flex items-start justify-between gap-4">
//         {/* Template information */}
//         <div className="min-w-0">
//           <div className="flex flex-wrap items-center gap-2">
//             <h3 className="font-semibold">{template.name}</h3>

//             {template.default && (
//               <Badge className="bg-green-100 text-green-700">Default</Badge>
//             )}

//             <Badge className="bg-green-100 text-green-700">
//               100%
//               <Check size={9} strokeWidth={3} />
//             </Badge>
//           </div>

//           <p className="mt-1 text-sm text-[#8492A6]">{template.description}</p>

//           <div className="mt-3 flex flex-wrap items-center gap-2">
//             <Badge className="bg-blue-50 text-[#2388D0]">
//               {template.objectives}
//             </Badge>

//             <Badge className="bg-purple-50 text-purple-700">
//               {template.behaviours}
//             </Badge>

//             <Badge className="bg-gray-100 text-[#8492A6]">Q1–Q4 scoring</Badge>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex shrink-0 items-center gap-2">
//           <button
//             type="button"
//             className="flex h-8 items-center gap-1.5 rounded bg-blue-50 px-3 text-xs font-semibold text-[#2388D0] transition hover:bg-blue-100"
//           >
//             <Eye size={12} />
//             Preview
//           </button>

//           <button
//             type="button"
//             className="flex h-8 items-center gap-1.5 rounded bg-gray-100 px-3 text-xs font-semibold text-[#667085] transition hover:bg-gray-200"
//           >
//             <Pencil size={12} />
//             Edit
//           </button>

//           {!template.default && (
//             <button
//               type="button"
//               aria-label={`Delete ${template.name}`}
//               className="flex h-8 w-8 items-center justify-center text-[#98A2B3] transition hover:text-red-500"
//             >
//               <Trash2 size={13} />
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="my-3 border-t border-dashed border-[#E5E9EF]" />

//       {/* Categories */}
//       <div className="flex flex-wrap gap-2">
//         {template.categories.map((category) => (
//           <div
//             key={category.name}
//             className={`rounded border px-2.5 py-2 text-sm ${
//               category.purple
//                 ? "border-purple-200 bg-purple-50 text-purple-700"
//                 : "border-blue-100 bg-blue-50 text-[#2388D0]"
//             }`}
//           >
//             <span className="font-semibold">{category.name}</span>

//             <span className="ml-2 opacity-60">{category.weight}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { Check, Eye, Pencil, Trash2 } from "lucide-react";

type Category = {
  name: string;
  weight: string;
  purple?: boolean;
};

type Template = {
  name: string;
  description: string;
  objectives: string;
  behaviours: string;
  categories: Category[];
  default?: boolean;
};

type TemplateCardProps = {
  template: Template;
  onPreview: () => void;
  onEdit: () => void;
};

export function TemplateCard({
  template,
  onPreview,
  onEdit,
}: TemplateCardProps) {
  return (
    <article className="border border-[#E5E9EF] bg-white px-4 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* Template information */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[#1F2937]">{template.name}</h3>

            {template.default && (
              <Badge className="bg-green-100 text-green-700">Default</Badge>
            )}

            <Badge className="bg-green-100 text-green-700">
              100%
              <Check size={9} strokeWidth={3} />
            </Badge>
          </div>

          <p className="mt-1 text-sm text-[#8492A6]">{template.description}</p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className="bg-blue-50 text-[#2388D0]">
              {template.objectives}
            </Badge>

            <Badge className="bg-purple-50 text-purple-700">
              {template.behaviours}
            </Badge>

            <Badge className="bg-gray-100 text-[#8492A6]">Q1–Q4 scoring</Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1 rounded-md bg-gray-100 p-1">
          {/* Preview */}
          <button
            type="button"
            onClick={onPreview}
            className="flex h-8 items-center gap-1.5 rounded px-3 text-xs font-semibold text-[#667085] transition hover:bg-white hover:text-[#2388D0]"
          >
            <Eye size={13} />
            Preview
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={onEdit}
            className="flex h-8 items-center gap-1.5 rounded px-3 text-xs font-semibold text-[#667085] transition hover:bg-white hover:text-[#2388D0]"
          >
            <Pencil size={13} />
            Edit
          </button>

          {/* Delete */}
          {!template.default && (
            <button
              type="button"
              aria-label={`Delete ${template.name}`}
              className="flex h-8 w-8 items-center justify-center rounded text-[#98A2B3] transition hover:bg-white hover:text-red-500"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-dashed border-[#E5E9EF]" />

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {template.categories.map((category) => (
          <div
            key={category.name}
            className={`rounded border px-2.5 py-2 text-sm ${
              category.purple
                ? "border-purple-200 bg-purple-50 text-purple-700"
                : "border-blue-100 bg-blue-50 text-[#2388D0]"
            }`}
          >
            <span className="font-semibold">{category.name}</span>

            <span className="ml-2 opacity-60">{category.weight}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Badge                                                                      */
/* -------------------------------------------------------------------------- */

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}
