// src/components/reports/DrillIntoSection.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { LuLayoutGrid, LuList, LuChevronRight } from "react-icons/lu";
import { DrillEntity, DrillEntityType } from "@/types/report";

type DrillIntoSectionProps = {
  byClient: DrillEntity[];
  byAgent: DrillEntity[];
  byProject: DrillEntity[];
};

const entityHrefPrefix: Record<DrillEntityType, string> = {
  client: "/accounting/reports/clients",
  agent: "/accounting/reports/agents",
  project: "/accounting/reports/projects",
};

function DrillCard({ entity }: { entity: DrillEntity }) {
  return (
    <Link
      href={`${entityHrefPrefix[entity.type]}/${entity.id}`}
      className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 hover:bg-slate-50"
    >
      <div>
        <p className="text-sm font-medium text-slate-800">{entity.name}</p>
        <p className="text-xs text-slate-400">
          {entity.invoiceCount} invoice{entity.invoiceCount !== 1 && "s"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium tabular-nums text-slate-700">
          ₦{entity.totalValue.toLocaleString()}
        </span>
        <LuChevronRight size={16} className="text-sky-500" />
      </div>
    </Link>
  );
}

function DrillTableRow({ entity }: { entity: DrillEntity }) {
  const barColor =
    entity.type === "client"
      ? "bg-sky-500"
      : entity.type === "agent"
        ? "bg-emerald-500"
        : "bg-amber-500";

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-2.5 text-sm capitalize text-slate-500">
        {entity.type}
      </td>
      <td className="px-4 py-2.5 text-sm font-medium text-sky-600">
        {entity.name}
      </td>
      <td className="px-4 py-2.5 text-sm text-slate-500">
        {entity.invoiceCount} invoice{entity.invoiceCount !== 1 && "s"}
      </td>
      <td className="px-4 py-2.5 text-sm tabular-nums text-slate-700">
        ₦{entity.totalValue.toLocaleString()}
      </td>
      <td className="px-4 py-2.5">
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{ width: `${entity.sharePercent}%` }}
          />
        </div>
      </td>
      <td className="px-4 py-2.5 text-right">
        <Link
          href={`${entityHrefPrefix[entity.type]}/${entity.id}`}
          className="rounded-md bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-100"
        >
          Drill in →
        </Link>
      </td>
    </tr>
  );
}

export default function DrillIntoSection({
  byClient,
  byAgent,
  byProject,
}: DrillIntoSectionProps) {
  const [view, setView] = useState<"cards" | "table">("cards");

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Drill into</h2>
        <div className="flex items-center rounded-md border border-slate-200 bg-white p-0.5">
          <button
            onClick={() => setView("cards")}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium ${
              view === "cards"
                ? "bg-sky-50 text-sky-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <LuLayoutGrid size={14} />
            Cards
          </button>
          <button
            onClick={() => setView("table")}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium ${
              view === "table"
                ? "bg-sky-50 text-sky-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <LuList size={14} />
            Table
          </button>
        </div>
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-sm font-medium text-slate-500">
              By Client
            </p>
            <div className="space-y-1">
              {byClient.map((e) => (
                <DrillCard key={e.id} entity={e} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-sm font-medium text-slate-500">
              By Agent
            </p>
            <div className="space-y-1">
              {byAgent.map((e) => (
                <DrillCard key={e.id} entity={e} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-sm font-medium text-slate-500">
              By Project
            </p>
            <div className="space-y-1">
              {byProject.map((e) => (
                <DrillCard key={e.id} entity={e} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Details</th>
                <th className="px-4 py-2.5 font-medium">Total Value</th>
                <th className="px-4 py-2.5 font-medium">Share</th>
                <th className="px-4 py-2.5 font-medium text-right">
                  Drill in
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...byClient, ...byProject, ...byAgent].map((e) => (
                <DrillTableRow key={`${e.type}-${e.id}`} entity={e} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}