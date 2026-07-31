"use client";

import { profile } from "@/data/employee/profile";
import ProfileCard from "./ProfileCard";

export default function NextOfKin() {
  return (
    <ProfileCard title="Next of Kin">
      <div className="grid gap-6 md:grid-cols-4">
        <div>
          <p className="text-xs text-gray-400">Name</p>

          <p className="mt-2 font-medium">{profile.nextOfKin.name}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Relationship</p>

          <p className="mt-2 font-medium">{profile.nextOfKin.relationship}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Phone</p>

          <p className="mt-2 font-medium">{profile.nextOfKin.phone}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Address</p>

          <p className="mt-2 font-medium">{profile.nextOfKin.address}</p>
        </div>
      </div>
    </ProfileCard>
  );
}
