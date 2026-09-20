"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { FiDownload, FiUploadCloud, FiCheckCircle, FiAlertCircle, FiFileText } from "react-icons/fi";
import {
  downloadEmployeeTemplate,
  importEmployees,
} from "@/lib/api/hris";
import type { ImportEmployeesData } from "@/lib/api/types/hrisTypes";

export default function InviteEmployeePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<ImportEmployeesData | null>(null);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      setDownloadingTemplate(true);
      const blob = await downloadEmployeeTemplate();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "employee-template.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Employee CSV template downloaded successfully.");
    } catch (err) {
      console.error("TEMPLATE DOWNLOAD FAILED:", err);
      toast.error("Failed to download employee template.");
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;

    setError(null);
    setSuccessResult(null);

    // Validate CSV extension
    if (!file.name.toLowerCase().endsWith(".csv")) {
      const msg = "Invalid file type. Please select a valid CSV file (.csv).";
      setError(msg);
      toast.error(msg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate 20MB maximum as specified in Swagger
    const maxFileSize = 20 * 1024 * 1024;
    if (file.size > maxFileSize) {
      const msg = "File is too large. Maximum file size allowed is 20MB.";
      setError(msg);
      toast.error(msg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);

    try {
      setLoading(true);

      const response = await importEmployees(file);

      console.log("IMPORT SUCCESS:", response);
      setSuccessResult(response.data);

      const importedCount = response.data?.imported ?? 1;
      toast.success(
        response.message || `Successfully imported ${importedCount} employee(s)!`
      );

      // Clear selected file and file input
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Route back to employee list after a short delay so the toast is seen
      setTimeout(() => {
        router.push("/hris/employees");
      }, 1200);
    } catch (err: unknown) {
      console.error("IMPORT FAILED:", err);
      let errMsg = "Failed to import employees. Please verify your CSV format and try again.";

      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
        if (resData?.message) {
          errMsg = resData.message;
        } else if (err.response?.status === 409) {
          errMsg = "Duplicate or invalid employee records found in CSV.";
        } else if (err.response?.status === 400) {
          errMsg = "Invalid CSV structure. Please ensure columns match the bulk template.";
        }
      }

      setError(errMsg);
      toast.error(errMsg);
      setSelectedFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUploadClick = () => {
    if (!loading) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (loading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleInviteViaForm = () => {
    router.push("/hris/employees/add");
  };

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Invite Employee
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Bulk-import employee profiles from CSV or invite individual employees.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            disabled={downloadingTemplate}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            title="Download the official CSV template"
          >
            <FiDownload size={14} />
            <span>Export CSV ↗</span>
          </button>

          <button
            type="button"
            onClick={handleInviteViaForm}
            className="whitespace-nowrap rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700"
          >
            + New Employee
          </button>
        </div>
      </div>

      {/* Upload section + illustration */}
      <div className="flex h-auto flex-col gap-6 lg:flex-row">
        {/* Upload area */}
        <div className="w-full space-y-4 lg:w-2/3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className="text-base">📄</span>
            Upload
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
              <div className="flex items-start gap-2">
                <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <div>
                  <span className="font-semibold">Import Error: </span>
                  <span>{error}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-red-400 transition hover:text-red-600"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Success Banner */}
          {successResult && (
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
              <FiCheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                Successfully imported {successResult.imported} employee record(s)! Redirecting to employee directory...
              </span>
            </div>
          )}

          {/* Upload Dropzone */}
          <div
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed px-8 py-12 text-center transition ${
              loading
                ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                : isDragging
                ? "cursor-copy border-sky-500 bg-sky-50/60 ring-2 ring-sky-200"
                : "cursor-pointer border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-2xl text-sky-500">
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
              ) : (
                <FiUploadCloud size={24} className="text-sky-600" />
              )}
            </div>

            {loading ? (
              <>
                <p className="text-base font-medium text-slate-700">
                  Importing employees...
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Please wait while the employee records are imported.
                </p>
              </>
            ) : selectedFile ? (
              <>
                <div className="flex items-center gap-2 text-slate-800">
                  <FiFileText size={18} className="text-sky-600" />
                  <p className="text-base font-medium">{selectedFile.name}</p>
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <p className="mt-2 text-xs font-medium text-sky-600 hover:underline">
                  Click to choose another CSV file
                </p>
              </>
            ) : (
              <>
                <p className="text-base font-medium text-slate-700">
                  Upload or Drag and Drop Employee details
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Maximum File Size is 20MB
                </p>

                <p className="text-sm text-slate-400">
                  Supported File Type is .csv
                </p>
              </>
            )}
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              disabled={downloadingTemplate || loading}
              className="rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloadingTemplate
                ? "Downloading..."
                : "Download Bulk Template"}
            </button>

            {/* KEEP THIS BUTTON */}
            <button
              type="button"
              onClick={handleInviteViaForm}
              disabled={loading}
              className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
            >
              Invite Employee Via Form
            </button>
          </div>
        </div>

        {/* Illustration & Bulk Onboarding Card */}
        <div
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleUploadClick();
            }
          }}
          title={loading ? "Importing employees..." : "Click or drop CSV here to import employees"}
          className={`hidden w-80 shrink-0 items-center justify-center rounded-xl border p-6 transition md:flex ${
            loading
              ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-70"
              : isDragging
              ? "cursor-pointer border-sky-400 bg-sky-50 shadow-inner"
              : "cursor-pointer border-slate-100 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/20 hover:shadow-sm"
          }`}
        >
          <div className="flex flex-col items-center justify-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cf233824242acb5019b349a57e2b0f895da0155f.png"
              alt="Bulk employee onboarding"
              className={`h-60 w-60 object-contain transition ${
                loading ? "animate-pulse" : ""
              }`}
            />

            <p className="mt-3 text-xs font-medium text-slate-500">
              Bulk employee onboarding
            </p>
            <span className="mt-1 text-[11px] font-medium text-sky-600">
              {loading ? "Importing in progress..." : "Click or drag CSV here to import"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}