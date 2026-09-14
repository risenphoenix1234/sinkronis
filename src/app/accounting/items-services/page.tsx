"use client";

import { useState } from "react";
import AddItemModal from "@/components/modals/AddItemModal";
import EditItemModal from "@/components/modals/EditItemModal";
import DeleteItemModal from "@/components/modals/DeleteItemModal";

type ItemRow = {
  code: string;
  name: string;
  vatCode: string;
  unitPrice: string;
  unit: string;
  description: string;
  status: "Active" | "Inactive";
};

const staticItems: ItemRow[] = [
  {
    code: "ITM-001",
    name: "HR Software Licence",
    vatCode: "7.5%",
    unitPrice: "₦80,000",
    unit: "Per month",
    description: "Monthly HRIS software subscription",
    status: "Active",
  },
  {
    code: "ITM-002",
    name: "Payroll Processing",
    vatCode: "7.5%",
    unitPrice: "₦15,000",
    unit: "Per payroll run",
    description: "Monthly payroll processing fee",
    status: "Active",
  },
  {
    code: "ITM-003",
    name: "Employee Training Day",
    vatCode: "0%",
    unitPrice: "₦50,000",
    unit: "Per day",
    description: "On-site training for employees",
    status: "Active",
  },
  {
    code: "ITM-004",
    name: "Annual Maintenance",
    vatCode: "7.5%",
    unitPrice: "₦120,000",
    unit: "Per year",
    description: "Support and maintenance contract",
    status: "Inactive",
  },
];

export default function ItemsServicesPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<ItemRow | null>(null);

  const handleOpenEdit = (item: ItemRow) => {
    setActiveItem(item);
    setEditOpen(true);
  };

  const handleOpenDelete = (item: ItemRow) => {
    setActiveItem(item);
    setDeleteOpen(true);
  };

  return (
    <section className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Items &amp; Services
          </h1>
          <p className="mt-1 text-base text-slate-500">
            Standard catalogue used when creating invoices.
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="rounded-md bg-sky-600 px-5 py-2.5 text-base font-medium text-white hover:bg-sky-700 whitespace-nowrap"
        >
          + Add item
        </button>
      </div>

      {/* Search + filter row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search items or services…"
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-base text-slate-700 outline-none placeholder:text-slate-400"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
            All
          </button>
          <button className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            Active
          </button>
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
            Inactive
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Item code</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">VAT</th>
              <th className="px-6 py-4 font-medium text-right">Unit price</th>
              <th className="px-6 py-3 font-medium">Unit</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staticItems.map((item) => (
              <tr key={item.code} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">
                  {item.code}
                </td>
                <td className="px-6 py-3 text-base font-medium text-slate-800 whitespace-nowrap">
                  {item.name}
                </td>
                <td className="px-6 py-3 text-base text-slate-600">
                  {item.vatCode}
                </td>
                <td className="px-6 py-3 text-base text-right tabular-nums text-slate-800 whitespace-nowrap">
                  {item.unitPrice}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">
                  {item.unit}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                      item.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-base text-slate-500">
                  {item.description}
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="rounded px-3 py-1.5 text-sm text-slate-500 hover:bg-sky-50 hover:text-sky-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleOpenDelete(item)}
                    className="rounded px-3 py-1.5 text-sm text-rose-500 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditItemModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        itemName={activeItem?.name}
      />
      <DeleteItemModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        itemName={activeItem?.name}
      />
    </section>
  );
}