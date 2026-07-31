"use client";

import AddGoal from "@/components/employee/appraisal/AddGoal";
import { PhaseStepper } from "@/components/employee/appraisal/PhaseStepper";
import { TargetIcon } from "@/components/employee/appraisal/TargetIcon";
import ViewAppraisal from "@/components/employee/appraisal/ViewAppraisal";
import { goals, pastAppraisals } from "@/data/employee/appraisal";
import { AppraisalRating, Goal, GoalStatus } from "@/types/employee/appraisal";
import Link from "next/link";
import { useState } from "react";

function goalStatusBadge(status: GoalStatus) {
  const base = "text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap";
  if (status === "Completed") return `${base} bg-green-100 text-green-600`;
  if (status === "In Progress") return `${base} bg-yellow-100 text-yellow-600`;
  return `${base} bg-gray-100 text-gray-500`;
}

function ratingBadge(rating: AppraisalRating) {
  const base = "text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap";
  if (rating === "Exceeds Expectations")
    return `${base} bg-green-100 text-green-600`;
  if (rating === "Meets Expectations")
    return `${base} bg-blue-100 text-blue-600`;
  return `${base} bg-red-100 text-red-500`;
}

export default function MyAppraisal() {
  const goalList = goals;
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showView, setShowView] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 mx-auto">
      {/* ── Page header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Appraisal</h1>
        <p className="text-sm text-gray-400 mt-1">
          Track your performance goals and appraisal cycles
        </p>
      </div>

      {/* ── Current Cycle Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-7 py-6 mb-5">
        {/* Cycle header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Q2 2026 Review</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Period: 1 Apr - 30 Jun 2026 · Deadline: 15 July 2026
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-600">
            In Progress
          </span>
        </div>

        {/* Stepper */}
        <PhaseStepper />

        {/* Phase info banner */}
        <div className="mt-6 border border-blue-100 bg-blue-50/40 rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-blue-600 mb-1">
            Current Phase: Self-Assessment
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Your goals are confirmed. Click "Begin Self-Assessment" below to
            open the full OKR appraisal form and enter your achieved values for
            each quarter.
          </p>
        </div>

        {/* Goals section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Q2 2026 Goals
            </h3>
            <button
              onClick={() => setShowAddGoal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Add Goals
            </button>
          </div>

          <div className="space-y-3">
            {goalList.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-400 shrink-0">
                    <TargetIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {goal.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Target: {goal.target}
                    </p>
                  </div>
                </div>
                <span className={goalStatusBadge(goal.status)}>
                  {goal.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-4 mt-6 pt-5 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="w-4 h-4"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Goals Confirmed
          </div>
          <Link
            href="/employee/appraisal/self-assessment"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Begin Self-Assessment →
          </Link>
        </div>
      </div>

      {/* ── Past Appraisals ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-7 py-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-5">
          Past Appraisals
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                "Cycle",
                "Period",
                "Final Score",
                "Rating",
                "Date Completed",
                "Action",
              ].map((col) => (
                <th
                  key={col}
                  className="text-left pb-3 text-xs font-semibold text-gray-400 pr-4 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pastAppraisals.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-gray-50 ${i % 2 === 1 ? "bg-gray-50/60" : ""}`}
              >
                <td className="py-4 pr-4 text-xs font-bold text-gray-800 whitespace-nowrap">
                  {row.cycle}
                </td>
                <td className="py-4 pr-4 text-xs text-gray-500 whitespace-nowrap">
                  {row.period}
                </td>
                <td className="py-4 pr-4 text-xs font-bold text-gray-800">
                  {row.finalScore}%
                </td>
                <td className="py-4 pr-4">
                  <span className={ratingBadge(row.rating)}>{row.rating}</span>
                </td>
                <td className="py-4 pr-4 text-xs text-gray-500 whitespace-nowrap">
                  {row.dateCompleted}
                </td>
                <td className="py-4">
                  <button
                    onClick={() => setShowView(true)}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className="w-4 h-4"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modals ── */}

      <AddGoal open={showAddGoal} onClose={() => setShowAddGoal(false)} />
      <ViewAppraisal open={showView} onClose={() => setShowView(false)} />
    </div>
  );
}
