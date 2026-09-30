// src/components/payroll/payee/AddPayeeModal.tsx
"use client";

import { useState } from "react";
import {
  X,
  Calculator,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  CreditCard,
  Shield,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SearchableCreatableSelect, {
  NIGERIAN_BANKS,
  NIGERIAN_PFAS,
} from "@/components/ui/SearchableCreatableSelect";
import {
  UnifiedPayee,
  PayeeStatus,
  EmploymentType,
  TaxStatus,
  formatNaira,
  calculatePayeeDeductions,
  getDefaultTaxStatus,
} from "@/types/payroll/unified-payee";

export type AddPayeeModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payee: UnifiedPayee) => void;
};

interface FormState {
  name: string;
  type: "Permanent" | "Contract" | "Consultant";
  role: string;
  dateOnboarded: string;
  employmentType: EmploymentType;
  status: PayeeStatus;
  onPayroll: boolean;
  email: string;
  phone: string;
  stateOfResidence: string;
  bankName: string;
  bankAccount: string;
  accountName: string;

  // Earnings
  monthlyAmount: string;
  basicSalary: string;
  housingAllowance: string;
  transportAllowance: string;
  otherAllowance: string;

  // Tax & statutory
  taxStatus: TaxStatus;
  taxable: boolean;
  tin: string;
  pensionPin: string;
  pfaName: string;
  nhfNumber: string;
}

const defaultFormState: FormState = {
  name: "",
  type: "Permanent",
  role: "",
  dateOnboarded: new Date().toISOString().split("T")[0],
  employmentType: "Full-time",
  status: "Active",
  onPayroll: true,
  email: "",
  phone: "",
  stateOfResidence: "Lagos",
  bankName: "",
  bankAccount: "",
  accountName: "",
  monthlyAmount: "250000",
  basicSalary: "150000",
  housingAllowance: "80000",
  transportAllowance: "50000",
  otherAllowance: "20000",
  taxStatus: "PAYE",
  taxable: true,
  tin: "",
  pensionPin: "",
  pfaName: "Stanbic IBTC Pension Managers",
  nhfNumber: "",
};

export default function AddPayeeModal({
  open,
  onClose,
  onSubmit,
}: AddPayeeModalProps) {
  const [formData, setFormData] = useState<FormState>(defaultFormState);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Automatically update taxStatus if type changes
      if (name === "type") {
        const newType = value as "Permanent" | "Contract" | "Consultant";
        updated.taxStatus = getDefaultTaxStatus(newType);
      }

      return updated;
    });
    setValidationError(null);
  };

  const handleBankSelect = (bank: string) => {
    setFormData((prev) => ({ ...prev, bankName: bank }));
    setValidationError(null);
  };

  const handlePfaSelect = (pfa: string) => {
    setFormData((prev) => ({ ...prev, pfaName: pfa }));
  };

  const isPermanent = formData.type === "Permanent";
  const isContract = formData.type === "Contract";
  const isConsultant = formData.type === "Consultant";

  // Compute live calculations
  const basic = parseFloat(formData.basicSalary) || 0;
  const housing = parseFloat(formData.housingAllowance) || 0;
  const transport = parseFloat(formData.transportAllowance) || 0;
  const other = parseFloat(formData.otherAllowance) || 0;
  const contractFee = parseFloat(formData.monthlyAmount) || 0;

  const gross = isPermanent
    ? basic + housing + transport + other
    : contractFee;

  const preview = calculatePayeeDeductions({
    type: formData.type,
    grossSalary: gross,
    basicSalary: basic,
    housingAllowance: housing,
    transportAllowance: transport,
    otherAllowance: other,
    taxStatus: formData.taxStatus,
    taxable: formData.taxable,
  });

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setValidationError("Please enter the payee's full name or business entity name.");
      return false;
    }
    if (!formData.role.trim()) {
      setValidationError("Please enter the payee's role or designation.");
      return false;
    }
    if (!formData.dateOnboarded) {
      setValidationError("Please select the onboarding date.");
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (isPermanent && gross <= 0) {
      setValidationError("Please specify a basic salary greater than ₦0.");
      return false;
    }
    if (!isPermanent && contractFee <= 0) {
      setValidationError("Please enter a valid contract or consultant fee greater than ₦0.");
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    if (!formData.bankName.trim()) {
      setValidationError("Please select or enter the payee's bank name.");
      return false;
    }
    if (!formData.bankAccount.trim() || formData.bankAccount.trim().length < 10) {
      setValidationError("Please enter a valid 10-digit bank account number.");
      return false;
    }
    if (!formData.accountName.trim()) {
      setValidationError("Please enter the account holder name as registered with the bank.");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValidationError(null);

    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    } else if (step === 3) {
      if (validateStep3()) setStep(4);
    }
  };

  // Final Submit from Step 4 strictly
  const handleFinalSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Strict safety check: Never submit unless explicitly on Step 4 (Preview & Summary)
    if (step !== 4) {
      return;
    }

    if (!validateStep1()) {
      setStep(1);
      return;
    }
    if (!validateStep2()) {
      setStep(2);
      return;
    }
    if (!validateStep3()) {
      setStep(3);
      return;
    }

    const newPayee: UnifiedPayee = {
      id: `PAYEE-${Date.now()}`,
      name: formData.name.trim(),
      type: formData.type,
      role: formData.role.trim(),
      dateOnboarded: formData.dateOnboarded,
      joinDate: formData.dateOnboarded,
      employmentType: formData.employmentType,
      status: formData.status,
      onPayroll: formData.onPayroll,
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone: formData.phone.trim() || "+234 800 000 0000",
      stateOfResidence: formData.stateOfResidence,
      bankName: formData.bankName.trim(),
      bankAccount: formData.bankAccount.trim(),
      accountName: formData.accountName.trim(),
      taxStatus: formData.taxStatus,
      taxable: formData.taxable,
      taxType: formData.taxStatus === "WHT" ? "WHT" : formData.taxStatus === "None" ? "EXEMPT" : "PAYE",
      grossSalary: gross,
      basicSalary: isPermanent ? basic : undefined,
      housingAllowance: isPermanent ? housing : undefined,
      transportAllowance: isPermanent ? transport : undefined,
      otherAllowance: isPermanent ? other : undefined,
      statutory: {
        tin: formData.tin || undefined,
        pensionPin: formData.pensionPin || undefined,
        pfaName: formData.pfaName || undefined,
        nhfNumber: formData.nhfNumber || undefined,
      },
      deductions: preview.deductions,
      netSalary: preview.netSalary,
      paymentHistory: [],
    };

    onSubmit(newPayee);
    handleClose();
  };

  const handleClose = () => {
    setFormData(defaultFormState);
    setStep(1);
    setValidationError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl overflow-hidden my-6 border border-[#e2e8f0]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4 bg-[#f8fafc]">
          <div>
            <h2 className="text-base font-bold text-[#1f2937]">Add New Payee</h2>
            <p className="text-xs text-[#6b7280]">
              Step {step} of 4 — {
                step === 1
                  ? "General Information"
                  : step === 2
                  ? "Compensation & Statutory Records"
                  : step === 3
                  ? "Bank & Disbursement Destination"
                  : "Preview & Full Summary"
              }
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-[#667085] transition hover:bg-[#f2f4f7] hover:text-[#1f2937]"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="border-b border-[#e5e7eb] bg-white px-6 py-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 ${
                step === 1
                  ? "text-[#2183c6]"
                  : step > 1
                  ? "text-[#16a34a]"
                  : "text-[#9ca3af]"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  step === 1
                    ? "bg-[#2183c6] text-white"
                    : step > 1
                    ? "bg-[#16a34a] text-white"
                    : "bg-[#e5e7eb] text-[#6b7280]"
                }`}
              >
                {step > 1 ? "✓" : "1"}
              </span>
              <span>General</span>
            </button>

            <div className={`h-0.5 flex-1 mx-2 sm:mx-3 ${step > 1 ? "bg-[#16a34a]" : "bg-[#e5e7eb]"}`} />

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
              className={`flex items-center gap-1.5 ${
                step === 2
                  ? "text-[#2183c6]"
                  : step > 2
                  ? "text-[#16a34a]"
                  : "text-[#9ca3af]"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  step === 2
                    ? "bg-[#2183c6] text-white"
                    : step > 2
                    ? "bg-[#16a34a] text-white"
                    : "bg-[#e5e7eb] text-[#6b7280]"
                }`}
              >
                {step > 2 ? "✓" : "2"}
              </span>
              <span>Compensation</span>
            </button>

            <div className={`h-0.5 flex-1 mx-2 sm:mx-3 ${step > 2 ? "bg-[#16a34a]" : "bg-[#e5e7eb]"}`} />

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => {
                if (validateStep1() && validateStep2()) setStep(3);
              }}
              className={`flex items-center gap-1.5 ${
                step === 3
                  ? "text-[#2183c6]"
                  : step > 3
                  ? "text-[#16a34a]"
                  : "text-[#9ca3af]"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  step === 3
                    ? "bg-[#2183c6] text-white"
                    : step > 3
                    ? "bg-[#16a34a] text-white"
                    : "bg-[#e5e7eb] text-[#6b7280]"
                }`}
              >
                {step > 3 ? "✓" : "3"}
              </span>
              <span>Bank Details</span>
            </button>

            <div className={`h-0.5 flex-1 mx-2 sm:mx-3 ${step > 3 ? "bg-[#16a34a]" : "bg-[#e5e7eb]"}`} />

            {/* Step 4 */}
            <button
              type="button"
              onClick={() => {
                if (validateStep1() && validateStep2() && validateStep3()) setStep(4);
              }}
              className={`flex items-center gap-1.5 ${
                step === 4 ? "text-[#2183c6]" : "text-[#9ca3af]"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  step === 4
                    ? "bg-[#2183c6] text-white"
                    : "bg-[#e5e7eb] text-[#6b7280]"
                }`}
              >
                4
              </span>
              <span>Preview & Summary</span>
            </button>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="bg-[#fef2f2] border-b border-[#fee2e2] px-6 py-2.5 text-xs text-[#b91c1c] flex items-center justify-between">
            <span>{validationError}</span>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="text-[#991b1b] hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <div className="max-h-[62vh] overflow-y-auto px-6 py-5 space-y-4">
            {/* ============================================================== */}
            {/* STEP 1: GENERAL INFORMATION                                     */}
            {/* ============================================================== */}
            {step === 1 && (
              <div className="space-y-4">
                <Field label="Full Name / Registered Entity Name" required>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Babatunde Adeleke / Apex Logistics Ltd"
                    required
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Payee Classification" required>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="h-10 w-full rounded-md border border-[#e5e7eb] px-3 text-sm outline-none focus:border-[#2183c6] bg-white font-medium"
                    >
                      <option value="Permanent">Permanent (Salaried Staff — PAYE)</option>
                      <option value="Contract">Contract (5% Withholding Tax)</option>
                      <option value="Consultant">Consultant (Tax Exempt — 0%)</option>
                    </select>
                  </Field>

                  <Field label="Date Added / Onboarded" required>
                    <Input
                      name="dateOnboarded"
                      type="date"
                      value={formData.dateOnboarded}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Role / Designation" required>
                    <Input
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g. Senior Frontend Engineer"
                      required
                    />
                  </Field>

                  <Field label="Engagement Type">
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="h-10 w-full rounded-md border border-[#e5e7eb] px-3 text-sm outline-none focus:border-[#2183c6] bg-white"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Retainer">Retainer</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email Address">
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. payee@sinkronis.com"
                    />
                  </Field>

                  <Field label="Phone Number">
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 800 000 0000"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="State of Residence (Tax Authority)">
                    <select
                      name="stateOfResidence"
                      value={formData.stateOfResidence}
                      onChange={handleChange}
                      className="h-10 w-full rounded-md border border-[#e5e7eb] px-3 text-sm outline-none focus:border-[#2183c6] bg-white"
                    >
                      <option value="Lagos">Lagos (LIRS)</option>
                      <option value="Abuja (FCT)">Abuja FCT (FCT-IRS)</option>
                      <option value="Rivers">Rivers (RIRS)</option>
                      <option value="Kano">Kano (KIRS)</option>
                      <option value="Ogun">Ogun (OGIRS)</option>
                      <option value="Oyo">Oyo (OYSIRS)</option>
                      <option value="Kaduna">Kaduna</option>
                      <option value="Delta">Delta</option>
                      <option value="Enugu">Enugu</option>
                    </select>
                  </Field>

                  <Field label="Status">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="h-10 w-full rounded-md border border-[#e5e7eb] px-3 text-sm outline-none focus:border-[#2183c6] bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </Field>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 2: COMPENSATION & TAX STATUS                               */}
            {/* ============================================================== */}
            {step === 2 && (
              <div className="space-y-4">
                {/* Notice banner for selected classification */}
                <div className={`rounded-lg p-3 text-xs border ${
                  isPermanent
                    ? "bg-[#eff6ff] border-[#bfdbfe] text-[#1e40af]"
                    : isContract
                    ? "bg-[#fffbeb] border-[#fef3c7] text-[#92400e]"
                    : "bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]"
                }`}>
                  <div className="font-semibold flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={15} />
                    <span>
                      {isPermanent
                        ? "Permanent Staff — Progressive PAYE + Statutory Pension"
                        : isContract
                        ? "Contract Engagement — Flat 5% Withholding Tax (WHT)"
                        : "Consultant / Advisory — Tax Exempt (0% Deduction)"}
                    </span>
                  </div>
                  <p>
                    {isPermanent
                      ? "FIRS Consolidated Relief Allowance + PIT progressive tax bands apply, with mandatory 8% employee pension & 2.5% NHF."
                      : isContract
                      ? "5% Withholding Tax (WHT) will be automatically deducted from the monthly fee. No pension or NHF deductions."
                      : "No tax or pension is deducted at source. The payee receives 100% of the invoiced retainer fee."}
                  </p>
                </div>

                {/* Tax Status Selector */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tax Status" required>
                    <select
                      name="taxStatus"
                      value={formData.taxStatus}
                      onChange={handleChange}
                      className="h-10 w-full rounded-md border border-[#e5e7eb] px-3 text-sm outline-none focus:border-[#2183c6] bg-white font-medium"
                    >
                      <option value="PAYE">PAYE (Pay-As-You-Earn)</option>
                      <option value="WHT">WHT (5% Withholding Tax)</option>
                      <option value="None">None (Tax Exempt / 0%)</option>
                    </select>
                  </Field>

                  <Field label="Tax Identification Number (TIN)">
                    <Input
                      name="tin"
                      value={formData.tin}
                      onChange={handleChange}
                      placeholder="e.g. 23819201-0001"
                    />
                  </Field>
                </div>

                {/* Permanent Compensation Inputs */}
                {isPermanent ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Basic Salary (₦)" required>
                        <Input
                          name="basicSalary"
                          type="number"
                          min={0}
                          value={formData.basicSalary}
                          onChange={handleChange}
                          required
                        />
                      </Field>

                      <Field label="Housing Allowance (₦)">
                        <Input
                          name="housingAllowance"
                          type="number"
                          min={0}
                          value={formData.housingAllowance}
                          onChange={handleChange}
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Transport Allowance (₦)">
                        <Input
                          name="transportAllowance"
                          type="number"
                          min={0}
                          value={formData.transportAllowance}
                          onChange={handleChange}
                        />
                      </Field>

                      <Field label="Other Allowance (₦)">
                        <Input
                          name="otherAllowance"
                          type="number"
                          min={0}
                          value={formData.otherAllowance}
                          onChange={handleChange}
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Searchable PFA Combobox */}
                      <SearchableCreatableSelect
                        label="Pension Administrator (PFA)"
                        name="pfaName"
                        value={formData.pfaName}
                        onChange={handlePfaSelect}
                        options={NIGERIAN_PFAS}
                        placeholder="Search PFA or type custom..."
                      />

                      <Field label="PENCOM PIN">
                        <Input
                          name="pensionPin"
                          value={formData.pensionPin}
                          onChange={handleChange}
                          placeholder="PEN100..."
                        />
                      </Field>
                    </div>

                    <Field label="National Housing Fund (NHF) No.">
                      <Input
                        name="nhfNumber"
                        value={formData.nhfNumber}
                        onChange={handleChange}
                        placeholder="e.g. NHF-123456"
                      />
                    </Field>
                  </div>
                ) : (
                  /* Contract / Consultant Fee Input */
                  <div className="space-y-4">
                    <Field
                      label={
                        isContract
                          ? "Monthly Contract Fee (₦)"
                          : "Monthly Consultant Retainer (₦)"
                      }
                      required
                    >
                      <Input
                        name="monthlyAmount"
                        type="number"
                        min={0}
                        value={formData.monthlyAmount}
                        onChange={handleChange}
                        required
                      />
                    </Field>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 3: BANK DETAILS                                            */}
            {/* ============================================================== */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Searchable Bank Combobox */}
                <SearchableCreatableSelect
                  label="Bank Name"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleBankSelect}
                  options={NIGERIAN_BANKS}
                  placeholder="Search bank name or type custom..."
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Account Number (10 Digits)" required>
                    <Input
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleChange}
                      placeholder="0123456789"
                      maxLength={10}
                      required
                    />
                  </Field>

                  <Field label="Account Holder Name" required>
                    <Input
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      placeholder="Name as registered with bank"
                      required
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 4: PREVIEW & FULL SUMMARY                                  */}
            {/* ============================================================== */}
            {step === 4 && (
              <div className="space-y-4">
                {/* Notice banner */}
                <div className="rounded-lg bg-[#eff6ff] border border-[#bfdbfe] p-3 text-xs text-[#1e40af] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#2183c6] shrink-0" />
                    <span>
                      <strong>Payee Preview:</strong> Please review all information below before confirming and saving to the payee registry.
                    </span>
                  </div>
                </div>

                {/* Section 1: General & Profile Details */}
                <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 font-semibold text-[#1e293b]">
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-[#2183c6]" />
                      <span>General Information</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        formData.type === "Permanent"
                          ? "bg-[#e0f2fe] text-[#0284c7]"
                          : formData.type === "Contract"
                          ? "bg-[#fef3c7] text-[#b45309]"
                          : "bg-[#f3e8ff] text-[#7e22ce]"
                      }`}
                    >
                      {formData.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[#475569]">
                    <div>
                      <span className="text-[#94a3b8] block text-[11px]">Payee Name</span>
                      <span className="font-semibold text-[#1e293b]">{formData.name}</span>
                    </div>
                    <div>
                      <span className="text-[#94a3b8] block text-[11px]">Role / Designation</span>
                      <span className="font-semibold text-[#1e293b]">{formData.role}</span>
                    </div>
                    <div>
                      <span className="text-[#94a3b8] block text-[11px]">Date Onboarded</span>
                      <span className="font-medium text-[#1e293b]">{formData.dateOnboarded}</span>
                    </div>
                    <div>
                      <span className="text-[#94a3b8] block text-[11px]">Engagement Type</span>
                      <span className="font-medium text-[#1e293b]">{formData.employmentType}</span>
                    </div>
                    <div>
                      <span className="text-[#94a3b8] block text-[11px]">Email Address</span>
                      <span className="font-medium text-[#1e293b]">{formData.email || "—"}</span>
                    </div>
                    <div>
                      <span className="text-[#94a3b8] block text-[11px]">Phone Number</span>
                      <span className="font-medium text-[#1e293b]">{formData.phone || "—"}</span>
                    </div>
                    <div>
                      <span className="text-[#94a3b8] block text-[11px]">State of Residence</span>
                      <span className="font-medium text-[#1e293b]">{formData.stateOfResidence}</span>
                    </div>
                    <div>
                      <span className="text-[#94a3b8] block text-[11px]">Payee Status</span>
                      <span className="font-medium text-[#1e293b]">{formData.status}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Compensation & Tax Regime */}
                <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 font-semibold text-[#1e293b]">
                    <div className="flex items-center gap-1.5">
                      <Shield size={14} className="text-[#2183c6]" />
                      <span>Compensation & Tax Regime</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#f1f5f9] text-[#475569]">
                      Tax Status: {formData.taxStatus}
                    </span>
                  </div>

                  {isPermanent ? (
                    <div className="grid grid-cols-2 gap-3 text-[#475569]">
                      <div>
                        <span className="text-[#94a3b8] block text-[11px]">Basic Salary</span>
                        <span className="font-semibold text-[#1e293b]">{formatNaira(basic)}</span>
                      </div>
                      <div>
                        <span className="text-[#94a3b8] block text-[11px]">Housing Allowance</span>
                        <span className="font-semibold text-[#1e293b]">{formatNaira(housing)}</span>
                      </div>
                      <div>
                        <span className="text-[#94a3b8] block text-[11px]">Transport Allowance</span>
                        <span className="font-semibold text-[#1e293b]">{formatNaira(transport)}</span>
                      </div>
                      <div>
                        <span className="text-[#94a3b8] block text-[11px]">Other Allowance</span>
                        <span className="font-semibold text-[#1e293b]">{formatNaira(other)}</span>
                      </div>
                      <div>
                        <span className="text-[#94a3b8] block text-[11px]">Tax Identification Number (TIN)</span>
                        <span className="font-mono text-[#1e293b]">{formData.tin || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[#94a3b8] block text-[11px]">Pension Administrator (PFA)</span>
                        <span className="font-medium text-[#1e293b]">{formData.pfaName || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[#94a3b8] block text-[11px]">PENCOM PIN</span>
                        <span className="font-mono text-[#1e293b]">{formData.pensionPin || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[#94a3b8] block text-[11px]">NHF Number</span>
                        <span className="font-mono text-[#1e293b]">{formData.nhfNumber || "—"}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 text-[#475569]">
                      <div>
                        <span className="text-[#94a3b8] block text-[11px]">
                          {isContract ? "Monthly Contract Fee" : "Monthly Consultant Retainer"}
                        </span>
                        <span className="font-semibold text-[#1e293b]">{formatNaira(contractFee)}</span>
                      </div>
                      <div>
                        <span className="text-[#94a3b8] block text-[11px]">Tax Identification Number (TIN)</span>
                        <span className="font-mono text-[#1e293b]">{formData.tin || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[#94a3b8] block text-[11px]">Tax Applicable</span>
                        <span className="font-medium text-[#1e293b]">
                          {isContract ? "5% Withholding Tax (WHT)" : "Exempt (0%)"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 3: Bank & Disbursement Destination */}
                <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 font-semibold text-[#1e293b]">
                    <div className="flex items-center gap-1.5">
                      <CreditCard size={14} className="text-[#2183c6]" />
                      <span>Banking & Disbursement Destination</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-[#475569]">
                    <div>
                      <span className="text-[#94a3b8] block text-[11px]">Bank Name</span>
                      <span className="font-semibold text-[#1e293b]">{formData.bankName}</span>
                    </div>
                    <div>
                      <span className="text-[#94a3b8] block text-[11px]">Account Number</span>
                      <span className="font-mono font-bold text-[#1e293b]">{formData.bankAccount}</span>
                    </div>
                    <div>
                      <span className="text-[#94a3b8] block text-[11px]">Account Holder Name</span>
                      <span className="font-semibold text-[#1e293b]">{formData.accountName}</span>
                    </div>
                  </div>
                </div>

                {/* Section 4: Live Payout Breakdown (Calculated) */}
                <div className="rounded-xl border border-[#bae6fd] bg-[#f0f9ff] p-4 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-[#0369a1] border-b border-[#e0f2fe] pb-2">
                    <Calculator size={15} />
                    <span>Estimated Monthly Payout Summary</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-white p-3 shadow-sm border border-[#e0f2fe]">
                      <span className="text-[#64748b] block text-[11px]">Monthly Gross</span>
                      <span className="font-bold text-[#0f172a] text-base">{formatNaira(gross)}</span>
                    </div>

                    <div className="rounded-lg bg-white p-3 shadow-sm border border-[#e0f2fe]">
                      <span className="text-[#64748b] block text-[11px]">
                        {isContract
                          ? "5% WHT Deducted"
                          : isConsultant
                          ? "Tax Deducted (0%)"
                          : "Total Statutory Deductions"}
                      </span>
                      <span className="font-bold text-[#b91c1c] text-base">
                        {formatNaira(preview.deductions.totalDeductions)}
                      </span>
                    </div>

                    <div className="rounded-lg bg-white p-3 shadow-sm border border-[#e0f2fe]">
                      <span className="text-[#64748b] block text-[11px]">Net Monthly Take-Home</span>
                      <span className="font-bold text-[#15803d] text-base">{formatNaira(preview.netSalary)}</span>
                    </div>
                  </div>

                  {/* Itemized deductions breakdown if permanent */}
                  {isPermanent && preview.deductions.totalDeductions > 0 && (
                    <div className="pt-2 border-t border-[#e0f2fe] grid grid-cols-3 gap-2 text-[11px] text-[#475569]">
                      <div>
                        <span>PAYE Tax: </span>
                        <span className="font-semibold text-[#b91c1c]">{formatNaira(preview.deductions.paye)}</span>
                      </div>
                      <div>
                        <span>Pension (8%): </span>
                        <span className="font-semibold text-[#b91c1c]">{formatNaira(preview.deductions.employeePension)}</span>
                      </div>
                      <div>
                        <span>NHF (2.5%): </span>
                        <span className="font-semibold text-[#b91c1c]">{formatNaira(preview.deductions.nhf)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Wizard Action Footer */}
          <div className="flex items-center justify-between border-t border-[#f0f0f0] bg-[#fafafa] px-6 py-4">
            {step === 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
              >
                Cancel
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setValidationError(null);
                  setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : 1));
                }}
              >
                <ArrowLeft size={14} className="mr-1.5" />
                Previous
              </Button>
            )}

            {step < 4 ? (
              <Button
                key="wizard-btn-next"
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNextStep}
              >
                <span>
                  {step === 1
                    ? "Continue to Compensation"
                    : step === 2
                    ? "Continue to Bank Details"
                    : "Preview Summary"}
                </span>
                <ArrowRight size={14} className="ml-1.5" />
              </Button>
            ) : (
              <Button
                key="wizard-btn-submit"
                type="button"
                variant="primary"
                size="sm"
                onClick={(e) => handleFinalSubmit(e)}
                className="bg-[#16a34a] hover:bg-[#15803d]"
              >
                <CheckCircle2 size={14} className="mr-1.5" />
                Confirm & Add Payee
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-[#4b5563]">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
