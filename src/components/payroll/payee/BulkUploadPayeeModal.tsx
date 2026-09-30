// src/components/payroll/payee/BulkUploadPayeeModal.tsx
"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Download, Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import { usePayees } from "@/context/payroll/PayeeContext";
import {
  UnifiedPayee,
  PayeeType,
  TaxStatus,
  calculatePayeeDeductions,
  normalizePayeeType,
  getDefaultTaxStatus,
} from "@/types/payroll/unified-payee";

export interface BulkUploadPayeeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ParsedPayeeRow {
  index: number;
  name: string;
  type: PayeeType;
  role: string;
  monthlyAmount: number;
  dateOnboarded: string;
  bankName: string;
  bankAccount: string;
  accountName: string;
  taxStatus: TaxStatus;
  email: string;
  phone: string;
  tin: string;
  pfaName: string;
  pensionPin: string;
  isValid: boolean;
  errors: string[];
}

const SAMPLE_CSV_CONTENT = `Name,Classification,Role,EmploymentType,DateOnboarded,TaxStatus,MonthlyGross,BankName,AccountNumber,AccountName,Email,Phone,TIN,PFAName,PensionPIN
Adebayo Adeleke,Permanent,Engineering Director,Full-time,2024-01-15,PAYE,1500000,Zenith Bank,1012345678,Adebayo Adeleke,adebayo@example.com,+2348012345678,1234567-0001,Stanbic IBTC Pension Managers,PEN10012345
Funke Balogun,Contract,UX Design Specialist,Contract,2024-02-01,WHT,450000,Access Bank,0123456789,Funke Balogun,funke@example.com,+2348023456789,,,
Dr. Kingsley Moghalu,Consultant,Economic Advisor,Retainer,2024-03-01,None,850000,First Bank of Nigeria,2012345678,Kingsley Moghalu,kmoghalu@example.com,+2348034567890,,,
Ngozi Okonjo,Permanent,Finance Lead,Full-time,2024-02-15,PAYE,950000,Guaranty Trust Bank (GTBank),0012345678,Ngozi Okonjo,ngozi@example.com,+2348045678901,,Leadway Pensure PFA,PEN10098765`;

export default function BulkUploadPayeeModal({
  open,
  onClose,
  onSuccess,
}: BulkUploadPayeeModalProps) {
  const { addPayees } = usePayees();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedPayeeRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!open) return null;

  /* -------------------------------------------------------------------------- */
  /* Download CSV template                                                      */
  /* -------------------------------------------------------------------------- */

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "payee-template.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    toast.success("CSV template downloaded!");
  };

  /* -------------------------------------------------------------------------- */
  /* CSV Parser & Validator                                                     */
  /* -------------------------------------------------------------------------- */

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const processCSVText = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      toast.error("The uploaded CSV is empty or only contains headers.");
      setParsedRows([]);
      return;
    }

    const rawHeaders = parseCSVLine(lines[0]);
    const headerMap: Record<string, number> = {};
    rawHeaders.forEach((h, i) => {
      const normalized = h.toLowerCase().replace(/[^a-z0-9]/g, "");
      headerMap[normalized] = i;
    });

    const getCol = (cols: string[], ...aliases: string[]): string => {
      for (const alias of aliases) {
        const norm = alias.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (norm in headerMap && cols[headerMap[norm]] !== undefined) {
          return cols[headerMap[norm]];
        }
      }
      return "";
    };

    const dataLines = lines.slice(1);
    const rows: ParsedPayeeRow[] = [];

    dataLines.forEach((line, idx) => {
      const cols = parseCSVLine(line);
      const name = getCol(cols, "name", "fullname", "payeename", "employee") || cols[0] || "";
      const rawType = getCol(cols, "classification", "type", "payeetype", "employmenttype") || cols[1] || "";
      const role = getCol(cols, "role", "designation", "jobtitle", "position") || cols[2] || "Staff Member";
      const rawDate = getCol(cols, "dateonboarded", "dateadded", "joindate", "hiredate") || cols[4] || "";
      const rawTaxStatus = getCol(cols, "taxstatus", "tax") || cols[5] || "";

      // Salary resolution (supports MonthlyGross, GrossSalary, or basic + allowances breakdown)
      let monthlyAmount = parseFloat(
        getCol(cols, "monthlygross", "grosssalary", "gross")
          .replace(/[₦,]/g, "") || "0"
      );

      if (isNaN(monthlyAmount) || monthlyAmount <= 0) {
        const basic = parseFloat(getCol(cols, "basicsalary", "basic").replace(/[₦,]/g, "") || "0");
        const housing = parseFloat(getCol(cols, "housingallowance", "housing").replace(/[₦,]/g, "") || "0");
        const transport = parseFloat(getCol(cols, "transportallowance", "transport").replace(/[₦,]/g, "") || "0");
        const other = parseFloat(getCol(cols, "otherallowance", "other").replace(/[₦,]/g, "") || "0");
        const sum = basic + housing + transport + other;
        if (sum > 0) monthlyAmount = sum;
        else {
          monthlyAmount = parseFloat(cols[6]?.replace(/[₦,]/g, "") || cols[3]?.replace(/[₦,]/g, "") || "0");
        }
      }

      const bankName = getCol(cols, "bankname", "bank") || cols[7] || "";
      const bankAccount = (getCol(cols, "accountnumber", "bankaccount", "accountno") || cols[8] || "").replace(/[^0-9]/g, "");
      const accountName = getCol(cols, "accountname") || cols[9] || name;
      const email = getCol(cols, "email") || cols[10] || "";
      const phone = getCol(cols, "phone", "phonenumber") || cols[11] || "";
      const tin = getCol(cols, "tin", "taxid") || cols[12] || "";
      const pfaName = getCol(cols, "pfaname", "pfa", "pensionadministrator") || cols[13] || "";
      const pensionPin = getCol(cols, "pensionpin", "pin", "rsa") || cols[14] || "";

      const type = normalizePayeeType(rawType);
      let taxStatus: TaxStatus = getDefaultTaxStatus(type);

      if (rawTaxStatus) {
        const tsLower = rawTaxStatus.toLowerCase();
        if (tsLower.includes("wht") || tsLower.includes("withholding")) {
          taxStatus = "WHT";
        } else if (tsLower.includes("none") || tsLower.includes("exempt") || tsLower === "0") {
          taxStatus = "None";
        } else if (tsLower.includes("paye")) {
          taxStatus = "PAYE";
        }
      }

      const dateOnboarded =
        rawDate && rawDate.length >= 8
          ? rawDate
          : new Date().toISOString().split("T")[0];

      // Validation
      const errors: string[] = [];
      if (!name) errors.push("Missing Name");
      if (isNaN(monthlyAmount) || monthlyAmount <= 0) errors.push("Invalid Salary");
      if (!bankName) errors.push("Missing Bank Name");
      if (!bankAccount || bankAccount.length < 10) errors.push("Invalid Account Number (min 10 digits)");

      rows.push({
        index: idx + 1,
        name,
        type,
        role,
        monthlyAmount: isNaN(monthlyAmount) ? 0 : monthlyAmount,
        dateOnboarded,
        bankName,
        bankAccount,
        accountName,
        taxStatus,
        email,
        phone,
        tin,
        pfaName,
        pensionPin,
        isValid: errors.length === 0,
        errors,
      });
    });

    setParsedRows(rows);
  };

  /* -------------------------------------------------------------------------- */
  /* File Handlers                                                              */
  /* -------------------------------------------------------------------------- */

  const validateFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a valid .csv file.");
      return false;
    }
    return true;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !validateFile(file)) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processCSVText(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file || !validateFile(file)) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processCSVText(text);
    };
    reader.readAsText(file);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setIsDragging(false);
    setParsedRows([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  /* -------------------------------------------------------------------------- */
  /* Commit Import                                                              */
  /* -------------------------------------------------------------------------- */

  const validRows = parsedRows.filter((r) => r.isValid);
  const invalidRows = parsedRows.filter((r) => !r.isValid);

  const handleCommitImport = () => {
    if (!selectedFile) return;

    if (parsedRows.length === 0) {
      toast.error("No valid payee data found in the file.");
      return;
    }

    if (validRows.length === 0) {
      toast.error("None of the rows in the CSV are valid. Please check required fields.");
      return;
    }

    setIsProcessing(true);

    try {
      const payeesToImport: UnifiedPayee[] = validRows.map((r, i) => {
        const basic = r.type === "Permanent" ? Math.round(r.monthlyAmount * 0.5) : undefined;
        const housing = r.type === "Permanent" ? Math.round(r.monthlyAmount * 0.3) : undefined;
        const transport = r.type === "Permanent" ? Math.round(r.monthlyAmount * 0.2) : undefined;

        const calc = calculatePayeeDeductions({
          type: r.type,
          grossSalary: r.monthlyAmount,
          basicSalary: basic,
          housingAllowance: housing,
          transportAllowance: transport,
          taxStatus: r.taxStatus,
          taxable: true,
        });

        return {
          id: `PAYEE-BULK-${Date.now()}-${i + 1}`,
          name: r.name,
          type: r.type,
          role: r.role,
          dateOnboarded: r.dateOnboarded,
          joinDate: r.dateOnboarded,
          employmentType: "Full-time",
          status: "Active",
          onPayroll: true,
          email: r.email || `${r.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          phone: r.phone || "+234 800 000 0000",
          stateOfResidence: "Lagos",
          bankName: r.bankName,
          bankAccount: r.bankAccount,
          accountName: r.accountName || r.name,
          taxStatus: r.taxStatus,
          taxable: true,
          taxType: r.taxStatus === "WHT" ? "WHT" : r.taxStatus === "None" ? "EXEMPT" : "PAYE",
          grossSalary: r.monthlyAmount,
          basicSalary: basic,
          housingAllowance: housing,
          transportAllowance: transport,
          statutory: {
            tin: r.tin || undefined,
            pensionPin: r.pensionPin || undefined,
            pfaName: r.pfaName || undefined,
          },
          deductions: calc.deductions,
          netSalary: calc.netSalary,
          paymentHistory: [],
        };
      });

      addPayees(payeesToImport);
      toast.success(
        `Successfully imported ${validRows.length} ${
          validRows.length === 1 ? "payee" : "payees"
        }!`
      );
      if (invalidRows.length > 0) {
        toast.info(
          `${invalidRows.length} rows were skipped due to validation issues.`
        );
      }
      onSuccess?.();
      handleClose();
    } catch {
      toast.error("An error occurred during import.");
    } finally {
      setIsProcessing(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Render (100% Visual Fidelity to media_1790771076461.png)                  */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[520px] overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-xl font-bold text-[#263342]">
            Bulk Upload Payees
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
        <div className="px-8 pb-6">
          {/* CSV Template Format Box */}
          <div className="rounded-md bg-[#F2F4F7] px-4 py-4">
            <h3 className="text-sm font-semibold text-[#344054]">
              CSV Template Format
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#667085]">
              Required columns:{" "}
              <span className="font-semibold text-[#475467]">
                Name, Classification, Role, EmploymentType, DateOnboarded,
                TaxStatus, MonthlyGross, BankName, AccountNumber, AccountName
              </span>
            </p>
          </div>

          {/* Download CSV Template Button */}
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="mt-4 flex h-10 items-center gap-2 rounded-md border border-[#A8D5F5] bg-white px-4 text-sm font-medium text-[#1683D8] transition hover:bg-[#F0F9FF]"
          >
            <Download size={16} />
            <span>Download CSV Template</span>
          </button>

          {/* Upload CSV File Label */}
          <p className="mb-2 mt-6 text-sm font-medium text-[#475467]">
            Upload CSV File
          </p>

          {/* Drop Zone */}
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
                  {validRows.length > 0 && (
                    <span className="ml-1 text-[#16a34a] font-medium">
                      ({validRows.length} valid)
                    </span>
                  )}
                  {invalidRows.length > 0 && (
                    <span className="ml-1 text-[#b91c1c] font-medium">
                      ({invalidRows.length} issues)
                    </span>
                  )}
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

          {/* Action Footer Buttons */}
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
              disabled={!selectedFile || isProcessing || (parsedRows.length > 0 && validRows.length === 0)}
              onClick={handleCommitImport}
              className={`h-11 rounded-md px-5 text-sm font-medium text-white transition ${
                selectedFile && !isProcessing && !(parsedRows.length > 0 && validRows.length === 0)
                  ? "bg-[#1683D8] hover:bg-[#0F74C2]"
                  : "cursor-not-allowed bg-[#C5D0D9]"
              }`}
            >
              {isProcessing ? "Importing..." : "Import Payees"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
