// // components/employee/profile/PersonalDetails.tsx
// "use client";

// import { Pencil } from "lucide-react";
// import { formatDate } from "@/lib/format";
// import ProfileCard from "./ProfileCard";
// import { PersonalDetailsData } from "@/lib/api/employee";

// export default function PersonalDetails({
//   data,
// }: {
//   data: PersonalDetailsData;
// }) {
//   const details = [
//     { label: "Full Name", value: data.fullName },
//     { label: "Date of Birth", value: formatDate(data.dateOfBirth) },
//     { label: "Gender", value: data.gender },
//     { label: "Personal Email", value: data.personalEmail },
//     { label: "Marital Status", value: data.maritalStatus },
//     { label: "Address", value: data.address },
//     { label: "Nationality", value: data.nationality },
//   ];

//   return (
//     <ProfileCard
//       title="Personal Details"
//       action={
//         <button className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700">
//           <Pencil size={15} />
//           Edit
//         </button>
//       }
//     >
//       <div className="grid gap-6 sm:grid-cols-2">
//         {details.map((item) => (
//           <div key={item.label}>
//             <p className="text-xs font-medium tracking-wide text-gray-400">
//               {item.label}
//             </p>
//             <p className="mt-2 text-sm font-medium text-gray-800">
//               {item.value || "—"}
//             </p>
//           </div>
//         ))}
//       </div>
//     </ProfileCard>
//   );
// }

// components/employee/profile/PersonalDetails.tsx
"use client";

import { useState } from "react";
import { Pencil, X, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import ProfileCard from "./ProfileCard";
import { PersonalDetailsData, updatePersonalDetails } from "@/lib/api/employee";

interface PersonalDetailsProps {
  data: PersonalDetailsData;
  onSave: (updated: PersonalDetailsData) => void;
}

const EDITABLE_KEYS = [
  "phoneNumber",
  "personalEmail",
  "address",
  "maritalStatus",
  "nationality",
] as const satisfies ReadonlyArray<keyof PersonalDetailsData>;

type EditableKey = (typeof EDITABLE_KEYS)[number];

const FIELDS: Array<{
  key: keyof PersonalDetailsData;
  label: string;
  type: "text" | "date" | "email" | "tel";
}> = [
  { key: "fullName", label: "Full Name", type: "text" },
  { key: "dateOfBirth", label: "Date of Birth", type: "date" },
  { key: "gender", label: "Gender", type: "text" },
  { key: "phoneNumber", label: "Phone Number", type: "tel" },
  { key: "personalEmail", label: "Personal Email", type: "email" },
  { key: "maritalStatus", label: "Marital Status", type: "text" },
  { key: "address", label: "Address", type: "text" },
  { key: "nationality", label: "Nationality", type: "text" },
];

function isEditable(key: keyof PersonalDetailsData): key is EditableKey {
  return (EDITABLE_KEYS as readonly string[]).includes(key);
}

export default function PersonalDetails({
  data,
  onSave,
}: PersonalDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Record<EditableKey, string>>(
    pickEditable(data),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pickEditable(source: PersonalDetailsData): Record<EditableKey, string> {
    const result = {} as Record<EditableKey, string>;
    for (const key of EDITABLE_KEYS) {
      result[key] = (source[key] as string) || "";
    }
    return result;
  }

  function startEdit() {
    setForm(pickEditable(data));
    setError(null);
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setError(null);
  }

  function handleChange(key: EditableKey, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    try {
      await updatePersonalDetails(form);
      onSave({ ...data, ...form });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ProfileCard
      title="Personal Details"
      action={
        isEditing ? (
          <button
            onClick={cancelEdit}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <X size={15} />
            Cancel
          </button>
        ) : (
          <button
            onClick={startEdit}
            className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            <Pencil size={15} />
            Edit
          </button>
        )
      }
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const editableNow = isEditing && isEditable(field.key);

          return (
            <div key={field.key}>
              <p className="text-xs font-medium tracking-wide text-gray-400">
                {field.label}
                {!isEditable(field.key) && (
                  <span className="ml-1 text-gray-300">(HR managed)</span>
                )}
              </p>

              {editableNow ? (
                <input
                  type={field.type}
                  value={form[field.key as EditableKey] ?? ""}
                  onChange={(e) =>
                    handleChange(field.key as EditableKey, e.target.value)
                  }
                  className="mt-2 w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-800 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              ) : (
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {field.type === "date"
                    ? formatDate(data[field.key])
                    : data[field.key] || "—"}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {isEditing && (
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={cancelEdit}
            disabled={isSaving}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {isSaving && <Loader2 size={15} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      )}
    </ProfileCard>
  );
}
