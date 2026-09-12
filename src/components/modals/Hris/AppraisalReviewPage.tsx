"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Search, RotateCcw, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { getAppraisalCycles, getAppraisalReviews } from "@/lib/api/hris";
import type { AppraisalCycleSummary, AppraisalReview } from "@/lib/api/types/hrisTypes";
import ReviewsTable from "@/components/hris/ReviewsTable";

const STAGE_OPTIONS = [
  { label: "All Stages", value: "" },
  { label: "Goal Setting", value: "GOAL_SETTING" },
  { label: "Self Assessment", value: "SELF_ASSESSMENT" },
  { label: "Manager Review", value: "MANAGER_REVIEW" },
  { label: "HR Approval", value: "HR_APPROVAL" },
  { label: "Acknowledgment", value: "ACKNOWLEDGMENT" },
  { label: "Completed", value: "COMPLETED" },
] as const;

export default function AppraisalReviewPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedCycleId, setSelectedCycleId] = useState("");
  const [cycles, setCycles] = useState<AppraisalCycleSummary[]>([]);

  const [reviews, setReviews] = useState<AppraisalReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Debounce search so it doesn't fire a request per keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Load available cycles for filter
  useEffect(() => {
    getAppraisalCycles()
      .then((res) => {
        if (Array.isArray(res?.data)) {
          setCycles(res.data);
        }
      })
      .catch((err) => {
        console.error(
          "Failed to load appraisal cycles:",
          axios.isAxiosError(err) ? err.response?.data : err,
        );
      });
  }, []);

  const fetchReviews = useCallback(() => {
    setLoading(true);
    getAppraisalReviews({
      search: debouncedSearch || undefined,
      status: selectedStage || undefined,
      cycleId: selectedCycleId || undefined,
      page,
      limit,
    })
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        setReviews(list);
        if (res?.pagination) {
          setPagination(res.pagination);
        } else {
          setPagination((prev) => ({
            ...prev,
            total: list.length,
            totalPages: Math.max(1, Math.ceil(list.length / limit)),
          }));
        }
      })
      .catch((err) => {
        console.error(
          "Appraisal reviews failed:",
          axios.isAxiosError(err) ? err.response?.data : err,
        );
        setReviews([]);
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch, selectedStage, selectedCycleId, page, limit]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedStage("");
    setSelectedCycleId("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    debouncedSearch || selectedStage || selectedCycleId,
  );

  return (
    <div className="min-h-screen space-y-5 bg-[#F9FAFB]">
      {/* Header & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by employee name or ID…"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* Stage / Status Filter */}
          <div className="relative">
            <select
              value={selectedStage}
              onChange={(e) => {
                setSelectedStage(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              {STAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cycle Filter */}
          <div className="relative">
            <select
              value={selectedCycleId}
              onChange={(e) => {
                setSelectedCycleId(e.target.value);
                setPage(1);
              }}
              className="h-10 max-w-[220px] truncate rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">All Cycles</option>
              {cycles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          )}
        </div>

        {/* Count and Refresh */}
        <div className="flex items-center gap-3">
          {!loading && (
            <span className="text-xs font-medium text-slate-500">
              {pagination.total} {pagination.total === 1 ? "review" : "reviews"} found
            </span>
          )}
          <button
            type="button"
            onClick={fetchReviews}
            disabled={loading}
            title="Refresh reviews"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-sky-600 disabled:opacity-50"
          >
            <RotateCcw size={15} className={loading ? "animate-spin text-sky-600" : ""} />
          </button>
        </div>
      </div>

      {/* Reviews Table with Empty State */}
      <ReviewsTable
        reviews={reviews}
        loading={loading}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Pagination Controls */}
      {!loading && reviews.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 pt-4 sm:flex-row">
          <p className="text-xs text-slate-500">
            Showing Page <span className="font-semibold text-slate-700">{pagination.page}</span> of{" "}
            <span className="font-semibold text-slate-700">{pagination.totalPages || 1}</span>
            {" · "}
            <span className="font-medium text-slate-600">{pagination.total}</span> total records
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <button
              type="button"
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages || 1, p + 1))
              }
              disabled={page >= (pagination.totalPages || 1)}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
