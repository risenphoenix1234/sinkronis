"use client";

import { useEffect, useState } from "react";
import AddItemModal, { NewItemInput } from "@/components/modals/AddItemModal";
import EditItemModal from "@/components/modals/EditItemModal";
import DeleteItemModal from "@/components/modals/DeleteItemModal";
import { getCatalogueItems, createCatalogueItem, updateCatalogueItem, deleteCatalogueItem } from "@/lib/api/accounting";
import { CatalogueItem } from "@/lib/api/types/accounting.types";
import Loader from "@/components/ui/Loader";

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

function naira(value: number) {
  return `₦${value.toLocaleString()}`;
}

export default function ItemsServicesPage() {
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<CatalogueItem | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCatalogueItems({ search: search || undefined });
      setItems(res.data.items);
    } catch (err) {
      setError("Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchItems, 400);
    return () => clearTimeout(debounce);
  }, [search]);

  const filteredItems = items.filter((i) => statusFilter === "ALL" || i.status === statusFilter);

  const handleAdd = async (input: NewItemInput) => {
    try {
      await createCatalogueItem(input);
      setAddOpen(false);
      await fetchItems();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to create item.");
    }
  };

  const openEdit = (item: CatalogueItem) => {
    setActiveItem(item);
    setEditOpen(true);
  };

  const handleEdit = async (id: string, updates: Partial<NewItemInput>) => {
    try {
      await updateCatalogueItem(id, updates);
      setEditOpen(false);
      await fetchItems();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update item.");
    }
  };

  const openDelete = (item: CatalogueItem) => {
    setActiveItem(item);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!activeItem) return;
    try {
      await deleteCatalogueItem(activeItem.id);
      setDeleteOpen(false);
      await fetchItems();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete item.");
    }
  };

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Items &amp; Services</h1>
          <p className="mt-1 text-base text-slate-500">Standard catalogue used when creating invoices.</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="rounded-md bg-sky-600 px-5 py-2.5 text-base font-medium text-white hover:bg-sky-700 whitespace-nowrap"
        >
          + Add item
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items or services…"
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-base text-slate-700 outline-none placeholder:text-slate-400"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`rounded-full border px-4 py-2 text-sm ${
              statusFilter === "ALL" ? "border-slate-300 bg-slate-100 font-semibold text-slate-800" : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("ACTIVE")}
            className={`rounded-full border px-4 py-2 text-sm ${
              statusFilter === "ACTIVE" ? "border-emerald-200 bg-emerald-50 font-medium text-emerald-700" : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter("INACTIVE")}
            className={`rounded-full border px-4 py-2 text-sm ${
              statusFilter === "INACTIVE" ? "border-slate-300 bg-slate-100 font-semibold text-slate-800" : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

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
            {loading && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-400"><Loader variant="inline" label="Loading items" /></td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-red-500">{error}</td>
              </tr>
            )}

            {!loading && !error && filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-sm font-medium text-sky-600 whitespace-nowrap">{item.itemCode}</td>
                <td className="px-6 py-3 text-base font-medium text-slate-800 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-3 text-base text-slate-600">{item.vatApplicable ? "Yes" : "No"}</td>
                <td className="px-6 py-3 text-base text-right tabular-nums text-slate-800 whitespace-nowrap">
                  {naira(item.unitPrice)}
                </td>
                <td className="px-6 py-3 text-base text-slate-600 whitespace-nowrap">{item.unit}</td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                      item.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-3 text-base text-slate-500">{item.description ?? "—"}</td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded px-3 py-1.5 text-sm text-slate-500 hover:bg-sky-50 hover:text-sky-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDelete(item)}
                    className="rounded px-3 py-1.5 text-sm text-rose-500 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!loading && !error && filteredItems.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-400">No items yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} onSave={handleAdd} />
      <EditItemModal open={editOpen} item={activeItem} onClose={() => setEditOpen(false)} onSave={handleEdit} />
      <DeleteItemModal
        open={deleteOpen}
        itemName={activeItem?.name}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
}