// src/app/payroll/payees/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Download,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Building,
  CreditCard,
  FileText,
  Shield,
  Layers,
  Calendar,
  Save,
  X,
  Plus,
  Calculator,
  Gift,
  HelpCircle,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import { usePayees } from "@/context/payroll/PayeeContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import SearchableCreatableSelect, {
  NIGERIAN_BANKS,
  NIGERIAN_PFAS,
} from "@/components/ui/SearchableCreatableSelect";
import {
  UnifiedPayee,
  PayeeType,
  PayeeStatus,
  EmploymentType,
  TaxStatus,
  formatNaira,
  calculatePayeeDeductions,
  getDefaultTaxStatus,
} from "@/types/payroll/unified-payee";
import Documents from "@/components/payroll/payee/Documents";
import RemovePayeeModal from "@/components/payroll/payee/RemovePayeeModal";

const TABS = [
  "Overview",
  "Pay Breakdown",
  "Deductions & Loans",
  "Benefit in Kind (BIK)",
  "Payment History",
  "Documents",
] as const;

type TabType = (typeof TABS)[number];

export default function PayeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { getPayeeById, updatePayee, deletePayee, toggleOnPayroll } = usePayees();
  const payee = getPayeeById(idParam as string);

  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  const [isEditing, setIsEditing] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  // Editable Form State (for inline editing)
  const [formData, setFormData] = useState<UnifiedPayee | null>(null);

  // Initialize or reset formData when payee changes or edit mode toggles
  useEffect(() => {
    if (payee) {
      setFormData({ ...payee });
    }
  }, [payee, isEditing]);

  if (!payee || !formData) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#1f2937]">Payee Not Found</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          The payee with ID <code className="text-[#2183c6]">{idParam}</code> could not be found.
        </p>
        <Button
          onClick={() => router.push("/payroll/payees")}
          variant="primary"
          size="sm"
          className="mt-5"
        >
          Return to Payees
        </Button>
      </div>
    );
  }

  const isPermanent = (isEditing ? formData.type : payee.type) === "Permanent";
  const isContract = (isEditing ? formData.type : payee.type) === "Contract";
  const isConsultant = (isEditing ? formData.type : payee.type) === "Consultant";

  // Handle Input Changes in Inline Edit Mode
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Automatically sync taxStatus if type changes
      if (name === "type") {
        const newType = value as PayeeType;
        if (newType === "Contract") updated.taxStatus = "WHT";
        else if (newType === "Consultant") updated.taxStatus = "None";
        else updated.taxStatus = "PAYE";
      }

      return updated;
    });
  };

  // Recalculate live totals for the edit session
  const currentGross = isPermanent
    ? (Number(formData.basicSalary) || 0) +
      (Number(formData.housingAllowance) || 0) +
      (Number(formData.transportAllowance) || 0) +
      (Number(formData.otherAllowance) || 0)
    : Number(formData.grossSalary) || 0;

  const liveDeductions = calculatePayeeDeductions({
    type: formData.type,
    grossSalary: currentGross,
    basicSalary: Number(formData.basicSalary) || 0,
    housingAllowance: Number(formData.housingAllowance) || 0,
    transportAllowance: Number(formData.transportAllowance) || 0,
    otherAllowance: Number(formData.otherAllowance) || 0,
    taxStatus: formData.taxStatus,
    taxable: formData.taxable,
    customDeductions: formData.deductions?.customDeductions,
    loans: formData.loans,
  });

  const handleSaveChanges = () => {
    if (!formData.name.trim()) {
      toast.error("Payee name cannot be empty.");
      return;
    }
    if (!formData.bankAccount.trim()) {
      toast.error("Bank account number is required.");
      return;
    }

    const updated: UnifiedPayee = {
      ...formData,
      grossSalary: currentGross,
      deductions: liveDeductions.deductions,
      netSalary: liveDeductions.netSalary,
    };

    updatePayee(payee.id, updated);
    setIsEditing(false);
    toast.success("Payee information updated successfully!");
  };

  const handleCancelEdit = () => {
    setFormData({ ...payee });
    setIsEditing(false);
  };

  const handleRemove = () => {
    deletePayee(payee.id);
    toast.success("Payee removed successfully");
    router.push("/payroll/payees");
  };

  const handleExportHistory = () => {
    const records = payee.paymentHistory || [];
    if (records.length === 0) {
      toast.info("No payment records available to export for this payee.");
      return;
    }

    const headers = ["Period", "Amount", "Payment Date", "Reference", "Status"];
    const rows = records.map((r) => [
      `"${r.period}"`,
      r.amount,
      `"${r.paymentDate}"`,
      `"${r.reference}"`,
      r.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `payment-history-${payee.name.replace(/\s+/g, "_")}-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Payment history exported!");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => router.push("/payroll/payees")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748b] hover:text-[#0f172a] transition"
        >
          <ChevronLeft size={16} />
          <span>Return to Payees</span>
        </button>

        <div className="flex items-center gap-2.5">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="gap-1.5"
              >
                <X size={14} />
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveChanges}
                className="gap-1.5 bg-[#16a34a] hover:bg-[#15803d]"
              >
                <Save size={14} />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-1.5"
              >
                <Edit size={14} />
                Edit Payee
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRemoveOpen(true)}
                className="gap-1.5 text-[#b91c1c] hover:bg-[#fef2f2] hover:border-[#fca5a5]"
              >
                <Trash2 size={14} />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Editing Mode Banner */}
      {isEditing && (
        <div className="flex items-center justify-between rounded-lg bg-[#eff6ff] border border-[#bfdbfe] px-4 py-2.5 text-xs text-[#1e40af]">
          <span className="font-semibold flex items-center gap-1.5">
            <Edit size={14} />
            Inline Editing Mode Active — Modify any field directly and click "Save Changes" above.
          </span>
          <span className="text-[11px] text-[#3b82f6]">No modal required</span>
        </div>
      )}

      {/* Payee Profile Header Card */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e0f2fe] text-xl font-bold text-[#0369a1] border-2 border-white shadow-sm">
              {payee.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-[#0f172a]">{payee.name}</h1>
                <StatusBadge status={payee.status} variant="pill" />
              </div>

              <div className="mt-1.5 flex items-center gap-2 text-xs text-[#64748b]">
                <span>Payee ID:</span>
                <code className="text-[#0f172a] font-mono font-medium">{payee.id}</code>
              </div>
            </div>
          </div>

          {/* Quick Pay Stats */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-[#f1f5f9] pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-[11px] font-medium text-[#64748b] block">Monthly Gross</span>
              <span className="text-base font-bold text-[#0f172a]">
                {formatNaira(isEditing ? currentGross : payee.grossSalary)}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-medium text-[#64748b] block">Net Take-Home</span>
              <span className="text-base font-bold text-[#16a34a]">
                {formatNaira(isEditing ? liveDeductions.netSalary : payee.netSalary)}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[11px] font-medium text-[#64748b] mb-1">On Payroll</span>
              <button
                type="button"
                onClick={() => toggleOnPayroll(payee.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  payee.onPayroll ? "bg-[#2183c6]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    payee.onPayroll ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex border-b border-[#e2e8f0] overflow-x-auto space-x-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-3 text-xs font-semibold border-b-2 transition ${
              activeTab === tab
                ? "border-[#2183c6] text-[#2183c6]"
                : "border-transparent text-[#64748b] hover:text-[#0f172a]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: OVERVIEW                                                       */}
      {/* ==================================================================== */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Personal Information Card (Left Column) */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <User size={16} className="text-[#2183c6]" />
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#64748b] block mb-1">Full Name</span>
                {isEditing ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-9 text-xs font-semibold"
                  />
                ) : (
                  <span className="font-semibold text-[#0f172a]">{payee.name}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">Role / Job Title</span>
                {isEditing ? (
                  <Input
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="h-9 text-xs"
                  />
                ) : (
                  <span className="font-semibold text-[#0f172a]">{payee.role}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">Payee Classification</span>
                {isEditing ? (
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="h-9 w-full rounded border border-[#e2e8f0] px-2 text-xs"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                    <option value="Consultant">Consultant</option>
                  </select>
                ) : (
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      payee.type === "Permanent"
                        ? "bg-[#e0f2fe] text-[#0284c7]"
                        : payee.type === "Contract"
                        ? "bg-[#fef3c7] text-[#b45309]"
                        : "bg-[#f3e8ff] text-[#7e22ce]"
                    }`}
                  >
                    {payee.type}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">Tax Status</span>
                {isEditing ? (
                  <select
                    name="taxStatus"
                    value={formData.taxStatus}
                    onChange={handleInputChange}
                    className="h-9 w-full rounded border border-[#e2e8f0] px-2 text-xs font-semibold"
                  >
                    <option value="PAYE">PAYE (PIT Act Progressive)</option>
                    <option value="WHT">WHT (5% Withholding Tax)</option>
                    <option value="None">None (Tax Exempt / 0%)</option>
                  </select>
                ) : (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f1f5f9] text-[#475569]">
                    {payee.taxStatus === "WHT"
                      ? "WHT (5% Withholding Tax)"
                      : payee.taxStatus === "None"
                      ? "None (Tax Exempt / 0%)"
                      : "PAYE (PIT Act Progressive)"}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">Date Added / Onboarded</span>
                {isEditing ? (
                  <Input
                    name="dateOnboarded"
                    type="date"
                    value={formData.dateOnboarded}
                    onChange={handleInputChange}
                    className="h-9 text-xs"
                  />
                ) : (
                  <span className="font-semibold text-[#0f172a]">{payee.dateOnboarded || payee.joinDate || "N/A"}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">Engagement Type</span>
                {isEditing ? (
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className="h-9 w-full rounded border border-[#e2e8f0] px-2 text-xs"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Retainer">Retainer</option>
                  </select>
                ) : (
                  <span className="font-semibold text-[#0f172a]">{payee.employmentType || "Full-time"}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">Email Address</span>
                {isEditing ? (
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-9 text-xs"
                  />
                ) : (
                  <span className="font-semibold text-[#0f172a]">{payee.email || "—"}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">Phone Number</span>
                {isEditing ? (
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="h-9 text-xs"
                  />
                ) : (
                  <span className="font-semibold text-[#0f172a]">{payee.phone || "—"}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">State of Residence</span>
                {isEditing ? (
                  <Input
                    name="stateOfResidence"
                    value={formData.stateOfResidence}
                    onChange={handleInputChange}
                    className="h-9 text-xs"
                  />
                ) : (
                  <span className="font-semibold text-[#0f172a]">{payee.stateOfResidence || "Lagos"}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">Payee Status</span>
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="h-9 w-full rounded border border-[#e2e8f0] px-2 text-xs font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                ) : (
                  <StatusBadge status={payee.status} variant="pill" />
                )}
              </div>
            </div>
          </div>

          {/* Right Side Column: Tax Regime & Banking Disbursement */}
          <div className="space-y-6">
            {/* Statutory & Tax IDs */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <Shield size={16} className="text-[#2183c6]" />
                Tax Regime & Statutory Records
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#64748b] block mb-1">Tax Status</span>
                {isEditing ? (
                  <select
                    name="taxStatus"
                    value={formData.taxStatus}
                    onChange={handleInputChange}
                    className="h-9 w-full rounded border border-[#e2e8f0] px-2 text-xs font-semibold"
                  >
                    <option value="PAYE">PAYE (PIT Act Progressive)</option>
                    <option value="WHT">WHT (5% Withholding Tax)</option>
                    <option value="None">None (Tax Exempt / 0%)</option>
                  </select>
                ) : (
                  <span className="font-semibold text-[#0f172a]">{payee.taxStatus || "PAYE"}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">Tax ID (TIN)</span>
                {isEditing ? (
                  <Input
                    name="tin"
                    value={formData.statutory?.tin || ""}
                    onChange={(e) =>
                      setFormData((p) =>
                        p
                          ? {
                              ...p,
                              statutory: { ...p.statutory, tin: e.target.value },
                            }
                          : null,
                      )
                    }
                    className="h-9 text-xs"
                    placeholder="e.g. 1234567-0001"
                  />
                ) : (
                  <span className="font-mono font-medium text-[#0f172a]">{payee.statutory?.tin || "—"}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">Pension PIN</span>
                {isEditing ? (
                  <Input
                    name="pensionPin"
                    value={formData.statutory?.pensionPin || ""}
                    onChange={(e) =>
                      setFormData((p) =>
                        p
                          ? {
                              ...p,
                              statutory: { ...p.statutory, pensionPin: e.target.value },
                            }
                          : null,
                      )
                    }
                    className="h-9 text-xs"
                    placeholder="PEN100..."
                  />
                ) : (
                  <span className="font-mono font-medium text-[#0f172a]">{payee.statutory?.pensionPin || "—"}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">Pension Administrator (PFA)</span>
                {isEditing ? (
                  <SearchableCreatableSelect
                    value={formData.statutory?.pfaName || ""}
                    onChange={(val) =>
                      setFormData((p) =>
                        p
                          ? {
                              ...p,
                              statutory: { ...p.statutory, pfaName: val },
                            }
                          : null,
                      )
                    }
                    options={NIGERIAN_PFAS}
                    placeholder="Select PFA..."
                  />
                ) : (
                  <span className="font-semibold text-[#0f172a]">{payee.statutory?.pfaName || "—"}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">NHF Number</span>
                {isEditing ? (
                  <Input
                    name="nhfNumber"
                    value={formData.statutory?.nhfNumber || ""}
                    onChange={(e) =>
                      setFormData((p) =>
                        p
                          ? {
                              ...p,
                              statutory: { ...p.statutory, nhfNumber: e.target.value },
                            }
                          : null,
                      )
                    }
                    className="h-9 text-xs"
                    placeholder="NHF-123456"
                  />
                ) : (
                  <span className="font-mono font-medium text-[#0f172a]">{payee.statutory?.nhfNumber || "—"}</span>
                )}
              </div>
            </div>
          </div>

          {/* Banking & Payout Destination */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <CreditCard size={16} className="text-[#2183c6]" />
                Banking & Disbursement Destination
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[#64748b] block mb-1">Bank Name</span>
                {isEditing ? (
                  <SearchableCreatableSelect
                    value={formData.bankName}
                    onChange={(val) =>
                      setFormData((p) => (p ? { ...p, bankName: val } : null))
                    }
                    options={NIGERIAN_BANKS}
                    placeholder="Search bank name..."
                  />
                ) : (
                  <span className="font-semibold text-[#0f172a]">{payee.bankName}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">Account Number (NUBAN)</span>
                {isEditing ? (
                  <Input
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleInputChange}
                    className="h-9 text-xs font-mono"
                    maxLength={10}
                  />
                ) : (
                  <span className="font-mono font-semibold text-[#0f172a]">{payee.bankAccount}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] block mb-1">Account Holder Name</span>
                {isEditing ? (
                  <Input
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    className="h-9 text-xs"
                  />
                ) : (
                  <span className="font-semibold text-[#0f172a]">{payee.accountName}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: PAY BREAKDOWN                                                  */}
      {/* ==================================================================== */}
      {activeTab === "Pay Breakdown" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Earnings Structure Card */}
            <div className="lg:col-span-2 rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0f172a]">Earnings Package (Monthly)</h3>
                  <p className="text-xs text-[#64748b]">Fixed breakdown of base pay and standard allowances</p>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#e0f2fe] text-[#0369a1]">
                  {formatNaira(isEditing ? currentGross : payee.grossSalary)} / mo
                </span>
              </div>

              {isPermanent ? (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[#64748b] block mb-1">Basic Salary (₦)</label>
                    {isEditing ? (
                      <Input
                        name="basicSalary"
                        type="number"
                        value={formData.basicSalary || ""}
                        onChange={handleInputChange}
                        className="h-9 text-xs"
                      />
                    ) : (
                      <span className="font-bold text-[#0f172a] text-sm">
                        {formatNaira(payee.basicSalary || 0)}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[#64748b] block mb-1">Housing Allowance (₦)</label>
                    {isEditing ? (
                      <Input
                        name="housingAllowance"
                        type="number"
                        value={formData.housingAllowance || ""}
                        onChange={handleInputChange}
                        className="h-9 text-xs"
                      />
                    ) : (
                      <span className="font-bold text-[#0f172a] text-sm">
                        {formatNaira(payee.housingAllowance || 0)}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[#64748b] block mb-1">Transport Allowance (₦)</label>
                    {isEditing ? (
                      <Input
                        name="transportAllowance"
                        type="number"
                        value={formData.transportAllowance || ""}
                        onChange={handleInputChange}
                        className="h-9 text-xs"
                      />
                    ) : (
                      <span className="font-bold text-[#0f172a] text-sm">
                        {formatNaira(payee.transportAllowance || 0)}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[#64748b] block mb-1">Other Allowance (₦)</label>
                    {isEditing ? (
                      <Input
                        name="otherAllowance"
                        type="number"
                        value={formData.otherAllowance || ""}
                        onChange={handleInputChange}
                        className="h-9 text-xs"
                      />
                    ) : (
                      <span className="font-bold text-[#0f172a] text-sm">
                        {formatNaira(payee.otherAllowance || 0)}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-xs text-[#64748b] block">Monthly Contract / Retainer Fee (₦)</label>
                  {isEditing ? (
                    <Input
                      name="grossSalary"
                      type="number"
                      value={formData.grossSalary || ""}
                      onChange={handleInputChange}
                      className="h-10 text-sm font-bold max-w-sm"
                    />
                  ) : (
                    <span className="font-bold text-[#0f172a] text-lg">
                      {formatNaira(payee.grossSalary)}
                    </span>
                  )}
                  <p className="text-xs text-[#64748b]">
                    {isContract
                      ? "5% Withholding Tax (WHT) is automatically deducted before net payout."
                      : "Consultancy retainers are disbursed without tax deductions."}
                  </p>
                </div>
              )}
            </div>

            {/* Live Statutory Breakdown Card */}
            <div className="rounded-xl border border-[#bae6fd] bg-[#f0f9ff] p-5 shadow-sm space-y-4">
              <div className="border-b border-[#bae6fd] pb-3">
                <h3 className="text-sm font-bold text-[#0369a1] flex items-center gap-1.5">
                  <Calculator size={16} />
                  Statutory Deductions Preview
                </h3>
                <span className="text-xs text-[#0284c7]">
                  {isPermanent
                    ? "Based on Nigerian FIRS & PENCOM laws"
                    : isContract
                    ? "5% FIRS Withholding Tax"
                    : "Tax Exempt"}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {isPermanent ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-[#e0f2fe]">
                      <span className="text-[#475569]">PAYE Income Tax:</span>
                      <span className="font-bold text-[#b91c1c]">
                        {formatNaira(
                          isEditing
                            ? liveDeductions.deductions.paye
                            : payee.deductions.paye,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#e0f2fe]">
                      <span className="text-[#475569]">Employee Pension (8%):</span>
                      <span className="font-bold text-[#b45309]">
                        {formatNaira(
                          isEditing
                            ? liveDeductions.deductions.employeePension
                            : payee.deductions.employeePension,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#e0f2fe]">
                      <span className="text-[#475569]">NHF (2.5% Basic):</span>
                      <span className="font-bold text-[#7e22ce]">
                        {formatNaira(
                          isEditing
                            ? liveDeductions.deductions.nhf
                            : payee.deductions.nhf,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-[#e0f2fe]">
                      <span className="text-[#475569]">Employer Pension (10%):</span>
                      <span className="font-medium text-[#475569]">
                        {formatNaira(
                          isEditing
                            ? liveDeductions.deductions.employerPension
                            : payee.deductions.employerPension,
                        )}
                      </span>
                    </div>
                  </>
                ) : isContract ? (
                  <div className="flex justify-between py-2 border-b border-[#e0f2fe]">
                    <span className="text-[#475569]">Withholding Tax (5% WHT):</span>
                    <span className="font-bold text-[#b91c1c]">
                      {formatNaira(
                        isEditing
                          ? liveDeductions.deductions.totalDeductions
                          : payee.deductions.totalDeductions,
                      )}
                    </span>
                  </div>
                ) : (
                  <div className="py-2 text-center text-[#16a34a] font-medium">
                    No tax deducted (0% rate applied)
                  </div>
                )}

                <div className="flex justify-between pt-2 text-sm font-bold">
                  <span className="text-[#0369a1]">Total Deductions:</span>
                  <span className="text-[#b91c1c]">
                    {formatNaira(
                      isEditing
                        ? liveDeductions.deductions.totalDeductions
                        : payee.deductions.totalDeductions,
                    )}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-[#bae6fd] text-sm font-bold">
                  <span className="text-[#0369a1]">Net Take-Home:</span>
                  <span className="text-[#16a34a] text-base">
                    {formatNaira(
                      isEditing
                        ? liveDeductions.netSalary
                        : payee.netSalary,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: DEDUCTIONS & LOANS                                             */}
      {/* ==================================================================== */}
      {activeTab === "Deductions & Loans" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custom Deductions Card */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0f172a]">Custom & Voluntary Deductions</h3>
                  <p className="text-xs text-[#64748b]">Deductions configured specifically for this payee</p>
                </div>
              </div>

              {(payee.deductions?.customDeductions || []).length > 0 ? (
                <div className="space-y-2">
                  {payee.deductions.customDeductions.map((cd) => (
                    <div
                      key={cd.id}
                      className="flex items-center justify-between rounded-lg border border-[#e2e8f0] p-3 text-xs"
                    >
                      <span className="font-semibold text-[#0f172a]">{cd.name}</span>
                      <span className="font-bold text-[#b91c1c]">{formatNaira(cd.amount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-[#f8fafc] border border-dashed border-[#cbd5e1] p-6 text-center text-xs text-[#64748b]">
                  No custom voluntary deductions registered for this payee.
                </div>
              )}
            </div>

            {/* Active Loans & Repayments */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0f172a]">Employee Loans & Repayments</h3>
                  <p className="text-xs text-[#64748b]">Active company advances or staff loans</p>
                </div>
              </div>

              {(payee.loans || []).length > 0 ? (
                <div className="space-y-3">
                  {(payee.loans || []).map((loan) => (
                    <div
                      key={loan.id}
                      className="rounded-lg border border-[#e2e8f0] p-3.5 text-xs space-y-2"
                    >
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-[#0f172a]">{loan.name}</span>
                        <span className="text-[#0284c7] font-bold">
                          {formatNaira(loan.monthlyDeduction)} / mo
                        </span>
                      </div>
                      <div className="flex justify-between text-[#64748b] text-[11px]">
                        <span>Remaining: {formatNaira(loan.balanceRemaining)}</span>
                        <span>Total: {formatNaira(loan.totalAmount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-[#f8fafc] border border-dashed border-[#cbd5e1] p-6 text-center text-xs text-[#64748b]">
                  No active loans or advances on record.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: BENEFIT IN KIND (BIK)                                          */}
      {/* ==================================================================== */}
      {activeTab === "Benefit in Kind (BIK)" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
              <div className="border-b border-[#f1f5f9] pb-3">
                <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                  <Gift size={16} className="text-[#2183c6]" />
                  Benefit in Kind (BIK) Provisions
                </h3>
                <p className="text-xs text-[#64748b] mt-1">
                  Non-cash benefits provided by the employer. These do not reduce monthly take-home pay but are recorded for compliance and tax valuation.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[#64748b] block mb-1">HMO / Health Insurance (₦)</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.bik?.hmo || 0}
                      onChange={(e) =>
                        setFormData((p) =>
                          p
                            ? {
                                ...p,
                                bik: { ...p.bik, hmo: Number(e.target.value) },
                              }
                            : null,
                        )
                      }
                      className="h-9 text-xs"
                    />
                  ) : (
                    <span className="font-bold text-[#0f172a] text-sm">
                      {formatNaira(payee.bik?.hmo || 25000)}
                    </span>
                  )}
                  <p className="text-[10px] text-[#94a3b8] mt-1">Monthly company medical plan</p>
                </div>

                <div>
                  <label className="text-[#64748b] block mb-1">Airtime / Data Allowance (₦)</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.bik?.airtime || 0}
                      onChange={(e) =>
                        setFormData((p) =>
                          p
                            ? {
                                ...p,
                                bik: { ...p.bik, airtime: Number(e.target.value) },
                              }
                            : null,
                        )
                      }
                      className="h-9 text-xs"
                    />
                  ) : (
                    <span className="font-bold text-[#0f172a] text-sm">
                      {formatNaira(payee.bik?.airtime || 10000)}
                    </span>
                  )}
                  <p className="text-[10px] text-[#94a3b8] mt-1">Monthly cellular provision</p>
                </div>

                <div>
                  <label className="text-[#64748b] block mb-1">Lunch & Refreshment (₦)</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.bik?.lunch || 0}
                      onChange={(e) =>
                        setFormData((p) =>
                          p
                            ? {
                                ...p,
                                bik: { ...p.bik, lunch: Number(e.target.value) },
                              }
                            : null,
                        )
                      }
                      className="h-9 text-xs"
                    />
                  ) : (
                    <span className="font-bold text-[#0f172a] text-sm">
                      {formatNaira(payee.bik?.lunch || 0)}
                    </span>
                  )}
                  <p className="text-[10px] text-[#94a3b8] mt-1">Subsidized office meals</p>
                </div>

                <div>
                  <label className="text-[#64748b] block mb-1">13th Month Provision (₦)</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.bik?.thirteenthMonth || 0}
                      onChange={(e) =>
                        setFormData((p) =>
                          p
                            ? {
                                ...p,
                                bik: {
                                  ...p.bik,
                                  thirteenthMonth: Number(e.target.value),
                                },
                              }
                            : null,
                        )
                      }
                      className="h-9 text-xs"
                    />
                  ) : (
                    <span className="font-bold text-[#0f172a] text-sm">
                      {formatNaira(payee.bik?.thirteenthMonth || 0)}
                    </span>
                  )}
                  <p className="text-[10px] text-[#94a3b8] mt-1">Annual bonus provision</p>
                </div>
              </div>
            </div>

            {/* BIK Summary */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#0f172a] border-b border-[#f1f5f9] pb-2">
                Monthly BIK Total
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-[#64748b]">Total Benefit Value:</span>
                  <span className="font-bold text-[#0284c7]">
                    {formatNaira(
                      (payee.bik?.hmo || 25000) +
                        (payee.bik?.airtime || 10000) +
                        (payee.bik?.lunch || 0) +
                        (payee.bik?.thirteenthMonth || 0),
                    )}
                  </span>
                </div>
                <p className="text-[11px] text-[#94a3b8] pt-2 border-t border-[#f1f5f9]">
                  Non-taxable benefit value provided on top of direct monetary compensation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: PAYMENT HISTORY                                                */}
      {/* ==================================================================== */}
      {activeTab === "Payment History" && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Pay Run Disbursement History</h3>
              <p className="text-xs text-[#64748b]">Past payouts executed through the Sinkronis payroll engine</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportHistory}
              className="gap-1.5"
            >
              <Download size={14} />
              Export CSV
            </Button>
          </div>

          {(payee.paymentHistory || []).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#475569]">
                    <th className="py-2.5 px-3 font-semibold">Period</th>
                    <th className="py-2.5 px-3 font-semibold">Payment Date</th>
                    <th className="py-2.5 px-3 font-semibold">Reference</th>
                    <th className="py-2.5 px-3 font-semibold">Amount Paid</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {payee.paymentHistory.map((rec, i) => (
                    <tr key={i} className="hover:bg-[#f8fafc]">
                      <td className="py-3 px-3 font-semibold text-[#0f172a]">{rec.period}</td>
                      <td className="py-3 px-3 text-[#64748b]">{rec.paymentDate}</td>
                      <td className="py-3 px-3 font-mono text-[#64748b]">{rec.reference}</td>
                      <td className="py-3 px-3 font-bold text-[#16a34a]">{formatNaira(rec.amount)}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            rec.status === "Paid"
                              ? "bg-[#dcfce7] text-[#15803d]"
                              : rec.status === "Pending"
                              ? "bg-[#fef9c3] text-[#a16207]"
                              : "bg-[#fee2e2] text-[#b91c1c]"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No Payment History"
              subtitle="This payee has not participated in any finalized pay runs yet."
            />
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 6: DOCUMENTS                                                      */}
      {/* ==================================================================== */}
      {activeTab === "Documents" && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <Documents payeeId={payee.id} payeeName={payee.name} />
        </div>
      )}

      {/* Remove Payee Confirmation Modal */}
      <RemovePayeeModal
        open={removeOpen}
        payee={payee as any}
        onCancel={() => setRemoveOpen(false)}
        onRemove={handleRemove}
      />
    </div>
  );
}
