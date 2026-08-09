// src/components/modals/GenerateInvoiceModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { allTenants } from "@/lib/pa-tenants-data";
// Note: allTenants still comes from your existing tenants file — untouched.
// Invoice-related data (used on the billing page) lives in @/lib/platform-billing-data.

export interface NewInvoiceInput {
  tenant: string;
  period: string;
  amount: number;
}

interface GenerateInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (input: NewInvoiceInput) => void;
}

export default function GenerateInvoiceModal({
  open,
  onClose,
  onGenerate,
}: GenerateInvoiceModalProps) {
  const [tenant, setTenant] = useState("");
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");

  if (!open) return null;

  const resetForm = () => {
    setTenant("");
    setPeriod("");
    setAmount("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGenerate = () => {
    if (!tenant.trim() || !period.trim()) return;

    onGenerate({
      tenant: tenant.trim(),
      period: period.trim(),
      amount: Number(amount) || 0,
    });

    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Generate Invoice</h2>
            <p className="mt-0.5 text-xs text-slate-500">Create a new invoice for a tenant</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-700">
              Tenant <span className="text-red-500">*</span>
            </label>
            <select
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a tenant</option>
              {allTenants.map((t) => (
                <option key={t.id} value={t.company}>
                  {t.company}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">
              Period <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="e.g. Aug 2026"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Amount (₦)</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleGenerate}
            className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Generate
          </button>
          <button
            onClick={handleClose}
            className="flex-1 rounded-md border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}