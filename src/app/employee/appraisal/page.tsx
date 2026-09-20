"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Check, Eye } from "lucide-react";
import ViewMyAppraisal, {
  AppraisalDetailData,
} from "@/components/employee/appraisal/viewMyAppraisal";
import { getEmployeeAppraisalHistory } from "@/lib/api/employee";
import {
  EmployeeAppraisalHistoryItem,
  EmployeeAppraisalPagination,
} from "@/lib/api/types/employeeTypes";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    const cleanDateStr = dateStr.split("T")[0];
    const [y, m, d] = cleanDateStr.split("-").map(Number);
    if (!y || !m || !d) return dateStr;
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getCycleName(item: EmployeeAppraisalHistoryItem): string {
  if (item.cycleName) return item.cycleName;
  if (typeof item.cycle === "string" && item.cycle) return item.cycle;
  if (typeof item.cycle === "object" && item.cycle?.name) return item.cycle.name;
  return "Performance Review";
}

function getPeriod(item: EmployeeAppraisalHistoryItem): string {
  if (item.period) return item.period;
  if (item.periodStart && item.periodEnd) {
    return `${formatDate(item.periodStart)} – ${formatDate(item.periodEnd)}`;
  }
  if (typeof item.cycle === "object" && item.cycle?.periodFrom && item.cycle?.periodTo) {
    return `${formatDate(item.cycle.periodFrom)} – ${formatDate(item.cycle.periodTo)}`;
  }
  return "—";
}

function getFinalScore(item: EmployeeAppraisalHistoryItem): number | null {
  if (item.finalScore != null && !isNaN(Number(item.finalScore))) {
    return Math.round(Number(item.finalScore));
  }
  if (item.ratingValue != null && !isNaN(Number(item.ratingValue))) {
    return Number(item.ratingValue);
  }
  return null;
}

function getRatingLabel(item: EmployeeAppraisalHistoryItem): string {
  if (typeof item.rating === "object" && item.rating) {
    return item.rating.label || item.rating.key || "Completed";
  }
  if (typeof item.rating === "string" && item.rating) {
    return item.rating;
  }
  return "Completed";
}

function getDateCompleted(item: EmployeeAppraisalHistoryItem): string {
  const rawDate =
    item.dateCompleted ||
    item.completedAt ||
    (typeof item.cycle === "object" ? item.cycle?.submissionDeadline : null);
  return formatDate(rawDate);
}

const PHASES = [
  {
    step: 1,
    title: "Goal Setting",
    status: "completed",
  },
  {
    step: 2,
    title: "Self-Assessment",
    status: "active",
  },
  {
    step: 3,
    title: "Manager Review",
    status: "upcoming",
  },
  {
    step: 4,
    title: "HR Approval",
    status: "upcoming",
  },
  {
    step: 5,
    title: "Acknowledgment",
    status: "upcoming",
  },
];

export default function EmployeeAppraisalPage() {
  const [selectedAppraisalId, setSelectedAppraisalId] = useState<string | null>(null);
  const [selectedAppraisal, setSelectedAppraisal] =
    useState<AppraisalDetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [history, setHistory] = useState<EmployeeAppraisalHistoryItem[]>([]);
  const [pagination, setPagination] =
    useState<EmployeeAppraisalPagination | null>(null);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const fetchAppraisalHistory = useCallback(async () => {
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await getEmployeeAppraisalHistory({ page: 1, limit: 10 });
      setHistory(res.data || []);
      setPagination(res.pagination || null);
    } catch (err: unknown) {
      console.error("Failed to load appraisal history:", err);
      setHistoryError(
        err instanceof Error
          ? err.message
          : "Failed to load appraisal history. Please try again.",
      );
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchAppraisalHistory();
  }, [fetchAppraisalHistory]);

  const handleView = (item: EmployeeAppraisalHistoryItem) => {
    const rawId = item.appraisalId || item.id;
    setSelectedAppraisalId(rawId ? String(rawId) : null);
    setSelectedAppraisal({
      cycle: getCycleName(item),
      period: getPeriod(item),
      finalScore: getFinalScore(item) ?? 0,
      rating: getRatingLabel(item),
      dateCompleted: getDateCompleted(item),
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D2433] sm:text-3xl">
            My Appraisal
          </h1>
          <p className="mt-1 text-sm text-[#98A2B3]">
            Track your performance goals and appraisal cycles
          </p>
        </header>

        {/* Active Appraisal Cycle Card */}
        <section className="mt-6 rounded-xl border border-[#EAECF0] bg-white p-6 shadow-sm sm:p-7">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#1D2433]">
                Q2 2026 Review
              </h2>
              <p className="mt-1 text-xs text-[#667085]">
                Period: 1 Apr – 30 Jun 2026 · Deadline: 15 July 2026
              </p>
            </div>

            <span className="inline-flex items-center rounded-full border border-[#FEDF89] bg-[#FFFAEB] px-3 py-1 text-xs font-semibold text-[#B54708]">
              In Progress
            </span>
          </div>

          {/* Stepper */}
          <div className="mt-8 flex items-center justify-between">
            {PHASES.map((phase, idx) => {
              const isLast = idx === PHASES.length - 1;
              const isCompleted = phase.status === "completed";
              const isActive = phase.status === "active";

              return (
                <div key={phase.step} className="flex flex-1 items-center">
                  {/* Step node */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                        isCompleted
                          ? "bg-[#1683D8] text-white"
                          : isActive
                            ? "border-2 border-[#1683D8] bg-white font-bold text-[#1683D8]"
                            : "border-2 border-[#D0D5DD] bg-white text-[#98A2B3]"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4 stroke-[2.5] text-white" />
                      ) : (
                        phase.step
                      )}
                    </div>
                    <span
                      className={`mt-2 whitespace-nowrap text-xs text-center ${
                        isActive
                          ? "font-bold text-[#1D2433]"
                          : isCompleted
                            ? "font-medium text-[#475467]"
                            : "font-medium text-[#98A2B3]"
                      }`}
                    >
                      {phase.title}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {!isLast && (
                    <div
                      className={`mx-2 mb-6 h-[2px] flex-1 ${
                        isCompleted ? "bg-[#1683D8]" : "bg-[#E4E7EC]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Phase Callout Box */}
          <div className="mt-8 flex flex-col justify-between gap-4 rounded-lg border border-[#B2DDFF] bg-[#F0F7FE] p-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-semibold text-[#1683D8]">
                Current Phase: Self-Assessment
              </h3>
              <p className="mt-0.5 text-xs text-[#475467]">
                Click "Begin Self-Assessment" to open the full OKR appraisal form
                and enter your achieved values for each quarter.
              </p>
            </div>

            <Link
              href="/employee/appraisal/self-assessment"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#1683D8] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1270B8]"
            >
              Begin Self-Assessment →
            </Link>
          </div>
        </section>

        {/* Past Appraisals Section */}
        <section className="mt-6 rounded-xl border border-[#EAECF0] bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1D2433]">
              Past Appraisals
            </h2>
            {pagination && pagination.total > 0 && (
              <span className="text-xs font-medium text-[#667085]">
                Total: {pagination.total}
              </span>
            )}
          </div>

          {historyError && (
            <div className="mt-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{historyError}</span>
              </div>
              <button
                type="button"
                onClick={fetchAppraisalHistory}
                className="font-medium underline hover:text-red-900"
              >
                Retry
              </button>
            </div>
          )}

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EAECF0] text-xs font-semibold text-[#667085]">
                  <th className="py-3 pr-4 font-semibold">Cycle</th>
                  <th className="py-3 pr-4 font-semibold">Period</th>
                  <th className="py-3 pr-4 font-semibold">Final Score</th>
                  <th className="py-3 pr-4 font-semibold">Rating</th>
                  <th className="py-3 pr-4 font-semibold">Date Completed</th>
                  <th className="py-3 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EAECF0]">
                {loadingHistory ? (
                  Array.from({ length: 2 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 pr-4">
                        <div className="h-4 w-28 rounded bg-gray-200" />
                      </td>
                      <td className="py-4 pr-4">
                        <div className="h-4 w-24 rounded bg-gray-200" />
                      </td>
                      <td className="py-4 pr-4">
                        <div className="h-4 w-12 rounded bg-gray-200" />
                      </td>
                      <td className="py-4 pr-4">
                        <div className="h-6 w-24 rounded-full bg-gray-200" />
                      </td>
                      <td className="py-4 pr-4">
                        <div className="h-4 w-20 rounded bg-gray-200" />
                      </td>
                      <td className="py-4">
                        <div className="h-4 w-12 rounded bg-gray-200" />
                      </td>
                    </tr>
                  ))
                ) : history.length > 0 ? (
                  history.map((item, index) => {
                    const ratingLabel = getRatingLabel(item);
                    const isExceeds =
                      ratingLabel.toLowerCase().includes("exceed") ||
                      ratingLabel.toLowerCase().includes("outstanding") ||
                      ratingLabel.toLowerCase().includes("above");
                    const score = getFinalScore(item);

                    return (
                      <tr
                        key={item.id || item.appraisalId || index}
                        className={`transition ${
                          index % 2 === 1
                            ? "bg-[#F8F9FB] hover:bg-[#F2F4F7]"
                            : "hover:bg-[#F9FAFB]"
                        }`}
                      >
                        <td className="py-4 pr-4 text-sm font-bold text-[#1D2433]">
                          {getCycleName(item)}
                        </td>
                        <td className="py-4 pr-4 text-sm text-[#475467]">
                          {getPeriod(item)}
                        </td>
                        <td className="py-4 pr-4 text-sm font-bold text-[#1D2433]">
                          {score != null ? `${score}%` : "—"}
                        </td>
                        <td className="py-4 pr-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              isExceeds
                                ? "border border-[#ABEFC6]/60 bg-[#ECFDF3] text-[#027A48]"
                                : "border border-[#B2DDFF]/60 bg-[#EFF8FF] text-[#175CD3]"
                            }`}
                          >
                            {ratingLabel}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-sm text-[#475467]">
                          {getDateCompleted(item)}
                        </td>
                        <td className="py-4">
                          <button
                            type="button"
                            onClick={() => handleView(item)}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1683D8] transition hover:text-[#1270B8]"
                          >
                            <Eye size={15} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : null}
              </tbody>
            </table>

            {!loadingHistory && history.length === 0 && (
              <div className="py-12 text-center text-[#98A2B3]">
                <svg
                  className="mx-auto mb-3 h-10 w-10 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <p className="text-sm font-medium text-[#1D2433]">
                  No past appraisals found
                </p>
                <p className="mt-1 text-xs text-[#98A2B3]">
                  Completed appraisal reviews and performance history will appear here.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* View Details Modal */}
        <ViewMyAppraisal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAppraisalId(null);
          }}
          appraisalId={selectedAppraisalId}
          appraisal={selectedAppraisal}
        />
      </div>
    </div>
  );
}
