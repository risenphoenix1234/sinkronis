"use client";

import AddEmployeeModal from "@/components/payroll/employee/AddEmployeeModal";
import BulkUploadEmployeesModal from "@/components/payroll/employee/BulkUploadEmployeeModal";
import { Download, Plus, Upload, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Employee = {
  initials: string;
  name: string;
  role: string;
  department: string;
  gross: string;
  netPay: string;
  status: "Active" | "Inactive";
  paye: string;
  payroll: boolean;
};

const employees: Employee[] = [
  {
    initials: "AN",
    name: "Adaeze Nwachukwu",
    role: "Support Lead",
    department: "Customer Support",
    gross: "₦243,000",
    netPay: "₦206,603",
    status: "Inactive",
    paye: "₦13,177",
    payroll: false,
  },
  {
    initials: "AO",
    name: "Amara Okafor",
    role: "HR Manager",
    department: "Human Resources",
    gross: "₦607,500",
    netPay: "₦492,919",
    status: "Active",
    paye: "₦56,531",
    payroll: true,
  },
  {
    initials: "AG",
    name: "Amina Garba",
    role: "Compliance Officer",
    department: "Legal & Compliance",
    gross: "₦459,000",
    netPay: "₦377,439",
    status: "Active",
    paye: "₦37,701",
    payroll: true,
  },
  {
    initials: "BL",
    name: "Babajide Lawson",
    role: "Legal Counsel",
    department: "Legal & Compliance",
    gross: "₦890,000",
    netPay: "₦718,872",
    status: "Active",
    paye: "₦93,728",
    payroll: true,
  },
  {
    initials: "BA",
    name: "Bisi Adekoya",
    role: "Account Executive",
    department: "Sales & Marketing",
    gross: "₦405,000",
    netPay: "₦335,446",
    status: "Active",
    paye: "₦30,854",
    payroll: true,
  },
  {
    initials: "CO",
    name: "Chiamaka Obi",
    role: "HR Officer",
    department: "Human Resources",
    gross: "₦351,000",
    netPay: "₦290,871",
    status: "Active",
    paye: "₦24,589",
    payroll: true,
  },
  {
    initials: "CK",
    name: "Chidi Okeke",
    role: "Support Specialist",
    department: "Customer Support",
    gross: "₦270,000",
    netPay: "₦228,170",
    status: "Active",
    paye: "₦16,030",
    payroll: true,
  },
  {
    initials: "CA",
    name: "Chukwuemeka Adeyemi",
    role: "Finance Lead",
    department: "Finance",
    gross: "₦752,000",
    netPay: "₦509,206",
    status: "Active",
    paye: "₦75,714",
    payroll: true,
  },
  {
    initials: "DA",
    name: "Damilola Afolabi",
    role: "DevOps Engineer",
    department: "IT & Technology",
    gross: "₦565,000",
    netPay: "₦461,828",
    status: "Active",
    paye: "₦51,572",
    payroll: true,
  },
  {
    initials: "EN",
    name: "Emeka Nwosu",
    role: "Software Engineer",
    department: "IT & Technology",
    gross: "₦506,000",
    netPay: "₦375,555",
    status: "Active",
    paye: "₦44,005",
    payroll: true,
  },
];

export default function EmployeesPage() {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  const router = useRouter();

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

            {/* Export */}
            <button
              type="button"
              className="flex h-9 items-center gap-2 rounded-md border border-[#E0E5EB] bg-white px-4 text-sm font-medium text-[#718096] transition hover:bg-[#F8FAFC]"
            >
              <Download size={14} />
              Export CSV
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
              placeholder="Search name or role..."
              className="h-9 w-full rounded-md border border-[#DDE2E8] bg-white pl-10 pr-4 text-sm text-[#344054] outline-none placeholder:text-[#98A2B3] focus:border-[#2388D0] focus:ring-1 focus:ring-[#2388D0]"
            />
          </div>

          {/* Department Filter */}
          <select
            className="h-9 w-full rounded-md border border-[#DDE2E8] bg-white px-3 text-sm text-[#98A2B3] outline-none focus:border-[#2388D0] sm:w-[145px]"
            defaultValue=""
          >
            <option value="" disabled>
              Department
            </option>
            <option value="customer-support">Customer Support</option>
            <option value="human-resources">Human Resources</option>
            <option value="finance">Finance</option>
            <option value="it">IT & Technology</option>
            <option value="legal">Legal & Compliance</option>
          </select>

          {/* Status Filter */}
          <select
            className="h-9 w-full rounded-md border border-[#DDE2E8] bg-white px-3 text-sm text-[#98A2B3] outline-none focus:border-[#2388D0] sm:w-[105px]"
            defaultValue=""
          >
            <option value="" disabled>
              Status
            </option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Payroll Filter */}
          <select
            className="h-9 w-full rounded-md border border-[#DDE2E8] bg-white px-3 text-sm text-[#98A2B3] outline-none focus:border-[#2388D0] sm:w-[108px]"
            defaultValue=""
          >
            <option value="" disabled>
              Payroll
            </option>
            <option value="on-payroll">On Payroll</option>
            <option value="off-payroll">Off Payroll</option>
          </select>
        </div>

        {/* ================================================================ */}
        {/* EMPLOYEE TABLE */}
        {/* ================================================================ */}

        <section className="overflow-hidden rounded-md border border-[#E1E5EA] bg-white">
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

              {/* Table Body */}
              <tbody>
                {employees.map((employee, index) => (
                  <tr
                    key={employee.name}
                    className={`border-b border-[#E5E7EB] ${
                      index % 2 === 1 ? "bg-[#F1F2F6]" : "bg-white"
                    }`}
                  >
                    {/* Employee */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E5F3FC] text-[10px] font-semibold text-[#2388D0]">
                          {employee.initials}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#263342]">
                            {employee.name}
                          </p>

                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="text-xs text-[#8492A6]">
                              {employee.role}
                            </span>

                            {employee.payroll && (
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
                      {employee.department}
                    </td>

                    {/* Gross */}
                    <td className="px-4 py-3 text-sm font-semibold text-[#263342]">
                      {employee.gross}
                    </td>

                    {/* Net Pay */}
                    <td className="px-4 py-3 text-sm font-semibold text-[#15803D]">
                      {employee.netPay}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          employee.status === "Active"
                            ? "bg-[#D9F5DE] text-[#15803D]"
                            : "bg-[#F1F3F5] text-[#667085]"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>

                    {/* PAYE */}
                    <td className="px-4 py-3 text-sm text-[#FF4D4F]">
                      {employee.paye}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/payroll/employees/${encodeURIComponent(employee.name)}`,
                            )
                          }
                          className="rounded-md bg-[#E5F3FC] px-3 py-1.5 text-xs font-medium text-[#1683D8] transition hover:bg-[#D6ECFA]"
                        >
                          View
                        </button>

                        {employee.payroll ? (
                          <button
                            type="button"
                            className="rounded-md bg-[#FFF1C7] px-3 py-1.5 text-xs font-medium text-[#9A6B00] transition hover:bg-[#FFE9A8]"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="rounded-md bg-[#D9F5DE] px-3 py-1.5 text-xs font-medium text-[#15803D] transition hover:bg-[#C8EFD0]"
                          >
                            Add to Payroll
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <BulkUploadEmployeesModal
        open={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onImport={(file) => {
          console.log("Selected CSV:", file);

          // Later you can send the file to your backend here.
        }}
      />

      <AddEmployeeModal
        open={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
      />
    </>
  );
}
