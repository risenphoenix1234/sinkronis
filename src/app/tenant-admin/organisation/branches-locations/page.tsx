"use client";

import { useEffect, useState } from "react";
import { getBranchesTable, createBranch, deleteBranch } from "@/lib/api/admin";
import { BranchTableRow } from "@/lib/api/types/admin.types";

const emptyForm = { name: "", address: "", city: "", state: "", country: "NG", phone: "" };

export default function BranchesLocationsPage() {
  const [branches, setBranches] = useState<BranchTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBranches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBranchesTable({ limit: 100 });
      setBranches(res.data);
    } catch (err) {
      setError("Failed to load branches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) {
      setFormError("Branch name and address are required.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      await createBranch(form);
      closeModal();
      fetchBranches();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to create branch.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteBranch(id);
      setBranches((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete branch.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-[#2183C6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1c70ab]"
        >
          <span className="text-base leading-none">+</span> Add Branch
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}

      <div className="space-y-3">
        {loading && (
          <p className="py-8 text-center text-sm text-slate-400">Loading branches...</p>
        )}

        {!loading &&
          branches.map((branch) => (
            <div
              key={branch.id}
              className="flex items-start justify-between rounded-md border border-slate-100 px-4 py-3.5"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-slate-400">📍</span>
                <div>
                  <p className="font-medium text-slate-800">{branch.branchName}</p>
                  <p className="text-sm text-slate-500">{branch.address}</p>
                  <p className="text-sm text-slate-400">
                    {branch.city}, {branch.state}, {branch.country} · {branch.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <button
                  onClick={() => handleDelete(branch.id)}
                  disabled={deletingId === branch.id}
                  className="hover:text-rose-600 disabled:opacity-50"
                  aria-label={`Delete ${branch.branchName}`}
                >
                  {deletingId === branch.id ? "…" : "🗑"}
                </button>
              </div>
            </div>
          ))}

        {!loading && branches.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">No branches added yet.</p>
        )}
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
              <h2 className="text-lg font-semibold text-slate-800">Add Branch</h2>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+2348012345678"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
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
                  {submitting ? "Adding..." : "Add Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}