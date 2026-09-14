// components/employee/profile/NextOfKin.tsx
"use client";

import { EmergencyContactData } from "@/lib/api/employee";
import ProfileCard from "./ProfileCard";

export default function NextOfKin({ data }: { data: EmergencyContactData }) {
  return (
    <ProfileCard title="Next of Kin">
      <div className="grid gap-6 md:grid-cols-4">
        <div>
          <p className="text-xs text-gray-400">Name</p>
          <p className="mt-2 font-medium">{data.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Relationship</p>
          <p className="mt-2 font-medium">{data.relationship}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Phone</p>
          <p className="mt-2 font-medium">{data.phoneNumber}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Address</p>
          <p className="mt-2 font-medium">{data.address}</p>
        </div>
      </div>
    </ProfileCard>
  );
}
