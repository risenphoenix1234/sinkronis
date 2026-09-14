"use client";

import {
  downloadEmployeeTemplate,
  importEmployees,
  inviteEmployee,
} from "@/lib/api/hris";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function InviteEmployeePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    } catch (error) {
      console.error("TEMPLATE DOWNLOAD FAILED:", error);
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate CSV
    if (!file.name.toLowerCase().endsWith(".csv")) {
      console.error("Invalid file type. Please select a CSV file.");
      event.target.value = "";
      return;
    }

    // Validate 20MB maximum
    const maxFileSize = 20 * 1024 * 1024;

    if (file.size > maxFileSize) {
      console.error("File is too large. Maximum file size is 20MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    try {
      setLoading(true);

      const response = await importEmployees(file);

      console.log("IMPORT SUCCESS:", response);

      // Clear selected file after successful import
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Go back to employee list
      router.push("/hris/employees");
    } catch (error) {
      console.error("IMPORT FAILED:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    if (!loading) {
      fileInputRef.current?.click();
    }
  };

  const handleInviteViaForm = () => {
    router.push("/hris/employees/add");
  };

  const handleTestInvite = async () => {
    try {
      const res = await inviteEmployee({
        email: "femifestus0002@gmail.com", // ⚠️ use plato plato's real email here
        roleId: "cmtcx59js000pepg2273duugz", // Owner role — quick test only, not for real use
        moduleAccess: ["HRIS"],
      });
      console.log("Invite success:", res);
    } catch (err) {
      console.error(
        "Invite failed:",
        axios.isAxiosError(err) ? err.response?.data : err,
      );
    }
  };

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          Invite Employee
        </h1>

        <button
          type="button"
          onClick={handleTestInvite}
          className="rounded-md bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-300"
        >
          Test Invite
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Export CSV ↗
          </button>

          <button
            type="button"
            onClick={handleInviteViaForm}
            className="whitespace-nowrap rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
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

          {/* Upload area */}
          <div
            onClick={handleUploadClick}
            className={`flex min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white px-8 py-12 text-center transition ${
              loading
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:border-sky-300 hover:bg-sky-50/30"
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
              {loading ? "..." : "⬆"}
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
                <p className="text-base font-medium text-slate-700">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <p className="mt-2 text-sm text-sky-600">
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
              disabled={downloadingTemplate}
              className="rounded-md border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloadingTemplate
                ? "Downloading..."
                : "Download Bulk Template"}
            </button>

            {/* KEEP THIS BUTTON */}
            <button
              type="button"
              onClick={handleInviteViaForm}
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
