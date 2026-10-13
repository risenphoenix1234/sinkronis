// src/app/payroll/invite-payee/page.tsx
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiFileText, FiUploadCloud } from "react-icons/fi";
import { bulkCreatePayrollPayees, getApiErrorMessage } from "@/lib/api/payroll";
import type { ExternalPayeeBody } from "@/lib/api/types/payroll.types";

const MAX_BYTES = 20 * 1024 * 1024;
const MAX_ROWS = 500;
const normalizePhone = (value: string) => {
  const digits = value.replace(/[^0-9+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  return digits;
};

const TEMPLATE_HEADER = "Type,Name,Role,Email,Phone Number,Bank Name,Account Number,Tax ID,Monthly Amount";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((v) => v.trim() !== "")) rows.push(row);
  return rows;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const FIELD_ALIASES: Record<string, string[]> = {
  type: ["type", "payeetype"],
  name: ["name", "fullname", "payeename"],
  role: ["role", "externalrole", "jobtitle"],
  email: ["email", "emailaddress"],
  phone: ["phone", "phonenumber"],
  bank: ["bankname", "bank"],
  account: ["accountnumber", "account"],
  tin: ["taxid", "tin"],
  amount: ["monthlyamount", "amount", "grosssalary", "salary"],
};

type Parsed = { payees: ExternalPayeeBody[]; problems: string[] };

function parsePayees(text: string): Parsed {
  const rows = parseCsv(text);
  if (rows.length < 2) return { payees: [], problems: ["The file has no payee rows."] };
  if (rows.length - 1 > MAX_ROWS) return { payees: [], problems: [`The file has more than ${MAX_ROWS} rows.`] };

  const header = rows[0].map(norm);
  const col: Record<string, number> = {};
  for (const [key, aliases] of Object.entries(FIELD_ALIASES)) {
    col[key] = header.findIndex((h) => aliases.includes(h));
  }
  const missing = ["type", "name", "amount"].filter((k) => col[k] === -1);
  if (missing.length) {
    return { payees: [], problems: [`Missing column(s): ${missing.join(", ")}. Use the bulk template.`] };
  }

  const payees: ExternalPayeeBody[] = [];
  const problems: string[] = [];
  rows.slice(1).forEach((r, idx) => {
    const line = idx + 2;
    const get = (k: string) => (col[k] >= 0 ? (r[col[k]] ?? "").trim() : "");
    const type = get("type").toUpperCase();
    const name = get("name");
    const amount = Number(get("amount").replace(/[,₦\s]/g, ""));
    const account = get("account");

    if (type !== "CONTRACT" && type !== "CONSULTANT") return problems.push(`Row ${line}: Type must be Contract or Consultant.`);
    if (!name) return problems.push(`Row ${line}: Name is required.`);
    if (!Number.isFinite(amount) || amount <= 0) return problems.push(`Row ${line}: Monthly Amount must be greater than 0.`);
    if (account && !/^\d{10}$/.test(account)) return problems.push(`Row ${line}: Account Number must be 10 digits.`);

    payees.push({
      type,
      taxRegime: type === "CONTRACT" ? "WHT" : "EXEMPT",
      name,
      monthlyAmount: amount,
      status: "ACTIVE",
      onPayroll: true,
      ...(get("role") ? { externalRole: get("role") } : {}),
      ...(get("email") ? { email: get("email") } : {}),
      ...(get("phone") ? { phone: normalizePhone(get("phone")) } : {}),
      ...(get("bank") ? { bankName: get("bank") } : {}),
      ...(account ? { accountNumber: account } : {}),
      ...(get("tin") ? { tin: get("tin") } : {}),
    });
  });
  return { payees, problems };
}

export default function InvitePayeePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [done, setDone] = useState("");

  const pick = async (f: File | undefined) => {
    setDone("");
    setParsed(null);
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".csv")) return setError("Only .csv files are supported.");
    if (f.size > MAX_BYTES) return setError("File is larger than 20MB.");
    setError("");
    setFile(f);
    setParsed(parsePayees(await f.text()));
  };

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_HEADER + "\n"], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payee-bulk-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const submit = async () => {
    if (submittingRef.current || !parsed || parsed.problems.length > 0 || parsed.payees.length === 0) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      const res = await bulkCreatePayrollPayees(parsed.payees);
      setDone(res.message || `${parsed.payees.length} payees added.`);
      setTimeout(() => router.push("/payroll/payees"), 1200);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not upload the payees."));
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const ready = parsed && parsed.problems.length === 0 && parsed.payees.length > 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Add New Payee</h1>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-700">
            <FiFileText size={13} /> Upload
          </div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pick(e.dataTransfer.files?.[0]);
            }}
            onClick={() => inputRef.current?.click()}
            className={`flex h-72 cursor-pointer items-center justify-center rounded-lg border border-dashed px-6 text-center ${
              dragging ? "border-[#2183C6] bg-[#2183C6]/5" : "border-slate-300 bg-slate-50"
            }`}
          >
            <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
            <div className="flex items-center gap-4">
              <FiUploadCloud size={32} className="text-[#2183C6]" />
              <div className="text-left">
                <p className="text-sm font-medium text-slate-800">{file ? file.name : "Upload or Drag and Drop Payee details"}</p>
                <p className="mt-1 text-[11px] text-slate-500">Maximum File Size is 20MB</p>
                <p className="text-[11px] text-slate-500">Supported File Type is .csv</p>
              </div>
            </div>
          </div>

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          {done && <p className="mt-2 text-xs text-green-600">{done}</p>}
          {parsed && parsed.problems.length > 0 && (
            <div className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
              {parsed.problems.slice(0, 6).map((p) => (
                <p key={p}>{p}</p>
              ))}
              {parsed.problems.length > 6 && <p>and {parsed.problems.length - 6} more.</p>}
            </div>
          )}
          {ready && !done && <p className="mt-2 text-xs text-slate-600">{parsed.payees.length} payees ready to upload.</p>}

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={downloadTemplate} className="rounded-md bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
              Download Bulk Template
            </button>
            <Link href="/payroll/invite-payee/form" className="rounded-md bg-[#2183C6] px-5 py-2 text-sm font-medium text-white hover:opacity-90">
              Invite Payee Via Form
            </Link>
          </div>
          {ready && !done && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={submit}
                disabled={submitting}
                className="rounded-md border border-[#2183C6] px-5 py-2 text-sm font-medium text-[#2183C6] hover:bg-[#2183C6]/5 disabled:opacity-50"
              >
                {submitting ? "Uploading…" : "Submit Upload"}
              </button>
            </div>
          )}
        </div>

        <div className="hidden items-center justify-center rounded-lg bg-[#E3F6FA] lg:flex">
          <FiUploadCloud size={96} className="text-[#2183C6]/40" />
        </div>
      </div>
    </div>
  );
}