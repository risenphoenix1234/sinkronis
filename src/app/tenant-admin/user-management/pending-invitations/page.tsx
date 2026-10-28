// src/app/tenant-admin/user-management/pending-invitations/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getInvitations, resendInvitation } from "@/lib/api/admin";
import { TenantInvitation } from "@/lib/api/types/admin.types";
import Loader from "@/components/ui/Loader";

const moduleBadgeColor: Record<string, string> = {
  HRIS: "bg-emerald-50 text-emerald-700",
  ACCOUNTING: "bg-sky-50 text-sky-700",
  PAYROLL: "bg-violet-50 text-violet-700",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PendingInvitationsPage() {
  const [invitations, setInvitations] = useState<TenantInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const fetchInvitations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInvitations();
      setInvitations(res.data);
    } catch (err) {
      setError("Failed to load invitations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleResend = async (id: string) => {
    setResendingId(id);
    try {
      await resendInvitation(id);
      await fetchInvitations();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to resend invitation.");
    } finally {
      setResendingId(null);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Modules</th>
              <th className="px-4 py-2.5 font-medium">Sent</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400"><Loader variant="inline" label="Loading invitations" /></td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              invitations.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-50">
                  <td className="px-4 py-3 text-slate-800">{inv.email}</td>
                  <td className="px-4 py-3 text-slate-600">{inv.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {inv.modules.map((mod) => (
                        <span
                          key={mod}
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${moduleBadgeColor[mod] ?? "bg-slate-100 text-slate-600"}`}
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(inv.sentAt)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        inv.status === "PENDING" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {inv.status === "PENDING" ? "Pending" : "Expired"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-sm">
                      <button
                        onClick={() => handleResend(inv.id)}
                        disabled={resendingId === inv.id}
                        className="text-sky-600 hover:underline disabled:opacity-60"
                      >
                        {resendingId === inv.id ? "Resending..." : "Resend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && !error && invitations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                  No pending invitations.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}