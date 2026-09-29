// components/payroll/payee/EditPayeeModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Loader2, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import {
  updatePayee,
  PayeeDetail,
  PayeeListItem,
  PayeeApiType,
  PayeeApiStatus,
  UpdatePayeeBody,
} from "@/lib/api/payroll";
import { normalizePhoneNumber } from "@/utils/phoneField";

export type EditPayeeFormData = {
  fullName: string;
  type: string;
  status: string;
  email: string;
  phone: string;
  bank: string;
  accountNumber: string;
  accountName: string;
  tin: string;
  monthlyAmount: string;
  subjectToPaye: boolean;
};

type EditPayeeModalProps = {
  open: boolean;
  payee: PayeeDetail | PayeeListItem | null;
  onClose: () => void;
  onSuccess?: () => void;
};

const initialFormData: EditPayeeFormData = {
  fullName: "",
  type: "Contractor",
  status: "Active",
  email: "",
  phone: "",
  bank: "",
  accountNumber: "",
  accountName: "",
  tin: "",
  monthlyAmount: "0",
  subjectToPaye: false,
};

function formatTypeToSelect(type?: string): string {
  switch (type) {
    case "DIRECTOR":
      return "Director";
    case "VENDOR":
      return "Vendor";
    case "BOARD_MEMBER":
      return "Board Member";
    case "CONTRACTOR":
    default:
      return "Contractor";
  }
}

function formatStatusToSelect(status?: string): string {
  return status === "INACTIVE" ? "Inactive" : "Active";
}

export default function EditPayeeModal({
  open,
  payee,
  onClose,
  onSuccess,
}: EditPayeeModalProps) {
  const [formData, setFormData] = useState<EditPayeeFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && payee) {
      const bankName = payee.bank?.bankName || "";
      const accountNumber = payee.bank?.accountNumber || "";
      const accountName =
        (payee.bank && "accountName" in payee.bank
          ? (payee.bank as { accountName?: string | null }).accountName
          : "") || "";
      const tin = ("tin" in payee ? (payee as PayeeDetail).tin : "") || "";

      setFormData({
        fullName: payee.name || "",
        type: formatTypeToSelect(payee.type),
        status: formatStatusToSelect(payee.status),
        email: payee.email || "",
        phone: payee.phone || "",
        bank: bankName,
        accountNumber: accountNumber,
        accountName: accountName,
        tin: tin,
        monthlyAmount: String(payee.monthlyAmount ?? 0),
        subjectToPaye: Boolean(payee.isTaxable),
      });
      setFieldErrors({});
    }
  }, [open, payee]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !submitting) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, submitting]);

  if (!open || !payee) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleClose = () => {
    setFieldErrors({});
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    setFieldErrors({});

    const name = formData.fullName.trim();
    if (!name) {
      setFieldErrors((prev) => ({ ...prev, fullName: "Full Name is required" }));
      toast.error("Full Name / Company Name is required.");
      return;
    }

    const amount = Number(formData.monthlyAmount);
    if (isNaN(amount) || amount < 0) {
      setFieldErrors((prev) => ({
        ...prev,
        monthlyAmount: "Must be a valid positive number",
      }));
      toast.error("Monthly Amount must be a valid non-negative number.");
      return;
    }

    // Validate & normalize phone if provided
    let normalizedPhone: string | undefined = undefined;
    if (formData.phone.trim()) {
      const norm = normalizePhoneNumber(formData.phone);
      if (!norm) {
        setFieldErrors((prev) => ({
          ...prev,
          phone: "Invalid phone format (e.g. +234 801 234 5678 or 08012345678)",
        }));
        toast.error("Invalid phone number format.");
        return;
      }
      normalizedPhone = norm;
    }

    setSubmitting(true);

    // Map type & status to Swagger enum values
    const typeUpper = (
      formData.type === "Board Member"
        ? "BOARD_MEMBER"
        : formData.type.toUpperCase()
    ) as PayeeApiType;

    const statusUpper = formData.status.toUpperCase() as PayeeApiStatus;

    const payload: UpdatePayeeBody = {
      name,
      type: typeUpper,
      status: statusUpper,
      email: formData.email.trim() || undefined,
      phone: normalizedPhone,
      bankName: formData.bank.trim() || undefined,
      accountName: formData.accountName.trim() || undefined,
      monthlyAmount: amount,
      isTaxable: Boolean(formData.subjectToPaye),
    };

    // Only send accountNumber and tin if they were edited and not masked (contains no '*')
    if (formData.accountNumber && !formData.accountNumber.includes("*")) {
      payload.accountNumber = formData.accountNumber.trim();
    }
    if (formData.tin && !formData.tin.includes("*")) {
      payload.tin = formData.tin.trim();
    }

    try {
      await updatePayee(payee.id, payload);

      toast.success("Payee updated successfully");
      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          data?: {
            message?: string;
            validationErrors?: Array<{ field?: string; message?: string; code?: string }>;
            details?: {
              validationErrors?: Array<{ field?: string; message?: string; code?: string }>;
            };
          };
        };
      };

      const valList =
        axiosErr?.response?.data?.validationErrors ||
        axiosErr?.response?.data?.details?.validationErrors;

      if (Array.isArray(valList) && valList.length > 0) {
        const serverFieldErrors: Record<string, string> = {};
        for (const item of valList) {
          if (item.field) {
            if (item.field === "phone") {
              serverFieldErrors.phone =
                "Invalid phone format. Please use international format (e.g. +2348012345678).";
            } else {
              serverFieldErrors[item.field] = item.message || "Invalid input";
            }
          }
        }
        setFieldErrors(serverFieldErrors);

        const firstErr = valList[0];
        const friendlyMsg =
          firstErr.field === "phone"
            ? "Invalid phone number format. Please provide e.g. +2348012345678 or 08012345678."
            : firstErr.message || axiosErr?.response?.data?.message || "Validation failed.";

        toast.error(friendlyMsg);
      } else {
        const msg =
          axiosErr?.response?.data?.message ||
          "Failed to update payee. Please check the inputs and try again.";
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "h-10 w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 text-sm text-[#101828] placeholder-[#98A2B3] outline-none transition hover:border-gray-400 focus:border-[#1683d8] focus:ring-1 focus:ring-[#1683d8] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[530px] rounded-2xl bg-white p-7 sm:p-8 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6">
          <h2 className="text-lg font-bold text-[#1f2937]">Edit Payee</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close"
            className="rounded-lg p-1 text-[#667085] transition hover:bg-gray-100 hover:text-[#1f2937] disabled:opacity-50"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Row 1: Full Name / Company Name */}
            <Field label="Full Name / Company Name *" error={fieldErrors.fullName}>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={submitting}
                className={`${inputClass} ${fieldErrors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500/15" : ""}`}
              />
            </Field>

            {/* Row 2: Type & Status */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Type" error={fieldErrors.type}>
                <div className="relative">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`${inputClass} appearance-none pr-9 cursor-pointer`}
                  >
                    <option value="Contractor">Contractor</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Director">Director</option>
                    <option value="Board Member">Board Member</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
                  />
                </div>
              </Field>

              <Field label="Status" error={fieldErrors.status}>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`${inputClass} appearance-none pr-9 cursor-pointer`}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
                  />
                </div>
              </Field>
            </div>

            {/* Row 3: Email & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email" error={fieldErrors.email}>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={submitting}
                  className={`${inputClass} ${fieldErrors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/15" : ""}`}
                />
              </Field>

              <Field label="Phone" error={fieldErrors.phone}>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={submitting}
                  className={`${inputClass} ${fieldErrors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500/15" : ""}`}
                />
              </Field>
            </div>

            {/* Row 4: Bank */}
            <Field label="Bank" error={fieldErrors.bank}>
              <input
                name="bank"
                value={formData.bank}
                onChange={handleChange}
                disabled={submitting}
                className={inputClass}
              />
            </Field>

            {/* Row 5: Account Number & Account Name */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Account Number" error={fieldErrors.accountNumber}>
                <input
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  disabled={submitting}
                  className={inputClass}
                />
              </Field>

              <Field label="Account Name" error={fieldErrors.accountName}>
                <input
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  disabled={submitting}
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Row 6: TIN (optional) & Monthly Amount (₦) * */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="TIN (optional)" error={fieldErrors.tin}>
                <input
                  name="tin"
                  value={formData.tin}
                  onChange={handleChange}
                  disabled={submitting}
                  className={inputClass}
                />
              </Field>

              <Field label="Monthly Amount (₦) *" error={fieldErrors.monthlyAmount}>
                <input
                  name="monthlyAmount"
                  type="number"
                  min={0}
                  value={formData.monthlyAmount}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className={`${inputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 ${fieldErrors.monthlyAmount ? "border-red-500 focus:border-red-500 focus:ring-red-500/15" : ""}`}
                />
              </Field>
            </div>

            {/* Row 7: Checkbox */}
            <div className="pt-1">
              <label className="inline-flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  name="subjectToPaye"
                  checked={formData.subjectToPaye}
                  onChange={handleChange}
                  disabled={submitting}
                  className="h-4 w-4 rounded border-[#D0D5DD] text-[#1683d8] focus:ring-[#1683d8] cursor-pointer"
                />
                <span className="text-sm font-medium text-[#1f2937]">
                  Subject to PAYE tax
                </span>
              </label>
            </div>

            {/* Row 8: Actions */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="h-11 flex-1 rounded-lg border border-[#D0D5DD] bg-[#F2F4F7] px-6 text-sm font-medium text-[#344054] transition hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#1683d8] px-8 text-sm font-medium text-white transition hover:bg-[#1270b8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? "Saving Payee..." : "Save Payee"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-xs font-normal text-[#667085]">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
