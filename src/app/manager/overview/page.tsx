// src/app/manager/overview/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { getAppraisals } from "@/lib/api/hris";
import { AppraisalReview } from "@/lib/api/types/hrisTypes";
import Loader from "@/components/ui/Loader";

interface Counts {
  total: number;
  awaitingReview: number;
  inProgress: number;
  withHr: number;
  completed: number;
}

function stageOf(row: AppraisalReview): string {
  return String(row.stage ?? row.status ?? "").toUpperCase();
}

function buildCounts(rows: AppraisalReview[], total: number): Counts {
  const count = (stages: string[]) =>
    rows.filter((r) => stages.includes(stageOf(r))).length;
  return {
    total,
    awaitingReview: count(["MANAGER_REVIEW"]),
    inProgress: count(["GOAL_SETTING", "SELF_ASSESSMENT"]),
    withHr: count(["HR_APPROVAL", "ACKNOWLEDGMENT"]),
    completed: count(["COMPLETED"]),
  };
}

export default function ManagerOverviewPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAppraisals({ limit: 100 });
        const rows = Array.isArray(res?.data) ? res.data : [];
        setCounts(buildCounts(rows, res?.pagination?.total ?? rows.length));
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to load your appraisals."
            : "Failed to load your appraisals.",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = counts
    ? [
        { label: "Assigned appraisals", value: counts.total },
        { label: "Awaiting your review", value: counts.awaitingReview },
        { label: "Employee in progress", value: counts.inProgress },
        { label: "With HR or sign-off", value: counts.withHr },
        { label: "Completed", value: counts.completed },
      ]
    : [];

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Manager Overview</h1>
        <p className="text-sm text-slate-500">
          A summary of the appraisals assigned to you.
        </p>
      </div>

      {loading && <Loader variant="section" label="Loading" />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {counts && (
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className="rounded-lg bg-white p-4 shadow-sm">
              <h2 className="text-xs font-semibold text-slate-500">{card.label}</h2>
              <p className="mt-2 text-2xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {counts && counts.awaitingReview > 0 && (
        <Link
          href="/manager/appraisal"
          className="inline-block rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
        >
          Review now
        </Link>
      )}
    </section>
  );
}