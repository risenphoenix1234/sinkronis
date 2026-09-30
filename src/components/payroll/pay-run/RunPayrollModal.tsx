// components/payroll/pay-run/RunPayrollModal.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Search, CheckSquare, Square, Filter, Users, Calculator } from "lucide-react";
import { usePayees } from "@/context/payroll/PayeeContext";
import { UnifiedPayee, PayeeType, formatNaira } from "@/types/payroll/unified-payee";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export type RunPayrollSubmitData = {
  periodLabel: string;
  from: string;
  to: string;
  selectedPayees: UnifiedPayee[];
};

type RunPayrollModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RunPayrollSubmitData) => void;
};

export default function RunPayrollModal({
  open,
  onClose,
  onSubmit,
}: RunPayrollModalProps) {
  const { payees } = usePayees();

  // Period inputs
  const [periodLabel, setPeriodLabel] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Payee selection state: set of selected payee IDs
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Search and filter inside modal
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<PayeeType | "ALL">("ALL");

  // Initialize dates and default selections when opened
  useEffect(() => {
    if (open) {
      const now = new Date();
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const curMonth = monthNames[now.getMonth()];
      const curYear = now.getFullYear();
      setPeriodLabel(`${curMonth} ${curYear}`);

      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .slice(0, 10);

      setFromDate(firstDay);
      setToDate(lastDay);

      // Default to selecting all active payees who are onPayroll
      const initialSelected = new Set(
        payees
          .filter((p) => p.onPayroll && p.status === "Active")
          .map((p) => p.id),
      );
      setSelectedIds(initialSelected);
    }
  }, [open, payees]);

  // Filtered payees inside modal
  const visiblePayees = useMemo(() => {
    return payees.filter((p) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "ALL" ||
        p.type === typeFilter ||
        (typeFilter === "Permanent" && p.type === "Employee") ||
        (typeFilter === "Contract" && (p.type === "Contractor" || p.type === "Vendor")) ||
        (typeFilter === "Consultant" && (p.type === "Director" || p.type === "Board Member"));

      return matchesSearch && matchesType;
    });
  }, [payees, searchTerm, typeFilter]);

  // Totals of currently selected payees
  const { selectedCount, totalGross, totalDeductions, totalNet, selectedPayeesList } = useMemo(() => {
    const list = payees.filter((p) => selectedIds.has(p.id));
    const gross = list.reduce((sum, p) => sum + p.grossSalary, 0);
    const deductions = list.reduce((sum, p) => sum + p.deductions.totalDeductions, 0);
    const net = list.reduce((sum, p) => sum + p.netSalary, 0);

    return {
      selectedCount: list.length,
      totalGross: gross,
      totalDeductions: deductions,
      totalNet: net,
      selectedPayeesList: list,
    };
  }, [payees, selectedIds]);

  if (!open) return null;

  const toggleSelectAll = () => {
    const allVisibleIds = visiblePayees.map((p) => p.id);
    const allSelected = allVisibleIds.every((id) => selectedIds.has(id));

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        allVisibleIds.forEach((id) => next.delete(id));
      } else {
        allVisibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const togglePayee = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isValid =
    periodLabel.trim() !== "" &&
    fromDate !== "" &&
    toDate !== "" &&
    selectedCount > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onSubmit({
      periodLabel,
      from: fromDate,
      to: toDate,
      selectedPayees: selectedPayeesList,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#1f2937]">Run Payroll</h2>
            <p className="text-xs text-[#6b7280]">
              Select pay period dates and choose payees to include in this pay run
            </p>
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

        <form onSubmit={handleSubmit}>
          {/* Top Form Fields: Period & Dates */}
          <div className="border-b border-[#f0f0f0] bg-[#fafafa] px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#374151]">
                  Pay Period Label <span className="text-red-500">*</span>
                </label>
                <Input
                  value={periodLabel}
                  onChange={(e) => setPeriodLabel(e.target.value)}
                  placeholder="e.g. October 2026"
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#374151]">
                  From Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#374151]">
                  To Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Payee Selection Controls */}
          <div className="px-6 pt-4 pb-2 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#2183c6]" />
                <span className="text-xs font-bold text-[#1f2937]">Select Payees for this Run</span>
                <span className="rounded-full bg-[#e0f2fe] text-[#0369a1] px-2 py-0.5 text-[11px] font-semibold">
                  {selectedCount} of {payees.length} selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="inline-flex items-center gap-1 rounded-md border border-[#d0d5dd] bg-white px-2.5 py-1 text-xs font-medium text-[#374151] hover:bg-[#f9fafb]"
                >
                  <CheckSquare size={13} className="text-[#2183c6]" />
                  <span>Toggle All Visible</span>
                </button>
              </div>
            </div>

            {/* Quick search & filter in modal */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter payees by name, role, dept..."
                  className="h-8 pl-8 text-xs"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="h-8 rounded-md border border-[#e5e7eb] bg-white px-2 text-xs outline-none focus:border-[#2183c6]"
              >
                <option value="ALL">All Classifications</option>
                <option value="Permanent">Permanent (PAYE)</option>
                <option value="Contract">Contract (5% WHT)</option>
                <option value="Consultant">Consultant (0% Tax)</option>
              </select>
            </div>
          </div>

          {/* Payee Selection Scrollable Checklist */}
          <div className="max-h-[300px] overflow-y-auto px-6 divide-y divide-[#f0f0f0] border-t border-b border-[#f0f0f0]">
            {visiblePayees.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#9ca3af]">
                No payees found matching &quot;{searchTerm}&quot;
              </div>
            ) : (
              visiblePayees.map((payee) => {
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
                        onChange={() => {}} // handled by parent onClick
                        className="h-4 w-4 rounded border-[#d0d5dd] text-[#2183c6] focus:ring-[#2183c6]"
                      />
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f4fd] text-[11px] font-bold text-[#2183c6]">
                        {payee.avatar || payee.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#1f2937]">{payee.name}</span>
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
                        Gross: {formatNaira(payee.grossSalary)} (ded. -{formatNaira(payee.deductions.totalDeductions)})
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Live Run Summary Footer */}
          <div className="bg-[#f0f9ff] border-t border-[#bae6fd] px-6 py-3.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Calculator size={15} className="text-[#0369a1]" />
                <span className="font-semibold text-[#0369a1]">Run Totals ({selectedCount} Payees Selected):</span>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[#64748b] block text-[10px]">Total Gross</span>
                  <span className="font-bold text-[#0f172a]">{formatNaira(totalGross)}</span>
                </div>
                <div>
                  <span className="text-[#64748b] block text-[10px]">Total Deductions</span>
                  <span className="font-bold text-[#b91c1c]">-{formatNaira(totalDeductions)}</span>
                </div>
                <div>
                  <span className="text-[#64748b] block text-[10px]">Total Net Payout</span>
                  <span className="font-extrabold text-[#15803d] text-sm">{formatNaira(totalNet)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between bg-white px-6 py-4 border-t border-[#f0f0f0]">
            <span className="text-xs text-[#6b7280]">
              {selectedCount === 0 && (
                <span className="text-red-500 font-medium">Please select at least one payee to proceed</span>
              )}
            </span>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!isValid}
              >
                Create &amp; Run Payroll ({selectedCount})
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
