"use client";

import { useEffect, useState } from "react";
import NewProjectModal from "@/components/modals/NewProjectModal";
import { getProjects, createProject } from "@/lib/api/accounting";
import { ProjectListItem, ProjectSummary, CreateProjectPayload } from "@/lib/api/types/accounting.types";
import Loader from "@/components/ui/Loader";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  ON_HOLD: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-sky-50 text-sky-700",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
};

type Filter = "All" | "ACTIVE" | "ON_HOLD" | "COMPLETED";

function naira(value: number) {
  return `₦${value.toLocaleString()}`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [summary, setSummary] = useState<ProjectSummary>({ totalProjects: 0, activeProjects: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("All");

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProjects();
      setProjects(res.data.projects);
      setSummary(res.data.summary);
    } catch (err) {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filters: Filter[] = ["All", "ACTIVE", "ON_HOLD", "COMPLETED"];

  const filtered = filter === "All" ? projects : projects.filter((p) => p.status === filter);

  const handleCreate = async (payload: CreateProjectPayload) => {
    try {
      await createProject(payload);
      setModalOpen(false);
      await fetchProjects();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create project.");
    }
  };

  return (
    <section className="space-y-6 p-6 max-w-8xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">
            {summary.totalProjects} projects · {summary.activeProjects} active
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 whitespace-nowrap"
        >
          + New Project
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
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
              {f === "All" ? "All" : statusLabels[f]}
            </button>
          ))}
        </div>
      </div>

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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-400"><Loader variant="inline" label="Loading projects" /></td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-red-500">{error}</td>
              </tr>
            )}

            {!loading && !error && filtered.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">{project.projectId}</td>
                <td className="px-6 py-3 text-base font-medium text-slate-800 whitespace-nowrap">{project.name}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{project.clientName}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{project.agentName ?? "—"}</td>
                <td className="px-6 py-3 text-base tabular-nums text-slate-800 whitespace-nowrap">{naira(project.value)}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{formatDate(project.startDate)}</td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{formatDate(project.endDate)}</td>
                <td className="px-6 py-3">
                  <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[project.status]}`}>
                    {statusLabels[project.status]}
                  </span>
                </td>
              </tr>
            ))}

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-400">No projects yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </section>
  );
}