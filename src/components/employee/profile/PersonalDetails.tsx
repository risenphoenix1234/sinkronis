"use client";

import { Pencil } from "lucide-react";
import { profile } from "@/data/employee/profile";
import ProfileCard from "./ProfileCard";

export default function PersonalDetails() {
  const details = [
    {
      label: "Full Name",
      value: profile.personal.fullName,
    },
    {
      label: "Date of Birth",
      value: profile.personal.dateOfBirth,
    },
    {
      label: "Gender",
      value: profile.personal.gender,
    },
    {
      label: "Personal Email",
      value: profile.personal.email,
    },
    {
      label: "Marital Status",
      value: profile.personal.maritalStatus,
    },
    {
      label: "Address",
      value: profile.personal.address,
    },
    {
      label: "Nationality",
      value: profile.personal.nationality,
    },
  ];

  return (
    <ProfileCard
      title="Personal Details"
      action={
        <button className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700">
          <Pencil size={15} />
          Edit
        </button>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {details.map((item) => (
          <div key={item.label}>
            <p className="text-xs font-medium tracking-wide text-gray-400">
              {item.label}
            </p>

            <p className="mt-2 text-sm font-medium text-gray-800">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </ProfileCard>
  );
}
