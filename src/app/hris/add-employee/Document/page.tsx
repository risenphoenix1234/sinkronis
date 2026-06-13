"use client";

import UploadZone from "@/components/ui/UploadZone";
import { useRef, useState } from "react";

// // ── Icons ──────────────────────────────────────────────────────────────────

// function PersonIcon({ active }: { active: boolean }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? "white" : "#94a3b8"} strokeWidth={2}>
//       <circle cx="12" cy="8" r="4" />
//       <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
//     </svg>
//   );
// }

// function BriefcaseIcon({ active }: { active: boolean }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? "white" : "#94a3b8"} strokeWidth={2}>
//       <rect x="2" y="7" width="20" height="14" rx="2" />
//       <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
//     </svg>
//   );
// }

// function DocumentIcon({ active }: { active: boolean }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? "white" : "#94a3b8"} strokeWidth={2}>
//       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//       <polyline points="14 2 14 8 20 8" />
//       <line x1="8" y1="13" x2="16" y2="13" />
//       <line x1="8" y1="17" x2="12" y2="17" />
//     </svg>
//   );
// }

// function UploadCloudIcon() {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="#60a5fa" strokeWidth={1.5}>
//       <polyline points="16 16 12 12 8 16" />
//       <line x1="12" y1="12" x2="12" y2="21" />
//       <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
//     </svg>
//   );
// }

// // ── Steps config ──────────────────────────────────────────────────────────

// const steps = [
//   { id: 1, label: "Personal Information",     Icon: PersonIcon },
//   { id: 2, label: "Professional Information", Icon: BriefcaseIcon },
//   { id: 3, label: "Documents",                Icon: DocumentIcon },
// ];

// // ── Upload zone ───────────────────────────────────────────────────────────

// function UploadZone({ id }: { id: string }) {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [dragging, setDragging] = useState(false);

//   const handleFile = (file: File) => setFileName(file.name);

//   return (
//     <div
//       onClick={() => inputRef.current?.click()}
//       onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
//       onDragLeave={() => setDragging(false)}
//       onDrop={(e) => {
//         e.preventDefault();
//         setDragging(false);
//         const file = e.dataTransfer.files[0];
//         if (file) handleFile(file);
//       }}
//       className={`w-full rounded-xl border-2 border-dashed py-10 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
//         dragging
//           ? "border-blue-400 bg-blue-50"
//           : "border-gray-200 bg-gray-50 hover:bg-gray-100"
//       }`}
//     >
//       <UploadCloudIcon />
//       {fileName ? (
//         <p className="text-sm text-blue-500 font-medium">{fileName}</p>
//       ) : (
//         <p className="text-sm text-gray-500 font-medium">Upload file</p>
//       )}
//       <input
//         ref={inputRef}
//         id={id}
//         type="file"
//         accept=".jpg,.jpeg,.png,.pdf"
//         className="hidden"
//         onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
//       />
//     </div>
//   );
// }

// const hint = "Upload the document in this field, acceptable formats: JPEG, JPG or PDF (Max. 10MB)";

// ── Page component ────────────────────────────────────────────────────────

export default function AddNewEmployeeStep3() {
  const currentStep = 3;

  return (
    <section className="space-y-3">
      <section className="bg-white min-h-screen p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Add New Employee
        </h1>

        <div className="flex gap-12">
          {/* ── Sidebar ── */}
          {/* <div className="flex flex-col items-center pt-2 shrink-0"> */}
            {/* {steps.map(({ id, label, Icon }, idx) => {
              const isActive = id === currentStep;
              const isDone = id < currentStep;
              return (
                <div key={id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-blue-500 shadow-md shadow-blue-200"
                        : isDone
                          ? "bg-blue-400"
                          : "bg-white border border-gray-200"
                    }`}
                  >
                    <Icon active={isActive || isDone} />
                  </div>
                  <span
                    className={`mt-1.5 text-xs text-center leading-tight max-w-[72px] ${
                      isActive ? "text-blue-500 font-semibold" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                  {idx < steps.length - 1 && (
                    <div className="w-px h-8 bg-gray-200 my-1" />
                  )}
                </div>
              );
            })} */}
          </div>
          <aside className="w-56">
            <div className="relative flex flex-col items-center">
              <div className="absolute top-8 h-[220px] w-px bg-gray-200" />

              <div className="z-10 flex flex-col items-center mb-10">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  👤
                </div>
                <span className="mt-3 text-sm font-medium">
                  Personal Information
                </span>
              </div>

              <div className="z-10 flex flex-col items-center mb-10">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  💼
                </div>
                <span className="mt-3 text-sm text-gray-500">
                  Professional Information
                </span>
              </div>

              <div className="z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  📄
                </div>
                <span className="mt-3 text-sm text-gray-500">Documents</span>
              </div>
            </div>
          </aside>

          {/* ── Form ── */}
          <div className="flex-1 space-y-6">
            {/* Step label */}
            <div>
              <p className="text-xs text-gray-400 font-medium">Step 3/3</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">
                Documents
              </p>
            </div>

            {/* Upload appointment letter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Upload appointment letter
              </label>
              <UploadZone id="appointment-letter" />
              <p className="mt-1.5 text-[11px] text-gray-400">Upload the documents in this formats, Acceptable formats: JPEGS JPG </p>
            </div>

            {/* Upload salary slips */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Upload salary slips
              </label>
              <UploadZone id="salary-slips" />
              <p className="mt-1.5 text-[11px] text-gray-400">Upload the documents in this formats, Acceptable formats: JPEGS, JPG or PDF (max 10mb) </p>
            </div>

            {/* Other Documents */}
            <div>
              <div className="flex items-center gap-4 mb-2">
                <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
                  Other Documents
                </label>
              
              <UploadZone id="other-documents" />
              <p className="mt-1.5 text-[11px] text-gray-400">Upload the documents in this formats, Acceptable formats: JPEGS JPG </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      {/* <div className="border-t border-dashed border-gray-300 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-end gap-3">
          <button className="px-5 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Cancel
          </button>
          <button className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition shadow-sm">
            Next
          </button>
        </div>
      </div> */}
      
      <footer/>
    </section>
  );
}
