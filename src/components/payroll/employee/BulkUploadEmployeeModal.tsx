"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Download, Upload, X } from "lucide-react";

type BulkUploadEmployeesModalProps = {
  open: boolean;
  onClose: () => void;
  onImport?: (file: File) => void;
};

const CSV_HEADERS = [
  "Name",
  "Department",
  "Role",
  "EmploymentType",
  "EmploymentStatus",
  "Email",
  "Phone",
  "State",
  "BankName",
  "AccountNumber",
  "BasicSalary",
  "HousingAllowance",
  "TransportAllowance",
  "OtherAllowance",
];

export default function BulkUploadEmployeesModal({
  open,
  onClose,
  onImport,
}: BulkUploadEmployeesModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  /* -------------------------------------------------------------------------- */
  /* File validation                                                            */
  /* -------------------------------------------------------------------------- */

  const validateFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      alert("Please upload a CSV file.");
      return false;
    }

    return true;
  };

  /* -------------------------------------------------------------------------- */
  /* File handlers                                                              */
  /* -------------------------------------------------------------------------- */

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !validateFile(file)) return;

    setSelectedFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file || !validateFile(file)) return;

    setSelectedFile(file);
  };

  const handleImport = () => {
    if (!selectedFile) return;

    onImport?.(selectedFile);

    setSelectedFile(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setIsDragging(false);
    onClose();
  };

  /* -------------------------------------------------------------------------- */
  /* Download CSV template                                                      */
  /* -------------------------------------------------------------------------- */

  const handleDownloadTemplate = () => {
    const csvContent = `${CSV_HEADERS.join(",")}\n`;

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "employee-template.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[520px] overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-8 py-6">
          <h2 className="text-xl font-bold text-[#263342]">
            Bulk Upload Employees
          </h2>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="rounded-md p-1 text-[#667085] transition hover:bg-[#F2F4F7] hover:text-[#1F2937]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* CSV information */}
          <div className="rounded-md bg-[#F2F4F7] px-4 py-4">
            <h3 className="text-sm font-semibold text-[#344054]">
              CSV Template Format
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#667085]">
              Required columns:{" "}
              <span className="font-semibold text-[#475467]">
                Name, Department, Role, EmploymentType, EmploymentStatus, Email,
                Phone, State, BankName, AccountNumber, BasicSalary,
                HousingAllowance, TransportAllowance, OtherAllowance
              </span>
            </p>
          </div>

          {/* Download template */}
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="mt-4 flex h-10 items-center gap-2 rounded-md border border-[#A8D5F5] bg-white px-4 text-sm font-medium text-[#1683D8] transition hover:bg-[#F0F9FF]"
          >
            <Download size={16} />

            <span>Download CSV Template</span>
          </button>

          {/* Upload label */}
          <p className="mb-2 mt-6 text-sm font-medium text-[#475467]">
            Upload CSV File
          </p>

          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                fileInputRef.current?.click();
              }
            }}
            className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 transition ${
              isDragging
                ? "border-[#1683D8] bg-[#F0F9FF]"
                : "border-[#A8D5F5] bg-[#FCFDFF] hover:bg-[#F8FBFF]"
            }`}
          >
            <Upload
              size={24}
              className="mb-3 text-[#B8C4D0]"
              strokeWidth={1.7}
            />

            {selectedFile ? (
              <div className="text-center">
                <p className="text-sm font-medium text-[#344054]">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-xs text-[#98A2B3]">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <p className="text-sm text-[#98A2B3]">
                Drag & drop a .csv file here, or click to browse
              </p>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Footer */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="h-11 rounded-md border border-[#D0D5DD] bg-white px-5 text-sm font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!selectedFile}
              onClick={handleImport}
              className={`h-11 rounded-md px-5 text-sm font-medium text-white transition ${
                selectedFile
                  ? "bg-[#1683D8] hover:bg-[#0F74C2]"
                  : "cursor-not-allowed bg-[#C5D0D9]"
              }`}
            >
              Import Employees
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
