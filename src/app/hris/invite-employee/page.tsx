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
<<<<<<< HEAD
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

=======
        <h1 className="text-2xl font-semibold text-slate-900">Invite Employee</h1>
>>>>>>> origin/platform-admin
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
<<<<<<< HEAD
      <div className="flex h-auto flex-col gap-6 lg:flex-row">
        {/* Upload area */}
        <div className="w-full space-y-4 lg:w-2/3">
=======
      <div className="flex gap-6">
        {/* Upload area */}
        <div className="flex-1 space-y-4">
>>>>>>> origin/platform-admin
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
<<<<<<< HEAD
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
=======
        <div className="w-80 shrink-0 flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-6">
          <div className="text-center space-y-3">
            {/* SVG illustration placeholder matching the Figma visual */}
            <svg viewBox="0 0 280 260" className="w-full" xmlns="http://www.w3.org/2000/svg">
              {/* Monitor */}
              <rect x="30" y="20" width="180" height="130" rx="10" fill="#e0f0ff" stroke="#2183C6" strokeWidth="2"/>
              <rect x="40" y="30" width="160" height="110" rx="6" fill="white"/>
              {/* Screen content lines */}
              <rect x="55" y="45" width="60" height="8" rx="3" fill="#2183C6"/>
              <rect x="55" y="60" width="130" height="5" rx="2" fill="#cbd5e1"/>
              <rect x="55" y="72" width="110" height="5" rx="2" fill="#cbd5e1"/>
              <rect x="55" y="84" width="120" height="5" rx="2" fill="#cbd5e1"/>
              <rect x="55" y="96" width="90" height="5" rx="2" fill="#cbd5e1"/>
              {/* Social icons */}
              <circle cx="130" cy="110" r="6" fill="#3b82f6"/>
              <circle cx="146" cy="110" r="6" fill="#ef4444"/>
              <circle cx="162" cy="110" r="6" fill="#8b5cf6"/>
              {/* Monitor stand */}
              <rect x="105" y="150" width="30" height="16" rx="2" fill="#94a3b8"/>
              <rect x="90" y="165" width="60" height="6" rx="3" fill="#94a3b8"/>
              {/* Person */}
              <circle cx="220" cy="80" r="20" fill="#2183C6"/>
              <circle cx="220" cy="68" r="10" fill="#fde68a"/>
              <rect x="205" y="82" width="30" height="35" rx="6" fill="#2183C6"/>
              <rect x="200" y="88" width="12" height="22" rx="4" fill="#2183C6"/>
              <rect x="228" y="88" width="12" height="22" rx="4" fill="#2183C6"/>
              <rect x="208" y="117" width="10" height="20" rx="4" fill="#1e40af"/>
              <rect x="222" y="117" width="10" height="20" rx="4" fill="#1e40af"/>
              {/* Plants */}
              <rect x="20" y="195" width="8" height="30" rx="2" fill="#4ade80"/>
              <ellipse cx="24" cy="188" rx="14" ry="18" fill="#22c55e"/>
              <ellipse cx="14" cy="195" rx="10" ry="13" fill="#16a34a"/>
              <ellipse cx="34" cy="192" rx="10" ry="13" fill="#16a34a"/>
              {/* Floor line */}
              <rect x="10" y="224" width="260" height="3" rx="1" fill="#e2e8f0"/>
            </svg>
            <p className="text-xs text-slate-400">Bulk employee onboarding</p>
>>>>>>> origin/platform-admin
          </div>
        </div>
      </div>
    </section>
  );
}