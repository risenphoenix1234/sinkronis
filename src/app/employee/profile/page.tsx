// app/employee/profile/page.tsx
"use client";

import ProfileHeader from "@/components/employee/profile/ProfileHeader";
import PersonalDetails from "@/components/employee/profile/PersonalDetails";
import WorkDetails from "@/components/employee/profile/WorkDetails";
import NextOfKin from "@/components/employee/profile/NextOfKin";
import Tabs from "@/components/employee/profile/Tabs";
import Button from "@/components/ui/Button";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { AlertCircle, RefreshCw, UserX } from "lucide-react";

export default function ProfilePage() {
  const {
    profile,
    isLoading,
    error,
    errorCode,
    updateProfile,
    refetch,
  } = useEmployeeProfile();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="animate-pulse space-y-2">
            <div className="h-8 w-48 rounded bg-slate-200" />
            <div className="h-4 w-72 rounded bg-slate-200" />
          </div>
          <div className="h-44 rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="h-64 rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse" />
            <div className="h-64 rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    const isNotLinked = errorCode === "NOT_LINKED";

    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-8">
        <div className="mx-auto max-w-2xl mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            {isNotLinked ? (
              <UserX className="h-7 w-7 text-amber-600" />
            ) : (
              <AlertCircle className="h-7 w-7 text-red-600" />
            )}
          </div>

          <h2 className="text-xl font-semibold text-slate-900">
            {isNotLinked
              ? "No Linked Employee Profile"
              : "Unable to Load Profile"}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            {isNotLinked
              ? "The currently authenticated user account is an Administrator/Owner and is not linked to an employee record in this tenant. Employee Self-Service profiles are created when employees are invited through HRIS."
              : error ||
                "Something went wrong while loading the employee profile."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Request
            </Button>
           
          </div>
        </div>
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

        <NextOfKin
          data={
            profile.emergencyContact || {
              id: null,
              name: "—",
              relationship: "—",
              phoneNumber: "—",
              address: "—",
            }
          }
        />

        <Tabs
          documents={profile.documents || []}
          bankDetails={
            profile.bankDetails || {
              accountName: "—",
              accountNumberMasked: "—",
              last4: "—",
              bank: { code: "—", name: "—" },
              accountType: "—",
              pendingUpdateRequest: null,
            }
          }
          onBankRequestSubmitted={refetch}
        />
      </div>
    </main>
  );
}
