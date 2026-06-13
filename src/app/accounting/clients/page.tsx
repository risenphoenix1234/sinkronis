"use client";

import { useState } from "react";
import Link from "next/link";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import AddClientModal from "@/components/modals/AddClientModal";
import EditClientModal from "@/components/modals/EditClientModal";
import DeleteClientModal from "@/components/modals/DeleteClientModal";

type ClientRow = {
  id: string;
  name: string;
  tin: string;
  contact: string;
  email: string;
  status: "Active" | "Inactive";
  since: string;
};

const staticClients: ClientRow[] = [
  {
    id: "CLT-001",
    name: "Zenith Technologies Ltd",
    tin: "TIN-2034567890",
    contact: "Mr. Chidi Obi",
    email: "finance@zenithtech.ng",
    status: "Active",
    since: "10 Jan 2026",
  },
  {
    id: "CLT-002",
    name: "Prestige Global Services",
    tin: "TIN-3045678901",
    contact: "Mrs. Funke Adeyemi",
    email: "accounts@prestigeglobal.ng",
    status: "Active",
    since: "15 Feb 2026",
  },
  {
    id: "CLT-003",
    name: "Blustar Logistics",
    tin: "TIN-4056789012",
    contact: "Mr. Tunde Bankole",
    email: "billing@blustarlogistics.com",
    status: "Active",
    since: "01 Mar 2026",
  },
  {
    id: "CLT-004",
    name: "Nexus Capital Partners",
    tin: "TIN-5067890123",
    contact: "Ms. Adaeze Nwosu",
    email: "finance@nexuscapital.ng",
    status: "Inactive",
    since: "20 Mar 2026",
  },
];

export default function AccountingClientsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeClient, setActiveClient] = useState<ClientRow | null>(null);

  const openEdit = (client: ClientRow) => {
    setActiveClient(client);
    setEditOpen(true);
  };

  const openDelete = (client: ClientRow) => {
    setActiveClient(client);
    setDeleteOpen(true);
  };

  return (
    <section className="space-y-6">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Clients</h1>
          <p className="mt-1 text-xs text-slate-500">4 clients • 3 active</p>
        </div>

        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-sky-700"
        >
          <span className="text-lg leading-none">+</span>
          <span>Add Client</span>
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name or Tax ID..."
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <span className="pointer-events-none absolute right-4 top-2.5 text-xs text-slate-400">
            🔍
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-700">
            All
          </button>
          <button className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 font-semibold text-emerald-700">
            Active
          </button>
          <button className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-slate-700">
            Inactive
          </button>
        </div>
      </div>

      {/* Table */}
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
            {staticClients.map((client) => (
              <tr
                key={client.id}
                className="border-t border-slate-100 text-sm hover:bg-slate-50/80"
              >
                <td className="px-6 py-3 text-sky-600">
                  <Link href={`/accounting/clients/${client.id}`}>
                    {client.id}
                  </Link>
                </td>
                <td className="px-6 py-3">{client.name}</td>
                <td className="px-6 py-3">{client.tin}</td>
                <td className="px-6 py-3">{client.contact}</td>
                <td className="px-6 py-3">{client.email}</td>
                <td className="px-6 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      client.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-3">{client.since}</td>
                <td className="px-6 py-3 text-right">
                  <div className="inline-flex items-center gap-3 text-slate-400">
                    {/* eye icon */}
                    <Link
                      href={`/accounting/clients/${client.id}`}
                      className="rounded-full p-1.5 hover:bg-slate-100 hover:text-sky-600"
                      aria-label="View client"
                    >
                      <FiEye className="h-4 w-4" />
                    </Link>

                    {/* pencil icon */}
                    <button
                      type="button"
                      onClick={() => openEdit(client)}
                      className="rounded-full p-1.5 hover:bg-slate-100 hover:text-sky-600"
                      aria-label="Edit client"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>

                    {/* trash icon */}
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
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddClientModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditClientModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        clientName={activeClient?.name}
      />
      <DeleteClientModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        clientName={activeClient?.name}
      />
    </section>
  );
}
