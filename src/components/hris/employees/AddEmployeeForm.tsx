"use client";

import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";

type Step = "personal" | "professional" | "documents";

const steps: { key: Step; label: string }[] = [
  { key: "personal", label: "Personal Information" },
  { key: "professional", label: "Professional Information" },
  { key: "documents", label: "Documents" },
];

const inputClassName =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100";

const selectClassName = `${inputClassName} appearance-none`;

export default function AddEmployeeForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("personal");

  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    personalEmail: "",
    email: "",
    gender: "",
    dob: "",
    nationality: "",
    maritalStatus: "",
    address: "",
    bankName: "",
    accountNumber: "",
    nextOfKinFirstName: "",
    nextOfKinLastName: "",
    nextOfKinEmail: "",
    nextOfKinContact: "",
  });

  const [professional, setProfessional] = useState({
    employeeID: "",
    employeeStatus: "",
    taxId: "",
    pensionId: "",
    department: "",
    position: "",
    workMode: "",
    dateJoined: "",
    salary: "",
    earnings: "",
    guarantorLastName: "",
    guarantorFirstName: "",
    guarantorRelationship: "",
    guarantorPhone: "",
    guarantorAddress: "",
  });

  const stepIndex = steps.findIndex((step) => step.key === currentStep);
  const isPersonal = currentStep === "personal";
  const isProfessional = currentStep === "professional";
  const isDocuments = currentStep === "documents";

  const goNext = () => {
    if (currentStep === "personal") setCurrentStep("professional");
    else if (currentStep === "professional") setCurrentStep("documents");
  };

  const goBack = () => {
    if (currentStep === "professional") setCurrentStep("personal");
    else if (currentStep === "documents") setCurrentStep("professional");
  };

  const handleSubmit = () => {
    router.push("/hris/employees");
  };

  const updatePersonal = (field: keyof typeof personal, value: string) => {
    setPersonal((prev) => ({ ...prev, [field]: value }));
  };

  const updateProfessional = (
    field: keyof typeof professional,
    value: string,
  ) => {
    setProfessional((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-col gap-6 lg:flex-row">
        <aside className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:w-64">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Employee Setup
          </h2>
          <div className="space-y-5">
            {steps.map((step, index) => {
              const isActive = index === stepIndex;
              const isCompleted = index < stepIndex;

              return (
                <div key={step.key} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        isCompleted || isActive
                          ? "bg-sky-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`mt-1 h-10 w-0.5 ${
                          isCompleted ? "bg-sky-600" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                  <div className="pt-1">
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-sky-600" : "text-slate-500"
                      }`}
                    >
                      Step {index + 1}
                    </p>
                    <p
                      className={`text-xs ${
                        isActive ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {isPersonal && (
            <div className="space-y-6">
              <StepHeader
                step={1}
                title="Personal Information"
                subtitle="Add the employee’s core profile details."
              />

              <div className="flex items-center gap-4">
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200">
                  <Camera size={18} className="text-slate-500" />
                </button>
                <button className="text-sm font-medium text-slate-500 transition hover:text-sky-600">
                  Upload photo
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="First Name"
                  value={personal.firstName}
                  onChange={(e) => updatePersonal("firstName", e.target.value)}
                />
                <InputField
                  label="Last Name"
                  value={personal.lastName}
                  onChange={(e) => updatePersonal("lastName", e.target.value)}
                />
                <InputField
                  label="Phone Number"
                  value={personal.phoneNumber}
                  onChange={(e) =>
                    updatePersonal("phoneNumber", e.target.value)
                  }
                />
                <InputField
                  label="PersonalEmail"
                  type="personalEmail"
                  value={personal.personalEmail}
                  onChange={(e) =>
                    updatePersonal("personalEmail", e.target.value)
                  }
                />
                <SelectField
                  label="Gender"
                  value={personal.gender}
                  onChange={(e) => updatePersonal("gender", e.target.value)}
                  options={["Select", "Male", "Female"]}
                />
                <InputField
                  label="Date of Birth"
                  type="date"
                  value={personal.dob}
                  onChange={(e) => updatePersonal("dob", e.target.value)}
                />
                <InputField
                  label="Nationality"
                  value={personal.nationality}
                  onChange={(e) =>
                    updatePersonal("nationality", e.target.value)
                  }
                />
                <SelectField
                  label="Marital Status"
                  value={personal.maritalStatus}
                  onChange={(e) =>
                    updatePersonal("maritalStatus", e.target.value)
                  }
                  options={["Select", "Single", "Married", "Divorced"]}
                />
              </div>

              <InputField
                label="Address"
                value={personal.address}
                onChange={(e) => updatePersonal("address", e.target.value)}
              />

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Next of Kin Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="First Name"
                    value={personal.nextOfKinFirstName}
                    onChange={(e) =>
                      updatePersonal("nextOfKinFirstName", e.target.value)
                    }
                  />
                  <InputField
                    label="Last Name"
                    value={personal.nextOfKinLastName}
                    onChange={(e) =>
                      updatePersonal("nextOfKinLastName", e.target.value)
                    }
                  />

                  <InputField
                    label="Contact"
                    value={personal.nextOfKinContact}
                    onChange={(e) =>
                      updatePersonal("nextOfKinContact", e.target.value)
                    }
                  />
                  <InputField
                    label="Address"
                    type="address"
                    value={personal.address}
                    onChange={(e) => updatePersonal("address", e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Bank Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField
                    label="Bank Name"
                    value={personal.bankName}
                    onChange={(e) => updatePersonal("bankName", e.target.value)}
                    options={[
                      "Select",
                      "Uba",
                      "Gtbank",
                      "Zenith",
                      "Access Bank",
                      "First Bank",
                    ]}
                  />
                  <InputField
                    label="Account Number"
                    value={personal.accountNumber}
                    onChange={(e) =>
                      updatePersonal("accountNumber", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {isProfessional && (
            <div className="space-y-6">
              <StepHeader
                step={2}
                title="Professional Information"
                subtitle="Add the employee’s work details and guarantor information."
              />

              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="Employee ID"
                  value={professional.employeeID}
                  onChange={(e) =>
                    updateProfessional("employeeID", e.target.value)
                  }
                />
                <SelectField
                  label="Employee Status"
                  value={professional.employeeStatus}
                  onChange={(e) =>
                    updateProfessional("employeeStatus", e.target.value)
                  }
                  options={[
                    "Select employee status",
                    "Confirmed",
                    "Probation",
                    "Exited",
                  ]}
                />
                <InputField
                  label="Tax ID"
                  value={professional.taxId}
                  onChange={(e) => updateProfessional("taxId", e.target.value)}
                />
                <InputField
                  label="Pension ID"
                  value={professional.pensionId}
                  onChange={(e) =>
                    updateProfessional("pensionId", e.target.value)
                  }
                />
                <SelectField
                  label="Department"
                  value={professional.department}
                  onChange={(e) =>
                    updateProfessional("department", e.target.value)
                  }
                  options={[
                    "Select department",
                    "HR Department",
                    "IT Department",
                    "Finance Department",
                    "Marketing Department",
                    "Service Department",
                    "Specialist Department",
                  ]}
                />
                <InputField
                  label="Position"
                  value={professional.position}
                  onChange={(e) =>
                    updateProfessional("position", e.target.value)
                  }
                  placeholder="Enter position"
                />
                <SelectField
                  label="Work Mode"
                  value={professional.workMode}
                  onChange={(e) =>
                    updateProfessional("workMode", e.target.value)
                  }
                  options={["Select", "Remote", "Hybrid", "On-site"]}
                />
                <InputField
                  label="Date Joined"
                  type="date"
                  value={professional.dateJoined}
                  onChange={(e) =>
                    updateProfessional("dateJoined", e.target.value)
                  }
                />
              </div>

              <InputField
                label="Earnings"
                value={professional.salary}
                onChange={(e) => updateProfessional("salary", e.target.value)}
                placeholder="Type here"
              />

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Guarantor Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="Last Name"
                    value={professional.guarantorLastName}
                    onChange={(e) =>
                      updateProfessional("guarantorLastName", e.target.value)
                    }
                    placeholder="Enter"
                  />
                  <InputField
                    label="First Name"
                    value={professional.guarantorFirstName}
                    onChange={(e) =>
                      updateProfessional("guarantorFirstName", e.target.value)
                    }
                    placeholder="Enter"
                  />
                  <InputField
                    label="Relationship"
                    value={professional.guarantorRelationship}
                    onChange={(e) =>
                      updateProfessional(
                        "guarantorRelationship",
                        e.target.value,
                      )
                    }
                    placeholder="Enter"
                  />
                  <InputField
                    label="Phone Number"
                    value={professional.guarantorPhone}
                    onChange={(e) =>
                      updateProfessional("guarantorPhone", e.target.value)
                    }
                    placeholder="Enter phone"
                  />
                </div>
                <div className="mt-4">
                  <InputField
                    label="Address"
                    value={professional.guarantorAddress}
                    onChange={(e) =>
                      updateProfessional("guarantorAddress", e.target.value)
                    }
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>
          )}

          {isDocuments && (
            <div className="space-y-6">
              <StepHeader
                step={3}
                title="Documents"
                subtitle="Upload the required documents for employee onboarding."
              />

              <div className="space-y-4">
                {[
                  {
                    label: "Upload appointment letter",
                    sub: "Accepted formats: PDF, Word, PNG, JPEG, max 5MB",
                  },
                ].map((doc) => (
                  <div key={doc.label}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {doc.label}
                    </label>
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center">
                      <div className="mb-2 text-2xl text-slate-300">⬆</div>
                      <p className="text-xs font-medium text-slate-500">
                        Upload file
                      </p>
                      <p className="mt-1 max-w-xs text-xs text-slate-400">
                        {doc.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="mb-2 flex items-center gap-8 justify-between">
                  <label className="mb-2 w-full text-sm font-medium text-slate-700">
                    Other Documents
                  </label>
                  <select className={selectClassName}>
                    <option value="">Label Document</option>
                    <option>ID Card</option>
                    <option>Certificate</option>
                    <option>Contract</option>
                  </select>
                </div>

                <div className="mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center">
                  <div className="mb-2 text-2xl text-slate-300">⬆</div>
                  <p className="text-xs font-medium text-slate-500">
                    Upload file
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            {!isPersonal && (
              <button
                onClick={goBack}
                className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
            {!isDocuments ? (
              <button
                onClick={goNext}
                className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHeader({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">Step {step}/3</p>
      <h2 className="mt-1 text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClassName}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-slate-600">{label}</label>
      <select value={value} onChange={onChange} className={selectClassName}>
        {options.map((option) => (
          <option
            key={option}
            value={
              option === "Select" ||
              option === "Select employee status" ||
              option === "Select department"
                ? ""
                : option
            }
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
