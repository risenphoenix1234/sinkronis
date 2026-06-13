import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import { useState } from "react";

// ── Page component ────────────────────────────────────────────────────────

export default function AddNewEmployeeStep2() {
  const currentStep = 2;

  return (
    <section className="space-y-3">
      <section className="bg-white min-h-screen p-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-slate-800 mb-10">
          Add New Employee
        </h1>

        <div className="flex gap-12">
          {/* Stepper*/}
          <aside className="w-56">
            <div className="relative flex flex-col items-center">
              <div className="absolute top-8 h-[20px] w-px bg-blue-500" />
              <div className="z-10 flex flex-col items-center mb-10">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  👤
                </div>
                <span className="mt-3 text-sm font-medium">
                  Personal Information
                </span>
              </div>

              <div className="z-10 flex flex-col items-center mb-10">
                <div className="w-10 h-10 rounded-full  bg-blue-500 flex items-center justify-center">
                  💼
                </div>
                <span className="mt-3 text-sm text-gray-500">
                  Professional Information
                </span>
              </div>

              <div className="z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  📄
                </div>
                <span className="mt-3 text-sm text-gray-500">Documents</span>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="flex-1 max-w-5xl">
            {/* Header */}
            <div className="mb-8">
              <p className="text-xs text-gray-500">Step 2/3</p>
              <h2 className="font-semibold">Professional Information</h2>
            </div>

            {/* ── Form ── */}

            <div className="space-y-4">
              {/* Row 1 — Employee ID / Status */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Employee ID"
                  name="employeeid"
                  placeholder="Enter employee id"
                />

                <SelectField
                  label="Employee Status"
                  name="employeestatus"
                  options={["Active", "Inactive", "On Leave", "Probation"]}
                />

                {/* Row 2 — Department / Position */}
                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    label="Department"
                    name="department"
                    options={[
                      "Engineering",
                      "Finance",
                      "HR",
                      "Marketing",
                      "Operations",
                    ]}
                  />

                  <SelectField
                    label="Position"
                    name="position"
                    options={[
                      "Manager",
                      "Senior Engineer",
                      "Engineer",
                      "Analyst",
                      "Intern",
                    ]}
                  />
                </div>
                {/* Row 3 — Work Mode / Date Joined */}

                <div className="grid grid-cols-2 gap-4">
                  <SelectField
                    label="Work Mode"
                    name="workmode"
                    options={["Remote", "On-site", "Hybrid"]}
                  />

                  <FormField
                    label="Date Joined"
                    name="datejoined"
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                {/* Row 4 — Earnings (half width) */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Earnings" name="earnings" />
                </div>
                {/* Guarantor Information */}
                <div className="pt-2">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Guarantor Information
                  </p>
                  {/* Last / First name */}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField
                      label="Last Name"
                      name="lastname"
                      placeholder="Enter last name"
                    />

                    <FormField
                      label="First Name"
                      name="firstname"
                      placeholder="Enter first name"
                    />

                    <FormField
                      label="Relationship"
                      name="relationship"
                      placeholder="Type here"
                    />

                    <FormField
                      label="Phone Number"
                      name="phonenumber"
                      placeholder="Type here"
                    />

                    <FormField
                      label="Address"
                      name="address "
                      placeholder="Type here"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="border-t border-dashed border-gray-300 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-end gap-3">
          <button className="px-5 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Cancel
          </button>
          <button className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition shadow-sm">
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
