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

type Row = { label: string; value: number };

const asRec = (v: unknown): PayrollRecord | undefined => (v && typeof v === "object" && !Array.isArray(v) ? (v as PayrollRecord) : undefined);

const itemRows = (v: unknown): Row[] => {
  if (!Array.isArray(v)) return [];
  return v
    .map((i) => {
      const rec = asRec(i);
      const label = pickText(rec, ["name", "label", "code"]);
      const value = pickNum(rec, ["amount", "value"]);
      return label && value !== null ? { label, value } : null;
    })
    .filter((x): x is Row => x !== null);
};

const keyRows = (rec: PayrollRecord | undefined, rows: [string, string][]): Row[] =>
  rows
    .map(([label, key]) => ({ label, value: pickNum(rec, [key]) }))
    .filter((x): x is Row => x.value !== null);

function Section({ title, rows, total }: { title: string; rows: Row[]; total?: Row }) {
  const shown = rows.filter((x) => x.value !== 0);
  if (shown.length === 0 && !total) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{title}</h2>
      <dl className="divide-y divide-slate-100">
        {shown.map((x) => (
          <div key={x.label} className="flex items-center justify-between py-2.5 text-sm">
            <dt className="text-slate-500">{x.label}</dt>
            <dd className="font-medium text-slate-800">{naira(x.value)}</dd>
          </div>
        ))}
        {total && (
          <div className="flex items-center justify-between py-2.5 text-sm">
            <dt className="font-semibold text-slate-900">{total.label}</dt>
            <dd className="font-semibold text-slate-900">{naira(total.value)}</dd>
          </div>
        )}
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
  const earningsRec = asRec(slip?.earnings);
  const deductionsRec = asRec(slip?.deductions);
  const employerRec = asRec(slip?.employerContributions);
  const paymentRec = asRec(slip?.payment);
  const earningRows = itemRows(earningsRec?.items);
  const deductionRows = [
    ...keyRows(deductionsRec, [
      ["PAYE", "paye"],
      ["Employee Pension", "employeePension"],
      ["NHF", "nhf"],
      ["Loans", "loans"],
      ["Other Deductions", "customDeductions"],
    ]),
    ...itemRows(deductionsRec?.items),
  ];
  const employerRows = [
    ...keyRows(employerRec, [
      ["Employer Pension", "employerPension"],
      ["NSITF", "nsitf"],
    ]),
    ...itemRows(employerRec?.others),
  ];
  const gross = pickNum(earningsRec, ["grossSalary"]) ?? pickNum(slip, ["grossPay"]);
  const totalDeductions = pickNum(deductionsRec, ["totalDeductions"]) ?? pickNum(slip, ["totalDeductions"]);
  const paidAt = pickText(paymentRec, ["paidAt"]);
  const reference = pickText(paymentRec, ["reference"]);

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
            <Section title="Earnings" rows={earningRows} total={gross !== null ? { label: "Gross Pay", value: gross } : undefined} />
            <Section title="Deductions" rows={deductionRows} total={totalDeductions !== null ? { label: "Total Deductions", value: totalDeductions } : undefined} />
            <Section title="Employer Contributions" rows={employerRows} />
          </div>

          {(paidAt || reference) && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-5 text-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-900">Payment</h2>
              <dl className="divide-y divide-slate-100">
                {paidAt && (
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-slate-500">Paid On</dt>
                    <dd className="font-medium text-slate-800">{new Date(paidAt).toLocaleDateString("en-GB")}</dd>
                  </div>
                )}
                {reference && (
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-slate-500">Reference</dt>
                    <dd className="font-medium text-slate-800">{reference}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </>
      )}
    </div>
  );
}