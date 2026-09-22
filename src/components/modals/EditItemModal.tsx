"use client";

import { useEffect, useState } from "react";
import { CatalogueItem } from "@/lib/api/types/accounting.types";

interface EditItemModalProps {
  open: boolean;
  item: CatalogueItem | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<{
    name: string;
    type: "ITEM" | "PRODUCT" | "SERVICE";
    unitPrice: string;
    unit: string;
    description: string;
    vatApplicable: boolean;
  }>) => void;
}

export default function EditItemModal({ open, item, onClose, onSave }: EditItemModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"ITEM" | "PRODUCT" | "SERVICE">("SERVICE");
  const [unitPrice, setUnitPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [vatApplicable, setVatApplicable] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setType(item.type);
      setUnitPrice(String(item.unitPrice));
      setUnit(item.unit);
      setDescription(item.description ?? "");
      setVatApplicable(item.vatApplicable);
    }
  }, [item]);

  if (!open || !item) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(item.id, {
        name: name.trim(),
        type,
        unitPrice: unitPrice.trim(),
        unit: unit.trim(),
        description: description.trim() || undefined,
        vatApplicable,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg text-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Edit Item / Service</h2>
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs bg-white"
            >
              <option value="SERVICE">Service</option>
              <option value="PRODUCT">Product</option>
              <option value="ITEM">Item</option>
            </select>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Unit Price (₦)</label>
              <input
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Unit</label>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={vatApplicable}
              onChange={(e) => setVatApplicable(e.target.checked)}
            />
            VAT applicable
          </label>

          <div className="mt-4 flex justify-end gap-2 pt-2 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-200 px-4 py-1.5 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded bg-sky-600 px-4 py-1.5 font-medium text-white hover:bg-sky-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}