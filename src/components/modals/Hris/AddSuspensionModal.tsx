"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { ChevronDown, X, Loader2, Calendar } from "lucide-react";
import { getEmployees, createSuspension } from "@/lib/api/hris";
import type { EmployeeListItem, CreateSuspensionPayload } from "@/lib/api/types/hrisTypes";
import { resolveDepartmentName } from "@/utils/department";

type AddSuspensionModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type FormData = {
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  queryType: string;
  status: string;
  from: string;
  to: string;
  notes: string;
};

const QUERY_TYPES = [
  { value: "PERFORMANCE_RELATED", label: "Performance-Related" },
  { value: "GROSS_MISCONDUCT", label: "Gross Misconduct" },
  { value: "INSUBORDINATION", label: "Insubordination" },
  { value: "ATTENDANCE", label: "Attendance" },
];

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function formatToYMD(dateStr: string): string | undefined {
  if (!dateStr) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 2 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  return undefined;
}

const initialFormData: FormData = {
  employeeId: "",
  employeeName: "",
  role: "",
  department: "",
  queryType: QUERY_TYPES[0].value,
  status: STATUS_OPTIONS[0].value,
  from: "",
  to: "",
  notes: "",
};

export default function AddSuspensionModal({
  open,
  onClose,
  onSuccess,
}: AddSuspensionModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeListItem | null>(null);

  const [showIdSuggestions, setShowIdSuggestions] = useState(false);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const idRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

// Fetch employees on modal open
  useEffect(() => {
    if (open) {
      setLoadingEmployees(true);
      getEmployees({ limit: 100 })
        .then((res) => {
          setEmployees(Array.isArray(res) ? res : []);
        })
        .catch((err) => {
          console.error("Failed to load employees for suspension modal:", err);
        })
        .finally(() => setLoadingEmployees(false));
    } else {
      setFormData(initialFormData);
      setSelectedEmployee(null);
      setShowIdSuggestions(false);
      setShowNameSuggestions(false);
    }
  }, [open]);

  // Close suggestion dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (idRef.current && !idRef.current.contains(e.target as Node)) {
        setShowIdSuggestions(false);
      }
      if (nameRef.current && !nameRef.current.contains(e.target as Node)) {
        setShowNameSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Filtered employee suggestions by ID and Name (shows all available employees)
  const employeeIdSuggestions = useMemo(() => {
    const query = formData.employeeId.toLowerCase().trim();
    if (!query) return employees;
    return employees.filter((emp) => {
      const id = (emp.employeeId || emp.id || "").toLowerCase();
      const name = (emp.name || "").toLowerCase();
      return id.includes(query) || name.includes(query);
    });
  }, [employees, formData.employeeId]);

  const employeeNameSuggestions = useMemo(() => {
    const query = formData.employeeName.toLowerCase().trim();
    if (!query) return employees;
    return employees.filter((emp) => {
      const name = (emp.name || "").toLowerCase();
      const id = (emp.employeeId || emp.id || "").toLowerCase();
      return name.includes(query) || id.includes(query);
    });
  }, [employees, formData.employeeName]);

  const departmentOptions = useMemo(() => {
    return Array.from(
      new Set(
        employees
          .map((e) => resolveDepartmentName(e.department))
          .filter((d): d is string => Boolean(d && d !== "—")),
      ),
    );
  }, [employees]);

  // When an employee is chosen from suggestions
  const handleSelectEmployee = (emp: EmployeeListItem) => {
    setSelectedEmployee(emp);
    const deptName = resolveDepartmentName(emp.department);

    setFormData((prev) => ({
      ...prev,
      employeeId: emp.employeeId || emp.id,
      employeeName: emp.name || "",
      role: emp.role || "",
      department: deptName !== "—" ? deptName : prev.department,
    }));
    setShowIdSuggestions(false);
    setShowNameSuggestions(false);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, employeeId: val }));
    setShowIdSuggestions(true);

    const matched = employees.find(
      (emp) =>
        emp.employeeId?.toLowerCase() === val.toLowerCase() ||
        emp.id.toLowerCase() === val.toLowerCase(),
    );
    if (matched) {
      setSelectedEmployee(matched);
      const deptName = resolveDepartmentName(matched.department);
      setFormData((prev) => ({
        ...prev,
        employeeName: matched.name || prev.employeeName,
        role: matched.role || prev.role,
        department: deptName !== "—" ? deptName : prev.department,
      }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, employeeName: val }));
    setShowNameSuggestions(true);

    const matched = employees.find(
      (emp) => emp.name?.toLowerCase() === val.toLowerCase(),
    );
    if (matched) {
      setSelectedEmployee(matched);
      const deptName = resolveDepartmentName(matched.department);
      setFormData((prev) => ({
        ...prev,
        employeeId: matched.employeeId || matched.id || prev.employeeId,
        role: matched.role || prev.role,
        department: deptName !== "—" ? deptName : prev.department,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employeeId.trim() && !selectedEmployee) {
      toast.error("Please enter or select a valid Employee ID");
      return;
    }

    const matched =
      selectedEmployee ||
      employees.find(
        (emp) =>
          emp.employeeId?.toLowerCase() === formData.employeeId.trim().toLowerCase() ||
          emp.id.toLowerCase() === formData.employeeId.trim().toLowerCase(),
      );

    const targetEmployeeId = matched?.id || formData.employeeId.trim();

    // Compute duration in days if From and To dates are selected
    let durationValue = 1;
    const durationUnit = "DAY";

    if (formData.from && formData.to) {
      const fromTime = new Date(formData.from).getTime();
      const toTime = new Date(formData.to).getTime();
      if (!isNaN(fromTime) && !isNaN(toTime)) {
        if (toTime < fromTime) {
          toast.error("The 'To' date must be after or equal to the 'From' date");
          return;
        }
        const diffDays = Math.ceil(
          (toTime - fromTime) / (1000 * 60 * 60 * 24),
        );
        durationValue = Math.max(1, diffDays);
      }
    }

    const suspensionNotes =
      formData.notes.trim() ||
      `Suspension for ${formData.queryType.replace(/_/g, " ")}${
        formData.from ? ` from ${formData.from}` : ""
      }${formData.to ? ` to ${formData.to}` : ""}`;

    const validStatus = ["ACTIVE", "COMPLETED", "CANCELLED"].includes(
      formData.status,
    )
      ? formData.status
      : "ACTIVE";

    const validStartDate = formatToYMD(formData.from);

    setSubmitting(true);
    try {
      await createSuspension({
        employeeId: targetEmployeeId,
        queryType: formData.queryType,
        durationValue,
        durationUnit,
        notes: suspensionNotes,
        status: validStatus,
        ...(validStartDate ? { startDate: validStartDate } : {}),
      });

      toast.success("Suspension created successfully");
      setFormData(initialFormData);
      setSelectedEmployee(null);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      console.error("Failed to create suspension:", err);
      let msg = "Failed to create suspension. Please check your inputs.";
      if (err && typeof err === "object") {
        const axiosErr = err as {
          response?: {
            status?: number;
            data?: {
              message?: string;
              error?: string;
              validationErrors?: Array<{ message?: string; field?: string }>;
            };
          };
          message?: string;
        };

        if (axiosErr.response?.status === 409) {
          msg =
            axiosErr.response?.data?.message ||
            "Active suspension already exists for this employee.";
        } else if (
          axiosErr.response?.data?.validationErrors &&
          axiosErr.response.data.validationErrors.length > 0
        ) {
          const firstErr = axiosErr.response.data.validationErrors[0];
          msg = `${firstErr.field ? `${firstErr.field}: ` : ""}${firstErr.message}`;
        } else {
          msg =
            axiosErr.response?.data?.message ||
            axiosErr.response?.data?.error ||
            axiosErr.message ||
            msg;
        }
      }
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6 overflow-y-auto">
      {/* Modal Card */}
      <div className="relative w-full max-w-[760px] rounded-2xl bg-white p-6 sm:p-10 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <X size={20} />
        </button>

        {/* Title matching Figma */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E293B]">
          Add New Suspension
        </h1>

        {/* Form Grid */}
        <form onSubmit={handleSubmit} autoComplete="off" className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
            {/* 1. Employee ID */}
            <div ref={idRef} className="relative">
              <div className="relative rounded-lg border border-[#E2E8F0] bg-white transition focus-within:border-[#2183C6] focus-within:ring-1 focus-within:ring-[#2183C6]">
                <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-xs text-[#94A3B8] font-normal select-none pointer-events-none">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="suspensionEmployeeId"
                  autoComplete="off"
                  placeholder="00354AE"
                  value={formData.employeeId}
                  onChange={handleIdChange}
                  onFocus={() => setShowIdSuggestions(true)}
                  required
                  className="h-12 w-full rounded-lg bg-transparent px-4 text-sm text-[#1E293B] placeholder:text-[#94A3B8] outline-none"
                />
              </div>

              {/* Suggestions dropdown */}
              {showIdSuggestions && employeeIdSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  {loadingEmployees ? (
                    <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400">
                      <Loader2 size={12} className="animate-spin" />
                      Loading employees…
                    </div>
                  ) : (
                    employeeIdSuggestions.map((emp) => (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => handleSelectEmployee(emp)}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-blue-50 transition"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">
                            {emp.employeeId || emp.id}
                          </p>
                          <p className="text-slate-500">{emp.name}</p>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {emp.role}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 2. Employee Name */}
            <div ref={nameRef} className="relative">
              <div className="relative rounded-lg border border-[#E2E8F0] bg-white transition focus-within:border-[#2183C6] focus-within:ring-1 focus-within:ring-[#2183C6]">
                <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-xs text-[#94A3B8] font-normal select-none pointer-events-none">
                  Employee Name
                </label>
                <input
                  type="text"
                  name="suspensionEmployeeName"
                  autoComplete="off"
                  data-lpignore="true"
                  placeholder="Employee Name"
                  value={formData.employeeName}
                  onChange={handleNameChange}
                  onFocus={() => setShowNameSuggestions(true)}
                  className="h-12 w-full rounded-lg bg-transparent px-4 text-sm text-[#1E293B] placeholder:text-[#94A3B8] outline-none"
                />
              </div>

              {/* Suggestions dropdown */}
              {showNameSuggestions && employeeNameSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  {employeeNameSuggestions.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => handleSelectEmployee(emp)}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-blue-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                          {emp.name
                            ? emp.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "EM"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {emp.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {emp.employeeId || emp.id}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {emp.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Role */}
            <div className="relative rounded-lg border border-[#E2E8F0] bg-white transition focus-within:border-[#2183C6] focus-within:ring-1 focus-within:ring-[#2183C6]">
              <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-xs text-[#94A3B8] font-normal select-none pointer-events-none">
                Role
              </label>
              <input
                type="text"
                name="suspensionRole"
                autoComplete="off"
                data-lpignore="true"
                placeholder="IT Manager"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
                className="h-12 w-full rounded-lg bg-transparent px-4 text-sm text-[#1E293B] placeholder:text-[#94A3B8] outline-none"
              />
            </div>

            {/* 4. Department */}
            <div className="relative rounded-lg border border-[#E2E8F0] bg-white transition focus-within:border-[#2183C6] focus-within:ring-1 focus-within:ring-[#2183C6]">
              <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-xs text-[#94A3B8] font-normal select-none pointer-events-none">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, department: e.target.value }))
                }
                className="h-12 w-full appearance-none rounded-lg bg-transparent px-4 pr-10 text-sm text-[#1E293B] outline-none cursor-pointer"
              >
                <option value="">Select Department</option>
                {formData.department &&
                  !departmentOptions.includes(formData.department) && (
                    <option value={formData.department}>
                      {formData.department}
                    </option>
                  )}
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                size={18}
              />
            </div>

            {/* 5. Query Type */}
            <div className="relative rounded-lg border border-[#E2E8F0] bg-white transition focus-within:border-[#2183C6] focus-within:ring-1 focus-within:ring-[#2183C6]">
              <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-xs text-[#94A3B8] font-normal select-none pointer-events-none">
                Query Type
              </label>
              <select
                value={formData.queryType}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, queryType: e.target.value }))
                }
                className="h-12 w-full appearance-none rounded-lg bg-transparent px-4 pr-10 text-sm text-[#1E293B] outline-none cursor-pointer"
              >
                {QUERY_TYPES.map((qt) => (
                  <option key={qt.value} value={qt.value}>
                    {qt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                size={18}
              />
            </div>

            {/* 6. Status */}
            <div className="relative rounded-lg border border-[#E2E8F0] bg-white transition focus-within:border-[#2183C6] focus-within:ring-1 focus-within:ring-[#2183C6]">
              <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-xs text-[#94A3B8] font-normal select-none pointer-events-none">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="h-12 w-full appearance-none rounded-lg bg-transparent px-4 pr-10 text-sm text-[#1E293B] outline-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                size={18}
              />
            </div>

            {/* 7. From Date */}
            <div className="relative rounded-lg border border-[#E2E8F0] bg-white transition focus-within:border-[#2183C6] focus-within:ring-1 focus-within:ring-[#2183C6]">
              <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-xs text-[#94A3B8] font-normal select-none pointer-events-none">
                From
              </label>
              <div
                className="relative flex items-center cursor-pointer"
                onClick={() => fromInputRef.current?.showPicker?.()}
              >
                <input
                  ref={fromInputRef}
                  type="text"
                  name="suspensionStartDate"
                  placeholder="dd/mm/yyyy"
                  value={formData.from}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, from: e.target.value }))
                  }
                  required
                  className="h-12 w-full rounded-lg bg-transparent px-4 pr-10 text-sm text-[#1E293B] placeholder:text-[#94A3B8] outline-none cursor-pointer"
                />
                <Calendar
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                  size={18}
                />
              </div>
            </div>

            <div className="relative rounded-lg border border-[#E2E8F0] bg-white transition focus-within:border-[#2183C6] focus-within:ring-1 focus-within:ring-[#2183C6]">
              <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-xs text-[#94A3B8] font-normal select-none pointer-events-none">
                To
              </label>
              <div
                className="relative flex items-center cursor-pointer"
                onClick={() => toInputRef.current?.showPicker?.()}
              >
                <input
                  ref={toInputRef}
                  type="text"
                  name="suspensionEndDate"
                  placeholder="dd/mm/yyyy"
                  value={formData.to}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, to: e.target.value }))
                  }
                  required
                  className="h-12 w-full rounded-lg bg-transparent px-4 pr-10 text-sm text-[#1E293B] placeholder:text-[#94A3B8] outline-none cursor-pointer"
                />
                <Calendar
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                  size={18}
                />
              </div>
            </div>

            {/* 9. Optional Notes */}
            <div className="relative rounded-lg border border-[#E2E8F0] bg-white transition focus-within:border-[#2183C6] focus-within:ring-1 focus-within:ring-[#2183C6] sm:col-span-2">
              <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-xs text-[#94A3B8] font-normal select-none pointer-events-none">
                Notes
              </label>
              <input
                type="text"
                placeholder="Add Note (optional)"
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="h-12 w-full rounded-lg bg-transparent px-4 text-sm text-[#1E293B] placeholder:text-[#94A3B8] outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-11 rounded-lg border border-[#E2E8F0] bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex h-11 items-center gap-2 rounded-lg bg-[#2183C6] px-6 text-sm font-medium text-white shadow-xs transition hover:bg-[#1b6aa2] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating…
                </>
              ) : (
                "Add Suspension"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
