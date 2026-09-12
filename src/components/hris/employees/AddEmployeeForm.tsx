"use client";

import { createEmployee } from "@/lib/api/hris";
import type {
  CreateEmployeePayload,
  Gender,
  MaritalStatus,
  EmployeeStatus,
  EmploymentType,
  WorkMode,
  AccountType,
} from "@/lib/api/types/hrisTypes";
import axios from "axios";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";

type Step = "personal" | "professional" | "documents";

const steps: { key: Step; label: string }[] = [
  { key: "personal", label: "Personal Information" },
  { key: "professional", label: "Professional Information" },
  { key: "documents", label: "Documents" },
];

const MAX_ADDITIONAL_DOCUMENTS = 9;

const GENDER_OPTIONS: { value: Gender | ""; label: string }[] = [
  { value: "", label: "Select" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const MARITAL_STATUS_OPTIONS: { value: MaritalStatus | ""; label: string }[] = [
  { value: "", label: "Select" },
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED", label: "Married" },
  { value: "DIVORCED", label: "Divorced" },
];

const EMPLOYEE_STATUS_OPTIONS: { value: EmployeeStatus | ""; label: string }[] =
  [
    { value: "", label: "Select employee status" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "ON_LEAVE", label: "On leave" },
    { value: "SUSPENDED", label: "Suspended" },
    { value: "TERMINATED", label: "Terminated" },
  ];

const EMPLOYMENT_TYPE_OPTIONS: { value: EmploymentType | ""; label: string }[] =
  [
    { value: "", label: "Select employment type" },
    { value: "FULL_TIME", label: "Full-time" },
    { value: "PART_TIME", label: "Part-time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERN", label: "Intern" },
  ];

const WORK_MODE_OPTIONS: { value: WorkMode | ""; label: string }[] = [
  { value: "", label: "Select" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "On-site" },
];

// Confirmed with you: single option for now.
const ACCOUNT_TYPE_OPTIONS: { value: AccountType | ""; label: string }[] = [
  { value: "", label: "Select account type" },
  { value: "SAVINGS", label: "Savings" },
];

const COUNTRY_CODES = [
  { code: "+234", label: "Nigeria (+234)" },
  { code: "+233", label: "Ghana (+233)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+1", label: "US/Canada (+1)" },
];

// Confirmed from Swagger example: "IDENTIFICATION" is valid.
// The other three are still UNCONFIRMED — check the Schema tab for the full enum
// before relying on them.
const DOCUMENT_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Select document type" },
  { value: "IDENTIFICATION", label: "Identification" },
  { value: "CERTIFICATE", label: "Certificate" },
  { value: "CONTRACT", label: "Contract" },
  { value: "OTHER", label: "Other" },
];

// UNCONFIRMED with backend — placeholder labels for per-file additional-document
// types. NOTE: the API schema only exposes a single top-level `documentType`
// field on the request, not one per uploaded file. Confirm with backend whether
// this per-document selector maps to anything real before shipping it.
const ADDITIONAL_DOCUMENT_TYPE_OPTIONS = [
  "ID_CARD",
  "CERTIFICATE",
  "CONTRACT",
  "OTHER",
];

const inputClassName =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100";

const selectClassName = `${inputClassName} appearance-none`;

const initialPersonal = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  personalEmail: "",
  gender: "" as Gender | "",
  dateOfBirth: "",
  nationality: "",
  maritalStatus: "" as MaritalStatus | "",
  address: "",
  bankName: "",
  bankCode: "",
  accountNumber: "",
  accountName: "",
  accountType: "" as AccountType | "",
  nextOfKinFirstName: "",
  nextOfKinLastName: "",
  nextOfKinContact: "",
  nextOfKinAddress: "",
};

const initialProfessional = {
  employeeID: "",
  employeeStatus: "" as EmployeeStatus | "",
  employmentType: "" as EmploymentType | "",
  taxId: "",
  pensionId: "",
  department: "",
  position: "",
  workMode: "" as WorkMode | "",
  dateJoined: "",
  earnings: "",
  guarantorLastName: "",
  guarantorFirstName: "",
  guarantorRelationship: "",
  guarantorPhone: "",
  guarantorAddress: "",
};

function buildPayload(
  p: typeof initialPersonal,
  prof: typeof initialProfessional,
  documentType: string,
): CreateEmployeePayload {
  return {
    employeeId: prof.employeeID,
    firstName: p.firstName,
    lastName: p.lastName,
    phoneNumber: p.phoneNumber,
    personalEmail: p.personalEmail,
    gender: p.gender as Gender,
    dateOfBirth: p.dateOfBirth,
    nationality: p.nationality,
    maritalStatus: p.maritalStatus as MaritalStatus,
    address: p.address,

    nextOfKinFirstName: p.nextOfKinFirstName,
    nextOfKinLastName: p.nextOfKinLastName,
    nextOfKinContact: p.nextOfKinContact,
    nextOfKinAddress: p.nextOfKinAddress,

    bankName: p.bankName,
    bankCode: p.bankCode,
    accountNumber: p.accountNumber, // keep as string
    accountName: p.accountName,
    accountType: p.accountType as AccountType,

    employeeStatus: prof.employeeStatus as EmployeeStatus,
    taxId: prof.taxId,
    pensionId: prof.pensionId,
    departmentId: prof.department,
    position: prof.position,
    employmentType: prof.employmentType as EmploymentType,
    workMode: prof.workMode as WorkMode,
    dateJoined: prof.dateJoined,
    earnings: Number(prof.earnings) || 0,

    guarantorFirstName: prof.guarantorFirstName,
    guarantorLastName: prof.guarantorLastName,
    guarantorRelationship: prof.guarantorRelationship,
    guarantorPhone: prof.guarantorPhone,
    guarantorAddress: prof.guarantorAddress,

    documentType: documentType as CreateEmployeePayload["documentType"],
  };
}

export default function AddEmployeeForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [personal, setPersonal] = useState(initialPersonal);
  const [professional, setProfessional] = useState(initialProfessional);
  const [documentType, setDocumentType] = useState("");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [appointmentLetter, setAppointmentLetter] = useState<File | null>(null);
  const [additionalDocuments, setAdditionalDocuments] = useState<
    { file: File; documentType: string }[]
  >([]);

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

  const updatePersonal = <K extends keyof typeof personal>(
    field: K,
    value: (typeof personal)[K],
  ) => {
    setPersonal((prev) => ({ ...prev, [field]: value }));
  };

  const updateProfessional = <K extends keyof typeof professional>(
    field: K,
    value: (typeof professional)[K],
  ) => {
    setProfessional((prev) => ({ ...prev, [field]: value }));
  };

  const addDocument = (file: File) => {
    if (additionalDocuments.length >= MAX_ADDITIONAL_DOCUMENTS) return;
    setAdditionalDocuments((prev) => [
      ...prev,
      { file, documentType: ADDITIONAL_DOCUMENT_TYPE_OPTIONS[0] },
    ]);
  };

  const updateDocumentType = (index: number, documentType: string) => {
    setAdditionalDocuments((prev) =>
      prev.map((doc, i) => (i === index ? { ...doc, documentType } : doc)),
    );
  };

  const removeDocument = (index: number) => {
    setAdditionalDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!professional.employeeStatus) {
      setSubmitError("Please select an employee status before saving.");
      setCurrentStep("professional");
      return;
    }

    if (!documentType) {
      setSubmitError("Please select a document type before saving.");
      setCurrentStep("documents");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = buildPayload(personal, professional, documentType);
      await createEmployee(payload, {
        profileImage,
        appointmentLetter,
        documents: additionalDocuments,
      });
      router.push("/hris/employees");
    } catch (error) {
      setSubmitError(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ??
              "Failed to add employee. Please try again.")
          : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
                        className={`mt-1 h-10 w-0.5 ${isCompleted ? "bg-sky-600" : "bg-slate-200"}`}
                      />
                    )}
                  </div>
                  <div className="pt-1">
                    <p
                      className={`text-sm font-medium ${isActive ? "text-sky-600" : "text-slate-500"}`}
                    >
                      Step {index + 1}
                    </p>
                    <p
                      className={`text-xs ${isActive ? "text-slate-800" : "text-slate-400"}`}
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
                <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-slate-100 transition hover:bg-slate-200">
                  <Camera size={18} className="text-slate-500" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) =>
                      setProfileImage(e.target.files?.[0] ?? null)
                    }
                  />
                </label>
                <span className="text-sm font-medium text-slate-500">
                  {profileImage ? profileImage.name : "Upload photo (JPEG/PNG)"}
                </span>
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
                <PhoneField
                  label="Phone Number"
                  value={personal.phoneNumber}
                  onChange={(v) => updatePersonal("phoneNumber", v)}
                />
                <InputField
                  label="Personal Email"
                  type="email"
                  value={personal.personalEmail}
                  onChange={(e) =>
                    updatePersonal("personalEmail", e.target.value)
                  }
                />
                <TypedSelectField
                  label="Gender"
                  value={personal.gender}
                  onChange={(v) => updatePersonal("gender", v as Gender | "")}
                  options={GENDER_OPTIONS}
                />
                <InputField
                  label="Date of Birth"
                  type="date"
                  value={personal.dateOfBirth}
                  onChange={(e) =>
                    updatePersonal("dateOfBirth", e.target.value)
                  }
                />
                <InputField
                  label="Nationality"
                  value={personal.nationality}
                  onChange={(e) =>
                    updatePersonal("nationality", e.target.value)
                  }
                />
                <TypedSelectField
                  label="Marital Status"
                  value={personal.maritalStatus}
                  onChange={(v) =>
                    updatePersonal("maritalStatus", v as MaritalStatus | "")
                  }
                  options={MARITAL_STATUS_OPTIONS}
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
                  <PhoneField
                    label="Contact"
                    value={personal.nextOfKinContact}
                    onChange={(v) => updatePersonal("nextOfKinContact", v)}
                  />
                  <InputField
                    label="Address"
                    value={personal.nextOfKinAddress}
                    onChange={(e) =>
                      updatePersonal("nextOfKinAddress", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-700">
                  Bank Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="Bank Name"
                    value={personal.bankName}
                    onChange={(e) => updatePersonal("bankName", e.target.value)}
                  />
                  <InputField
                    label="Bank Code"
                    value={personal.bankCode}
                    onChange={(e) => updatePersonal("bankCode", e.target.value)}
                  />
                  <InputField
                    label="Account Number"
                    value={personal.accountNumber}
                    onChange={(e) =>
                      updatePersonal("accountNumber", e.target.value)
                    }
                  />
                  <InputField
                    label="Account Name"
                    value={personal.accountName}
                    onChange={(e) =>
                      updatePersonal("accountName", e.target.value)
                    }
                  />
                  <TypedSelectField
                    label="Account Type"
                    value={personal.accountType}
                    onChange={(v) =>
                      updatePersonal("accountType", v as AccountType | "")
                    }
                    options={ACCOUNT_TYPE_OPTIONS}
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
                <TypedSelectField
                  label="Employee Status"
                  value={professional.employeeStatus}
                  onChange={(v) =>
                    updateProfessional(
                      "employeeStatus",
                      v as EmployeeStatus | "",
                    )
                  }
                  options={EMPLOYEE_STATUS_OPTIONS}
                />
                <TypedSelectField
                  label="Employment Type"
                  value={professional.employmentType}
                  onChange={(v) =>
                    updateProfessional(
                      "employmentType",
                      v as EmploymentType | "",
                    )
                  }
                  options={EMPLOYMENT_TYPE_OPTIONS}
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
                <InputField
                  label="Department"
                  value={professional.department}
                  onChange={(e) =>
                    updateProfessional("department", e.target.value)
                  }
                  placeholder="Enter Department"
                />
                <InputField
                  label="Position"
                  value={professional.position}
                  onChange={(e) =>
                    updateProfessional("position", e.target.value)
                  }
                  placeholder="Enter position"
                />
                <TypedSelectField
                  label="Work Mode"
                  value={professional.workMode}
                  onChange={(v) =>
                    updateProfessional("workMode", v as WorkMode | "")
                  }
                  options={WORK_MODE_OPTIONS}
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
                label="Earnings (monthly)"
                type="number"
                value={professional.earnings}
                onChange={(e) => updateProfessional("earnings", e.target.value)}
                placeholder="Enter monthly earnings"
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
                  <PhoneField
                    label="Phone Number"
                    value={professional.guarantorPhone}
                    onChange={(v) => updateProfessional("guarantorPhone", v)}
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

              <TypedSelectField
                label="Document Type"
                value={documentType}
                onChange={(v) => setDocumentType(v)}
                options={DOCUMENT_TYPE_OPTIONS}
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Upload appointment letter
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center transition hover:border-sky-300">
                  <div className="mb-2 text-2xl text-slate-300">⬆</div>
                  <p className="text-xs font-medium text-slate-500">
                    {appointmentLetter ? appointmentLetter.name : "Upload file"}
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-slate-400">
                    Accepted formats: JPEG, PNG, PDF
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) =>
                      setAppointmentLetter(e.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Additional Documents ({additionalDocuments.length}/
                    {MAX_ADDITIONAL_DOCUMENTS})
                  </label>
                  <label
                    className={`cursor-pointer text-sm font-medium ${
                      additionalDocuments.length >= MAX_ADDITIONAL_DOCUMENTS
                        ? "cursor-not-allowed text-slate-300"
                        : "text-sky-600 hover:text-sky-700"
                    }`}
                  >
                    + Add file
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      disabled={
                        additionalDocuments.length >= MAX_ADDITIONAL_DOCUMENTS
                      }
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) addDocument(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>

                {additionalDocuments.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center text-xs text-slate-400">
                    No additional documents added
                  </div>
                ) : (
                  <div className="space-y-2">
                    {additionalDocuments.map((doc, index) => (
                      <div
                        key={`${doc.file.name}-${index}`}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
                      >
                        <span className="flex-1 truncate text-sm text-slate-700">
                          {doc.file.name}
                        </span>
                        <select
                          value={doc.documentType}
                          onChange={(e) =>
                            updateDocumentType(index, e.target.value)
                          }
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600"
                        >
                          {ADDITIONAL_DOCUMENT_TYPE_OPTIONS.map((type) => (
                            <option key={type} value={type}>
                              {type.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-xs font-medium text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {submitError && (
            <p className="mt-4 text-sm text-red-600">{submitError}</p>
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
                disabled={isSubmitting}
                className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save"}
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

function splitPhone(value: string): { countryCode: string; local: string } {
  const match = COUNTRY_CODES.find((c) => value.startsWith(c.code));
  if (match)
    return { countryCode: match.code, local: value.slice(match.code.length) };
  return {
    countryCode: COUNTRY_CODES[0].code,
    local: value.replace(/^\+/, ""),
  };
}

function PhoneField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { countryCode, local } = splitPhone(value);

  const updateCountryCode = (newCode: string) => {
    onChange(`${newCode}${local}`);
  };

  const updateLocal = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, ""); // strip spaces/dashes as they're typed
    onChange(`${countryCode}${digits}`);
  };

  return (
    <div>
      <label className="mb-1 block text-sm text-slate-600">{label}</label>
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={(e) => updateCountryCode(e.target.value)}
          className="w-36 shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="numeric"
          value={local}
          onChange={(e) => updateLocal(e.target.value)}
          placeholder="8012345678"
          className={inputClassName}
        />
      </div>
    </div>
  );
}

function TypedSelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T | "";
  onChange: (value: T | "") => void;
  options: { value: T | ""; label: string }[];
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T | "")}
        className={selectClassName}
      >
        {options.map((opt) => (
          <option key={opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
