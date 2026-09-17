"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "personal" | "professional" | "documents";

const steps: { key: Step; label: string }[] = [
  { key: "personal", label: "Personal Information" },
  { key: "professional", label: "Professional Information" },
  { key: "documents", label: "Documents" },
];

export default function AddEmployeeForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("personal");

  const [personal, setPersonal] = useState({
    firstName: "", lastName: "", phoneNumber: "", email: "",
    gender: "", dob: "", nationality: "", maritalStatus: "",
    address: "", nextOfKinFirstName: "", nextOfKinLastName: "",
    nextOfKinEmail: "", nextOfKinContact: "",
  });

  const [professional, setProfessional] = useState({
    employeeID: "", employeeStatus: "", department: "",
    position: "", workMode: "", dateJoined: "", salary: "",
    guarantorLastName: "", guarantorFirstName: "",
    guarantorRelationship: "", guarantorPhone: "", guarantorAddress: "",
  });

  const stepIndex = steps.findIndex((s) => s.key === currentStep);

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

  return (
    <div className="flex gap-8">
      {/* Stepper sidebar */}
      <div className="w-48 shrink-0 space-y-6 pt-2">
        {steps.map((step, i) => (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  i < stepIndex
                    ? "bg-sky-600 text-white"
                    : i === stepIndex
                    ? "bg-sky-600 text-white ring-4 ring-sky-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {i < stepIndex ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`mt-1 h-10 w-0.5 ${i < stepIndex ? "bg-sky-600" : "bg-slate-200"}`} />
              )}
            </div>
            <div className="pt-1">
              <p className={`text-sm font-medium ${i === stepIndex ? "text-sky-600" : "text-slate-500"}`}>
                Step {i + 1}
              </p>
              <p className={`text-xs ${i === stepIndex ? "text-slate-800" : "text-slate-400"}`}>
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Form content */}
      <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6">
        {currentStep === "personal" && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-slate-800">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-slate-600">First Name</label>
                <input value={personal.firstName} onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Last Name</label>
                <input value={personal.lastName} onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Phone Number</label>
                <input value={personal.phoneNumber} onChange={(e) => setPersonal({ ...personal, phoneNumber: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Email</label>
                <input type="email" value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Gender</label>
                <select value={personal.gender} onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400">
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Date of Birth</label>
                <input type="date" value={personal.dob} onChange={(e) => setPersonal({ ...personal, dob: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Nationality</label>
                <input value={personal.nationality} onChange={(e) => setPersonal({ ...personal, nationality: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Marital Status</label>
                <select value={personal.maritalStatus} onChange={(e) => setPersonal({ ...personal, maritalStatus: e.target.value })}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400">
                  <option value="">Select</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Address</label>
              <input value={personal.address} onChange={(e) => setPersonal({ ...personal, address: e.target.value })}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
            </div>

            <h3 className="pt-2 text-sm font-semibold text-slate-700">Next of Kin Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-slate-600">First Name</label>
                <input value={personal.nextOfKinFirstName} onChange={(e) => setPersonal({ ...personal, nextOfKinFirstName: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Last Name</label>
                <input value={personal.nextOfKinLastName} onChange={(e) => setPersonal({ ...personal, nextOfKinLastName: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Email</label>
                <input type="email" value={personal.nextOfKinEmail} onChange={(e) => setPersonal({ ...personal, nextOfKinEmail: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Contact</label>
                <input value={personal.nextOfKinContact} onChange={(e) => setPersonal({ ...personal, nextOfKinContact: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
            </div>
          </div>
        )}

        {currentStep === "professional" && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-slate-800">Professional Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-slate-600">Employee ID</label>
                <input value={professional.employeeID} onChange={(e) => setProfessional({ ...professional, employeeID: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Employee Status</label>
                <select value={professional.employeeStatus} onChange={(e) => setProfessional({ ...professional, employeeStatus: e.target.value })}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400">
                  <option value="">Select employee status</option>
                  <option>Confirmed</option>
                  <option>Probation</option>
                  <option>Exited</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Department</label>
                <select value={professional.department} onChange={(e) => setProfessional({ ...professional, department: e.target.value })}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400">
                  <option value="">Select department</option>
                  <option>HR Department</option>
                  <option>IT Department</option>
                  <option>Finance Department</option>
                  <option>Marketing Department</option>
                  <option>Service Department</option>
                  <option>Specialist Department</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Position</label>
                <input value={professional.position} onChange={(e) => setProfessional({ ...professional, position: e.target.value })}
                  placeholder="Select position"
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Work Mode</label>
                <select value={professional.workMode} onChange={(e) => setProfessional({ ...professional, workMode: e.target.value })}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400">
                  <option value="">Select</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>On-site</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Date Joined</label>
                <input type="date" value={professional.dateJoined} onChange={(e) => setProfessional({ ...professional, dateJoined: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Earnings</label>
              <input value={professional.salary} onChange={(e) => setProfessional({ ...professional, salary: e.target.value })}
                placeholder="Type here"
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
            </div>

            <h3 className="pt-2 text-sm font-semibold text-slate-700">Guarantor Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-slate-600">Last Name</label>
                <input value={professional.guarantorLastName} onChange={(e) => setProfessional({ ...professional, guarantorLastName: e.target.value })}
                  placeholder="Enter"
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">First Name</label>
                <input value={professional.guarantorFirstName} onChange={(e) => setProfessional({ ...professional, guarantorFirstName: e.target.value })}
                  placeholder="Enter"
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Relationship</label>
                <input value={professional.guarantorRelationship} onChange={(e) => setProfessional({ ...professional, guarantorRelationship: e.target.value })}
                  placeholder="Enter"
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Phone Number</label>
                <input value={professional.guarantorPhone} onChange={(e) => setProfessional({ ...professional, guarantorPhone: e.target.value })}
                  placeholder="Enter phone"
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Address</label>
              <input value={professional.guarantorAddress} onChange={(e) => setProfessional({ ...professional, guarantorAddress: e.target.value })}
                placeholder="Enter address"
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400" />
            </div>
          </div>
        )}

        {currentStep === "documents" && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-slate-800">Documents</h2>

            {[
              { label: "Upload appointment letter", sub: "Upload the document in the field (accepted formats: PDF, Word, PNG, JPEG, max 5MB)" },
              { label: "Upload salary slip", sub: "Upload the document in the field (accepted formats: PDF, Word, PNG, JPEG, max 5MB)" },
            ].map((doc) => (
              <div key={doc.label}>
                <label className="mb-1 block text-sm font-medium text-slate-700">{doc.label}</label>
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center">
                  <div className="mb-2 text-2xl text-slate-300">⬆</div>
                  <p className="text-xs font-medium text-slate-500">Upload file</p>
                  <p className="mt-1 text-xs text-slate-400 max-w-xs">{doc.sub}</p>
                </div>
              </div>
            ))}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Other Documents</label>
              <select className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400">
                <option value="">Label Document</option>
                <option>ID Card</option>
                <option>Certificate</option>
                <option>Contract</option>
              </select>
              <div className="mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-center">
                <div className="mb-2 text-2xl text-slate-300">⬆</div>
                <p className="text-xs font-medium text-slate-500">Upload file</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer buttons */}
        <div className="mt-8 flex justify-end gap-3">
          {currentStep !== "personal" && (
            <button onClick={goBack}
              className="rounded-md border border-slate-200 px-5 py-2 text-sm text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
          )}
          {currentStep !== "documents" ? (
            <button onClick={goNext}
              className="rounded-md bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700">
              Next
            </button>
          ) : (
            <button onClick={handleSubmit}
              className="rounded-md bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700">
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}