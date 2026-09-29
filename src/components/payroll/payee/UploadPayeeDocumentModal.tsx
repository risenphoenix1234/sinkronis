// components/payroll/payee/UploadPayeeDocumentModal.tsx
"use client";

import { useState, useRef } from "react";
import { X, UploadCloud, FileText, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { uploadPayeeDocument } from "@/lib/api/payroll";

type UploadPayeeDocumentModalProps = {
  open: boolean;
  payeeId: string;
  onClose: () => void;
  onSuccess?: () => void;
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"];
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function UploadPayeeDocumentModal({
  open,
  payeeId,
  onClose,
  onSuccess,
}: UploadPayeeDocumentModalProps) {
  const [documentName, setDocumentName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleClose = () => {
    if (submitting) return;
    setDocumentName("");
    setFile(null);
    setError(null);
    setIsDragOver(false);
    onClose();
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);

    // Check size
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError("File size exceeds maximum allowed size of 10 MB.");
      return;
    }

    // Check type
    const lowerName = selectedFile.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) =>
      lowerName.endsWith(ext),
    );
    const hasValidMime =
      !selectedFile.type || ALLOWED_MIME_TYPES.includes(selectedFile.type);

    if (!hasValidExt && !hasValidMime) {
      setError("Only JPEG, PNG, or PDF files are accepted.");
      return;
    }

    setFile(selectedFile);

    // Auto-fill documentName if empty
    if (!documentName.trim()) {
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setDocumentName(baseName);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const trimmedName = documentName.trim();
    if (!trimmedName) {
      setError("Document Name is required.");
      return;
    }

    if (!file) {
      setError("Please select a document file to upload.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await uploadPayeeDocument(payeeId, {
        documentName: trimmedName,
        file,
      });

      toast.success("Payee document uploaded successfully");
      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          data?: {
            message?: string;
            validationErrors?: Array<{ message?: string }>;
          };
        };
      };
      const valMsg = axiosErr?.response?.data?.validationErrors?.[0]?.message;
      const msg =
        valMsg ||
        axiosErr?.response?.data?.message ||
        "Failed to upload document. Please check the file and try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="w-full max-w-[480px] rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
          <h2 className="text-base font-semibold text-[#1f2937]">
            Upload Document
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close"
            className="rounded-md p-1 text-[#667085] transition hover:bg-[#f2f4f7] hover:text-[#1f2937] disabled:opacity-50"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#667085]">
                Document Name <span className="text-[#667085]">*</span>
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="e.g. Service Agreement 2026"
                disabled={submitting}
                required
                className="w-full rounded-md border border-[#d0d5dd] px-3.5 py-2 text-sm text-[#1f2937] placeholder-[#98a2b3] focus:border-[#1683d8] focus:outline-none focus:ring-1 focus:ring-[#1683d8] disabled:bg-[#f9fafb]"
              />
            </div>

            {/* File Dropzone */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#667085]">
                File <span className="text-[#667085]">*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                disabled={submitting}
                className="hidden"
              />

              {!file ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition ${
                    isDragOver
                      ? "border-[#1683d8] bg-[#f0f9ff]"
                      : "border-[#d0d5dd] bg-[#fafafa] hover:bg-[#f5f5f5]"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f9ff] text-[#1683d8]">
                    <UploadCloud size={20} />
                  </div>
                  <p className="mt-2 text-xs font-medium text-[#344054]">
                    <span className="text-[#1683d8] underline">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="mt-1 text-[11px] text-[#98a2b3]">
                    JPEG, PNG, or PDF (max. 10 MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg border border-[#e5e7eb] bg-[#fafbfc] p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[#e0f2fe] text-[#0284c7]">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-[#1f2937]">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-[#98a2b3]">
                        {formatBytes(file.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    disabled={submitting}
                    className="rounded p-1 text-[#667085] hover:bg-gray-100 hover:text-[#1f2937]"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 border-t border-[#f0f0f0] px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="h-9 rounded-md border border-[#d0d5dd] bg-white px-4 text-xs font-medium text-[#344054] transition hover:bg-[#f9fafb] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !file}
              className="flex h-9 items-center gap-1.5 rounded-md bg-[#1683d8] px-4 text-xs font-medium text-white transition hover:bg-[#0f74c2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
