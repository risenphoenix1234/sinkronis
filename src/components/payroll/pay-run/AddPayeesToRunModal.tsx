// src/components/payroll/pay-run/AddPayeesToRunModal.tsx
"use client";

import { useState, useMemo } from "react";
import { X, Search, CheckSquare, Users, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { usePayees } from "@/context/payroll/PayeeContext";
import { UnifiedPayee, formatNaira } from "@/types/payroll/unified-payee";
import { addPayeesToClientPayRun } from "@/data/payroll/pay-run-store";

export interface AddPayeesToRunModalProps {
  open: boolean;
  onClose: () => void;
  runId: string;
  existingPayeeIds: string[];
  onSuccess: () => void;
}

export default function AddPayeesToRunModal({
  open,
  onClose,
  runId,
  existingPayeeIds = [],
  onSuccess,
}: AddPayeesToRunModalProps) {
  const { payees } = usePayees();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Existing set for quick lookup
  const existingSet = useMemo(() => new Set(existingPayeeIds), [existingPayeeIds]);

  // Available payees that are NOT already in this run
  const availablePayees = useMemo(() => {
    return payees.filter((p) => !existingSet.has(p.id) && !existingSet.has(p.name));
  }, [payees, existingSet]);

  // Filtered available payees
  const filteredPayees = useMemo(() => {
    return availablePayees.filter((p) => {
      const matchesSearch =
        search.trim() === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.role.toLowerCase().includes(search.toLowerCase()) ||
        p.bankName.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        typeFilter === "ALL" ||
        p.type === typeFilter ||
        (typeFilter === "Permanent" && p.type === "Employee") ||
        (typeFilter === "Contract" && (p.type === "Contractor" || p.type === "Vendor")) ||
        (typeFilter === "Consultant" && (p.type === "Director" || p.type === "Board Member"));

      return matchesSearch && matchesType;
    });
  }, [availablePayees, search, typeFilter]);

  const togglePayee = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredPayees.length && filteredPayees.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPayees.map((p) => p.id)));
    }
  };

  const selectedPayees = useMemo(() => {
    return availablePayees.filter((p) => selectedIds.has(p.id));
  }, [availablePayees, selectedIds]);

  const totalGross = selectedPayees.reduce((s, p) => s + p.grossSalary, 0);
  const totalNet = selectedPayees.reduce((s, p) => s + p.netSalary, 0);

  const handleAdd = () => {
    if (selectedPayees.length === 0) {
      toast.error("Please select at least one payee to add to this pay run.");
      return;
    }

    const updated = addPayeesToClientPayRun(runId, selectedPayees);
    if (updated) {
      toast.success(`Added ${selectedPayees.length} payees to pay run!`);
      onSuccess();
      setSelectedIds(new Set());
      onClose();
    } else {
      toast.error("Failed to update pay run.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl overflow-hidden my-6 border border-[#e2e8f0]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4 bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e0f2fe] text-[#0284c7]">
              <Users size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1f2937]">Add Payees to Pay Run</h2>
              <p className="text-xs text-[#6b7280]">
                Select additional eligible staff, contractors, or consultants for this pay run
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-[#667085] transition hover:bg-[#f2f4f7] hover:text-[#1f2937]"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-[#e5e7eb] bg-white space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search available payees by name, role, bank..."
                className="h-8 pl-8 text-xs"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8 rounded-md border border-[#e5e7eb] bg-white px-2.5 text-xs outline-none focus:border-[#2183c6]"
            >
              <option value="ALL">All Classifications</option>
              <option value="Permanent">Permanent</option>
              <option value="Contract">Contract</option>
              <option value="Consultant">Consultant</option>
            </select>

            <button
              type="button"
              onClick={toggleSelectAll}
              className="inline-flex items-center gap-1 rounded-md border border-[#d0d5dd] bg-white px-2.5 py-1 text-xs font-medium text-[#374151] hover:bg-[#f9fafb]"
            >
              <CheckSquare size={13} className="text-[#2183c6]" />
              <span>Toggle All</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748b]">
            <span>
              Available: <strong>{filteredPayees.length}</strong> | Selected:{" "}
              <strong className="text-[#16a34a]">{selectedIds.size}</strong>
            </span>
            {selectedIds.size > 0 && (
              <span>
                Net Addition: <strong className="text-[#16a34a]">{formatNaira(totalNet)}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Checklist */}
        <div className="max-h-[320px] overflow-y-auto px-6 divide-y divide-[#f1f5f9]">
          {filteredPayees.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#9ca3af]">
              {availablePayees.length === 0
                ? "All registered payees are already included in this pay run."
                : "No available payees matched your search criteria."}
            </div>
          ) : (
            filteredPayees.map((payee) => {
              const isSelected = selectedIds.has(payee.id);

              return (
                <div
                  key={payee.id}
                  onClick={() => togglePayee(payee.id)}
                  className={`flex items-center justify-between py-2.5 px-2 cursor-pointer rounded-lg transition ${
                    isSelected ? "bg-[#f0f9ff]/70" : "hover:bg-[#fafafa]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="h-4 w-4 rounded border-[#d0d5dd] text-[#2183c6] focus:ring-[#2183c6]"
                    />
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f4fd] text-[11px] font-bold text-[#2183c6]">
                      {payee.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#1f2937]">
                          {payee.name}
                        </span>
                        <span className="text-[10px] rounded px-1.5 py-0.2 bg-[#f3f4f6] text-[#4b5563] font-medium">
                          {payee.type}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6b7280]">
                        {payee.role} &bull; {payee.bankName}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-[#15803d]">
                      {formatNaira(payee.netSalary)}
                    </div>
                    <div className="text-[10px] text-[#9ca3af]">
                      Gross: {formatNaira(payee.grossSalary)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#f0f0f0] bg-[#fafafa] px-6 py-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAdd}
            disabled={selectedIds.size === 0}
            className="gap-1.5 bg-[#16a34a] hover:bg-[#15803d]"
          >
            <Plus size={14} />
            Add {selectedIds.size} {selectedIds.size === 1 ? "Payee" : "Payees"} to Pay Run
          </Button>
        </div>
      </div>
    </div>
  );
}
