"use client";

import { useEffect, useState } from "react";
import { Customer } from "@/lib/api/types/accounting.types";
import { UpdateCustomerPayload } from "@/lib/api/types/accounting.types";

interface EditClientModalProps {
  open: boolean;
  client: Customer | null;
  onClose: () => void;
  onSave: (id: string, updates: UpdateCustomerPayload) => void;
}

export default function EditClientModal({ open, client, onClose, onSave }: EditClientModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (client) {
      setCompanyName(client.companyName);
      setTaxId(client.taxId ?? "");
      setContactPerson(client.contactPerson ?? "");
      setEmail(client.email);
      setPhone(client.phone ?? "");
      setAddress(client.address ?? "");
    }
  }, [client]);

  if (!open || !client) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(client.id, {
        companyName: companyName.trim(),
        taxId: taxId.trim() || undefined,
        contactPerson: contactPerson.trim() || undefined,
        email: email.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg text-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Edit Client</h2>
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Company Name</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Tax ID (TIN)</label>
            <input
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Contact Person</label>
            <input
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded border border-slate-200 px-3 py-2 text-xs"
              rows={2}
            />
          </div>

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