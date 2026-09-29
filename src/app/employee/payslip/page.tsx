"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  downloadEmployeePayslipPdf,
  getEmployeePayslipDetail,
  getEmployeePayslips,
} from "@/lib/api/employee";
import {
  EmployeePayslipDetail,
  EmployeePayslipItem,
  EmployeePayslipsData,
  NetPayTrendItem,
} from "@/lib/api/types/employeeTypes";

function formatCurrency(amount: number, currency: string = "NGN") {
  const symbol = currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${(amount ?? 0).toLocaleString("en-NG")}`;
}

function formatKilo(value: number) {
  if (value >= 1000) {
    return `₦${Math.round(value / 1000)}k`;
  }
  return `₦${value}`;
}

function getStatusBadge(status: string) {
  const s = (status || "").toUpperCase();
  if (s === "APPROVED") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 border border-green-200">
        Approved
      </span>
    );
  }
  if (s === "PAID") {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
        Paid
      </span>
    );
  }
  if (s === "PENDING") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-700 border border-gray-200">
      {status}
    </span>
  );
}

function YearFilter({
  availableYears,
  selectedYear,
  onSelect,
}: {
  availableYears: number[];
  selectedYear: number;
  onSelect: (year: number) => void;
}) {
  const years = availableYears.length > 0 ? availableYears : [selectedYear];

  return (
    <div className="flex items-center gap-3 py-4">
      <span className="text-sm text-[#667085]">Filter by year:</span>
      <div className="flex gap-2">
        {years.map((year) => {
          const active = year === selectedYear;
          return (
            <button
              key={year}
              type="button"
              onClick={() => onSelect(year)}
              className={`h-8 rounded-md px-4 text-sm font-medium transition ${
                active
                  ? "bg-[#1683D8] text-white"
                  : "border border-[#D9DEE7] bg-white text-[#344054] hover:bg-[#F9FAFB]"
              }`}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NetPayChart({
  trend,
  loading,
}: {
  trend: NetPayTrendItem[];
  loading: boolean;
}) {
  const chartData = (trend || []).map((item) => ({
    month: item.period
      ? item.period.split(" ")[0].slice(0, 3)
      : `M${item.month}`,
    net: item.netPay ?? 0,
    fullPeriod: item.period,
    currency: item.currency,
  }));

  const subtitle =
    trend && trend.length > 0
      ? trend.length === 1
        ? trend[0].period
        : `${trend[0].period} – ${trend[trend.length - 1].period}`
      : "Recent pay history";

  const maxNet =
    trend.length > 0 ? Math.max(...trend.map((t) => t.netPay || 0)) : 0;
  const upperDomain = Math.max(
    360000,
    Math.ceil((maxNet * 1.2) / 10000) * 10000,
  );

  if (loading) {
    return (
      <div className="rounded-lg border border-[#EAECF0] bg-white p-6 shadow-sm animate-pulse">
        <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-36 bg-gray-100 rounded mb-6" />
        <div className="h-64 w-full bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#EAECF0] bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-[#1D2433]">
        Net Pay — Last 6 Months
      </h2>
      <p className="mt-1 text-sm text-[#98A2B3]">{subtitle}</p>

      <div className="mt-6 h-64">
        {chartData.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-gray-500">
              No net pay trend data available
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Approved payslips will automatically populate this trend chart.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="28%">
              <CartesianGrid vertical={false} stroke="#EEF1F5" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#98A2B3", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                domain={[0, upperDomain]}
                tickFormatter={formatKilo}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#98A2B3", fontSize: 11 }}
                width={56}
              />
              <Bar dataKey="net" fill="#2388D0" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function SummaryField({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <span className="text-sm text-[#667085]">
      {label}{" "}
      <span className={`font-semibold ${valueClassName ?? "text-[#1D2433]"}`}>
        {value}
      </span>
    </span>
  );
}

function PayslipCard({
  payslip,
  expanded,
  onToggle,
}: {
  payslip: EmployeePayslipItem;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [detail, setDetail] = useState<EmployeePayslipDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (expanded && !detail && !loadingDetail) {
      setLoadingDetail(true);
      getEmployeePayslipDetail(payslip.id)
        .then((res) => {
          if (isMounted) {
            setDetail(res);
          }
        })
        .catch(() => {
          // Gracefully fallback to summary figures if breakdown is unavailable
        })
        .finally(() => {
          if (isMounted) {
            setLoadingDetail(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [expanded, detail, loadingDetail, payslip.id]);

  const handleDownloadPdf = async () => {
    if (!payslip.canDownload || downloading) return;
    setDownloading(true);
    try {
      const blob = await downloadEmployeePayslipPdf(payslip.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safePeriod = (
        payslip.period || `${payslip.month}-${payslip.year}`
      ).replace(/[^a-zA-Z0-9-_]/g, "_");
      a.download = `Payslip_${safePeriod}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Payslip PDF downloaded successfully.");
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to download payslip PDF.";
      toast.error(errMsg);
    } finally {
      setDownloading(false);
    }
  };

  const currency = detail?.currency || payslip.currency;
  const grossAmount = detail?.grossPay ?? payslip.grossPay;
  const deductionsAmount = detail?.totalDeductions ?? payslip.totalDeductions;
  const netAmount = detail?.netPay ?? payslip.netPay;

  const earningsList =
    detail?.earnings && detail.earnings.length > 0 ? detail.earnings : null;
  const deductionsList =
    detail?.deductions && detail.deductions.length > 0
      ? detail.deductions
      : null;

  return (
    <div className="rounded-lg border border-[#EAECF0] bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-[#1D2433]">
              {payslip.period || `${payslip.month}/${payslip.year}`}
            </h3>
            {getStatusBadge(payslip.status)}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1">
            <SummaryField
              label="Gross"
              value={formatCurrency(grossAmount, currency)}
            />
            <SummaryField
              label="Deductions"
              value={`-${formatCurrency(deductionsAmount, currency)}`}
              valueClassName="text-[#F04438]"
            />
            <SummaryField
              label="Net Pay"
              value={formatCurrency(netAmount, currency)}
              valueClassName="text-[#12B76A]"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            disabled={!payslip.canDownload || downloading}
            onClick={handleDownloadPdf}
            className={`flex h-9 items-center gap-1.5 rounded-md border border-[#D9DEE7] bg-white px-3.5 text-sm font-medium transition ${
              payslip.canDownload && !downloading
                ? "text-[#1683D8] hover:bg-[#F5FAFF]"
                : "text-[#98A2B3] opacity-60 cursor-not-allowed"
            }`}
          >
            <Download
              size={15}
              className={downloading ? "animate-bounce" : ""}
            />
            {downloading ? "Downloading..." : "Download PDF"}
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="flex h-9 items-center gap-1.5 rounded-md border border-[#D9DEE7] bg-white px-3.5 text-sm font-medium text-[#344054] transition hover:bg-[#F9FAFB]"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            {expanded ? "Hide" : "View Full Breakdown"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#EAECF0] px-6 pb-6 pt-5">
          {loadingDetail ? (
            <div className="space-y-3 py-4 animate-pulse">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-full max-w-sm bg-gray-100 rounded" />
              <div className="h-3 w-full max-w-xs bg-gray-100 rounded" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              {/* Earnings */}
              <div>
                <h4 className="text-sm font-bold text-[#1D2433]">
                  Earnings & Allowances
                </h4>
                <div className="mt-3 divide-y divide-[#F0F2F5]">
                  {earningsList ? (
                    earningsList.map((item, idx) => (
                      <div
                        key={item.code || idx}
                        className="flex items-center justify-between py-2.5 text-sm"
                      >
                        <span className="text-[#667085]">
                          {item.name || item.code}
                        </span>
                        <span className="text-[#1D2433] font-medium">
                          {formatCurrency(item.amount, currency)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-[#667085]">Gross Earnings</span>
                      <span className="text-[#1D2433] font-medium">
                        {formatCurrency(grossAmount, currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2.5 text-sm font-bold text-[#1D2433]">
                    <span>Total Gross Pay</span>
                    <span>{formatCurrency(grossAmount, currency)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h4 className="text-sm font-bold text-[#1D2433]">
                  Deductions & Withholdings
                </h4>
                <div className="mt-3 divide-y divide-[#F0F2F5]">
                  {deductionsList ? (
                    deductionsList.map((item, idx) => (
                      <div
                        key={item.code || idx}
                        className="flex items-center justify-between py-2.5 text-sm"
                      >
                        <span className="text-[#667085]">
                          {item.name || item.code}
                        </span>
                        <span className="text-[#F04438] font-medium">
                          -{formatCurrency(item.amount, currency)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-[#667085]">
                        Statutory & Voluntary Deductions
                      </span>
                      <span className="text-[#F04438] font-medium">
                        -{formatCurrency(deductionsAmount, currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2.5 text-sm font-bold text-[#1D2433]">
                    <span>Total Deductions</span>
                    <span className="text-[#F04438]">
                      -{formatCurrency(deductionsAmount, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between rounded-md border border-[#BBF0D0] bg-[#EAF9EF] px-5 py-4">
            <span className="text-sm font-bold text-[#1D2433]">Net Pay</span>
            <span className="text-lg font-bold text-[#12B76A]">
              {formatCurrency(netAmount, currency)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyPayslipsPage() {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [data, setData] = useState<EmployeePayslipsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchPayslips = useCallback(async (yearToFetch: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEmployeePayslips({ year: yearToFetch });
      setData(result);
      if (result.selectedYear) {
        setSelectedYear(result.selectedYear);
      }
      // Expand first payslip by default if available
      if (result.payslips && result.payslips.length > 0) {
        setExpandedId(result.payslips[0].id);
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Failed to load payslips. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayslips(selectedYear);
  }, [fetchPayslips, selectedYear]);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-6 py-8 sm:px-10">
      <div className="mx-auto">
        <header>
          <h1 className="text-2xl font-bold text-[#1D2433]">My Payslips</h1>
          <p className="mt-1 text-sm text-[#98A2B3]">
            View and download your monthly payslips
          </p>
        </header>

        {error && (
          <div className="mt-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => fetchPayslips(selectedYear)}
              className="font-medium underline hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mt-6">
          <NetPayChart
            trend={data?.netPayTrend || []}
            loading={loading && !data}
          />
        </div>

        <YearFilter
          availableYears={data?.availableYears || []}
          selectedYear={selectedYear}
          onSelect={handleYearChange}
        />

        {loading && !data ? (
          <div className="flex flex-col gap-5 pb-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 w-full rounded-lg border border-[#EAECF0] bg-white p-6 shadow-sm animate-pulse"
              >
                <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
                <div className="h-3 w-64 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : data?.payslips && data.payslips.length > 0 ? (
          <div className="flex flex-col gap-5 pb-10">
            {data.payslips.map((payslip) => (
              <PayslipCard
                key={payslip.id}
                payslip={payslip}
                expanded={expandedId === payslip.id}
                onToggle={() => toggle(payslip.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-[#EAECF0] bg-white p-12 text-center shadow-sm pb-10">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#1683D8]">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-[#1D2433]">
              No payslips found for {selectedYear}
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[#667085]">
              There are no finalized payslips for this year. Approved payslips
              will appear here once payroll is processed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
