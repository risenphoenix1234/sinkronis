"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FiEdit2,
  FiArrowLeft,
  FiDownload,
  FiFileText,
  FiEye,
  FiEyeOff,
  FiCalendar,
  FiBriefcase,
  FiUser,
  FiCreditCard,
  FiClock,
  FiRefreshCw,
  FiCheckCircle,
  FiCheck,
  FiX,
  FiUploadCloud,
  FiChevronDown,
  FiLoader,
} from "react-icons/fi";
import { toast } from "react-toastify";
import BankSelect from "@/components/ui/BankSelect";
import {
  getEmployee,
  getEmployeeActivity,
  downloadEmployeeDocument,
  updateEmployeeStatus,
  updateEmployee,
  getEmployees,
} from "@/lib/api/hris";
import { getDepartmentsTable } from "@/lib/api/admin";
import type {
  EmployeeActivityRecord,
  EmployeeStatus,
  GetEmployeeDetail,
  UpdateEmployeePayload,
  Gender,
  MaritalStatus,
  WorkMode,
  EmploymentType,
  AccountType,
  DocumentType,
} from "@/lib/api/types/hrisTypes";
import ChangeEmployeeStatusModal from "@/components/modals/Hris/ChangeEmployeeStatusModal";

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ON_LEAVE: "On Leave",
  SUSPENDED: "Suspended",
  TERMINATED: "Terminated",
  CONFIRMED: "Confirmed",
  PROBATION: "Probation",
  EXITED: "Exited",
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PROBATION: "bg-amber-50 text-amber-700 border-amber-200",
  ON_LEAVE: "bg-blue-50 text-blue-700 border-blue-200",
  SUSPENDED: "bg-orange-50 text-orange-700 border-orange-200",
  INACTIVE: "bg-slate-100 text-slate-600 border-slate-200",
  TERMINATED: "bg-rose-50 text-rose-700 border-rose-200",
  EXITED: "bg-rose-50 text-rose-700 border-rose-200",
};

const STATUS_DOT_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-500",
  CONFIRMED: "bg-emerald-500",
  PROBATION: "bg-amber-500",
  ON_LEAVE: "bg-blue-500",
  SUSPENDED: "bg-orange-500",
  INACTIVE: "bg-slate-400",
  TERMINATED: "bg-rose-500",
  EXITED: "bg-rose-500",
};

const AVAILABLE_STATUSES: {
  value: EmployeeStatus;
  label: string;
  dotColor: string;
}[] = [
  { value: "ACTIVE", label: "Active", dotColor: "bg-emerald-500" },
  { value: "CONFIRMED", label: "Confirmed", dotColor: "bg-emerald-500" },
  { value: "PROBATION", label: "Probation", dotColor: "bg-amber-500" },
  { value: "ON_LEAVE", label: "On Leave", dotColor: "bg-blue-500" },
  { value: "SUSPENDED", label: "Suspended", dotColor: "bg-orange-500" },
  { value: "INACTIVE", label: "Inactive", dotColor: "bg-slate-400" },
  { value: "EXITED", label: "Exited", dotColor: "bg-rose-500" },
];

const STATUSES_REQUIRING_CONFIRMATION: EmployeeStatus[] = [
  "INACTIVE",
  "EXITED",
];

interface WorkDetailsFormState {
  departmentId: string;
  phoneNumber: string;
  personalEmail: string;
  nationality: string;
  dateOfBirth: string;
  maritalStatus: MaritalStatus | "";
  gender: Gender | "";
  workMode: WorkMode | "";
  employmentType: EmploymentType | "";
  address: string;
  earnings: string;
  position: string;
  firstName: string;
  lastName: string;
}

const emptyWorkDetailsForm: WorkDetailsFormState = {
  departmentId: "",
  phoneNumber: "",
  personalEmail: "",
  nationality: "",
  dateOfBirth: "",
  maritalStatus: "",
  gender: "",
  workMode: "",
  employmentType: "",
  address: "",
  earnings: "",
  position: "",
  firstName: "",
  lastName: "",
};

interface BankDetailsFormState {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode: string;
  accountType: AccountType | "";
  monthlySalary: string;
}

const emptyBankDetailsForm: BankDetailsFormState = {
  bankName: "",
  accountNumber: "",
  accountName: "",
  bankCode: "",
  accountType: "",
  monthlySalary: "",
};

function getInitialBankFormState(
  emp: GetEmployeeDetail | null,
): BankDetailsFormState {
  if (!emp) return emptyBankDetailsForm;
  const bank = (emp.bankDetails || {}) as Record<string, any>;
  const personal = (emp.personalInformation || {}) as Record<string, any>;
  const header = emp.header || {};

  const earn =
    personal.earnings !== undefined && personal.earnings !== null
      ? String(personal.earnings)
      : bank.monthlySalary !== undefined && bank.monthlySalary !== null
        ? String(bank.monthlySalary)
        : "";

  const rawAccountNumber = bank.accountNumber ? String(bank.accountNumber) : "";
  const accountNumberIsMasked =
    bank.masked === true || rawAccountNumber.includes("*");

  return {
    bankName: bank.bankName || "",
    accountNumber: accountNumberIsMasked ? "" : rawAccountNumber,
    accountName: bank.accountName || personal.fullName || header.name || "",
    bankCode: bank.bankCode || "",
    accountType: (bank.accountType as AccountType) || "",
    monthlySalary: earn,
  };
}

interface NextOfKinFormState {
  firstName: string;
  lastName: string;
  contact: string;
  relationship: string;
  address: string;
}

const emptyNextOfKinForm: NextOfKinFormState = {
  firstName: "",
  lastName: "",
  contact: "",
  relationship: "",
  address: "",
};

function getInitialNextOfKinFormState(
  emp: GetEmployeeDetail | null,
): NextOfKinFormState {
  if (!emp) return emptyNextOfKinForm;
  const nok = (emp.nextOfKin || {}) as Record<string, any>;

  let first = nok.firstName || "";
  let last = nok.lastName || "";
  if (!first && !last && nok.name) {
    const parts = String(nok.name).trim().split(/\s+/);
    first = parts[0] || "";
    last = parts.slice(1).join(" ") || "";
  }

  return {
    firstName: first,
    lastName: last,
    contact: nok.phoneNumber || nok.contact || "",
    relationship: nok.relationship || "",
    address: nok.address || "",
  };
}

interface GuarantorFormState {
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  address: string;
}

const emptyGuarantorForm: GuarantorFormState = {
  firstName: "",
  lastName: "",
  relationship: "",
  phone: "",
  address: "",
};

function getInitialGuarantorFormState(
  emp: GetEmployeeDetail | null,
): GuarantorFormState {
  if (!emp) return emptyGuarantorForm;
  const guar = (emp.guarantor || {}) as Record<string, any>;

  let first = guar.firstName || "";
  let last = guar.lastName || "";
  if (!first && !last && guar.name) {
    const parts = String(guar.name).trim().split(/\s+/);
    first = parts[0] || "";
    last = parts.slice(1).join(" ") || "";
  }

  return {
    firstName: first,
    lastName: last,
    relationship: guar.relationship || "",
    phone: guar.phoneNumber || guar.phone || "",
    address: guar.address || "",
  };
}

interface DocumentsFormState {
  documentType: DocumentType | "";
  selectedFile: File | null;
}

const emptyDocumentsForm: DocumentsFormState = {
  documentType: "IDENTIFICATION",
  selectedFile: null,
};

function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return String(dateStr);
  }
}

function formatFileSize(bytes?: number): string {
  if (!bytes || isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getInitialFormState(
  emp: GetEmployeeDetail | null,
): WorkDetailsFormState {
  if (!emp) return emptyWorkDetailsForm;

  const header = emp.header || {};
  const personal = (emp.personalInformation || {}) as Record<string, any>;
  const bank = (emp.bankDetails || {}) as Record<string, any>;

  let first = personal.firstName || "";
  let last = personal.lastName || "";
  if (!first && !last && (header.name || personal.fullName)) {
    const fullName = String(personal.fullName || header.name || "").trim();
    const parts = fullName.split(/\s+/);
    first = parts[0] || "";
    last = parts.slice(1).join(" ") || "";
  }

  const deptId =
    header.department?.id ||
    (typeof personal.department === "object"
      ? personal.department?.id
      : personal.department) ||
    "";

  const pos = header.role || personal.role || personal.position || "";
  const wm = personal.workMode || "";
  const empType = personal.employmentType || "";

  const earn =
    personal.earnings !== undefined && personal.earnings !== null
      ? String(personal.earnings)
      : bank.monthlySalary !== undefined && bank.monthlySalary !== null
        ? String(bank.monthlySalary)
        : "";

  let dob = "";
  if (personal.dateOfBirth) {
    try {
      const d = new Date(personal.dateOfBirth);
      if (!isNaN(d.getTime())) {
        dob = d.toISOString().split("T")[0];
      } else {
        dob = String(personal.dateOfBirth);
      }
    } catch {
      dob = String(personal.dateOfBirth);
    }
  }

  return {
    firstName: first,
    lastName: last,
    departmentId: deptId,
    phoneNumber: header.phoneNumber || personal.phoneNumber || "",
    personalEmail: personal.emailAddress || personal.personalEmail || "",
    nationality: personal.nationality || "",
    dateOfBirth: dob,
    maritalStatus: (personal.maritalStatus as any) || "",
    gender: (personal.gender as any) || "",
    workMode: (wm as any) || "",
    employmentType: (empType as any) || "",
    address: personal.address || "",
    earnings: earn,
    position: pos,
  };
}

function getCurrentManagerId(emp: GetEmployeeDetail | null): string {
  const manager = (emp as unknown as Record<string, any> | null)?.manager;
  return typeof manager?.id === "string" ? manager.id : "";
}

export default function EmployeeProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [employee, setEmployee] = useState<GetEmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activity, setActivity] = useState<EmployeeActivityRecord[]>([]);
  const [showEmployeeId, setShowEmployeeId] = useState(true);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [initialStatusForModal, setInitialStatusForModal] = useState<
    EmployeeStatus | undefined
  >(undefined);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement | null>(null);
  const editParamHandled = useRef(false);

  // In-card Edit Mode for Work Details
  const [isEditingWorkDetails, setIsEditingWorkDetails] = useState(false);
  const [editForm, setEditForm] =
    useState<WorkDetailsFormState>(emptyWorkDetailsForm);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [managers, setManagers] = useState<
    { id: string; name: string; employeeId: string }[]
  >([]);
  const [selectedManagerId, setSelectedManagerId] = useState("");

  const loadManagers = async () => {
    try {
      const list = await getEmployees({ limit: 100 });
      const eligible = list
        .filter(
          (e) =>
            e.id !== params.id &&
            (e.operationalStatus === "ACTIVE" ||
              e.operationalStatus === "ON_LEAVE"),
        )
        .map((e) => ({ id: e.id, name: e.name, employeeId: e.employeeId }));
      setManagers(eligible);
      return eligible;
    } catch {
      setManagers([]);
      return null;
    }
  };

  useEffect(() => {
    void loadManagers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // In-card Edit Mode for Bank Details
  const [isEditingBankDetails, setIsEditingBankDetails] = useState(false);
  const [bankForm, setBankForm] =
    useState<BankDetailsFormState>(emptyBankDetailsForm);
  const [submittingBank, setSubmittingBank] = useState(false);
  const [bankError, setBankError] = useState<string | null>(null);

  // In-card Edit Mode for Next of Kin
  const [isEditingNextOfKin, setIsEditingNextOfKin] = useState(false);
  const [nokForm, setNokForm] =
    useState<NextOfKinFormState>(emptyNextOfKinForm);
  const [submittingNok, setSubmittingNok] = useState(false);
  const [nokError, setNokError] = useState<string | null>(null);

  // In-card Edit Mode for Guarantor
  const [isEditingGuarantor, setIsEditingGuarantor] = useState(false);
  const [guarForm, setGuarForm] =
    useState<GuarantorFormState>(emptyGuarantorForm);
  const [submittingGuar, setSubmittingGuar] = useState(false);
  const [guarError, setGuarError] = useState<string | null>(null);

  // In-card Edit Mode for Documents
  const [isEditingDocuments, setIsEditingDocuments] = useState(false);
  const [docForm, setDocForm] =
    useState<DocumentsFormState>(emptyDocumentsForm);
  const [submittingDoc, setSubmittingDoc] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [detail, activityRes] = await Promise.all([
        getEmployee(params.id),
        getEmployeeActivity(params.id).catch((err) => {
          console.error("getEmployeeActivity failed:", err);
          toast.error("Failed to load employee activity history.");
          return {
            data: [] as EmployeeActivityRecord[],
          };
        }),
      ]);
        setEmployee(detail);
      setSelectedManagerId(getCurrentManagerId(detail));
      setActivity(activityRes.data ?? []);
      setEditForm(getInitialFormState(detail));
      setBankForm(getInitialBankFormState(detail));
      setNokForm(getInitialNextOfKinFormState(detail));
      setGuarForm(getInitialGuarantorFormState(detail));
    } catch (error) {
      console.error("getEmployee failed:", error);
      const errMsg = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Couldn't load this employee.")
        : "Couldn't load this employee.";
      setLoadError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Load departments for the select dropdown
  useEffect(() => {
    let isMounted = true;
    setLoadingDepartments(true);
    getDepartmentsTable({ limit: 100 })
      .then((res: any) => {
        if (isMounted && res?.data && Array.isArray(res.data)) {
          const formatted = res.data.map((d: any) => ({
            id: d.id,
            name: d.departmentName || d.name || "Unnamed Department",
          }));
          setDepartments(formatted);
        }
      })
      .catch((err) => {
        console.error("Could not load departments:", err);
        toast.error("Could not load departments list.");
      })
      .finally(() => {
        if (isMounted) setLoadingDepartments(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Check URL query param for ?edit=true to auto-enter edit mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (
        !editParamHandled.current &&
        sp.get("edit") === "true" &&
        employee
      ) {
        editParamHandled.current = true;
        setEditForm(getInitialFormState(employee));
        setIsEditingWorkDetails(true);
      }
    }
  }, [employee]);

  // Close status dropdown on click outside
  useEffect(() => {
    if (!isStatusDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStatusDropdownOpen]);

  // Handle direct status selection from dropdown calling updateEmployeeStatus
  const handleSelectStatus = async (newStatus: EmployeeStatus) => {
    setIsStatusDropdownOpen(false);
    if (!employee) return;
    const currentStatus =
      employee.header.lifecycleStatus || employee.header.status || "ACTIVE";
    if (newStatus === currentStatus) return;

    if (STATUSES_REQUIRING_CONFIRMATION.includes(newStatus)) {
      setInitialStatusForModal(newStatus);
      setStatusModalOpen(true);
      return;
    }

    setUpdatingStatus(true);
    try {
      const todayDate = new Date().toISOString().split("T")[0];
      await updateEmployeeStatus(params.id, {
        status: newStatus,
        effectiveDate: todayDate,
      });

      toast.success(
        `Employee status updated to ${STATUS_LABEL[newStatus] || newStatus} successfully!`,
      );
      await load();
    } catch (err: unknown) {
      console.error("updateEmployeeStatus failed:", err);
      let errMsg = "Failed to update employee status. Please try again.";
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
        if (
          resData?.validationErrors &&
          Array.isArray(resData.validationErrors)
        ) {
          errMsg = resData.validationErrors
            .map(
              (v: { field?: string; message?: string }) => v.message || v.field,
            )
            .join(", ");
        } else if (resData?.message) {
          errMsg = resData.message;
        }
      }
      toast.error(errMsg);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleStartEdit = () => {
    if (!employee) return;
    setEditForm(getInitialFormState(employee));
      setEditError(null);
    setSelectedManagerId(getCurrentManagerId(employee));
    void loadManagers();
    setIsEditingWorkDetails(true);
  };

  const handleCancelEdit = () => {
    if (employee) {
      setEditForm(getInitialFormState(employee));
    }
    setEditError(null);
    setSelectedManagerId(getCurrentManagerId(employee));
    setIsEditingWorkDetails(false);
  };

  const updateField = <K extends keyof WorkDetailsFormState>(
    key: K,
    value: WorkDetailsFormState[K],
  ) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveEdit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
      if (submittingEdit) return;

    const currentManagerId = getCurrentManagerId(employee);
    const managerChanged =
      selectedManagerId !== "" &&
      selectedManagerId !== currentManagerId &&
      !(selectedManagerId === "__none__" && currentManagerId === "");

    setSubmittingEdit(true);
    setEditError(null);

    try {
         if (managerChanged && selectedManagerId !== "__none__") {
        const fresh = await loadManagers();
        if (fresh && !fresh.some((m) => m.id === selectedManagerId)) {
          const unavailable =
            "The selected manager is no longer eligible or available.";
          setEditError(unavailable);
          toast.error(unavailable);
          return;
        }
      }

      const payload: UpdateEmployeePayload = {
        firstName: editForm.firstName.trim() || undefined,
        lastName: editForm.lastName.trim() || undefined,
        departmentId: editForm.departmentId || undefined,
        phoneNumber: editForm.phoneNumber.trim() || undefined,
        personalEmail: editForm.personalEmail.trim() || undefined,
        nationality: editForm.nationality.trim() || undefined,
        dateOfBirth: editForm.dateOfBirth || undefined,
        maritalStatus: (editForm.maritalStatus as MaritalStatus) || undefined,
        gender: (editForm.gender as Gender) || undefined,
        workMode: (editForm.workMode as WorkMode) || undefined,
        employmentType:
          (editForm.employmentType as EmploymentType) || undefined,
        address: editForm.address.trim() || undefined,
        earnings:
          editForm.earnings !== "" && !isNaN(Number(editForm.earnings))
            ? Number(editForm.earnings)
            : undefined,
         position: editForm.position.trim() || undefined,
        managerId: managerChanged
          ? selectedManagerId === "__none__"
            ? null
            : selectedManagerId
          : undefined,
      };

      await updateEmployee(params.id, payload);
      toast.success("Work details updated successfully!");
      setIsEditingWorkDetails(false);
      await load();
    } catch (err: unknown) {
      console.error("updateEmployee failed:", err);
      let msg = "Failed to save changes. Please try again.";
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
        if (
          resData?.validationErrors &&
          Array.isArray(resData.validationErrors)
        ) {
          msg = resData.validationErrors
            .map((v: any) => v.message || v.field)
            .join(", ");
        } else if (resData?.message) {
          msg = resData.message;
        }
      }
           if (
        axios.isAxiosError(err) &&
        err.response?.status === 404 &&
        /manager/i.test(String(err.response?.data?.message ?? ""))
      ) {
        msg = "The selected manager is no longer eligible or available.";
        void loadManagers();
      }
      setEditError(msg);
      toast.error(msg);
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Bank Details Handlers
  const handleStartEditBank = () => {
    if (!employee) return;
    setBankForm(getInitialBankFormState(employee));
    setBankError(null);
    setIsEditingBankDetails(true);
  };

  const handleCancelEditBank = () => {
    if (employee) {
      setBankForm(getInitialBankFormState(employee));
    }
    setBankError(null);
    setIsEditingBankDetails(false);
  };

  const updateBankField = <K extends keyof BankDetailsFormState>(
    key: K,
    value: BankDetailsFormState[K],
  ) => {
    setBankForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveBank = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submittingBank) return;

    setSubmittingBank(true);
    setBankError(null);

    try {
      const payload: UpdateEmployeePayload = {
        bankName: bankForm.bankName.trim() || undefined,
        accountNumber: bankForm.accountNumber.trim() || undefined,
        accountName: bankForm.accountName.trim() || undefined,
        bankCode: bankForm.bankCode.trim() || undefined,
        accountType: (bankForm.accountType as AccountType) || undefined,
        earnings:
          bankForm.monthlySalary !== "" &&
          !isNaN(Number(bankForm.monthlySalary))
            ? Number(bankForm.monthlySalary)
            : undefined,
      };

      await updateEmployee(params.id, payload);
      toast.success("Bank details updated successfully!");
      setIsEditingBankDetails(false);
      await load();
    } catch (err: unknown) {
      console.error("updateEmployee (bank) failed:", err);
      let msg = "Failed to update bank details. Please try again.";
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
        if (
          resData?.validationErrors &&
          Array.isArray(resData.validationErrors)
        ) {
          msg = resData.validationErrors
            .map((v: any) => v.message || v.field)
            .join(", ");
        } else if (resData?.message) {
          msg = resData.message;
        }
      }
      setBankError(msg);
      toast.error(msg);
    } finally {
      setSubmittingBank(false);
    }
  };

  // Next of Kin Handlers
  const handleStartEditNok = () => {
    if (!employee) return;
    setNokForm(getInitialNextOfKinFormState(employee));
    setNokError(null);
    setIsEditingNextOfKin(true);
  };

  const handleCancelEditNok = () => {
    if (employee) {
      setNokForm(getInitialNextOfKinFormState(employee));
    }
    setNokError(null);
    setIsEditingNextOfKin(false);
  };

  const updateNokField = <K extends keyof NextOfKinFormState>(
    key: K,
    value: NextOfKinFormState[K],
  ) => {
    setNokForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveNextOfKin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submittingNok) return;

    setSubmittingNok(true);
    setNokError(null);

    try {
      const payload: UpdateEmployeePayload = {
        nextOfKinFirstName: nokForm.firstName.trim() || undefined,
        nextOfKinLastName: nokForm.lastName.trim() || undefined,
        nextOfKinContact: nokForm.contact.trim() || undefined,
        nextOfKinAddress: nokForm.address.trim() || undefined,
      };

      await updateEmployee(params.id, payload);
      toast.success("Next of kin updated successfully!");
      setIsEditingNextOfKin(false);
      await load();
    } catch (err: unknown) {
      console.error("updateEmployee (next of kin) failed:", err);
      let msg = "Failed to update next of kin. Please try again.";
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
        if (
          resData?.validationErrors &&
          Array.isArray(resData.validationErrors)
        ) {
          msg = resData.validationErrors
            .map((v: any) => v.message || v.field)
            .join(", ");
        } else if (resData?.message) {
          msg = resData.message;
        }
      }
      setNokError(msg);
      toast.error(msg);
    } finally {
      setSubmittingNok(false);
    }
  };

  // Guarantor Handlers
  const handleStartEditGuarantor = () => {
    if (!employee) return;
    setGuarForm(getInitialGuarantorFormState(employee));
    setGuarError(null);
    setIsEditingGuarantor(true);
  };

  const handleCancelEditGuarantor = () => {
    if (employee) {
      setGuarForm(getInitialGuarantorFormState(employee));
    }
    setGuarError(null);
    setIsEditingGuarantor(false);
  };

  const updateGuarField = <K extends keyof GuarantorFormState>(
    key: K,
    value: GuarantorFormState[K],
  ) => {
    setGuarForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveGuarantor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submittingGuar) return;

    setSubmittingGuar(true);
    setGuarError(null);

    try {
      const payload: UpdateEmployeePayload = {
        guarantorFirstName: guarForm.firstName.trim() || undefined,
        guarantorLastName: guarForm.lastName.trim() || undefined,
        guarantorRelationship: guarForm.relationship.trim() || undefined,
        guarantorPhone: guarForm.phone.trim() || undefined,
        guarantorAddress: guarForm.address.trim() || undefined,
      };

      await updateEmployee(params.id, payload);
      toast.success("Guarantor information updated successfully!");
      setIsEditingGuarantor(false);
      await load();
    } catch (err: unknown) {
      console.error("updateEmployee (guarantor) failed:", err);
      let msg = "Failed to update guarantor information. Please try again.";
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
        if (
          resData?.validationErrors &&
          Array.isArray(resData.validationErrors)
        ) {
          msg = resData.validationErrors
            .map((v: any) => v.message || v.field)
            .join(", ");
        } else if (resData?.message) {
          msg = resData.message;
        }
      }
      setGuarError(msg);
      toast.error(msg);
    } finally {
      setSubmittingGuar(false);
    }
  };

  // Documents Handlers
  const handleStartEditDocuments = () => {
    if (!employee) return;
    setDocForm(emptyDocumentsForm);
    setDocError(null);
    setIsEditingDocuments(true);
  };

  const handleCancelEditDocuments = () => {
    setDocForm(emptyDocumentsForm);
    setDocError(null);
    setIsEditingDocuments(false);
  };

  const updateDocField = <K extends keyof DocumentsFormState>(
    key: K,
    value: DocumentsFormState[K],
  ) => {
    setDocForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveDocuments = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submittingDoc) return;

    setSubmittingDoc(true);
    setDocError(null);

    try {
      const payload: UpdateEmployeePayload = {
        documentType: (docForm.documentType as DocumentType) || undefined,
      };

      await updateEmployee(params.id, payload);
      toast.success("Documents updated successfully!");
      setIsEditingDocuments(false);
      await load();
    } catch (err: unknown) {
      console.error("updateEmployee (documents) failed:", err);
      let msg = "Failed to update documents. Please try again.";
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
        if (
          resData?.validationErrors &&
          Array.isArray(resData.validationErrors)
        ) {
          msg = resData.validationErrors
            .map((v: any) => v.message || v.field)
            .join(", ");
        } else if (resData?.message) {
          msg = resData.message;
        }
      }
      setDocError(msg);
      toast.error(msg);
    } finally {
      setSubmittingDoc(false);
    }
  };

  const handleDownloadDoc = async (docId: string, fileName?: string) => {
    if (!docId) return;
    try {
      setDownloadingDocId(docId);
      const blob = await downloadEmployeeDocument(params.id, docId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || `document-${docId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Document downloaded successfully.");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download document.");
    } finally {
      setDownloadingDocId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-y-4 p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <section className="space-y-4 p-6">
        <button
          onClick={() => router.push("/hris/employees")}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-sky-600"
        >
          <FiArrowLeft size={16} /> Back to Employees
        </button>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-base font-semibold text-red-700">
            Unable to load employee profile
          </p>
          <p className="mt-1 text-sm text-red-600">{loadError}</p>
          <button
            onClick={load}
            className="mt-4 rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (!employee) {
    return (
      <section className="space-y-4 p-6">
        <button
          onClick={() => router.push("/hris/employees")}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-sky-600"
        >
          <FiArrowLeft size={16} /> Back to Employees
        </button>
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-700">
            Employee not found
          </p>
          <p className="mt-1 text-sm text-slate-500">
            The requested employee record does not exist or has been removed.
          </p>
        </div>
      </section>
    );
  }

  const {
    header,
    personalInformation = {},
    bankDetails = {},
    nextOfKin = {},
    guarantor = {},
    documents = [],
    attendanceOverview = {},
  } = employee;

  const personal = (personalInformation || {}) as Record<string, any>;
  const bank = (bankDetails || {}) as Record<string, any>;
  const nok = (nextOfKin || {}) as Record<string, any>;
  const guar = (guarantor || {}) as Record<string, any>;
  const attendance = (attendanceOverview || {}) as Record<string, any>;

  const bankAccountMasked =
    bank.masked === true || String(bank.accountNumber ?? "").includes("*");

  const statusKey = header.lifecycleStatus || header.status || "ACTIVE";

  const departmentName =
    header.department?.name ??
    (personal.department && typeof personal.department === "object"
      ? personal.department.name
      : typeof personal.department === "string"
        ? personal.department
        : "—");

  const personalEmail = personal.emailAddress || personal.personalEmail || "—";
  const roleDisplay =
    header.role || personal.role || personal.position || "Employee";

  const salaryDisplay =
    bank.monthlySalary !== undefined && bank.monthlySalary !== null
      ? !isNaN(Number(bank.monthlySalary))
        ? `₦${Number(bank.monthlySalary).toLocaleString()}`
        : String(bank.monthlySalary)
      : personal.earnings !== undefined && personal.earnings !== null
        ? !isNaN(Number(personal.earnings))
          ? `₦${Number(personal.earnings).toLocaleString()}`
          : String(personal.earnings)
        : "—";

    const currentManagerId = getCurrentManagerId(employee);
  const currentManager = (employee as unknown as Record<string, any>).manager;
  const managerOptions = managers.map((m) => ({
    value: m.id,
    label: `${m.name} (${m.employeeId})`,
  }));
  if (currentManagerId && !managers.some((m) => m.id === currentManagerId)) {
    managerOptions.unshift({
      value: currentManagerId,
      label: `${currentManager?.name ?? "Current manager"} (${currentManager?.employeeId ?? "unavailable"}) - unavailable`,
    });
  }

  // Build department dropdown options, ensuring current department is included
  const departmentOptions = [
    {
      value: "",
      label: loadingDepartments
        ? "Loading departments..."
        : "Select Department",
    },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ];
  if (
    editForm.departmentId &&
    !departments.some((d) => d.id === editForm.departmentId)
  ) {
    departmentOptions.push({
      value: editForm.departmentId,
      label:
        departmentName && departmentName !== "—"
          ? departmentName
          : editForm.departmentId,
    });
  }

  return (
    <section className="space-y-6 p-6">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/hris/employees")}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-sky-600"
        >
          <FiArrowLeft size={16} /> Back to Employees
        </button>

        {isEditingWorkDetails && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Editing Work Details
          </span>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* Header card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-2xl font-bold text-sky-600">
                {header.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={header.profileImage}
                    alt={header.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  header.name?.charAt(0)?.toUpperCase() || "E"
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {header.name}
                </h1>
                <p className="mt-0.5 text-sm text-slate-500">
                  {isEditingWorkDetails && editForm.position
                    ? editForm.position
                    : roleDisplay}
                </p>
              </div>
            </div>

            {/* <div className="flex flex-wrap items-center gap-2.5">
              {statusKey === "PROBATION" && (
                <button
                  type="button"
                  onClick={() => {
                    setInitialStatusForModal("CONFIRMED");
                    setStatusModalOpen(true);
                  }}
                  disabled={updatingStatus}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 shadow-sm"
                  title="Confirm probationary employee"
                >
                  <FiCheckCircle size={14} />
                  <span>Confirm Employee</span>
                </button>
              )}
            </div> */}
          </div>

          {/* Overview & stats */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Employment Overview
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Date Joined:{" "}
                <span className="font-medium text-slate-700">
                  {formatDisplayDate(header.joinedDate)}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Attendance
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {attendance.presentDays !== undefined &&
                  attendance.presentDays !== null
                    ? `${attendance.presentDays} Days`
                    : "0 Days"}
                </p>
                <p className="mt-1 text-xs text-sky-600">
                  Present days recorded
                </p>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Late Clock-Ins
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {attendance.lateArrivals ?? 0}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Late arrivals logged
                </p>
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Overtime
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {attendance.overtimeHours ?? 0}{" "}
                  <span className="text-xs text-slate-400">Hrs</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">Overtime recorded</p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* WORK DETAILS CARD (IN-PLACE VIEW / EDIT)                  */}
        {/* ========================================================= */}
        <div
          id="work-details-section"
          className={`rounded-xl border bg-white p-6 shadow-sm transition-all ${
            isEditingWorkDetails
              ? "border-sky-300 ring-2 ring-sky-500/10"
              : "border-slate-200"
          }`}
        >
          {/* Card Header */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-base font-semibold text-slate-800">
                Work Details
              </h2>

              {/* Status Dropdown */}
              <div className="relative inline-block" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() =>
                    !updatingStatus && setIsStatusDropdownOpen((prev) => !prev)
                  }
                  disabled={updatingStatus}
                  title="Click to change employee status"
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 shadow-xs ${
                    STATUS_STYLES[statusKey] ??
                    "border-slate-200 bg-slate-100 text-slate-600"
                  } hover:brightness-95 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {updatingStatus ? (
                    <>
                      <FiLoader
                        size={12}
                        className="animate-spin text-current"
                      />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_COLORS[statusKey] || "bg-slate-400"}`}
                      />
                      <span>{STATUS_LABEL[statusKey] ?? statusKey}</span>
                      <FiChevronDown
                        size={12}
                        className={`text-current opacity-70 transition-transform duration-200 ${
                          isStatusDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Change Status
                    </div>
                    <div className="space-y-0.5">
                      {AVAILABLE_STATUSES.map((option) => {
                        const isCurrent = option.value === statusKey;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelectStatus(option.value)}
                            className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                              isCurrent
                                ? "bg-sky-50 font-semibold text-sky-900"
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 rounded-full ${option.dotColor}`}
                              />
                              <span>{option.label}</span>
                            </span>
                            {isCurrent && (
                              <FiCheck
                                size={13}
                                className="text-sky-600 shrink-0"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Edit icon button on Work Details */}
              {!isEditingWorkDetails ? (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-sky-500 hover:bg-sky-50 hover:text-sky-600 shadow-xs"
                  title="Edit Work Details"
                  aria-label="Edit Work Details"
                >
                  <FiEdit2 size={13} className="text-sky-600" />
                  <span>Edit</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Editing
                </span>
              )}
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Employee ID:</span>
                <span className="font-mono font-medium text-slate-800">
                  {showEmployeeId ? header.employeeId : "••••••••"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowEmployeeId((prev) => !prev)}
                  className="flex items-center gap-1 rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-600 transition hover:bg-slate-50"
                  title={showEmployeeId ? "Hide ID" : "Show ID"}
                >
                  {showEmployeeId ? (
                    <FiEyeOff size={12} />
                  ) : (
                    <FiEye size={12} />
                  )}
                  <span>{showEmployeeId ? "Hide" : "Show"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card Body: Edit Mode vs Read-Only Mode */}
          {isEditingWorkDetails ? (
            <form onSubmit={handleSaveEdit} className="space-y-6">
              {editError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 shadow-sm flex items-center gap-2">
                  <FiX className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* 1. Department */}
                <FormSelect
                  label="Department"
                  value={editForm.departmentId}
                  onChange={(v) => updateField("departmentId", v)}
                  disabled={submittingEdit}
                                  options={departmentOptions}
                />

                <FormSelect
                  label="Line Manager"
                  value={selectedManagerId}
                  onChange={(v) => setSelectedManagerId(v)}
                  disabled={submittingEdit}
                  options={[
                    { value: "", label: "Select Line Manager" },
                    { value: "__none__", label: "No manager (remove)" },
                       ...managerOptions,
                  ]}
                />

                {/* 2. Phone Number */}
                <FormInput
                  label="Phone Number"
                  type="tel"
                  value={editForm.phoneNumber}
                  onChange={(v) => updateField("phoneNumber", v)}
                  placeholder="e.g. +2348012345678"
                  disabled={submittingEdit}
                />

                {/* 3. Personal Email */}
                <FormInput
                  label="Personal Email"
                  type="email"
                  value={editForm.personalEmail}
                  onChange={(v) => updateField("personalEmail", v)}
                  placeholder="e.g. employee@example.com"
                  disabled={submittingEdit}
                />

                {/* 4. Nationality */}
                <FormInput
                  label="Nationality"
                  value={editForm.nationality}
                  onChange={(v) => updateField("nationality", v)}
                  placeholder="e.g. Nigerian"
                  disabled={submittingEdit}
                />

                {/* 5. Date of Birth */}
                <FormInput
                  label="Date of Birth"
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(v) => updateField("dateOfBirth", v)}
                  disabled={submittingEdit}
                />

                {/* 6. Marital Status */}
                <FormSelect
                  label="Marital Status"
                  value={editForm.maritalStatus}
                  onChange={(v) =>
                    updateField("maritalStatus", v as MaritalStatus | "")
                  }
                  disabled={submittingEdit}
                  options={[
                    { value: "", label: "Select marital status" },
                    { value: "SINGLE", label: "Single" },
                    { value: "MARRIED", label: "Married" },
                    { value: "DIVORCED", label: "Divorced" },
                    { value: "WIDOWED", label: "Widowed" },
                    { value: "OTHER", label: "Other" },
                  ]}
                />

                {/* 7. Gender */}
                <FormSelect
                  label="Gender"
                  value={editForm.gender}
                  onChange={(v) => updateField("gender", v as Gender | "")}
                  disabled={submittingEdit}
                  options={[
                    { value: "", label: "Select gender" },
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" },
                    { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
                  ]}
                />

                {/* 8. Work Mode */}
                <FormSelect
                  label="Work Mode"
                  value={editForm.workMode}
                  onChange={(v) => updateField("workMode", v as WorkMode | "")}
                  disabled={submittingEdit}
                  options={[
                    { value: "", label: "Select work mode" },
                    { value: "REMOTE", label: "Remote" },
                    { value: "HYBRID", label: "Hybrid" },
                    { value: "ONSITE", label: "Onsite" },
                  ]}
                />

                {/* 9. Employment Type */}
                <FormSelect
                  label="Employment Type"
                  value={editForm.employmentType}
                  onChange={(v) =>
                    updateField("employmentType", v as EmploymentType | "")
                  }
                  disabled={submittingEdit}
                  options={[
                    { value: "", label: "Select employment type" },
                    { value: "FULL_TIME", label: "Full-Time" },
                    { value: "PART_TIME", label: "Part-Time" },
                    { value: "CONTRACT", label: "Contract" },
                    { value: "INTERN", label: "Intern" },
                  ]}
                />

                {/* 10. Address */}
                <div className="sm:col-span-2">
                  <FormInput
                    label="Home Address"
                    value={editForm.address}
                    onChange={(v) => updateField("address", v)}
                    placeholder="e.g. 12 Marina Road, Lagos"
                    disabled={submittingEdit}
                  />
                </div>

                {/* 11. Monthly Earnings */}
                <div>
                  <FormInput
                    label="Monthly Earnings"
                    type="number"
                    value={editForm.earnings}
                    onChange={(v) => updateField("earnings", v)}
                    placeholder="e.g. 450000"
                    prefix="₦"
                    disabled={submittingEdit}
                  />
                </div>
              </div>

              {/* Bottom Save / Cancel Action Bar */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={submittingEdit}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50"
                >
                  {submittingEdit ? (
                    <>
                      <FiRefreshCw size={14} className="animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <>
                      <FiCheck size={15} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Department", value: departmentName },
                {
                  label: "Phone Number",
                  value: header.phoneNumber || personal.phoneNumber || "—",
                },
                { label: "Personal Email", value: personalEmail },
                { label: "Nationality", value: personal.nationality || "—" },
                {
                  label: "Date of Birth",
                  value: formatDisplayDate(personal.dateOfBirth),
                },
                {
                  label: "Marital Status",
                  value: personal.maritalStatus || "—",
                },
                { label: "Gender", value: personal.gender || "—" },
                { label: "Work Mode", value: personal.workMode || "—" },
                {
                  label: "Employment Type",
                  value: personal.employmentType || "—",
                },
                { label: "Address", value: personal.address || "—" },
                { label: "Monthly Earnings", value: salaryDisplay },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {f.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800 break-words">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bank Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Card Header: Title + Edit Action */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-slate-800">
                Bank Details
              </h2>
              {!isEditingBankDetails ? (
                <button
                  type="button"
                  onClick={handleStartEditBank}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-sky-500 hover:bg-sky-50 hover:text-sky-600 shadow-xs"
                  title="Edit Bank Details"
                  aria-label="Edit Bank Details"
                >
                  <FiEdit2 size={13} className="text-sky-600" />
                  <span>Edit</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Editing
                </span>
              )}
            </div>
          </div>

          {/* Card Body: Edit Mode vs Read-Only Mode */}
          {isEditingBankDetails ? (
            <form onSubmit={handleSaveBank} className="space-y-6">
              {bankError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 shadow-sm flex items-center gap-2">
                  <FiX className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>{bankError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Bank Name
                  </label>
                  <BankSelect
                    code={bankForm.bankCode}
                    name={bankForm.bankName}
                    disabled={submittingBank}
                    onChange={(bank) =>
                      setBankForm((prev) =>
                        prev.bankCode === bank.code && prev.bankName === bank.name
                          ? prev
                          : { ...prev, bankCode: bank.code, bankName: bank.name },
                      )
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 transition outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
                <FormInput
                  label="Account Number"
                  value={bankForm.accountNumber}
                  onChange={(v) => updateBankField("accountNumber", v)}
                  placeholder={
                    bankAccountMasked
                      ? "Leave blank to keep current number"
                      : "e.g. 0123456789"
                  }
                  disabled={submittingBank}
                />
                <FormInput
                  label="Account Name"
                  value={bankForm.accountName}
                  onChange={(v) => updateBankField("accountName", v)}
                  placeholder="e.g. Ada Okafor"
                  disabled={submittingBank}
                />
                <FormInput
                  label="Bank Code"
                  value={bankForm.bankCode}
                  onChange={() => {}}
                  placeholder="Filled when you pick a bank"
                  disabled
                />
                <FormSelect
                  label="Account Type"
                  value={bankForm.accountType}
                  onChange={(v) =>
                    updateBankField("accountType", v as AccountType | "")
                  }
                  disabled={submittingBank}
                  options={[
                    { value: "", label: "Select account type" },
                    { value: "SAVINGS", label: "Savings" },
                    { value: "CURRENT", label: "Current" },
                  ]}
                />
                <FormInput
                  label="Monthly Salary"
                  type="number"
                  value={bankForm.monthlySalary}
                  onChange={(v) => updateBankField("monthlySalary", v)}
                  placeholder="e.g. 450000"
                  prefix="₦"
                  disabled={submittingBank}
                />
              </div>

              {/* Bottom Save / Cancel Action Bar */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEditBank}
                  disabled={submittingBank}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBank}
                  className="flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50"
                >
                  {submittingBank ? (
                    <>
                      <FiRefreshCw size={14} className="animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <>
                      <FiCheck size={15} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Bank Name", value: bank.bankName || "—" },
                { label: "Account Number", value: bank.accountNumber || "—" },
                {
                  label: "Account Name",
                  value:
                    bank.accountName || personal.fullName || header.name || "—",
                },
                { label: "Bank Code", value: bank.bankCode || "—" },
                { label: "Account Type", value: bank.accountType || "—" },
                { label: "Monthly Salary", value: salaryDisplay },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {f.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800 break-words">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next of Kin & Guarantor */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Next of Kin */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Card Header: Title + Edit Action */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-slate-800">
                  Next of Kin
                </h2>
                {!isEditingNextOfKin ? (
                  <button
                    type="button"
                    onClick={handleStartEditNok}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-sky-500 hover:bg-sky-50 hover:text-sky-600 shadow-xs"
                    title="Edit Next of Kin"
                    aria-label="Edit Next of Kin"
                  >
                    <FiEdit2 size={13} className="text-sky-600" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Editing
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            {isEditingNextOfKin ? (
              <form onSubmit={handleSaveNextOfKin} className="space-y-4">
                {nokError && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 shadow-sm flex items-center gap-2">
                    <FiX className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{nokError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label="First Name"
                    value={nokForm.firstName}
                    onChange={(v) => updateNokField("firstName", v)}
                    placeholder="e.g. Emeka"
                    disabled={submittingNok}
                  />
                  <FormInput
                    label="Last Name"
                    value={nokForm.lastName}
                    onChange={(v) => updateNokField("lastName", v)}
                    placeholder="e.g. Okafor"
                    disabled={submittingNok}
                  />
                  <FormInput
                    label="Phone Number"
                    type="tel"
                    value={nokForm.contact}
                    onChange={(v) => updateNokField("contact", v)}
                    placeholder="e.g. +2348098765432"
                    disabled={submittingNok}
                  />
                  <FormInput
                    label="Relationship"
                    value={nokForm.relationship}
                    onChange={(v) => updateNokField("relationship", v)}
                    placeholder="e.g. Brother, Spouse"
                    disabled={submittingNok}
                  />
                  <div className="sm:col-span-2">
                    <FormInput
                      label="Home Address"
                      value={nokForm.address}
                      onChange={(v) => updateNokField("address", v)}
                      placeholder="e.g. 12 Marina Road, Lagos"
                      disabled={submittingNok}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelEditNok}
                    disabled={submittingNok}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingNok}
                    className="flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50"
                  >
                    {submittingNok ? (
                      <>
                        <FiRefreshCw size={14} className="animate-spin" />
                        <span>Saving…</span>
                      </>
                    ) : (
                      <>
                        <FiCheck size={15} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Full Name
                  </p>
                  <p className="mt-1 font-medium text-slate-800 break-words">
                    {nok.name ||
                      `${nok.firstName || ""} ${nok.lastName || ""}`.trim() ||
                      "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Phone Number
                  </p>
                  <p className="mt-1 font-medium text-slate-800 break-words">
                    {nok.phoneNumber || nok.contact || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Relationship
                  </p>
                  <p className="mt-1 font-medium text-slate-800 break-words">
                    {nok.relationship || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Address
                  </p>
                  <p className="mt-1 font-medium text-slate-800 break-words">
                    {nok.address || "—"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Guarantor */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Card Header: Title + Edit Action */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-slate-800">
                  Guarantor Information
                </h2>
                {!isEditingGuarantor ? (
                  <button
                    type="button"
                    onClick={handleStartEditGuarantor}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-sky-500 hover:bg-sky-50 hover:text-sky-600 shadow-xs"
                    title="Edit Guarantor Information"
                    aria-label="Edit Guarantor Information"
                  >
                    <FiEdit2 size={13} className="text-sky-600" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Editing
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            {isEditingGuarantor ? (
              <form onSubmit={handleSaveGuarantor} className="space-y-4">
                {guarError && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 shadow-sm flex items-center gap-2">
                    <FiX className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{guarError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label="First Name"
                    value={guarForm.firstName}
                    onChange={(v) => updateGuarField("firstName", v)}
                    placeholder="e.g. Chidi"
                    disabled={submittingGuar}
                  />
                  <FormInput
                    label="Last Name"
                    value={guarForm.lastName}
                    onChange={(v) => updateGuarField("lastName", v)}
                    placeholder="e.g. Okafor"
                    disabled={submittingGuar}
                  />
                  <FormInput
                    label="Relationship"
                    value={guarForm.relationship}
                    onChange={(v) => updateGuarField("relationship", v)}
                    placeholder="e.g. Father, Mentor"
                    disabled={submittingGuar}
                  />
                  <FormInput
                    label="Phone Number"
                    type="tel"
                    value={guarForm.phone}
                    onChange={(v) => updateGuarField("phone", v)}
                    placeholder="e.g. +2348033334444"
                    disabled={submittingGuar}
                  />
                  <div className="sm:col-span-2">
                    <FormInput
                      label="Home Address"
                      value={guarForm.address}
                      onChange={(v) => updateGuarField("address", v)}
                      placeholder="e.g. 12 Marina Road, Lagos"
                      disabled={submittingGuar}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelEditGuarantor}
                    disabled={submittingGuar}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingGuar}
                    className="flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50"
                  >
                    {submittingGuar ? (
                      <>
                        <FiRefreshCw size={14} className="animate-spin" />
                        <span>Saving…</span>
                      </>
                    ) : (
                      <>
                        <FiCheck size={15} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Full Name
                  </p>
                  <p className="mt-1 font-medium text-slate-800 break-words">
                    {guar.name ||
                      `${guar.firstName || ""} ${guar.lastName || ""}`.trim() ||
                      "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Relationship
                  </p>
                  <p className="mt-1 font-medium text-slate-800 break-words">
                    {guar.relationship || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Phone Number
                  </p>
                  <p className="mt-1 font-medium text-slate-800 break-words">
                    {guar.phoneNumber || guar.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Address
                  </p>
                  <p className="mt-1 font-medium text-slate-800 break-words">
                    {guar.address || "—"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Card Header: Title + Edit Action */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-slate-800">
                Documents ({documents.length})
              </h2>
              {!isEditingDocuments ? (
                <button
                  type="button"
                  onClick={handleStartEditDocuments}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-sky-500 hover:bg-sky-50 hover:text-sky-600 shadow-xs"
                  title="Edit Documents"
                  aria-label="Edit Documents"
                >
                  <FiEdit2 size={13} className="text-sky-600" />
                  <span>Edit</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Editing
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          {isEditingDocuments ? (
            <form onSubmit={handleSaveDocuments} className="space-y-6">
              {docError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 shadow-sm flex items-center gap-2">
                  <FiX className="h-4 w-4 shrink-0 text-rose-500" />
                  <span>{docError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormSelect
                  label="Primary Document Type"
                  value={docForm.documentType}
                  onChange={(v) =>
                    updateDocField("documentType", v as DocumentType | "")
                  }
                  disabled={submittingDoc}
                  options={[
                    {
                      value: "IDENTIFICATION",
                      label: "Identification (ID Card, Passport)",
                    },
                    {
                      value: "CERTIFICATE",
                      label: "Certificate (Degree, Diploma)",
                    },
                    { value: "CONTRACT", label: "Employment Contract" },
                    { value: "TAX_DOCUMENT", label: "Tax Document" },
                    { value: "PENSION_DOCUMENT", label: "Pension Document" },
                    { value: "OTHER", label: "Other Document" },
                  ]}
                />

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Attach New File
                  </label>
                  <label className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 text-sm text-slate-600 transition hover:border-sky-500 hover:bg-sky-50/50">
                    <FiUploadCloud size={16} className="text-sky-600" />
                    <span className="truncate">
                      {docForm.selectedFile
                        ? docForm.selectedFile.name
                        : "Choose file (PDF, PNG, JPG)"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      className="hidden"
                      disabled={submittingDoc}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        updateDocField("selectedFile", file);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Existing Documents List inside edit mode */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Current Employee Documents ({documents.length})
                </p>
                {documents.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-6 text-center text-sm text-slate-400">
                    No documents uploaded for this employee yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => {
                      const name =
                        doc.fileName || doc.originalName || "Document";
                      const isDownloading = downloadingDocId === doc.id;
                      return (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3 text-sm"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                              <FiFileText size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-slate-800">
                                {name}
                              </p>
                              <p className="text-xs text-slate-400">
                                {doc.type
                                  ? doc.type.replace("_", " ")
                                  : "Document"}
                                {doc.size
                                  ? ` • ${formatFileSize(doc.size)}`
                                  : ""}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownloadDoc(doc.id, name)}
                            disabled={isDownloading}
                            className="flex shrink-0 items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                          >
                            <FiDownload size={14} />
                            <span>
                              {isDownloading ? "Downloading..." : "Download"}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEditDocuments}
                  disabled={submittingDoc}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDoc}
                  className="flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-50"
                >
                  {submittingDoc ? (
                    <>
                      <FiRefreshCw size={14} className="animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <>
                      <FiCheck size={15} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : documents.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center text-sm text-slate-400">
              No documents uploaded for this employee.
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => {
                const name = doc.fileName || doc.originalName || "Document";
                const isDownloading = downloadingDocId === doc.id;
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3 text-sm transition hover:border-slate-300"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                        <FiFileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">
                          {name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {doc.type ? doc.type.replace("_", " ") : "Document"}
                          {doc.size ? ` • ${formatFileSize(doc.size)}` : ""}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadDoc(doc.id, name)}
                      disabled={isDownloading}
                      className="flex shrink-0 items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      <FiDownload size={14} />
                      <span>
                        {isDownloading ? "Downloading..." : "Download"}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Employee Activity */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-800">
            Employee Activity
          </h2>
          {activity.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center text-sm text-slate-400">
              No activity recorded yet.
            </div>
          ) : (
            <div className="space-y-4 h-48 overflow-y-auto">
              {activity.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-600">
                    {entry.action
                      ?.replace("HRIS_EMPLOYEE_", "")
                      ?.replace(/_/g, " ") || "ACTIVITY"}
                  </span>
                  <div>
                    <p className="text-xs text-slate-400">
                      {new Date(entry.createdAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-slate-600">{entry.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {employee && (
        <ChangeEmployeeStatusModal
          open={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          employeeId={params.id}
          employeeName={header.name}
          currentStatus={statusKey}
          initialStatus={initialStatusForModal}
          onSuccess={load}
        />
      )}
    </section>
  );
}

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  prefix?: string;
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  prefix,
}: FormInputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="pointer-events-none absolute left-3 text-sm font-medium text-slate-400">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-11 w-full rounded-lg border border-slate-200 bg-white text-sm text-slate-800 transition outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50 disabled:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 ${
            prefix ? "pl-8 pr-3" : "px-3"
          }`}
        />
      </div>
    </div>
  );
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

function FormSelect({
  label,
  value,
  onChange,
  options,
  disabled,
}: FormSelectProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-800 transition outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50 disabled:text-slate-400"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}