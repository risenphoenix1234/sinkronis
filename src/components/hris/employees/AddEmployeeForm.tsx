"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { createEmployee, inviteEmployee, getRoles } from "@/lib/api/hris";
import { getDepartmentsTable } from "@/lib/api/admin";
import type {
  CreateEmployeePayload,
  Gender,
  MaritalStatus,
  CreateEmployeeStatus,
  EmploymentType,
  WorkMode,
  AccountType,
  DocumentType,
  Role,
} from "@/lib/api/types/hrisTypes";

type Step = "personal" | "professional" | "documents";

const steps: { key: Step; label: string }[] = [
  { key: "personal", label: "Personal Information" },
  { key: "professional", label: "Professional Information" },
  { key: "documents", label: "Documents" },
];

const MAX_ADDITIONAL_DOCUMENTS = 9;

const GENDER_OPTIONS: { value: Gender | ""; label: string }[] = [
  { value: "", label: "Select gender" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

const MARITAL_STATUS_OPTIONS: { value: MaritalStatus | ""; label: string }[] = [
  { value: "", label: "Select marital status" },
  { value: "SINGLE", label: "Single" },
  { value: "MARRIED", label: "Married" },
  { value: "DIVORCED", label: "Divorced" },
  { value: "WIDOWED", label: "Widowed" },
  { value: "OTHER", label: "Other" },
];

const EMPLOYEE_STATUS_OPTIONS: {
  value: CreateEmployeeStatus | "";
  label: string;
}[] = [
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
  { value: "", label: "Select work mode" },
  { value: "ONSITE", label: "On-site" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
];

const ACCOUNT_TYPE_OPTIONS: { value: AccountType | ""; label: string }[] = [
  { value: "", label: "Select account type" },
  { value: "SAVINGS", label: "Savings" },
  { value: "CURRENT", label: "Current" },
];

const COUNTRY_CODES = [
  { code: "+234", label: "Nigeria (+234)" },
  { code: "+233", label: "Ghana (+233)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+1", label: "US/Canada (+1)" },
];

const DOCUMENT_TYPE_OPTIONS: { value: DocumentType | ""; label: string }[] = [
  { value: "", label: "Select document type" },
  { value: "IDENTIFICATION", label: "Identification" },
  { value: "CERTIFICATE", label: "Certificate" },
  { value: "CONTRACT", label: "Contract" },
  { value: "TAX_DOCUMENT", label: "Tax Document" },
  { value: "PENSION_DOCUMENT", label: "Pension Document" },
  { value: "OTHER", label: "Other" },
];

const ADDITIONAL_DOCUMENT_TYPE_OPTIONS = [
  "IDENTIFICATION",
  "CERTIFICATE",
  "CONTRACT",
  "TAX_DOCUMENT",
  "PENSION_DOCUMENT",
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
  employeeStatus: "ACTIVE" as CreateEmployeeStatus | "",
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

function hasValidPhoneDigits(phone?: string) {
  if (!phone) return false;
  const digits = phone.replace(/[^\d]/g, "");
  return digits.length >= 8;
}

function buildPayload(
  p: typeof initialPersonal,
  prof: typeof initialProfessional,
  documentType: DocumentType | "",
): CreateEmployeePayload {
  const payload: CreateEmployeePayload = {
    employeeId: prof.employeeID.trim(),
    firstName: p.firstName.trim(),
    lastName: p.lastName.trim(),
    personalEmail: p.personalEmail.trim(),
  };

  if (hasValidPhoneDigits(p.phoneNumber)) {
    payload.phoneNumber = p.phoneNumber.trim();
  }
  if (p.gender) payload.gender = p.gender;
  if (p.dateOfBirth) payload.dateOfBirth = p.dateOfBirth;
  if (p.nationality?.trim()) payload.nationality = p.nationality.trim();
  if (p.maritalStatus) payload.maritalStatus = p.maritalStatus;
  if (p.address?.trim()) payload.address = p.address.trim();

  if (p.nextOfKinFirstName?.trim())
    payload.nextOfKinFirstName = p.nextOfKinFirstName.trim();
  if (p.nextOfKinLastName?.trim())
    payload.nextOfKinLastName = p.nextOfKinLastName.trim();
  if (hasValidPhoneDigits(p.nextOfKinContact)) {
    payload.nextOfKinContact = p.nextOfKinContact.trim();
  }
  if (p.nextOfKinAddress?.trim())
    payload.nextOfKinAddress = p.nextOfKinAddress.trim();

  if (p.bankName?.trim()) payload.bankName = p.bankName.trim();
  if (p.bankCode?.trim()) payload.bankCode = p.bankCode.trim();
  if (p.accountNumber?.trim()) payload.accountNumber = p.accountNumber.trim();
  if (p.accountName?.trim()) payload.accountName = p.accountName.trim();
  if (p.accountType) payload.accountType = p.accountType;

  if (prof.employeeStatus) payload.employeeStatus = prof.employeeStatus;
  if (prof.taxId?.trim()) payload.taxId = prof.taxId.trim();
  if (prof.pensionId?.trim()) payload.pensionId = prof.pensionId.trim();
  if (prof.department?.trim()) payload.departmentId = prof.department.trim();
  if (prof.position?.trim()) payload.position = prof.position.trim();
  if (prof.employmentType) payload.employmentType = prof.employmentType;
  if (prof.workMode) payload.workMode = prof.workMode;
  if (prof.dateJoined) payload.dateJoined = prof.dateJoined;
  if (prof.earnings !== "" && !isNaN(Number(prof.earnings))) {
    payload.earnings = Number(prof.earnings);
  }

  if (prof.guarantorFirstName?.trim())
    payload.guarantorFirstName = prof.guarantorFirstName.trim();
  if (prof.guarantorLastName?.trim())
    payload.guarantorLastName = prof.guarantorLastName.trim();
  if (prof.guarantorRelationship?.trim())
    payload.guarantorRelationship = prof.guarantorRelationship.trim();
  if (hasValidPhoneDigits(prof.guarantorPhone)) {
    payload.guarantorPhone = prof.guarantorPhone.trim();
  }
  if (prof.guarantorAddress?.trim())
    payload.guarantorAddress = prof.guarantorAddress.trim();

  if (documentType) payload.documentType = documentType;

  return payload;
}

export default function AddEmployeeForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [personal, setPersonal] = useState(initialPersonal);
  const [professional, setProfessional] = useState(initialProfessional);
  const [documentType, setDocumentType] = useState<DocumentType | "">(
    "IDENTIFICATION",
  );

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [appointmentLetter, setAppointmentLetter] = useState<File | null>(null);
  const [additionalDocuments, setAdditionalDocuments] = useState<
    { file: File; documentType: string }[]
  >([]);

  // Dynamic department list and roles from authenticated tenant
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchMetadata = async () => {
      try {
        setLoadingDepartments(true);
        const [deptRes, rolesRes] = await Promise.all([
          getDepartmentsTable({ limit: 100 }).catch(() => null),
          getRoles().catch(() => null),
        ]);
        if (isMounted && deptRes?.data) {
          const formatted = deptRes.data.map(
            (d: { id: string; departmentName?: string; name?: string }) => ({
              id: d.id,
              name: d.departmentName || d.name || "Unnamed Department",
            }),
          );
          setDepartments(formatted);
        }
        if (isMounted && Array.isArray(rolesRes)) {
          setRoles(rolesRes);
        }
      } catch (err) {
        console.warn("Could not load metadata:", err);
      } finally {
        if (isMounted) setLoadingDepartments(false);
      }
    };

    fetchMetadata();
    return () => {
      isMounted = false;
    };
  }, []);

  const stepIndex = steps.findIndex((step) => step.key === currentStep);
  const isPersonal = currentStep === "personal";
  const isProfessional = currentStep === "professional";
  const isDocuments = currentStep === "documents";

  const validatePersonal = () => {
    if (
      !personal.firstName.trim() ||
      !personal.lastName.trim() ||
      !personal.personalEmail.trim()
    ) {
      const msg = "First name, last name, and personal email are required.";
      setSubmitError(msg);
      toast.warning(msg);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(personal.personalEmail.trim())) {
      const msg = "Please enter a valid personal email address.";
      setSubmitError(msg);
      toast.warning(msg);
      return false;
    }
    setSubmitError(null);
    return true;
  };

  const validateProfessional = () => {
    if (!professional.employeeID.trim()) {
      const msg = "Employee ID is required.";
      setSubmitError(msg);
      toast.warning(msg);
      return false;
    }
    setSubmitError(null);
    return true;
  };

  const goNext = () => {
    if (currentStep === "personal") {
      if (!validatePersonal()) return;
      setCurrentStep("professional");
    } else if (currentStep === "professional") {
      if (!validateProfessional()) return;
      setCurrentStep("documents");
    }
  };

  const goBack = () => {
    setSubmitError(null);
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
    if (additionalDocuments.length >= MAX_ADDITIONAL_DOCUMENTS) {
      toast.warning(
        `Maximum of ${MAX_ADDITIONAL_DOCUMENTS} additional documents allowed.`,
      );
      return;
    }
    setAdditionalDocuments((prev) => [
      ...prev,
      { file, documentType: documentType || "IDENTIFICATION" },
    ]);
  };

  const updateAdditionalDocumentType = (index: number, docType: string) => {
    setAdditionalDocuments((prev) =>
      prev.map((doc, i) =>
        i === index ? { ...doc, documentType: docType } : doc,
      ),
    );
  };

  const removeDocument = (index: number) => {
    setAdditionalDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validatePersonal()) {
      setCurrentStep("personal");
      return;
    }

    if (!validateProfessional()) {
      setCurrentStep("professional");
      return;
    }

    if (!documentType) {
      const msg = "Please select a document type before saving.";
      setSubmitError(msg);
      toast.warning(msg);
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

      // Automatically send the employee invitation email via SMTP
      try {
        const targetRoleId = roles[0]?.id;
        if (targetRoleId && payload.personalEmail) {
          await inviteEmployee({
            email: payload.personalEmail,
            roleId: targetRoleId,
            moduleAccess: ["HRIS"],
          });
          toast.success("Employee created and invitation email sent!");
        } else {
          toast.success("Employee created successfully!");
        }
      } catch (invErr: any) {
        console.warn("Employee created, but invitation failed:", invErr);
        toast.info(
          "Employee created. Invitation could not be sent: " +
          (invErr?.response?.data?.message ||
            "Check email delivery settings."),
        );
      }

      router.push("/hris/employees");
    } catch (error) {
      console.error("createEmployee error:", error);
      let message = "Failed to add employee. Please try again.";

      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data;
        if (
          Array.isArray(data.validationErrors) &&
          data.validationErrors.length > 0
        ) {
          message =
            data.validationErrors
              .map((v: { message?: string }) => v.message)
              .filter(Boolean)
              .join(", ") ||
            data.message ||
            message;
        } else if (data.message) {
          message = data.message;
        }
      }

      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Stepper sidebar */}
      <aside className="h-fit w-full shrink-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:w-64">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Employee Setup
        </h2>
        <div className="space-y-5">
          {steps.map((step, index) => {
            const isActive = index === stepIndex;
            const isCompleted = index < stepIndex;
            return (
              <div
                key={step.key}
                onClick={() => {
                  if (index < stepIndex) {
                    setSubmitError(null);
                    setCurrentStep(step.key);
                  }
                }}
                className={`flex items-start gap-3 ${index < stepIndex ? "cursor-pointer" : ""
                  }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${isCompleted || isActive
                        ? "bg-sky-600 text-white"
                        : "bg-slate-100 text-slate-400"
                      }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mt-1 h-10 w-0.5 ${isCompleted ? "bg-sky-600" : "bg-slate-200"
                        }`}
                    />
                  )}
                </div>
                <div className="pt-1">
                  <p
                    className={`text-sm font-medium ${isActive ? "text-sky-600" : "text-slate-500"
                      }`}
                  >
                    Step {index + 1}
                  </p>
                  <p
                    className={`text-xs ${isActive ? "font-medium text-slate-800" : "text-slate-400"
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

      {/* Step Content */}
      <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
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
                  onChange={(e) => setProfileImage(e.target.files?.[0] ?? null)}
                />
              </label>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">
                  {profileImage ? profileImage.name : "Upload photo"}
                </span>
                <span className="text-xs text-slate-400">
                  Accepted formats: JPEG, PNG (max 10MB)
                </span>
                {profileImage && (
                  <button
                    type="button"
                    onClick={() => setProfileImage(null)}
                    className="mt-1 text-left text-xs text-red-500 hover:underline"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="First Name *"
                value={personal.firstName}
                onChange={(e) => updatePersonal("firstName", e.target.value)}
                placeholder="e.g. Ada"
              />
              <InputField
                label="Last Name *"
                value={personal.lastName}
                onChange={(e) => updatePersonal("lastName", e.target.value)}
                placeholder="e.g. Okafor"
              />
              <InputField
                label="Personal Email *"
                type="email"
                value={personal.personalEmail}
                onChange={(e) =>
                  updatePersonal("personalEmail", e.target.value)
                }
                placeholder="e.g. ada.okafor@example.com"
              />
              <PhoneField
                label="Phone Number"
                value={personal.phoneNumber}
                onChange={(v) => updatePersonal("phoneNumber", v)}
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
                onChange={(e) => updatePersonal("dateOfBirth", e.target.value)}
              />
              <InputField
                label="Nationality"
                value={personal.nationality}
                onChange={(e) => updatePersonal("nationality", e.target.value)}
                placeholder="e.g. Nigerian"
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
              placeholder="e.g. 12 Marina Road, Lagos"
            />

            {/* Next of Kin */}
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
                  placeholder="e.g. Chidi"
                />
                <InputField
                  label="Last Name"
                  value={personal.nextOfKinLastName}
                  onChange={(e) =>
                    updatePersonal("nextOfKinLastName", e.target.value)
                  }
                  placeholder="e.g. Okafor"
                />
                <PhoneField
                  label="Contact Phone"
                  value={personal.nextOfKinContact}
                  onChange={(v) => updatePersonal("nextOfKinContact", v)}
                />
                <InputField
                  label="Address"
                  value={personal.nextOfKinAddress}
                  onChange={(e) =>
                    updatePersonal("nextOfKinAddress", e.target.value)
                  }
                  placeholder="e.g. 12 Marina Road, Lagos"
                />
              </div>
            </div>

            {/* Bank Information */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">
                Bank Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="Bank Name"
                  value={personal.bankName}
                  onChange={(e) => updatePersonal("bankName", e.target.value)}
                  placeholder="e.g. Access Bank"
                />
                <InputField
                  label="Bank Code"
                  value={personal.bankCode}
                  onChange={(e) => updatePersonal("bankCode", e.target.value)}
                  placeholder="e.g. 044"
                />
                <InputField
                  label="Account Number"
                  value={personal.accountNumber}
                  onChange={(e) =>
                    updatePersonal("accountNumber", e.target.value)
                  }
                  placeholder="e.g. 0123456789"
                />
                <InputField
                  label="Account Name"
                  value={personal.accountName}
                  onChange={(e) =>
                    updatePersonal("accountName", e.target.value)
                  }
                  placeholder="e.g. Ada Okafor"
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
                label="Employee ID *"
                value={professional.employeeID}
                onChange={(e) =>
                  updateProfessional("employeeID", e.target.value)
                }
                placeholder="e.g. EMP-001"
              />
              <TypedSelectField
                label="Employee Status"
                value={professional.employeeStatus}
                onChange={(v) =>
                  updateProfessional(
                    "employeeStatus",
                    v as CreateEmployeeStatus | "",
                  )
                }
                options={EMPLOYEE_STATUS_OPTIONS}
              />
              <TypedSelectField
                label="Employment Type"
                value={professional.employmentType}
                onChange={(v) =>
                  updateProfessional("employmentType", v as EmploymentType | "")
                }
                options={EMPLOYMENT_TYPE_OPTIONS}
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
                label="Position / Job Title"
                value={professional.position}
                onChange={(e) => updateProfessional("position", e.target.value)}
                placeholder="e.g. Software Engineer"
              />
              <InputField
                label="Date Joined"
                type="date"
                value={professional.dateJoined}
                onChange={(e) =>
                  updateProfessional("dateJoined", e.target.value)
                }
              />

              {/* Department selection */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-sm text-slate-600">Department</label>
                </div>
                {loadingDepartments ? (
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-400">
                    <Loader2 size={16} className="animate-spin text-sky-600" />
                    <span>Loading departments...</span>
                  </div>
                ) : (
                  <select
                    value={professional.department}
                    onChange={(e) =>
                      updateProfessional("department", e.target.value)
                    }
                    className={selectClassName}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <InputField
                label="Earnings (monthly salary)"
                type="number"
                value={professional.earnings}
                onChange={(e) => updateProfessional("earnings", e.target.value)}
                placeholder="e.g. 500000"
              />

              <InputField
                label="Tax ID"
                value={professional.taxId}
                onChange={(e) => updateProfessional("taxId", e.target.value)}
                placeholder="e.g. TAX-012345"
              />
              <InputField
                label="Pension ID"
                value={professional.pensionId}
                onChange={(e) =>
                  updateProfessional("pensionId", e.target.value)
                }
                placeholder="e.g. PEN-012345"
              />
            </div>

            {/* Guarantor Information */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-4 text-sm font-semibold text-slate-700">
                Guarantor Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="First Name"
                  value={professional.guarantorFirstName}
                  onChange={(e) =>
                    updateProfessional("guarantorFirstName", e.target.value)
                  }
                  placeholder="e.g. Emeka"
                />
                <InputField
                  label="Last Name"
                  value={professional.guarantorLastName}
                  onChange={(e) =>
                    updateProfessional("guarantorLastName", e.target.value)
                  }
                  placeholder="e.g. Okafor"
                />
                <InputField
                  label="Relationship"
                  value={professional.guarantorRelationship}
                  onChange={(e) =>
                    updateProfessional("guarantorRelationship", e.target.value)
                  }
                  placeholder="e.g. Brother"
                />
                <PhoneField
                  label="Phone Number"
                  value={professional.guarantorPhone}
                  onChange={(v) => updateProfessional("guarantorPhone", v)}
                />
              </div>
              <div className="mt-4">
                <InputField
                  label="Guarantor Address"
                  value={professional.guarantorAddress}
                  onChange={(e) =>
                    updateProfessional("guarantorAddress", e.target.value)
                  }
                  placeholder="e.g. 14 Marina Road, Lagos"
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
              label="Primary Document Type *"
              value={documentType}
              onChange={(v) => setDocumentType(v as DocumentType | "")}
              options={DOCUMENT_TYPE_OPTIONS}
            />

            {/* Appointment Letter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Upload Appointment Letter (Optional)
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center transition hover:border-sky-300">
                <div className="mb-2 text-2xl text-slate-300">⬆</div>
                <p className="text-xs font-medium text-slate-600">
                  {appointmentLetter
                    ? appointmentLetter.name
                    : "Click to select appointment letter"}
                </p>
                <p className="mt-1 max-w-xs text-xs text-slate-400">
                  Accepted formats: PDF, PNG, JPEG (max 10MB)
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
              {appointmentLetter && (
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Selected: {appointmentLetter.name}</span>
                  <button
                    type="button"
                    onClick={() => setAppointmentLetter(null)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Additional Documents */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Additional Documents ({additionalDocuments.length}/
                  {MAX_ADDITIONAL_DOCUMENTS})
                </label>
                <label
                  className={`cursor-pointer text-sm font-medium ${additionalDocuments.length >= MAX_ADDITIONAL_DOCUMENTS
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
                  No additional documents added (max 9 files)
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
                          updateAdditionalDocumentType(index, e.target.value)
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

        {/* Error Banner */}
        {submitError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          {!isPersonal && (
            <button
              type="button"
              onClick={goBack}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Back
            </button>
          )}

          {!isDocuments ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-lg bg-sky-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Employee"
              )}
            </button>
          )}
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
        className={`${inputClassName}${type === "number"
            ? " [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0"
            : ""
          }`}
      />
    </div>
  );
}

function splitPhone(value: string): { countryCode: string; local: string } {
  const match = COUNTRY_CODES.find((c) => value.startsWith(c.code));
  if (match) {
    return { countryCode: match.code, local: value.slice(match.code.length) };
  }
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
    if (!local) {
      onChange("");
    } else {
      onChange(`${newCode}${local}`);
    }
  };

  const updateLocal = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, "");
    if (!digits) {
      onChange("");
    } else {
      onChange(`${countryCode}${digits}`);
    }
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
