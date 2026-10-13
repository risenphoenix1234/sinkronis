// src/app/payroll/payslips/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import PayslipStatusBadge from "@/components/payroll/payslips/PayslipStatusBadge";
import { downloadBlob } from "@/components/payroll/payee-edit/utils";
import { downloadPayslipFile, getApiErrorMessage, getPayslipDetail } from "@/lib/api/payroll";
import { pickNum, pickText } from "@/lib/payroll-pick";
import type { PayrollRecord } from "@/lib/api/types/payroll.types";

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

const earnings: [string, string[]][] = [
  ["Base Compensation", ["baseCompensation", "basicSalary", "baseSalary"]],
  ["Bonus", ["bonus", "totalBonus"]],
  ["Gross Pay", ["cashGross", "grossPay", "gross"]],
];

const deductions: [string, string[]][] = [
  ["PAYE", ["paye"]],
  ["Withholding Tax", ["wht"]],
  ["Employee Pension", ["employeePension", "pension"]],
  ["NHF", ["nhf"]],
  ["AVC", ["avc"]],
  ["Loans", ["loans"]],
  ["Other Deductions", ["customDeductions", "otherDeductions"]],
];

const employer: [string, string[]][] = [
  ["Employer Pension", ["employerPension"]],
  ["NSITF", ["nsitf"]],
];

function Section({ title, rows, r }: { title: string; rows: [string, string[]][]; r: PayrollRecord }) {
  const shown = rows.map(([label, keys]) => ({ label, value: pickNum(r, keys) })).filter((x) => x.value !== null);
  if (shown.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{title}</h2>
      <dl className="divide-y divide-slate-100">
        {shown.map((x) => (
          <div key={x.label} className="flex items-center justify-between py-2.5 text-sm">
            <dt className="text-slate-500">{x.label}</dt>
            <dd className="font-medium text-slate-800">{naira(x.value as number)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function PayslipDetailPage() {
  const params = useParams<{ id: string }>();
  const [slip, setSlip] = useState<PayrollRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPayslipDetail(params.id)
      .then((d) => {
        if (!cancelled) setSlip(d);
      })
      .catch((e) => {
        if (!cancelled) setError(getApiErrorMessage(e, "Could not load this payslip."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const emp = slip?.employee as PayrollRecord | undefined;
  const name = pickText(slip, ["employeeName", "displayName", "fullName", "name"]) ?? pickText(emp, ["fullName", "name"]) ?? "Payslip";
  const periodObj = slip?.period as PayrollRecord | undefined;
  const period = pickText(slip, ["periodLabel", "payPeriod"]) ?? pickText(periodObj, ["label"]) ?? (typeof slip?.period === "string" ? slip.period : "-");
  const net = slip ? pickNum(slip, ["netPay", "net"]) : null;

  const download = async () => {
    try {
      downloadBlob(await downloadPayslipFile(params.id), `payslip-${name.replace(/\s+/g, "-").toLowerCase()}.pdf`);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not download this payslip."));
    }
  };

  return (
    <div className="p-6">
      <Link href="/payroll/payslips" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
        <FiArrowLeft size={13} /> Back to Payslips
      </Link>

      {loading && <p className="mt-6 text-sm text-slate-400">Loading payslip…</p>}
      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      {slip && (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{name}</h1>
              <p className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                {period}
                <PayslipStatusBadge status={pickText(slip, ["status"])} />
              </p>
            </div>
            <button onClick={download} className="flex items-center gap-2 rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              <FiDownload size={14} /> Download PDF
            </button>
          </div>

          {net !== null && (
            <div className="mt-6 inline-block rounded-lg border border-slate-200 bg-white px-6 py-4">
              <p className="text-xs text-slate-500">Net Pay</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{naira(net)}</p>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Section title="Earnings" rows={earnings} r={slip} />
            <Section title="Deductions" rows={deductions} r={slip} />
            <Section title="Employer Contributions" rows={employer} r={slip} />
          </div>
        </>
      )}
    </div>
  );
}