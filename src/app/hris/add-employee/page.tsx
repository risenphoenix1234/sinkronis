import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";

// src/app/hris/add-employee/page.tsx
export default function HRISAddEmployeePage() {
  return (
    <section className="space-y-3">
      <section className="bg-white min-h-screen p-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-10">
          Add New Employee
        </h1>

        <div className="flex gap-12">
          {/* Stepper */}
          <aside className="w-56">
            <div className="relative flex flex-col items-center">
              <div className="absolute top-8 h-[220px] w-px bg-gray-200" />

              <div className="z-10 flex flex-col items-center mb-10">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  👤
                </div>
                <span className="mt-3 text-sm font-medium">
                  Personal Information
                </span>
              </div>

              <div className="z-10 flex flex-col items-center mb-10">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
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
              <p className="text-xs text-gray-500">Step 1/3</p>
              <h2 className="font-semibold">Personal Information</h2>
            </div>

            {/* Upload */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                📷
              </div>
              <button className="text-sm text-gray-400">Upload photo</button>
            </div>

            {/* Personal Information */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  name="firstname"
                  placeholder="Enter first name"
                />

                <FormField
                  label="Last Name"
                  name="lastname"
                  placeholder="Enter last name"
                />

                <FormField
                  label="Phone Number"
                  name="phonenumber"
                  placeholder="Enter phone number"
                />
                <FormField
                  label="Email"
                  name="email"
                  placeholder="Enter email address"
                />

                <SelectField
                  label="Gender"
                  name="gender"
                  options={["Male", "Female", "Binary", "prefer not to say"]}
                />
                <FormField label="Date of Birth" name="dob" type="date" />

                <SelectField
                  label="Nationality"
                  name="nationality"
                  options={[
                    "Nigeria",
                    "Canada",
                    "Japan",
                    "Brasil",
                    "United kingdom",
                    "USA",
                  ]}
                />
                <SelectField
                  label="Marital Status"
                  name="maritalstatus"
                  options={["Single", "Married", "Divorced", "Complicated"]}
                />
                <FormField
                  label="Address"
                  name="address"
                  placeholder="Enter address"
                />
              </div>
            </div>

            {/* Next of Kin */}
            <h3 className="mt-8 mb-4 font-medium">Next of Kin Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="First Name" name="kinFirstName" />
              <FormField label="Last Name" name="kinLastName" />
              <FormField label="Contact" name="kinContact" />
              <FormField label="Address" name="kinAddress" />
            </div>

            {/* Bank */}
            <h3 className="mt-8 mb-4 font-medium">Bank Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Bank Name"
                name="bankName"
                options={["Chase Bank", "GTBank", "UBA", "Access Bank"]}
              />

              <FormField
                label="Account Number"
                name="accountNumber"
                placeholder="Emter account number"
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
