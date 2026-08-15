// app/tenant-admin/my-plan/module-addons/page.tsx
"use client";

import { useState } from "react";
import { FiUsers, FiDollarSign, FiBookOpen } from "react-icons/fi";
import {
  moduleCatalog,
  initialActiveModuleIds,
  naira,
  ModuleCatalogId,
} from "@/lib/plan-data";
import AddPlanConfirmModal from "@/components/modals/AddPlanConfirmModal";

const moduleIcons = {
  hris: FiUsers,
  payroll: FiDollarSign,
  accounting: FiBookOpen,
} as const;

const iconStyles: Record<string, string> = {
  hris: "bg-emerald-50 text-emerald-600",
  payroll: "bg-sky-50 text-sky-600",
  accounting: "bg-amber-50 text-amber-600",
};

export default function ModuleAddonsPage() {
  const [activeIds, setActiveIds] = useState<ModuleCatalogId[]>(initialActiveModuleIds);
  const [pendingModuleId, setPendingModuleId] = useState<ModuleCatalogId | null>(null);

  const individualModules = moduleCatalog.filter((m) => !m.isBundle);
  const currentModule = moduleCatalog.find((m) => m.id === "hris")!;
  const pendingModule = moduleCatalog.find((m) => m.id === pendingModuleId) ?? null;

  const handleToggleOn = (id: ModuleCatalogId) => {
    setPendingModuleId(id);
  };

  const handleConfirmAdd = () => {
    if (!pendingModuleId) return;
    setActiveIds((prev) => (prev.includes(pendingModuleId) ? prev : [...prev, pendingModuleId]));
    setPendingModuleId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
        <span>⚠</span>
        <p>
          Your current plan is <span className="font-medium">HRIS</span>. Add individual modules
          to expand access, or switch to <span className="font-medium">All-in-One</span> for the
          best value.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {individualModules.map((m) => {
            const isHris = m.id === "hris";
            const active = isHris || activeIds.includes(m.id);
            const Icon = moduleIcons[m.id as keyof typeof moduleIcons];
            const priceLabel = m.addonPriceLabel ?? `${naira(m.price)}/month`;

            return (
              <div key={m.id} className="flex items-start justify-between gap-4 p-5">
                <div className="flex flex-1 items-start gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${iconStyles[m.id]}`}
                  >
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                      {isHris && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Current Plan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{m.subtitle}</p>
                    <p className="mt-1 text-sm text-slate-500">{m.shortDescription}</p>
                    {!isHris && <p className="mt-2 text-xs text-slate-400">{priceLabel}</p>}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  {isHris ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-400">
                      Plan included
                    </span>
                  ) : (
                    <>
                      <span className="text-xs font-medium text-slate-500">
                        {active ? "On" : "Off"}
                      </span>
                      <button
                        onClick={() => (active ? undefined : handleToggleOn(m.id))}
                        disabled={active}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          active ? "bg-sky-600" : "bg-slate-200"
                        } ${active ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            active ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddPlanConfirmModal
        open={pendingModule !== null}
        currentPlanLabel={`${currentModule.name} · ${naira(currentModule.price)}/mo`}
        newPlanLabel={pendingModule ? `${pendingModule.name} · ${naira(pendingModule.price)}/mo` : ""}
        onCancel={() => setPendingModuleId(null)}
        onConfirm={handleConfirmAdd}
      />
    </div>
  );
}