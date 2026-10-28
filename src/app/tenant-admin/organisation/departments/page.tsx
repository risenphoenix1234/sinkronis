"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { getDepartmentsTable, createDepartment } from "@/lib/api/admin";
import { DepartmentTableRow } from "@/lib/api/types/admin.types";
import Loader from "@/components/ui/Loader";

const emptyForm = { name: "", description: "" };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentTableRow[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDepartmentsTable({ search: search || undefined, limit: 100 });
      setDepartments(res.data);
    } catch (err) {
      setError("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchDepartments, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setFormError("Department name is required.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await createDepartment({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      });
      closeModal();
      fetchDepartments();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to create department.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-sky-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700"
        >
          <FiPlus size={16} strokeWidth={2.5} />
          Add Department
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Department Name</th>
              <th className="px-4 py-2.5 font-medium">Head of Department</th>
              <th className="px-4 py-2.5 font-medium">Employees</th>
              <th className="px-4 py-2.5 font-medium">Date Created</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400"><Loader variant="inline" label="Loading departments" /></td>
              </tr>
            )}

            {!loading &&
              departments.map((dept) => (
                <tr key={dept.id} className="border-b border-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{dept.departmentName}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {dept.headOfDepartment ?? "Unassigned"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-sky-600">
                      {dept.employeeCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(dept.dateCreated)}</td>
                </tr>
              ))}

            {!loading && departments.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">
                  No departments match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Add Department</h2>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Department Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Product Design"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Optional"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
                >
                  {submitting ? "Adding..." : "Add Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}