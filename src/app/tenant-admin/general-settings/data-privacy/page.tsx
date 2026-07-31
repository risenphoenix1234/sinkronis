// app/tenant-admin/general-settings/data-privacy/page.tsx
"use client";

import { useState } from "react";
import { FiDownload, FiTrash2 } from "react-icons/fi";
import RequestAccountDeletionModal from "@/components/modals/RequestAccountDeletionModal";

export default function DataPrivacyPage() {
  const [deletionModalOpen, setDeletionModalOpen] = useState(false);
  const [exportRequested, setExportRequested] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);

  const handleExport = () => {
    // Hook up to API call to trigger the data export job here.
    console.log("Requesting data export");
    setExportRequested(true);
  };

  const handleConfirmDeletion = () => {
    // Hook up to API call to submit the account deletion request here.
    console.log("Account deletion requested");
    setDeletionRequested(true);
    setDeletionModalOpen(false);
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Data & Privacy</h1>
        <p className="mt-1 text-sm text-slate-500">
          Export your data or request account deletion
        </p>
      </div>

      {/* Export All Data */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-sky-600">
            <FiDownload size={16} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">Export All Data</p>
            <p className="mt-1 text-sm text-slate-500">
              Request a full export of your organisation's data — employees, invoices, expenses,
              attendance records, and settings — as a ZIP archive of CSV and JSON files. Export
              delivery within 24 hours to your registered admin email.
            </p>
            <button
              onClick={handleExport}
              disabled={exportRequested}
              className="mt-3 flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
            >
              <FiDownload size={14} />
              {exportRequested ? "Export Requested" : "Request Data Export"}
            </button>
            {exportRequested && (
              <p className="mt-2 text-xs text-emerald-600">
                We'll email you a download link within 24 hours.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Request Account Deletion */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <FiTrash2 size={16} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">Request Account Deletion</p>
            <p className="mt-1 text-sm text-slate-500">
              Permanently delete your organisation's account and all associated data. This action
              cannot be undone. A Sinkronis representative will contact you within 2 business days
              to confirm and process the request.
            </p>
            <button
              onClick={() => setDeletionModalOpen(true)}
              disabled={deletionRequested}
              className="mt-3 flex items-center gap-2 rounded-md border border-rose-300 bg-white px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiTrash2 size={14} />
              {deletionRequested ? "Deletion Requested" : "Request Account Deletion"}
            </button>
            {deletionRequested && (
              <p className="mt-2 text-xs text-rose-600">
                We've received your request and will reach out shortly.
              </p>
            )}
          </div>
        </div>
      </div>

      <RequestAccountDeletionModal
        open={deletionModalOpen}
        onClose={() => setDeletionModalOpen(false)}
        onConfirm={handleConfirmDeletion}
      />
    </div>
  );
}