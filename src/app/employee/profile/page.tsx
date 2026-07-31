"use client";

import ProfileHeader from "@/components/employee/profile/ProfileHeader";
import PersonalDetails from "@/components/employee/profile/PersonalDetails";
import WorkDetails from "@/components/employee/profile/WorkDetails";
import NextOfKin from "@/components/employee/profile/NextOfKin";
import Tabs from "@/components/employee/profile/Tabs";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-50 md:p-6">
      <div className="mx-auto space-y-6">
        {/* Page Heading */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage your personal information
          </p>
        </div>

        {/* Profile Header */}
        <ProfileHeader />

        {/* Personal + Work Details */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <PersonalDetails />
          <WorkDetails />
        </div>

        {/* Next of Kin */}
        <NextOfKin />

        {/* Documents & Bank Details */}
        <Tabs />
      </div>
    </main>
  );
}
