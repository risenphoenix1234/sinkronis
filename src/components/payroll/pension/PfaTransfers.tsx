"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronRight,
  Info,
  Loader2,
  Lock,
  Plus,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  advancePayrollPfaTransfer,
  getPayrollEmployeeOverview,
  getPayrollEmployees,
  getPayrollPensionPfas,
  getPayrollPfaTransfer,
  getPayrollPfaTransfers,
  initiatePayrollPfaTransfer,
  type PayrollEmployeeItem,
  type PayrollEmployeeOverviewData,
  type PayrollPfaTransferItem,
  type PayrollPfaTransferNextStatus,
} from "@/lib/api/payroll";
export const DEFAULT_PFAS = [
  "Stanbic IBTC Pension",
  "Leadway Pensure",
  "ARM Pension",
  "Premium Pension",
  "Trustfund Pensions",
  "FCMB Pensions",
  "AXA Mansard Pension",
  "AIICO Pension",
  "Access Pensions",
  "CrusaderSterling Pensions",
  "Norrenberger Pensions",
  "Oak Pensions",
  "Veritas Glanvills Pensions",
];

export type TransferStatus =
  | "Initiated"
  | "PENCOM Review"
  | "Old PFA Processing"
  | "New PFA Confirmation"
  | "Completed"
  | "Pending"
  | "Under Review"
  | "Processing"
  | "Awaiting Confirmation";

export type PfaTransferRecord = {
  id: string | number;
  employeeId?: string;
  employeeName: string;
  fromPfa: string;
  toPfa: string;
  initiatedDate: string;
  status: TransferStatus;
  rawStatus: string;
  currentStep: number; // 1 to 5
};


export const TRANSFER_STEPS = [
  { step: 1, key: "INITIATED", label: "Initiated" },
  { step: 2, key: "PENCOM_REVIEW", label: "PENCOM Review" },
  { step: 3, key: "OLD_PFA_PROCESSING", label: "Old PFA Processing" },
  { step: 4, key: "NEW_PFA_CONFIRMATION", label: "New PFA Confirmation" },
  { step: 5, key: "COMPLETED", label: "Completed" },
];

export function mapTransferStatusAndStep(
  rawStatus?: string,
  rawStep?: number,
): { status: TransferStatus; currentStep: number } {
  if (rawStep && rawStep >= 1 && rawStep <= 5) {
    const matched = TRANSFER_STEPS.find((t) => t.step === rawStep);
    return {
      status: (matched?.label as TransferStatus) ?? "Initiated",
      currentStep: rawStep,
    };
  }
  if (!rawStatus) return { status: "Initiated", currentStep: 1 };
  const s = rawStatus.toUpperCase().replace(/\s+|_/g, "");
  if (s.includes("COMPLETE") || s.includes("FINISHED")) {
    return { status: "Completed", currentStep: 5 };
  }
  if (s.includes("NEWPFA") || s.includes("CONFIRM")) {
    return { status: "New PFA Confirmation", currentStep: 4 };
  }
  if (s.includes("OLDPFA") || s.includes("PROCESSING")) {
    return { status: "Old PFA Processing", currentStep: 3 };
  }
  if (s.includes("REVIEW") || s.includes("PENCOM")) {
    return { status: "PENCOM Review", currentStep: 2 };
  }
  return { status: "Initiated", currentStep: 1 };
}

type PfaTransfersProps = {
  onCountChange?: (count: number) => void;
};

export default function PfaTransfers({ onCountChange }: PfaTransfersProps) {
  const [transfers, setTransfers] = useState<PfaTransferRecord[]>([]);
  const [apiTransfers, setApiTransfers] = useState<
    PayrollPfaTransferItem[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<PayrollEmployeeItem[]>([]);
  const [pfas, setPfas] = useState<string[]>(DEFAULT_PFAS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [advancingId, setAdvancingId] = useState<string | number | null>(null);
  const [refreshingId, setRefreshingId] = useState<string | number | null>(null);

  // Employee statutory check state
  const [isCheckingEmployee, setIsCheckingEmployee] = useState(false);
  const [employeeOverview, setEmployeeOverview] =
    useState<PayrollEmployeeOverviewData | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    employeeId: "", // CUID
    employeeName: "",
    fromPfa: "",
    toPfa: "",
    initiatedDate: new Date().toISOString().split("T")[0],
  });

  const loadTransfers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPayrollPfaTransfers();
      if (res?.data) {
        const list = Array.isArray(res.data) ? res.data : [];
        setApiTransfers(list);
      } else {
        setApiTransfers([]);
      }
    } catch (err: unknown) {
      console.error("[PfaTransfers] Failed to load PFA transfers:", err);
      const errMsg = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Failed to load PFA transfers.")
        : "Failed to load PFA transfers.";
      setError(errMsg);
      toast.error(errMsg);
      setApiTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initData() {
      await loadTransfers();

      try {
        const empRes = await getPayrollEmployees({ limit: 100 });
        if (isMounted && empRes?.data && Array.isArray(empRes.data)) {
          setEmployees(empRes.data);
        }
      } catch (err) {
        console.error("[PfaTransfers] Failed to load employees:", err);
      }

      try {
        const pfaRes = await getPayrollPensionPfas();
        if (isMounted && pfaRes?.data && Array.isArray(pfaRes.data)) {
          const names = pfaRes.data
            .map((item) =>
              typeof item === "string"
                ? item
                : (item.name ?? item.pfa ?? item.pfaName ?? ""),
            )
            .filter(Boolean);
          if (names.length > 0) {
            setPfas(Array.from(new Set([...DEFAULT_PFAS, ...names])));
          }
        }
      } catch (err) {
        console.error("[PfaTransfers] Failed to load PFAs:", err);
      }
    }

    initData();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayTransfers = useMemo<PfaTransferRecord[]>(() => {
    if (!apiTransfers || apiTransfers.length === 0) {
      return [];
    }
    return apiTransfers.map((item, index) => {
      let empName = item.employeeName;
      if (!empName && item.employee) {
        empName =
          `${item.employee.firstName || ""} ${item.employee.lastName || ""}`.trim() ||
          item.employee.fullName ||
          item.employee.email;
      }
      if (!empName && item.employeeId) {
        const matched = employees.find((e) => e.employeeId === item.employeeId);
        empName = matched?.fullName || item.employeeId;
      }
      const { status, currentStep } = mapTransferStatusAndStep(
        item.status,
        item.currentStep ?? item.step,
      );
      const dateRaw = item.initiatedDate ?? item.initiatedAt ?? item.createdAt;
      const formattedDate = dateRaw
        ? dateRaw.split("T")[0]
        : new Date().toISOString().split("T")[0];

      return {
        id: item.id ?? index + 1,
        employeeId: item.employeeId,
        employeeName: empName || `Employee ${index + 1}`,
        fromPfa: item.fromPfa ?? item.fromPfaName ?? "—",
        toPfa: item.toPfa ?? item.toPfaName ?? "—",
        initiatedDate: formattedDate,
        status,
        rawStatus: item.status || "INITIATED",
        currentStep,
      };
    });
  }, [apiTransfers, employees]);

  useEffect(() => {
    setTransfers(displayTransfers);
    onCountChange?.(displayTransfers.length);
  }, [displayTransfers, onCountChange]);

  // Fetch detailed employee overview when employee selection changes
  const checkEmployeeProfile = async (empId: string) => {
    if (!empId) {
      setEmployeeOverview(null);
      setFormData((prev) => ({ ...prev, fromPfa: "", toPfa: "" }));
      return;
    }

    setIsCheckingEmployee(true);
    try {
      const res = await getPayrollEmployeeOverview(empId);
      if (res?.data) {
        setEmployeeOverview(res.data);
        const statutory = res.data.statutoryProfile;
        const currentPfa = statutory?.pfaName?.trim() || "";
        setFormData((prev) => ({
          ...prev,
          fromPfa: currentPfa,
          toPfa: prev.toPfa === currentPfa ? "" : prev.toPfa,
        }));
      } else {
        setEmployeeOverview(null);
        setFormData((prev) => ({ ...prev, fromPfa: "", toPfa: "" }));
      }
    } catch (err) {
      console.error("[PfaTransfers] Failed to check employee profile:", err);
      toast.error("Could not fetch employee statutory profile details.");
      setEmployeeOverview(null);
      setFormData((prev) => ({ ...prev, fromPfa: "", toPfa: "" }));
    } finally {
      setIsCheckingEmployee(false);
    }
  };

  const handleEmployeeChange = (empId: string) => {
    const matched = employees.find((e) => e.employeeId === empId);
    setFormData((prev) => ({
      ...prev,
      employeeId: empId,
      employeeName: matched?.fullName || matched?.employeeCode || empId,
      fromPfa: "",
      toPfa: "",
    }));
    checkEmployeeProfile(empId);
  };

  // Check if selected employee has an unresolved transfer
  const hasUnresolvedTransfer = useMemo(() => {
    if (!formData.employeeId || !apiTransfers) return false;
    return apiTransfers.some(
      (t) =>
        t.employeeId === formData.employeeId &&
        t.status?.toUpperCase() !== "COMPLETED",
    );
  }, [formData.employeeId, apiTransfers]);

  // Check if current statutory profile has PFA
  const hasValidPfa = Boolean(
    employeeOverview?.statutoryProfile &&
    employeeOverview.statutoryProfile.pfaName?.trim(),
  );

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentPfa =
      formData.fromPfa || employeeOverview?.statutoryProfile?.pfaName;

    if (!formData.employeeId) {
      toast.error("Please select an employee.");
      return;
    }

    if (!currentPfa) {
      toast.error("Please select the current PFA.");
      return;
    }

    if (!formData.toPfa) {
      toast.error("Please select the target (new) PFA.");
      return;
    }

    if (currentPfa === formData.toPfa) {
      toast.error("Target PFA must be different from current PFA.");
      return;
    }

    if (hasUnresolvedTransfer) {
      toast.error(
        "This employee already has an active unresolved PFA transfer in progress.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        employeeId: formData.employeeId,
        currentPfa,
        newPfa: formData.toPfa,
        externalReference: `PFA-CHANGE-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      };

      const res = await initiatePayrollPfaTransfer(payload);

      toast.success(
        res?.message ||
        `PFA transfer initiated for ${formData.employeeName}. Submitted for PENCOM Review.`,
      );

      await loadTransfers();

      setFormData({
        employeeId: "",
        employeeName: "",
        fromPfa: "",
        toPfa: "",
        initiatedDate: new Date().toISOString().split("T")[0],
      });
      setEmployeeOverview(null);
      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error("[PfaTransfers] Failed to initiate PFA transfer:", err);
      let errMsg = "Failed to initiate PFA transfer.";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          errMsg =
            err.response.data?.message ||
            "Conflict: Mismatch or unresolved transfer exists.";
        } else if (err.response?.data?.message) {
          errMsg = err.response.data.message;
        }

        const validationErrors = err.response?.data?.validationErrors;
        if (Array.isArray(validationErrors) && validationErrors.length > 0) {
          const details = validationErrors
            .map((v: { field?: string; message?: string }) =>
              v.field ? `${v.field}: ${v.message}` : v.message,
            )
            .filter(Boolean)
            .join(", ");
          if (details) {
            errMsg += ` (${details})`;
          }
        }
      }
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdvance = async (
    transfer: PfaTransferRecord,
    targetStep: number,
  ) => {
    if (advancingId !== null) return;

    let nextStatus: PayrollPfaTransferNextStatus | null = null;
    if (targetStep === 2) nextStatus = "PENCOM_REVIEW";
    else if (targetStep === 3) nextStatus = "OLD_PFA_PROCESSING";
    else if (targetStep === 4) nextStatus = "NEW_PFA_CONFIRMATION";
    else if (targetStep === 5) nextStatus = "COMPLETED";

    if (!nextStatus) return;

    setAdvancingId(transfer.id);

    try {
      const res = await advancePayrollPfaTransfer(transfer.id, {
        nextStatus,
        externalReference: `PFA-CHANGE-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      });

      const targetLabel =
        TRANSFER_STEPS.find((t) => t.step === targetStep)?.label || nextStatus;
      toast.success(
        res?.message ||
        `Transfer for ${transfer.employeeName} advanced to ${targetLabel}.`,
      );

      await loadTransfers();
    } catch (err: unknown) {
      console.error("[PfaTransfers] Failed to advance transfer:", err);
      let errMsg = "Failed to advance PFA transfer.";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          errMsg =
            err.response.data?.message ||
            "Invalid transition: Cannot advance transfer to this status.";
        } else if (err.response?.data?.message) {
          errMsg = err.response.data.message;
        }
      }
      toast.error(errMsg);
    } finally {
      setAdvancingId(null);
    }
  };

  const handleFetchDetail = async (transferId: string | number) => {
    if (refreshingId !== null) return;
    setRefreshingId(transferId);
    try {
      const res = await getPayrollPfaTransfer(transferId);
      if (res?.data) {
        const item = res.data;
        const { status, currentStep } = mapTransferStatusAndStep(
          item.status,
          item.currentStep ?? item.step,
        );
        setTransfers((prev) =>
          prev.map((t) =>
            t.id === transferId
              ? {
                ...t,
                status,
                currentStep,
                fromPfa: item.fromPfa ?? item.fromPfaName ?? t.fromPfa,
                toPfa: item.toPfa ?? item.toPfaName ?? t.toPfa,
              }
              : t,
          ),
        );
        toast.info(res.message || "Transfer details refreshed.");
      }
    } catch (err: unknown) {
      console.error("[PfaTransfers] Failed to fetch transfer detail:", err);
      toast.error("Failed to load transfer detail.");
    } finally {
      setRefreshingId(null);
    }
  };

  return (
    <section className="mt-5 w-full">
      {/* HEADER ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pb-4">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#1683d8] px-4 text-xs font-semibold text-white transition hover:bg-[#1270b8] focus:outline-none focus:ring-2 focus:ring-[#1683d8]/20 shadow-sm"
        >
          <Plus size={16} strokeWidth={2.2} />
          Initiate PFA Transfer
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* PENCOM NOTICE BANNER */}
      <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-[#1e40af] leading-relaxed flex items-start gap-3">
        <div>
          <p className="mt-0.5 text-blue-800/90">
            PFA transfers follow the PENCOM 12-month process. Once initiated, it proceeds through PENCOM Review → Old PFA Processing → New PFA Confirmation → Completion.
          </p>
        </div>
      </div>

      {/* TRANSFER CARDS LIST */}
      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-[#D0D5DD] bg-white">
          <div className="flex items-center gap-2 text-xs font-medium text-[#667085]">
            <Loader2 size={16} className="animate-spin text-[#1683d8]" />
            Loading PFA transfers...
          </div>
        </div>
      ) : transfers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D0D5DD] bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#1683d8]">
            <Plus size={24} />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-[#1f2937]">
            No PFA Transfers Found
          </h3>
          <p className="mt-1 text-xs text-[#667085] max-w-sm">
            No PFA transfer requests have been initiated yet. You can initiate a transfer for an employee with a valid pension profile.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1683d8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1270b8] transition"
          >
            <Plus size={14} />
            Initiate First Transfer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {transfers.map((item) => (
            <TransferCard
              key={item.id}
              transfer={item}
              isAdvancing={advancingId === item.id}
              isRefreshing={refreshingId === item.id}
              onAdvance={handleAdvance}
              onFetchDetail={handleFetchDetail}
            />
          ))}
        </div>
      )}

      {/* INITIATE PFA TRANSFER MODAL */}
      {isModalOpen && (
        <div
          onClick={() => {
            if (!isSubmitting) setIsModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[480px] rounded-2xl bg-white p-6 sm:p-7 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-[#1f2937]">
                Initiate PFA Transfer
              </h3>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 transition hover:text-gray-600 disabled:opacity-50"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Regulatory Notice Banner */}
            <div className="mt-4 rounded-lg border border-[#FDE68A] bg-[#FFF9E6] px-4 py-3 text-xs leading-relaxed text-[#854D0E]">
              PENCOM mandates a 12-month waiting period before a PFA transfer completes.
            </div>

            {/* Form */}
            <form onSubmit={handleInitiate} className="mt-5 space-y-4">
              {/* Employee Selection */}
              <div>
                <label
                  htmlFor="transfer-employee"
                  className="mb-1.5 block text-xs font-normal text-[#4B5563]"
                >
                  Employee *
                </label>
                <select
                  id="transfer-employee"
                  value={formData.employeeId}
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                  required
                  disabled={isSubmitting || isCheckingEmployee}
                  className="h-10 w-full rounded-lg border border-[#D0D5DD] bg-white px-3 text-xs text-[#101828] outline-none transition focus:border-[#1683d8] focus:ring-1 focus:ring-[#1683d8]"
                >
                  <option value="">Select employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.fullName} {emp.employeeCode ? `(${emp.employeeCode})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current PFA (From) */}
              <div>
                <label
                  htmlFor="from-pfa"
                  className="mb-1.5 block text-xs font-normal text-[#4B5563]"
                >
                  Current PFA (From)
                </label>
                <select
                  id="from-pfa"
                  value={formData.fromPfa}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fromPfa: e.target.value }))
                  }
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-lg border border-[#D0D5DD] bg-white px-3 text-xs text-[#101828] outline-none transition focus:border-[#1683d8] focus:ring-1 focus:ring-[#1683d8]"
                >
                  <option value="">Select...</option>
                  {pfas.map((pfa) => (
                    <option key={pfa} value={pfa}>
                      {pfa}
                    </option>
                  ))}
                </select>
              </div>

              {/* New PFA (To) */}
              <div>
                <label
                  htmlFor="to-pfa"
                  className="mb-1.5 block text-xs font-normal text-[#4B5563]"
                >
                  New PFA (To)
                </label>
                <select
                  id="to-pfa"
                  value={formData.toPfa}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, toPfa: e.target.value }))
                  }
                  required
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-lg border border-[#D0D5DD] bg-white px-3 text-xs text-[#101828] outline-none transition focus:border-[#1683d8] focus:ring-1 focus:ring-[#1683d8]"
                >
                  <option value="">Select...</option>
                  {pfas
                    .filter((pfa) => pfa !== formData.fromPfa)
                    .map((pfa) => (
                      <option key={pfa} value={pfa}>
                        {pfa}
                      </option>
                    ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 w-36 rounded-lg border border-[#D0D5DD] bg-white text-xs sm:text-sm font-semibold text-[#344054] transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.employeeId || !formData.toPfa}
                  className="flex-1 flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1683d8] px-6 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#1270b8] disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  {isSubmitting ? "Initiating..." : "Initiate Transfer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </section>
  );
}

/* ==========================================================
   TRANSFER CARD COMPONENT
========================================================== */

function TransferCard({
  transfer,
  isAdvancing,
  isRefreshing,
  onAdvance,
  onFetchDetail,
}: {
  transfer: PfaTransferRecord;
  isAdvancing?: boolean;
  isRefreshing?: boolean;
  onAdvance?: (transfer: PfaTransferRecord, targetStep: number) => void;
  onFetchDetail?: (transferId: string | number) => void;
}) {
  const isCompletedStatus = transfer.status === "Completed";
  const nextStep = transfer.currentStep + 1;

  // Status color styles
  const getBadgeStyle = (status: TransferStatus | string) => {
    switch (status) {
      case "Completed":
        return "bg-[#D1FAE5] text-[#065F46]";
      case "New PFA Confirmation":
      case "Awaiting Confirmation":
        return "bg-indigo-50 text-indigo-700";
      case "Old PFA Processing":
      case "Processing":
        return "bg-purple-50 text-purple-700";
      case "PENCOM Review":
      case "Under Review":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "Initiated":
      case "Pending":
      default:
        return "bg-[#F3F4F6] text-[#374151]";
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white p-5 sm:p-6 shadow-none transition hover:border-gray-400">
      {/* Top Row: Employee details & Status Badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          {/* Employee Name */}
          <h3
            onClick={() => onFetchDetail?.(transfer.id)}
            title="Click to refresh transfer details"
            className="text-base font-bold text-[#1F2937] cursor-pointer hover:text-[#1683d8] transition inline-flex items-center gap-2"
          >
            {transfer.employeeName}
            {isRefreshing && (
              <Loader2 size={14} className="animate-spin text-[#1683d8]" />
            )}
          </h3>

          {/* Transfer Route */}
          <div className="mt-2 text-xs text-[#4B5563] space-y-0.5">
            <p className="font-normal text-[#4B5563]">{transfer.fromPfa}</p>
            <p className="text-gray-400 text-xs">&gt;</p>
            <p className="font-normal text-[#4B5563]">{transfer.toPfa}</p>
            <p className="pt-1 text-[11px] text-[#9CA3AF]">
              Initiated {transfer.initiatedDate}
            </p>
          </div>
        </div>

        {/* Status Pill Badge */}
        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getBadgeStyle(
              transfer.status,
            )}`}
          >
            {transfer.status}
          </span>
        </div>
      </div>

      {/* Stepper / Timeline */}
      <div className="mt-6 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] w-full px-2">
          {TRANSFER_STEPS.map((s, index) => {
            const isCompletedStep = s.step < transfer.currentStep;
            const isCurrentStep = s.step === transfer.currentStep;
            const isNextStep =
              !isCompletedStatus && transfer.currentStep + 1 === s.step;
            const isLineCompleted = transfer.currentStep > s.step;

            return (
              <div
                key={s.step}
                className="flex items-center flex-1 last:flex-none"
              >
                {/* Step Node */}
                <div className="flex flex-col items-center relative z-10 shrink-0">
                  {/* Step Circle */}
                  <button
                    type="button"
                    disabled={!isNextStep || isAdvancing}
                    onClick={() =>
                      isNextStep &&
                      !isAdvancing &&
                      onAdvance?.(transfer, s.step)
                    }
                    title={
                      isNextStep
                        ? `Click to advance to ${s.label}`
                        : s.label
                    }
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${isCompletedStep
                      ? "bg-[#0B6434] text-white"
                      : isCurrentStep
                        ? "bg-[#1070A8] text-white shadow-sm"
                        : "bg-[#F3F4F6] text-gray-400 border border-gray-200 cursor-default"
                      } ${isAdvancing && isNextStep ? "opacity-60 cursor-wait" : ""}`}
                  >
                    {isAdvancing && isNextStep ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : isCompletedStep ? (
                      <Check size={14} strokeWidth={2.5} />
                    ) : (
                      s.step
                    )}
                  </button>

                  {/* Step Label */}
                  <span
                    className={`mt-2 text-center text-[11px] whitespace-nowrap ${isCompletedStep || isCurrentStep
                      ? "font-bold text-[#1F2937]"
                      : "text-[#9CA3AF]"
                      }`}
                  >
                    {s.label}
                  </span>
                </div>

                {/* Connecting Line to next step */}
                {index < TRANSFER_STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-[2px] flex-1 -mt-6 transition ${isLineCompleted ? "bg-[#0B6434]" : "bg-gray-200"
                      }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
