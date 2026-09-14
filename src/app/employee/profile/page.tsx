// app/employee/profile/page.tsx
"use client";

import ProfileHeader from "@/components/employee/profile/ProfileHeader";
import PersonalDetails from "@/components/employee/profile/PersonalDetails";
import WorkDetails from "@/components/employee/profile/WorkDetails";
import NextOfKin from "@/components/employee/profile/NextOfKin";
import Tabs from "@/components/employee/profile/Tabs";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";

export default function ProfilePage() {
  const { profile, isLoading, error, updateProfile, refetch } =
    useEmployeeProfile();

  if (isLoading) {
    return <main className="p-6 text-sm text-slate-500">Loading profile…</main>;
  }

  if (error || !profile) {
    return (
      <main className="p-6 text-sm text-red-600">
        {error ?? "Unable to load profile."}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 md:p-6">
      <div className="mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage your personal information
          </p>
        </div>
        {/* PATCH /photo returns {} with no URL, so we refetch the whole profile
            to pick up the server-side image URL once the upload succeeds. */}
        <ProfileHeader data={profile.header} onPhotoUploaded={refetch} />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <PersonalDetails
            data={profile.personalDetails}
            onSave={(updated) => updateProfile({ personalDetails: updated })}
          />
          <WorkDetails data={profile.workDetails} />
        </div>
        <NextOfKin data={profile.emergencyContact} />

        <Tabs
          documents={profile.documents}
          bankDetails={profile.bankDetails}
          onBankRequestSubmitted={refetch}
        />{" "}
      </div>
    </main>
  );
}
