// src/app/tenant-admin/modules/page.tsx
"use client";

import Link from "next/link";
import { Users, BookOpen, DollarSign, ArrowRight, Zap } from "lucide-react";
import { tenantModules, TenantModule } from "@/lib/tenant-modules-data";

const iconMap = {
  hris: Users,
  accounting: BookOpen,
  payroll: DollarSign,
};

const iconStyles: Record<TenantModule["icon"], string> = {
  hris: "bg-emerald-50 text-emerald-600",
  accounting: "bg-sky-50 text-sky-600",
  payroll: "bg-slate-100 text-slate-400",
};

function ModuleCard({ mod }: { mod: TenantModule }) {
  const Icon = iconMap[mod.icon];
  const isActive = mod.status === "Active";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconStyles[mod.icon]}`}
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
                {mod.status}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">{mod.subtitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {isActive && mod.activeUsers !== undefined && (
            <span className="text-sm text-slate-500">{mod.activeUsers} active users</span>
          )}
          {isActive ? (
            <Link
              href={mod.href}
              className="flex items-center gap-1.5 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              Open Module
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
        {mod.features.map((feature) => (
          <span
            key={feature}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {feature}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
        {isActive ? (
          <>
            Module is <span className="font-medium text-slate-700">Active</span> and running normally.
          </>
        ) : (
          mod.statusNote
        )}
      </div>
    </div>
  );
}

export default function TenantModulesPage() {
  const totalModules = tenantModules.length;
  const activeModules = tenantModules.filter((m) => m.status === "Active").length;
  const comingSoon = tenantModules.filter((m) => m.status === "Coming Soon").length;

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Modules</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage and launch your active Sinkronis modules.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-sky-600">{totalModules}</p>
          <p className="mt-1 text-sm text-slate-500">Total Modules</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-emerald-600">{activeModules}</p>
          <p className="mt-1 text-sm text-slate-500">Active Modules</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-amber-500">{comingSoon}</p>
          <p className="mt-1 text-sm text-slate-500">Coming Soon</p>
        </div>
      </div>

      {/* Module cards */}
      <div className="space-y-4">
        {tenantModules.map((mod) => (
          <ModuleCard key={mod.id} mod={mod} />
        ))}
      </div>
    </section>
  );
}