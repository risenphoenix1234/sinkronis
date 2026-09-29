"use client";

import { useCallback, useEffect, useState } from "react";
import AddEmployeeModal from "@/components/payroll/employee/AddEmployeeModal";
import BulkUploadEmployeesModal from "@/components/payroll/employee/BulkUploadEmployeeModal";
import RemoveFromPayrollModal from "@/components/payroll/employee/RemoveFromPayroll";
import AddToPayrollModal from "@/components/payroll/employee/AddToPayroll";
import {
  AlertCircle,
  Download,
  Loader2,
  Plus,
  Search,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { naira } from "@/types/payroll/payee-data";
import {
  getPayrollEmployees,
  exportPayrollEmployeesCsv,
  removePayrollEmployeeEnrollment,
  enrollPayrollEmployee,
  PayrollEmployeeItem,
  PayrollEmployeeStatus,
  PayrollEmployeePayrollStatus,
} from "@/lib/api/payroll";


/* =========================================================
   STATUS HELPERS
========================================================= */

const employeeStatusStyle: Record<string, string> = {
  ACTIVE: "bg-[#D9F5DE] text-[#15803D]",
  Active: "bg-[#D9F5DE] text-[#15803D]",
  ON_LEAVE: "bg-[#FEF3C7] text-[#92400E]",
  SUSPENDED: "bg-[#FEE2E2] text-[#991B1B]",
  TERMINATED: "bg-[#F1F3F5] text-[#667085]",
  Inactive: "bg-[#F1F3F5] text-[#667085]",
};

const statusLabel: Record<string, string> = {
  ACTIVE: "Active",
  ON_LEAVE: "On Leave",
  SUSPENDED: "Suspended",
  TERMINATED: "Terminated",
};

/* =========================================================
   PAGE
========================================================= */

export default function EmployeesPage() {
  const router = useRouter();

  // ── Modal state ───────────────────────────────────────
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  // ── Filter state ──────────────────────────────────────
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [payrollFilter, setPayrollFilter] = useState("");

  // ── API state ─────────────────────────────────────────
  const [apiEmployees, setApiEmployees] = useState<PayrollEmployeeItem[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [exportingCsv, setExportingCsv] = useState(false);

  // ── Remove / Enroll state ─────────────────────────────
  const [employeeToRemove, setEmployeeToRemove] = useState<{
    id?: string;
    name: string;
    role: string;
    department: string;
    grossPay: string;
    netPay: string;
  } | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const [employeeToEnroll, setEmployeeToEnroll] = useState<{
    id?: string;
    name: string;
  } | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  /* =====================================================
     FETCH
  ===================================================== */

  const fetchEmployees = useCallback(async () => {
    setApiLoading(true);
    setApiError(null);
    try {
      const params: Parameters<typeof getPayrollEmployees>[0] = {
        limit: 100,
        ...(search ? { search } : {}),
        ...(deptFilter ? { departmentId: deptFilter } : {}),
        ...(statusFilter
          ? { status: statusFilter as PayrollEmployeeStatus }
          : {}),
        ...(payrollFilter
          ? { payrollStatus: payrollFilter as PayrollEmployeePayrollStatus }
          : {}),
        sortBy: "name",
        sortOrder: "asc",
      };
      const res = await getPayrollEmployees(params);
      setApiEmployees(res.data);
      setTotalCount(res.pagination.total);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setApiError(
        axiosErr.response?.data?.message ?? "Failed to load employees.",
      );
    } finally {
      setApiLoading(false);
    }
  }, [search, deptFilter, statusFilter, payrollFilter]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  /* =====================================================
     REMOVE & ENROLL ACTIONS
  ===================================================== */

  const handleConfirmRemoveFromPayroll = async () => {
    if (!employeeToRemove) return;
    if (!employeeToRemove.id) {
      toast.success("Employee removed from payroll successfully.");
      setEmployeeToRemove(null);
      return;
    }

    setIsRemoving(true);
    try {
      await removePayrollEmployeeEnrollment(employeeToRemove.id);
      toast.success("Employee removed from payroll successfully.");
      setEmployeeToRemove(null);
      fetchEmployees();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };
      const msg =
        axiosErr.response?.data?.message ??
        "Failed to remove employee from payroll.";
      toast.error(msg);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleConfirmAddToPayroll = async () => {
    if (!employeeToEnroll) return;
    if (!employeeToEnroll.id) {
      toast.success("Employee enrolled in payroll successfully.");
      setEmployeeToEnroll(null);
      return;
    }

    setIsEnrolling(true);
    try {
      await enrollPayrollEmployee(employeeToEnroll.id);
      toast.success("Employee enrolled in payroll successfully.");
      setEmployeeToEnroll(null);
      fetchEmployees();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };
      const msg =
        axiosErr.response?.data?.message ??
        "Failed to enroll employee in payroll.";
      toast.error(msg);
    } finally {
      setIsEnrolling(false);
    }
  };

  /* =====================================================
     EXPORT CSV
  ===================================================== */

  const handleExportCsv = async () => {
    if (exportingCsv) return;
    setExportingCsv(true);
    try {
      const params: Parameters<typeof exportPayrollEmployeesCsv>[0] = {
        ...(search ? { search } : {}),
        ...(deptFilter ? { departmentId: deptFilter } : {}),
        ...(statusFilter
          ? { status: statusFilter as PayrollEmployeeStatus }
          : {}),
        ...(payrollFilter
          ? { payrollStatus: payrollFilter as PayrollEmployeePayrollStatus }
          : {}),
      };
      const blob = await exportPayrollEmployeesCsv(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStr = new Date().toISOString().split("T")[0];
      a.download = `payroll-employees-${dateStr}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Employees exported successfully");
    } catch {
      toast.error("Failed to export employees. Please try again.");
    } finally {
      setExportingCsv(false);
    }
  };

  /* =====================================================
     DERIVED DATA
  ===================================================== */

  const displayRows = apiEmployees;

  return (
    <>
      <main className="min-h-screen bg-[#F8F9FA] px-4 py-5 text-[#263342] sm:px-6">
        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[30px] font-bold leading-tight text-[#1F2937]">
              Employees
            </h1>
            <p className="mt-1 text-sm text-[#7A8797]">
              Manage employee salary structures and deduction profiles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Bulk Upload */}
            <button
              type="button"
              onClick={() => setIsBulkUploadOpen(true)}
              className="flex h-9 items-center gap-2 rounded-md border border-[#D0D5DD] bg-white px-4 text-sm font-medium text-[#667085] transition hover:bg-[#F9FAFB]"
            >
              <Upload size={14} />
              Bulk Upload
            </button>

            {/* Add Employee */}
            <button
              type="button"
              onClick={() => setIsAddEmployeeOpen(true)}
              className="flex h-9 items-center gap-2 rounded-md border border-[#D0D5DD] bg-white px-4 text-sm font-medium text-[#667085] transition hover:bg-[#F9FAFB]"
            >
              <Plus size={15} />
              Add Employee
            </button>

            {/* Export CSV */}
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={exportingCsv}
              className="flex h-9 items-center gap-2 rounded-md border border-[#E0E5EB] bg-white px-4 text-sm font-medium text-[#718096] transition hover:bg-[#F8FAFC] disabled:opacity-60"
            >
              {exportingCsv ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {exportingCsv ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SEARCH / FILTERS */}
        {/* ================================================================ */}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or role..."
              className="h-9 w-full rounded-md border border-[#DDE2E8] bg-white pl-10 pr-4 text-sm text-[#344054] outline-none placeholder:text-[#98A2B3] focus:border-[#2388D0] focus:ring-1 focus:ring-[#2388D0]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 w-full rounded-md border border-[#DDE2E8] bg-white px-3 text-sm text-[#344054] outline-none focus:border-[#2388D0] sm:w-[130px]"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="TERMINATED">Terminated</option>
          </select>

          {/* Payroll Filter */}
          <select
            value={payrollFilter}
            onChange={(e) => setPayrollFilter(e.target.value)}
            className="h-9 w-full rounded-md border border-[#DDE2E8] bg-white px-3 text-sm text-[#344054] outline-none focus:border-[#2388D0] sm:w-[130px]"
          >
            <option value="">All Payroll</option>
            <option value="ON_PAYROLL">On Payroll</option>
            <option value="OFF_PAYROLL">Off Payroll</option>
          </select>
        </div>

        {/* ================================================================ */}
        {/* EMPLOYEE TABLE */}
        {/* ================================================================ */}

        <section className="overflow-hidden rounded-md border border-[#E1E5EA] bg-white">
          {/* Loading */}
          {apiLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-[#9ca3af]">
              <Loader2 className="h-7 w-7 animate-spin text-[#2388D0]" />
              <p className="mt-3 text-sm font-medium text-[#6b7280]">
                Loading employees...
              </p>
            </div>
          )}

          {/* Table — API rows or mock fallback */}
          {!apiLoading && !apiError && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-white">
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#718096]">
                      <button type="button" className="flex items-center gap-1">
                        Employee
                        <span className="text-[#2388D0]">⌃</span>
                      </button>
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-[#718096]">
                      <button type="button" className="flex items-center gap-1">
                        Department
                        <span className="text-[#98A2B3]">⌃</span>
                      </button>
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-[#718096]">
                      <button type="button" className="flex items-center gap-1">
                        Gross
                        <span className="text-[#98A2B3]">⌃</span>
                      </button>
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-[#718096]">
                      <button type="button" className="flex items-center gap-1">
                        Net Pay
                        <span className="text-[#98A2B3]">⌃</span>
                      </button>
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-[#718096]">
                      <button type="button" className="flex items-center gap-1">
                        Status
                        <span className="text-[#98A2B3]">⌃</span>
                      </button>
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-[#718096]">
                      PAYE
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-medium text-[#718096]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* ── API rows ── */}
                  {displayRows &&
                    displayRows.length > 0 &&
                    displayRows.map((emp, index) => (
                      <tr
                        key={emp.employeeId}
                        className={`border-b border-[#E5E7EB] ${
                          index % 2 === 1 ? "bg-[#F1F2F6]" : "bg-white"
                        }`}
                      >
                        {/* Employee */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E5F3FC] text-[10px] font-semibold text-[#2388D0]">
                              {emp.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#263342]">
                                {emp.fullName}
                              </p>
                              <div className="mt-0.5 flex items-center gap-2">
                                <span className="text-xs text-[#8492A6]">
                                  {emp.role ?? emp.employeeCode}
                                </span>
                                {emp.payrollStatus === "ON_PAYROLL" && (
                                  <span className="rounded-full bg-[#DCF7DF] px-1.5 py-0.5 text-[9px] font-semibold text-[#15803D]">
                                    On Payroll
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-4 py-3 text-sm text-[#667085]">
                          {emp.department?.name ?? "—"}
                        </td>

                        {/* Gross */}
                        <td className="px-4 py-3 text-sm font-semibold text-[#263342]">
                          {naira(emp.grossPay)}
                        </td>

                        {/* Net Pay */}
                        <td className="px-4 py-3 text-sm font-semibold text-[#15803D]">
                          {naira(emp.netPay)}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              employeeStatusStyle[emp.employeeStatus] ??
                              "bg-[#F1F3F5] text-[#667085]"
                            }`}
                          >
                            {statusLabel[emp.employeeStatus] ??
                              emp.employeeStatus}
                          </span>
                        </td>

                        {/* PAYE */}
                        <td className="px-4 py-3 text-sm text-[#FF4D4F]">
                          {naira(emp.paye)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/payroll/employees/${emp.employeeId}`,
                                )
                              }
                              className="rounded-md bg-[#E5F3FC] px-3 py-1.5 text-xs font-medium text-[#1683D8] transition hover:bg-[#D6ECFA]"
                            >
                              View
                            </button>

                            {emp.payrollStatus === "ON_PAYROLL" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setEmployeeToRemove({
                                    id: emp.employeeId,
                                    name: emp.fullName,
                                    role: emp.role || "N/A",
                                    department: emp.department?.name || "N/A",
                                    grossPay: naira(emp.grossPay),
                                    netPay: naira(emp.netPay),
                                  })
                                }
                                className="rounded-md bg-[#FFF1C7] px-3 py-1.5 text-xs font-medium text-[#9A6B00] transition hover:bg-[#FFE9A8]"
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setEmployeeToEnroll({
                                    id: emp.employeeId,
                                    name: emp.fullName,
                                  })
                                }
                                className="rounded-md bg-[#D9F5DE] px-3 py-1.5 text-xs font-medium text-[#15803D] transition hover:bg-[#C8EFD0]"
                              >
                                Add to Payroll
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                  {/* ── Empty state ── */}
                  {displayRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-10 text-center text-sm text-[#9ca3af]"
                      >
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Modals — preserved exactly */}
      <BulkUploadEmployeesModal
        open={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onSuccess={() => fetchEmployees()}
      />

      <AddEmployeeModal
        open={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onSuccess={() => fetchEmployees()}
      />

      {/* Remove from Payroll Modal */}
      {employeeToRemove && (
        <RemoveFromPayrollModal
          open={!!employeeToRemove}
          onClose={() => {
            if (!isRemoving) setEmployeeToRemove(null);
          }}
          onConfirm={handleConfirmRemoveFromPayroll}
          isLoading={isRemoving}
          employee={employeeToRemove}
        />
      )}

      {/* Add to Payroll Modal */}
      {employeeToEnroll && (
        <AddToPayrollModal
          isOpen={!!employeeToEnroll}
          onClose={() => {
            if (!isEnrolling) setEmployeeToEnroll(null);
          }}
          onConfirm={handleConfirmAddToPayroll}
          employeeName={employeeToEnroll.name}
          employeeId={employeeToEnroll.id}
          isLoading={isEnrolling}
        />
      )}
    </>
  );
}
