// src/components/modals/GenerateInvoiceModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

export interface NewInvoiceInput {
  tenantId: string;
  period: string;
  amount: number;
}

interface TenantOption {
  id: string;
  name: string;
}

interface GenerateInvoiceModalProps {
  open: boolean;
  tenants: TenantOption[];
  onClose: () => void;
  onGenerate: (input: NewInvoiceInput) => void;
}

export default function GenerateInvoiceModal({
  open,
  tenants,
  onClose,
  onGenerate,
}: GenerateInvoiceModalProps) {
  const [tenantId, setTenantId] = useState("");
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");

  if (!open) return null;

  const resetForm = () => {
    setTenantId("");
    setPeriod("");
    setAmount("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGenerate = () => {
    if (!tenantId || !period || !amount) return;

    onGenerate({
      tenantId,
      period,
      amount: Number(amount),
    });

    resetForm();
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
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Select a tenant</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">
              Period <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">
              Amount (₦) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleGenerate}
            className="flex-1 rounded-md bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700"
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