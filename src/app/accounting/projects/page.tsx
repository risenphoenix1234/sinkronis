"use client";

import { useState } from "react";
import NewProjectModal from "@/components/modals/NewProjectModal";

type Project = {
  id: string;
  name: string;
  client: string;
  agent: string;
  value: string;
  start: string;
  end: string;
  status: "Active" | "On Hold" | "Completed";
};

const staticProjects: Project[] = [
  {
    id: "PRJ-001",
    name: "Zenith HRIS Deployment",
    client: "Zenith Technologies Ltd",
    agent: "Emeka Okafor",
    value: "₦580,000",
    start: "01 Feb 2026",
    end: "30 Jun 2026",
    status: "Active",
  },
  {
    id: "PRJ-002",
    name: "Prestige Payroll Setup",
    client: "Prestige Global Services",
    agent: "Sade Williams",
    value: "₦375,000",
    start: "15 Mar 2026",
    end: "15 May 2026",
    status: "Active",
  },
  {
    id: "PRJ-003",
    name: "BlueStar Annual Contract",
    client: "BlueStar Logistics",
    agent: "Emeka Okafor",
    value: "₦240,000",
    start: "01 Jan 2026",
    end: "31 Mar 2026",
    status: "Completed",
  },
];

const statusStyles: Record<Project["status"], string> = {
  Active: "bg-emerald-50 text-emerald-700",
  "On Hold": "bg-amber-50 text-amber-700",
  Completed: "bg-sky-50 text-sky-700",
};

type Filter = "All" | "Active" | "On Hold" | "Completed";

export default function ProjectsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("All");

  const filters: Filter[] = ["All", "Active", "On Hold", "Completed"];

  const filtered =
    filter === "All"
      ? staticProjects
      : staticProjects.filter((p) => p.status === filter);

  const activeCount = staticProjects.filter((p) => p.status === "Active").length;

  return (
    <section className="space-y-6 p-6 max-w-8xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">
            {staticProjects.length} projects · {activeCount} active
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
        >
          + New Project
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search by name or client…"
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            🔍
          </span>
        </div>
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                filter === f
                  ? "border-sky-200 bg-sky-50 font-medium text-sky-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Project ID</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium">Agent</th>
              <th className="px-6 py-3 font-medium">Value</th>
              <th className="px-6 py-3 font-medium">Start</th>
              <th className="px-6 py-3 font-medium">End</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  {project.id}
                </td>
                <td className="px-6 py-3 text-base font-medium text-slate-800 whitespace-nowrap">
                  {project.name}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {project.client}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {project.agent}
                </td>
                <td className="px-6 py-3 text-base tabular-nums text-slate-800 whitespace-nowrap">
                  {project.value}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {project.start}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {project.end}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[project.status]}`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  <button className="rounded px-3 py-1.5 text-sm text-slate-500 hover:bg-sky-50 hover:text-sky-600 mr-2">
                    Edit
                  </button>
                  <button className="rounded px-3 py-1.5 text-sm text-rose-500 hover:bg-rose-50">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}