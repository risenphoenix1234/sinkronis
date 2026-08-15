"use client";

import { useRouter } from "next/navigation";

export default function InviteEmployeePage() {
  const router = useRouter();

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          Invite Employee
        </h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
            Export CSV ↗
          </button>
          <button
            onClick={() => router.push("/hris/employees/add")}
            className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
          >
            + New Employee
          </button>
        </div>
      </div>

      {/* Upload section + illustration */}
      <div className="flex flex-col gap-6 lg:flex-row h-auto">
        {/* Upload area */}
        <div className="w-full lg:w-2/3 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className="text-base">📄</span> Upload
          </div>

          <div className="flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white px-8 py-12 text-center transition hover:border-sky-300 hover:bg-sky-50/30">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-500 text-2xl">
              ⬆
            </div>
            <p className="text-base font-medium text-slate-700">
              Upload or Drag and Drop Employee details
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Maximum File Size is 20MB
            </p>
            <p className="text-sm text-slate-400">
              Supported File Types are .png, .jpeg, .pdf, .csv
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button className="rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
              Download Bulk Template
            </button>
            <button
              onClick={() => router.push("/hris/employees/add")}
              className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
            >
              Invite Employee Via Form
            </button>
          </div>
        </div>

        {/* Illustration */}
        <div className="hidden w-80 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-6 md:flex">
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src="/cf233824242acb5019b349a57e2b0f895da0155f.png"
              alt="Bulk employee onboarding"
              className="h-60 w-60 object-contain"
            />
            <p className="mt-3 text-xs text-slate-400">
              Bulk employee onboarding
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
