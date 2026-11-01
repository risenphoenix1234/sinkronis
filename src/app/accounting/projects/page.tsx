// src/app/accounting/projects/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import NewProjectModal from "@/components/modals/NewProjectModal";
import EditProjectModal from "@/components/modals/EditProjectModal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { getProjects, createProject, deleteProject, updateProject } from "@/lib/api/accounting";
import { ProjectListItem, ProjectSummary, CreateProjectPayload } from "@/lib/api/types/accounting.types";
import Loader from "@/components/ui/Loader";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-[#D8F3DC] text-[#1B7A34]",
  ON_HOLD: "bg-[#FFF3CD] text-[#856404]",
  COMPLETED: "bg-[#D8F3DC] text-[#1B7A34]",
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
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<ProjectListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectListItem | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProjects({ search: search || undefined });
      setProjects(res.data.projects);
      setSummary(res.data.summary);
    } catch (err) {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchProjects, 400);
    return () => clearTimeout(debounce);
  }, [search]);

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

  const handleUpdate = async (id: string, payload: Partial<CreateProjectPayload>) => {
    await updateProject(id, payload);
    await fetchProjects();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject(deleteTarget.id);
      setDeleteTarget(null);
      await fetchProjects();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete project.");
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] space-y-6 bg-[#F4F6F8] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#212B36]">Projects</h1>
          <p className="mt-2 text-xs text-[#637381]">
            {summary.totalProjects} projects · {summary.activeProjects} active
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 whitespace-nowrap rounded-md bg-[#2183C6] px-6 py-3 text-base font-medium text-white hover:bg-[#1976B8]"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#919EAB]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or client..."
            className="w-full border-b border-[#E5E9ED] bg-transparent py-3 pl-8 pr-2 text-sm text-[#212B36] outline-none placeholder:text-[#8B9197] focus:border-[#2183C6]"
          />
        </div>

        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-[13px] transition-colors ${
                filter === f
                  ? "border-[#2183C6] bg-[#2183C6] font-medium text-white"
                  : "border-[#E2E6EB] text-[#637381] hover:bg-white"
              }`}
            >
              {f === "All" ? "All" : statusLabels[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-[#E5E8EB] bg-white">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-dotted border-[#EBEEF0] text-[#637381]">
              <th className="px-3 py-3.5 font-normal">Project ID</th>
              <th className="px-3 py-3.5 font-normal">Name</th>
              <th className="px-3 py-3.5 font-normal">Client</th>
              <th className="px-3 py-3.5 font-normal">Agent</th>
              <th className="px-3 py-3.5 font-normal">Value</th>
              <th className="px-3 py-3.5 font-normal">Start</th>
              <th className="px-3 py-3.5 font-normal">End</th>
              <th className="px-3 py-3.5 font-normal">Status</th>
              <th className="px-3 py-3.5 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-sm text-[#919EAB]"><Loader variant="inline" label="Loading projects" /></td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-sm text-red-500">{error}</td>
              </tr>
            )}

            {!loading && !error && filtered.map((project) => (
              <tr key={project.id} className="even:bg-[#F2F2F7]">
                <td className="whitespace-nowrap px-3 py-3.5 text-[#2183C6]">{project.projectId}</td>
                <td className="whitespace-nowrap px-3 py-3.5 font-medium text-[#212B36]">{project.name}</td>
                <td className="whitespace-nowrap px-3 py-3.5 text-[#637381]">{project.clientName}</td>
                <td className="whitespace-nowrap px-3 py-3.5 text-[#637381]">{project.agentName ?? "—"}</td>
                <td className="whitespace-nowrap px-3 py-3.5 font-semibold tabular-nums text-[#212B36]">{naira(project.value)}</td>
                <td className="whitespace-nowrap px-3 py-3.5 text-[#637381]">{formatDate(project.startDate)}</td>
                <td className="whitespace-nowrap px-3 py-3.5 text-[#637381]">{formatDate(project.endDate)}</td>
                <td className="px-3 py-3.5">
                  <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium ${statusStyles[project.status] ?? "bg-[#F4F6F8] text-[#637381]"}`}>
                    {statusLabels[project.status] ?? project.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/accounting/reports/projects/${project.id}`}
                      aria-label={`View ${project.name}`}
                      className="rounded p-1.5 text-[#637381] hover:bg-[#E5E8EB]"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setEditTarget(project)}
                      aria-label={`Edit ${project.name}`}
                      className="rounded p-1.5 text-[#637381] hover:bg-[#E5E8EB]"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(project)}
                      aria-label={`Delete ${project.name}`}
                      className="rounded p-1.5 text-[#FF3B30] hover:bg-[#FFEBEE]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-sm text-[#919EAB]">No projects yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
      <EditProjectModal
        open={editTarget !== null}
        project={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleUpdate}
      />
      <ConfirmDeleteModal
        open={deleteTarget !== null}
        title="Delete project"
        description={`Delete ${deleteTarget?.name ?? "this project"}? This cannot be undone.`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}