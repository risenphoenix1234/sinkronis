"use client";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function InviteEmployeeModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-xl text-center">
        <div className="mb-6 flex items-center justify-between text-left">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Invite Employee</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              + New Employee
            </button>
          </div>
        </div>

        {/* Upload area */}
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600 text-2xl">
              ⬆
            </div>
          </div>
          <p className="text-sm font-medium text-slate-700">
            Upload or Drag and Drop Employees details
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Supported file types: .png, .jpg, .pdf, .xls
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            Download Bulk Template
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Invite Employee Via Form
          </button>
        </div>
      </div>
    </div>
  );
}