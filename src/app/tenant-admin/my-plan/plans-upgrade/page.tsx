// app/tenant-admin/my-plan/plans-upgrade/page.tsx
"use client";

import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import {
  naira,
  moduleCatalog,
  initialActiveModuleIds,
  ModuleCatalogId,
} from "@/lib/plan-data";
import AddPlanConfirmModal from "@/components/modals/AddPlanConfirmModal";

export default function PlansUpgradePage() {
  const [activeIds, setActiveIds] = useState<ModuleCatalogId[]>(initialActiveModuleIds);
  const [pendingModuleId, setPendingModuleId] = useState<ModuleCatalogId | null>(null);

  const isAllInOne = activeIds.includes("all-in-one");
  const currentModule = moduleCatalog.find((m) => m.id === "hris")!;
  const pendingModule = moduleCatalog.find((m) => m.id === pendingModuleId) ?? null;

  const isModuleIncluded = (id: ModuleCatalogId) => {
    if (isAllInOne) return true; // the bundle covers HRIS/Payroll/Accounting
    return activeIds.includes(id);
  };

  const handleAddModule = (id: ModuleCatalogId) => {
    setPendingModuleId(id);
  };

  const handleConfirmAdd = () => {
    if (!pendingModuleId) return;
    setActiveIds((prev) => (prev.includes(pendingModuleId) ? prev : [...prev, pendingModuleId]));
    setPendingModuleId(null);
  };

  const handleUpgradeToAllInOne = () => {
    setActiveIds(["all-in-one"]);
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">
        Choose the module or bundle that fits your organisation. You can subscribe to
        individual modules or the full All-in-One suite.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {moduleCatalog.map((mod) => {
          const included = isModuleIncluded(mod.id);
          const isBundle = mod.id === "all-in-one";

          return (
            <div
              key={mod.id}
              className={`relative flex flex-col rounded-xl border bg-white ${
                isBundle
                  ? "border-sky-500 pt-0 shadow-md ring-1 ring-sky-100"
                  : "border-slate-200 p-6"
              }`}
            >
              {isBundle && (
                <div className="rounded-t-xl bg-sky-600 py-2 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-white">
                    Best Value — All-in-One
                  </span>
                </div>
              )}

              <div className={isBundle ? "flex flex-1 flex-col p-6" : "flex flex-1 flex-col"}>
                <h3 className={`text-base font-semibold ${isBundle ? "text-sky-600" : "text-slate-900"}`}>
                  {mod.name}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">{mod.subtitle}</p>

                <div className="mt-4">
                  <span className="text-2xl font-bold text-slate-900">{naira(mod.price)}</span>
                  <span className="text-sm text-slate-400">/month</span>
                </div>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {mod.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <FiCheck size={15} className="mt-0.5 shrink-0 text-sky-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  {isBundle ? (
                    <button
                      onClick={handleUpgradeToAllInOne}
                      disabled={isAllInOne}
                      className={`w-full rounded-md px-4 py-2.5 text-sm font-medium ${
                        isAllInOne
                          ? "cursor-not-allowed border border-slate-200 text-slate-400"
                          : "bg-sky-600 text-white hover:bg-sky-700"
                      }`}
                    >
                      {isAllInOne ? "Current Plan" : "Upgrade to All-in-one"}
                    </button>
                  ) : mod.id === "hris" ? (
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-md border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-400"
                    >
                      Current Plan
                    </button>
                  ) : included ? (
                    <button
                      disabled
                      className="flex w-full items-center justify-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700"
                    >
                      <FiCheck size={15} />
                      Added
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddModule(mod.id)}
                      className="w-full rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
                    >
                      Add Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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