// app/tenant-admin/general-settings/data-privacy/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { FiDownload, FiTrash2 } from "react-icons/fi";
import RequestAccountDeletionModal from "@/components/modals/RequestAccountDeletionModal";
import {
  requestOrganizationExport,
  getOrganizationExportStatus,
  downloadOrganizationExport,
  requestOrganizationDeletion,
} from "@/lib/api/admin";
import { OrganizationExportStatus, OrganizationDeletionRequestBody } from "@/lib/api/types/admin.types";

export default function DataPrivacyPage() {
  const [deletionModalOpen, setDeletionModalOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<OrganizationExportStatus | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  function startPolling(exportId: string) {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const res = await getOrganizationExportStatus(exportId);
        setExportStatus(res.data);
        if (res.data.downloadAvailable || res.data.failedAt) {
          stopPolling();
        }
      } catch {
        stopPolling();
      }
    }, 10000);
  }

  useEffect(() => stopPolling, []);

  async function handleExport() {
    setRequesting(true);
    setError(null);
    try {
      const res = await requestOrganizationExport();
      // Normalize the initial POST response into the status shape for display
      setExportStatus({
        id: res.data.exportId,
        status: res.data.exportStatus,
        requestedAt: res.data.exportDate,
        processingStartedAt: null,
        completedAt: null,
        failedAt: null,
        deliveredAt: null,
        deliveryDueAt: res.data.deliveryDueAt,
        expiresAt: null,
        fileName: null,
        fileSize: res.data.fileSize,
        errorMessage: null,
        downloadAvailable: false,
        downloadPath: null,
      });
      startPolling(res.data.exportId);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to request export");
    } finally {
      setRequesting(false);
    }
  }

  async function handleDownload() {
    if (!exportStatus) return;
    try {
      const blob = await downloadOrganizationExport(exportStatus.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = exportStatus.fileName ?? "organization-export.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to download export");
    }
  }

  async function handleConfirmDeletion(payload: OrganizationDeletionRequestBody) {
    setError(null);
    try {
      await requestOrganizationDeletion(payload);
      setDeletionRequested(true);
      setDeletionModalOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to submit deletion request");
    }
  }

  const exportButtonDisabled = requesting || (!!exportStatus && !exportStatus.downloadAvailable && !exportStatus.failedAt);

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Data & Privacy</h1>
        <p className="mt-1 text-sm text-slate-500">
          Export your data or request account deletion
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-600">{error}</p>
      )}

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
              attendance records, and settings — as a ZIP archive. Delivery within 24 hours.
            </p>

            {!exportStatus?.downloadAvailable && (
              <button
                onClick={handleExport}
                disabled={exportButtonDisabled}
                className="mt-3 flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
              >
                <FiDownload size={14} />
                {requesting
                  ? "Requesting…"
                  : exportStatus
                  ? "Export Pending"
                  : "Request Data Export"}
              </button>
            )}

            {exportStatus && !exportStatus.downloadAvailable && !exportStatus.failedAt && (
              <p className="mt-2 text-xs text-slate-500">
                Status: {exportStatus.status.replaceAll("_", " ").toLowerCase()} — you'll be
                notified by email when it's ready.
              </p>
            )}

            {exportStatus?.failedAt && (
              <p className="mt-2 text-xs text-rose-600">
                Export failed{exportStatus.errorMessage ? `: ${exportStatus.errorMessage}` : "."}
              </p>
            )}

            {exportStatus?.downloadAvailable && (
              <button
                onClick={handleDownload}
                className="mt-3 flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <FiDownload size={14} />
                Download Export
              </button>
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
              cannot be undone. A Sinkronis representative will contact you within 2 business days.
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