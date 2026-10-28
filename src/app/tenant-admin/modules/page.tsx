// src/app/tenant-admin/modules/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, BookOpen, DollarSign, ArrowRight, Zap } from "lucide-react";
import { getAdminModules } from "@/lib/api/admin";
import { AdminModuleCard, ModuleKey } from "@/lib/api/types/admin.types";
import Loader from "@/components/ui/Loader";

const iconMap: Record<ModuleKey, typeof Users> = {
  hris: Users,
  accounting: BookOpen,
  payroll: DollarSign,
};

const iconStyles: Record<ModuleKey, string> = {
  hris: "bg-emerald-50 text-emerald-600",
  accounting: "bg-sky-50 text-sky-600",
  payroll: "bg-slate-100 text-slate-400",
};

function ModuleCard({ mod }: { mod: AdminModuleCard }) {
  const Icon = iconMap[mod.key] ?? Users;
  const isActive = mod.status === "ACTIVE";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconStyles[mod.key] ?? "bg-slate-100 text-slate-400"}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">{mod.name}</h2>
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`}
                />
                {isActive ? "Active" : mod.status === "COMING_SOON" ? "Coming Soon" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {isActive && (
            <span className="text-sm text-slate-500">{mod.activeUsers} active users</span>
          )}
          {mod.canLaunch && mod.action.canOpen ? (
            <Link
              href={mod.openPath}
              className="flex items-center gap-1.5 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              {mod.action.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              disabled
              className="flex cursor-not-allowed items-center gap-1.5 rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400"
            >
              <Zap className="h-4 w-4" />
              Coming Soon
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">{mod.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {mod.tabs.map((tab) => (
          <span
            key={tab}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
        {isActive ? (
          <>
            Module is <span className="font-medium text-slate-700">Active</span> and running normally.
          </>
        ) : mod.status === "COMING_SOON" ? (
          "This module is not yet available on your plan."
        ) : (
          "This module is currently inactive."
        )}
      </div>
    </div>
  );
}

export default function TenantModulesPage() {
  const [modules, setModules] = useState<AdminModuleCard[]>([]);
  const [analytics, setAnalytics] = useState({
    totalModules: 0,
    activeModules: 0,
    comingSoonModules: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminModules();
        setModules(res.modules);
        setAnalytics({
          totalModules: res.analytics.totalModules,
          activeModules: res.analytics.activeModules,
          comingSoonModules: res.analytics.comingSoonModules,
        });
      } catch (err) {
        setError("Failed to load modules.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Modules</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage and launch your active Sinkronis modules.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-sky-600">{analytics.totalModules}</p>
          <p className="mt-1 text-sm text-slate-500">Total Modules</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-emerald-600">{analytics.activeModules}</p>
          <p className="mt-1 text-sm text-slate-500">Active Modules</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-amber-500">{analytics.comingSoonModules}</p>
          <p className="mt-1 text-sm text-slate-500">Coming Soon</p>
        </div>
      </div>

      {loading && (
        <Loader variant="section" label="Loading modules" />
      )}

      {!loading && error && (
        <p className="py-10 text-center text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {modules.map((mod) => (
            <ModuleCard key={mod.key} mod={mod} />
          ))}
        </div>
      )}
    </section>
  );
}