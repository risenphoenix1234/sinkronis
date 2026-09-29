"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Download,
  Printer,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  parsePayslipRouteId,
} from "@/types/payroll/pay-run-data";
import { naira } from "@/types/payroll/payee-data";
import { toast } from "react-toastify";
import {
  getTenantPayslipDetail,
  downloadTenantPayslipPdf,
  TenantPayslipDetail,
} from "@/lib/api/payroll";

/* =========================================================
   CONSTANTS
========================================================= */

const statusStyles: Record<string, string> = {
  Paid: "bg-[#d8f5dc] text-[#16823b]",
  PAID: "bg-[#d8f5dc] text-[#16823b]",
  Pending: "bg-[#fef9c3] text-[#a16207]",
  PENDING: "bg-[#fef9c3] text-[#a16207]",
  Ready: "bg-[#e0e7ff] text-[#4338ca]",
  READY: "bg-[#e0e7ff] text-[#4338ca]",
  Failed: "bg-[#fee2e2] text-[#b91c1c]",
  FAILED: "bg-[#fee2e2] text-[#b91c1c]",
  APPROVED: "bg-[#ccfbf1] text-[#0f766e]",
};

/* =========================================================
   HELPERS
========================================================= */

const negative = (value: number) => `(${naira(value)})`;

/* =========================================================
   PAGE
========================================================= */

export default function PayslipView() {
  const router = useRouter();
  const params = useParams();

  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [apiPayslip, setApiPayslip] = useState<TenantPayslipDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Extract ID
  const { runId, slipId } = parsePayslipRouteId(idParam ?? "");
  const effectiveId = idParam?.includes("-") ? slipId : idParam;

  const fetchPayslip = useCallback(async () => {
    if (!effectiveId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await getTenantPayslipDetail(effectiveId);
      setApiPayslip(data);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (axiosErr.response?.status === 404) {
        setNotFound(true);
      } else if (axiosErr.response?.status === 403) {
        setError(
          "You do not have permission to view this payslip (payroll:payslips:view required).",
        );
      } else {
        setError(
          axiosErr.response?.data?.message ||
            "Failed to load payslip snapshot.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [effectiveId]);

  useEffect(() => {
    fetchPayslip();
  }, [fetchPayslip]);

  /* =======================================================
     LOADING STATE
  ======================================================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] p-6 text-[#263447]">
        <button
          type="button"
          onClick={() => router.push("/payroll/payslips")}
          className="mb-6 flex items-center gap-2 text-[14px] font-medium text-[#526477] transition hover:text-[#1682bd]"
        >
          <ArrowLeft size={18} />
          Back to Payslips
        </button>
        <div className="flex flex-col items-center justify-center py-24 text-[#9ca3af]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1683d8]" />
          <p className="mt-3 text-sm font-medium text-[#4b5563]">
            Loading payslip snapshot...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */
  if (error && !apiPayslip) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] p-6 text-[#263447]">
        <button
          type="button"
          onClick={() => router.push("/payroll/payslips")}
          className="mb-6 flex items-center gap-2 text-[14px] font-medium text-[#526477] transition hover:text-[#1682bd]"
        >
          <ArrowLeft size={18} />
          Back to Payslips
        </button>
        <div className="mx-auto max-w-[500px] rounded-lg border border-[#fecaca] bg-[#fef2f2] p-6 text-center text-sm text-[#991b1b]">
          <AlertCircle className="mx-auto mb-2 h-6 w-6 text-[#ef4444]" />
          <p className="font-semibold">{error}</p>
          <button
            onClick={() => fetchPayslip()}
            className="mt-4 rounded-md bg-[#ef4444] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#dc2626]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */
  if (notFound || !apiPayslip) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] p-6 text-[#263447]">
        <button
          type="button"
          onClick={() => router.push("/payroll/payslips")}
          className="mb-6 flex items-center gap-2 text-[14px] font-medium text-[#526477] transition hover:text-[#1682bd]"
        >
          <ArrowLeft size={18} />
          Back to Payslips
        </button>

        <p className="text-[16px] text-[#9ca3af]">Payslip not found.</p>
      </div>
    );
  }

  /* =======================================================
     ACTIONS
  ======================================================= */

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!effectiveId) return;

    try {
      setDownloadingPdf(true);
      const blob = await downloadTenantPayslipPdf(effectiveId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeEmployeeName = (employeeName || "payslip").replace(/\s+/g, "_");
      const safePeriod = (period || "period").replace(/\s+/g, "_");
      a.download = `payslip_${safeEmployeeName}_${safePeriod}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Payslip PDF downloaded successfully");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosErr.response?.data?.message || "Failed to download payslip PDF",
      );
    } finally {
      setDownloadingPdf(false);
    }
  };

  /* =======================================================
     DERIVED DATA & CALCULATIONS
  ======================================================= */

  const employeeName = apiPayslip.employeeName;
  const departmentName = apiPayslip.departmentName || "General";
  const jobTitle = apiPayslip.jobTitle || "Employee";
  const bankInfo = `${apiPayslip.bankName || "Commercial Bank"} — ${apiPayslip.bankAccount || apiPayslip.accountNumber || "N/A"}`;
  const pfa = apiPayslip.pensionNumber
    ? `Stanbic IBTC Pension (${apiPayslip.pensionNumber})`
    : "Stanbic IBTC Pension";
  const reference = apiPayslip.employeeCode || `REF-${apiPayslip.id.slice(-6).toUpperCase()}`;
  const period = apiPayslip.period;
  const statusBadge = apiPayslip.status;
  const grossAmount = apiPayslip.grossPay ?? apiPayslip.gross ?? 0;
  const netAmount = apiPayslip.netPay ?? 0;

  /* =======================================================
     EARNINGS
  ======================================================= */

  const earnings =
    apiPayslip.earnings && apiPayslip.earnings.length > 0
      ? apiPayslip.earnings.map((e) => ({
          label: e.name,
          amount: naira(e.amount),
        }))
      : [
          {
            label: "Basic Salary",
            amount: naira(apiPayslip.basic ?? Math.round(grossAmount * 0.6)),
          },
          {
            label: "Housing Allowance",
            amount: naira(apiPayslip.housing ?? Math.round(grossAmount * 0.2)),
          },
          {
            label: "Transport Allowance",
            amount: naira(apiPayslip.transport ?? Math.round(grossAmount * 0.1)),
          },
          {
            label: "Other Allowance",
            amount: naira(
              apiPayslip.otherAllowances ??
                apiPayslip.other ??
                Math.round(grossAmount * 0.1),
            ),
          },
        ];

  /* =======================================================
     DEDUCTIONS
  ======================================================= */

  const totalDeductionsAmount = apiPayslip.totalDeductions ?? apiPayslip.deductions ?? 0;

  const deductions =
    apiPayslip.deductionsList && apiPayslip.deductionsList.length > 0
      ? apiPayslip.deductionsList.map((d) => ({
          label: d.name,
          amount: negative(d.amount),
          color: d.color || "text-[#293544]",
        }))
      : [
          {
            label: "PAYE (Income Tax)",
            amount: negative(apiPayslip.paye ?? 0),
            color: "text-red-500",
          },
          {
            label: "Pension (Employee 8%)",
            amount: negative(apiPayslip.pension ?? 0),
            color: "text-[#9b7100]",
          },
          {
            label: "NHF (2.5%)",
            amount: negative(apiPayslip.nhf ?? 0),
            color: "text-[#9b17bd]",
          },
          ...((apiPayslip.loans ?? 0) > 0
            ? [
                {
                  label: "Loan Repayment",
                  amount: negative(apiPayslip.loans ?? 0),
                  color: "text-[#c2410c]",
                },
              ]
            : []),
          {
            label: "Total Deductions",
            amount: negative(totalDeductionsAmount),
            color: "text-red-500",
          },
        ];

  const employerPension =
    apiPayslip.employerContributions?.find((c) =>
      c.name.toLowerCase().includes("pension"),
    )?.amount ?? Math.round(grossAmount * 0.1);
  const employerNsitf =
    apiPayslip.employerContributions?.find((c) =>
      c.name.toLowerCase().includes("nsitf"),
    )?.amount ?? Math.round(grossAmount * 0.01);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#263447]">
      {/* ===================================================
          ACTION BAR
      ================================================== */}

      <div className="flex items-center justify-between p-4 print:hidden">
        {/* Back */}

        <button
          type="button"
          onClick={() => router.push("/payroll/payslips")}
          className="flex items-center gap-2 text-[14px] font-medium text-[#526477] transition hover:text-[#1682bd]"
        >
          <ArrowLeft size={18} />
          Back to Payslips
        </button>

        {/* Actions */}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex h-11 items-center gap-2 rounded-md border border-[#d9e0e7] bg-white px-5 text-[14px] font-medium text-[#536274] transition hover:bg-[#f8fafc]"
          >
            <Printer size={17} />
            Print
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="flex h-11 items-center gap-2 rounded-md bg-[#087fbd] px-5 text-[14px] font-semibold text-white transition hover:bg-[#076fa7] disabled:opacity-60"
          >
            {downloadingPdf ? (
              <Loader2 size={17} className="animate-spin text-white" />
            ) : (
              <Download size={17} />
            )}
            {downloadingPdf ? "Downloading..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* ===================================================
          PAYSLIP CONTAINER
      ================================================== */}

      <main className="flex justify-center px-4 pb-12 sm:px-6">
        <div
          id="payslip"
          className="w-full max-w-[720px] overflow-hidden rounded-md border border-[#e1e6eb] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] print:max-w-none print:rounded-none print:border-0 print:shadow-none"
        >
          {/* =================================================
              COMPANY HEADER
          ================================================= */}

          <section className="flex min-h-[145px] items-center justify-between bg-gradient-to-r from-[#197db9] to-[#2087c5] px-8 py-7 text-white sm:px-10">
            {/* Company */}

            <div>
              <h1 className="text-[24px] font-bold tracking-[-0.4px]">
                Sinkronis Technologies Ltd
              </h1>

              <p className="mt-2 text-[13px] text-white/90">
                14 Adeola Odeku Street, Victoria Island, Lagos
              </p>

              <p className="mt-1 text-[13px] text-white/90">
                admin@sinkronis.com
              </p>
            </div>

            {/* Payslip */}

            <div className="text-right">
              <h2 className="text-[22px] font-bold tracking-wide">PAYSLIP</h2>

              <p className="mt-2 text-[13px] text-white/90">
                Pay Period: {period}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-4 py-1.5 text-[12px] font-semibold ${statusStyles[statusBadge] || "bg-[#d8f5dc] text-[#16823b]"}`}
              >
                {statusBadge}
              </span>
            </div>
          </section>

          {/* =================================================
              EMPLOYEE INFORMATION
          ================================================= */}

          <section className="grid grid-cols-1 gap-x-12 gap-y-6 border-b border-[#e5e9ed] px-8 py-7 sm:grid-cols-2 sm:px-10">
            <InfoItem label="EMPLOYEE NAME" value={employeeName} />

            <InfoItem label="DEPARTMENT" value={departmentName} />

            <InfoItem label="ROLE / POSITION" value={jobTitle} />

            <InfoItem label="BANK" value={bankInfo} />

            <InfoItem label="PFA" value={pfa} />

            <InfoItem label="PAY REFERENCE" value={reference} />
          </section>

          {/* =================================================
              EARNINGS & DEDUCTIONS
          ================================================= */}

          <section className="grid grid-cols-1 gap-10 px-8 py-8 sm:grid-cols-2 sm:px-10">
            {/* =================================================
                EARNINGS
            ================================================= */}

            <BreakdownSection title="EARNINGS">
              {earnings.map((item) => (
                <BreakdownRow
                  key={item.label}
                  label={item.label}
                  amount={item.amount}
                />
              ))}

              {/* Gross Salary */}

              <div className="flex items-center justify-between pt-4">
                <span className="text-[14px] font-bold text-[#263447]">
                  Gross Salary
                </span>

                <span className="text-[15px] font-bold text-[#087fbd]">
                  {naira(grossAmount)}
                </span>
              </div>
            </BreakdownSection>

            {/* =================================================
                DEDUCTIONS
            ================================================= */}

            <BreakdownSection title="DEDUCTIONS">
              {deductions.map((item) => (
                <BreakdownRow
                  key={item.label}
                  label={item.label}
                  amount={item.amount}
                  amountClass={item.color}
                />
              ))}
            </BreakdownSection>
          </section>

          {/* =================================================
              NET PAY
          ================================================= */}

          <section className="px-8 pb-6 sm:px-10">
            <div className="flex min-h-[90px] items-center justify-between rounded-md border border-[#bce6c7] bg-[#effbf2] px-6">
              <span className="text-[16px] font-bold tracking-wide text-[#263447]">
                NET PAY
              </span>

              <span className="text-[28px] font-bold text-[#21843a]">
                {naira(netAmount)}
              </span>
            </div>
          </section>

          {/* =================================================
              EMPLOYER CONTRIBUTIONS
          ================================================= */}

          <section className="px-8 pb-7 sm:px-10">
            <div className="rounded-md border border-[#e0e5e9] bg-[#fafbfc] px-5 py-5">
              <p className="text-[11px] font-bold tracking-wide text-[#92a0b0]">
                EMPLOYER CONTRIBUTIONS
              </p>

              <p className="mt-1 text-[12px] text-[#92a0b0]">
                Not deducted from employee salary
              </p>

              <div className="mt-4 flex flex-col gap-3 text-[13px] text-[#617287] sm:flex-row sm:gap-8">
                <p>
                  Pension (10%):{" "}
                  <span className="font-semibold text-[#263447]">
                    {naira(employerPension)}
                  </span>
                </p>

                <p>
                  NSITF (1%):{" "}
                  <span className="font-semibold text-[#263447]">
                    {naira(employerNsitf)}
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="border-t border-[#e4e8ec] px-8 py-6 text-center sm:px-10">
            <p className="text-[11px] leading-5 text-[#94a0ad]">
              This is a computer-generated payslip and does not require a
              signature. For queries, contact HR at hr@sinkronis.com
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   BREAKDOWN SECTION
========================================================= */

type BreakdownSectionProps = {
  title: string;
  children: React.ReactNode;
};

function BreakdownSection({ title, children }: BreakdownSectionProps) {
  return (
    <div>
      <h3 className="mb-4 text-[14px] font-bold tracking-wide text-[#263447]">
        {title}
      </h3>

      <div>{children}</div>
    </div>
  );
}

/* =========================================================
   BREAKDOWN ROW
========================================================= */

type BreakdownRowProps = {
  label: string;
  amount: string;
  amountClass?: string;
};

function BreakdownRow({
  label,
  amount,
  amountClass = "text-[#293544]",
}: BreakdownRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-dotted border-[#dfe4e9] py-3 text-[13px]">
      <span className="text-[#617287]">{label}</span>

      <span className={`font-semibold ${amountClass}`}>{amount}</span>
    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

type InfoItemProps = {
  label: string;
  value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.6px] text-[#91a0b0]">
        {label}
      </p>

      <p className="mt-2 text-[14px] font-medium leading-5 text-[#293544]">
        {value}
      </p>
    </div>
  );
}
