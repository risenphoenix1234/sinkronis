"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import AddClientModal, { NewClientInput } from "@/components/modals/AddClientModal";
import EditClientModal from "@/components/modals/EditClientModal";
import DeleteClientModal from "@/components/modals/DeleteClientModal";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "@/lib/api/accounting";
import { Customer, CustomerSummary, UpdateCustomerPayload } from "@/lib/api/types/accounting.types";

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export default function AccountingClientsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [summary, setSummary] = useState<CustomerSummary>({ totalCustomers: 0, activeCustomers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeClient, setActiveClient] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomers({ search: search || undefined });
      setCustomers(res.data.customers);
      setSummary(res.data.summary);
    } catch (err) {
      setError("Failed to load clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchCustomers, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  const filteredCustomers = customers.filter((c) => statusFilter === "ALL" || c.status === statusFilter);

  const handleAdd = async (input: NewClientInput) => {
    try {
      await createCustomer(input);
      setAddOpen(false);
      await fetchCustomers();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create client.");
    }
  };

  const openEdit = (client: Customer) => {
    setActiveClient(client);
    setEditOpen(true);
  };

const handleEdit = async (id: string, updates: UpdateCustomerPayload) => {
    try {
      await updateCustomer(id, updates);
      setEditOpen(false);
      await fetchCustomers();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update client.");
    }
  };

  const openDelete = (client: Customer) => {
    setActiveClient(client);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!activeClient) return;
    try {
      await deleteCustomer(activeClient.id);
      setDeleteOpen(false);
      await fetchCustomers();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete client.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Clients</h1>
          <p className="mt-1 text-xs text-slate-500">
            {summary.totalCustomers} clients • {summary.activeCustomers} active
          </p>
        </div>

        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-sky-700"
        >
          <span className="text-lg leading-none">+</span>
          <span>Add Client</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or Tax ID..."
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <span className="pointer-events-none absolute right-4 top-2.5 text-xs text-slate-400">🔍</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`rounded-full border px-4 py-1.5 ${
              statusFilter === "ALL" ? "border-slate-300 bg-slate-100 font-semibold text-slate-800" : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("ACTIVE")}
            className={`rounded-full border px-4 py-1.5 ${
              statusFilter === "ACTIVE" ? "border-emerald-100 bg-emerald-50 font-semibold text-emerald-700" : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter("INACTIVE")}
            className={`rounded-full border px-4 py-1.5 ${
              statusFilter === "INACTIVE" ? "border-slate-300 bg-slate-100 font-semibold text-slate-800" : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Client ID</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Tax ID</th>
              <th className="px-6 py-3 font-medium">Contact Person</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Since</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-400">Loading clients...</td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-red-500">{error}</td>
              </tr>
            )}

          {!loading && !error && filteredCustomers.map((client) => (
  <tr key={client.id} className="border-t border-slate-100 text-sm hover:bg-slate-50/80">
    <td className="px-6 py-3 text-sky-600">
      <Link href={`/accounting/clients/${client.id}`}>{client.customerId}</Link>
    </td>
    <td className="px-6 py-3">{client.companyName}</td>
    <td className="px-6 py-3">{client.taxId ?? "—"}</td>
    <td className="px-6 py-3">{client.contactPerson ?? "—"}</td>
    <td className="px-6 py-3">{client.email}</td>
    <td className="px-6 py-3">
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        client.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
      }`}>
        {client.status === "ACTIVE" ? "Active" : "Inactive"}
      </span>
    </td>
    <td className="px-6 py-3">
      {new Date(client.since).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
    </td>
    <td className="px-6 py-3 text-right">
      <div className="inline-flex items-center gap-3 text-slate-400">
        <Link
          href={`/accounting/clients/${client.id}`}
          className="rounded-full p-1.5 hover:bg-slate-100 hover:text-sky-600"
          aria-label="View client"
        >
          <FiEye className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={() => openEdit(client)}
          className="rounded-full p-1.5 hover:bg-slate-100 hover:text-sky-600"
          aria-label="Edit client"
        >
          <FiEdit2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => openDelete(client)}
          className="rounded-full p-1.5 hover:bg-slate-100 hover:text-rose-600"
          aria-label="Delete client"
        >
          <FiTrash2 className="h-4 w-4" />
        </button>
      </div>
    </td>
  </tr>
))}

            {!loading && !error && filteredCustomers.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-400">No clients yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddClientModal open={addOpen} onClose={() => setAddOpen(false)} onSave={handleAdd} />
      <EditClientModal
        open={editOpen}
        client={activeClient}
        onClose={() => setEditOpen(false)}
        onSave={handleEdit}
      />
      <DeleteClientModal
        open={deleteOpen}
        clientName={activeClient?.companyName}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
}