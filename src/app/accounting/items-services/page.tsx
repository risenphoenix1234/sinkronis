// src/app/accounting/items-services/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import AddItemModal, { NewItemInput } from "@/components/modals/AddItemModal";
import EditItemModal from "@/components/modals/EditItemModal";
import DeleteItemModal from "@/components/modals/DeleteItemModal";
import { getCatalogueItems, createCatalogueItem, updateCatalogueItem, deleteCatalogueItem } from "@/lib/api/accounting";
import { CatalogueItem } from "@/lib/api/types/accounting.types";
import Loader from "@/components/ui/Loader";

function naira(value: number) {
  return `₦${value.toLocaleString()}`;
}

const typeStyles: Record<string, string> = {
  SERVICE: "bg-[#E3F2FD] text-[#1565C0]",
  PRODUCT: "bg-[#D8F3DC] text-[#1B7A34]",
  ITEM: "bg-[#F4F6F8] text-[#637381]",
};

const sentenceCase = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "—";

export default function ItemsServicesPage() {
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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
    <section className="min-h-[calc(100vh-5rem)] space-y-6 bg-[#F4F6F8] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#212B36]">Items &amp; Services</h1>
          <p className="mt-2 text-xs text-[#637381]">
            {items.length} {items.length === 1 ? "item" : "items"} in catalogue
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 whitespace-nowrap rounded-md bg-[#2183C6] px-6 py-3 text-base font-medium text-white hover:bg-[#1976B8]"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#919EAB]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items & services…"
          className="w-full border-b border-[#E2E6EB] bg-transparent py-3 pl-8 pr-2 text-sm text-[#212B36] outline-none placeholder:text-[#8B9197] focus:border-[#2183C6]"
        />
      </div>

      <div className="overflow-x-auto rounded-md border border-[#E5E8EB] bg-white">
        <table className="min-w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-dotted border-[#EBEEF0] text-[#637381]">
              <th className="px-3 py-3.5 font-normal">ID</th>
              <th className="px-3 py-3.5 font-normal">Name</th>
              <th className="px-3 py-3.5 font-normal">Type</th>
              <th className="px-3 py-3.5 font-normal">Unit Price</th>
              <th className="px-3 py-3.5 font-normal">Unit</th>
              <th className="px-3 py-3.5 font-normal">VAT</th>
              <th className="px-3 py-3.5 font-normal">Description</th>
              <th className="px-3 py-3.5 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-sm text-[#919EAB]"><Loader variant="inline" label="Loading items" /></td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-sm text-red-500">{error}</td>
              </tr>
            )}

            {!loading && !error && items.map((item) => (
              <tr key={item.id} className="even:bg-[#F2F2F7]">
                <td className="whitespace-nowrap px-3 py-3.5 text-[#2183C6]">{item.itemCode}</td>
                <td className="whitespace-nowrap px-3 py-3.5 font-medium text-[#212B36]">
                  {item.name}
                  {item.status !== "ACTIVE" && (
                    <span className="ml-2 rounded-full bg-[#F4F6F8] px-2 py-0.5 text-[11px] font-medium text-[#637381]">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-3 py-3.5">
                  <span
                    className={`rounded px-2 py-1 text-[11px] font-medium ${typeStyles[item.type] ?? "bg-[#F4F6F8] text-[#637381]"}`}
                  >
                    {sentenceCase(item.type)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 font-semibold tabular-nums text-[#212B36]">
                  {naira(item.unitPrice)}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-[#637381]">{item.unit}</td>
                <td className={`px-3 py-3.5 text-xs ${item.vatApplicable ? "font-medium text-[#1B7A34]" : "text-[#919EAB]"}`}>
                  {item.vatApplicable ? "7.5%" : "None"}
                </td>
                <td className="px-3 py-3.5 text-[#637381]">{item.description ?? "—"}</td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right">
                  <button
                    onClick={() => openEdit(item)}
                    aria-label={`Edit ${item.name}`}
                    className="mr-3 rounded p-1 text-[#637381] hover:bg-[#E3F2FD] hover:text-[#2183C6]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openDelete(item)}
                    aria-label={`Delete ${item.name}`}
                    className="rounded p-1 text-[#FF3B30] hover:bg-[#FFEBEE]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}

            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-sm text-[#919EAB]">No items yet.</td>
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