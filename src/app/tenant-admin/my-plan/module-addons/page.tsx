// app/tenant-admin/my-plan/module-addons/page.tsx
"use client";

import { useState } from "react";
import { modules as initialModules, naira } from "@/lib/plan-data";

export default function ModuleAddonsPage() {
  const [moduleList, setModuleList] = useState(initialModules);

  const toggleModule = (key: string) => {
    setModuleList((prev) =>
      prev.map((m) => (m.key === key && !m.includedInPlan ? { ...m, active: !m.active } : m))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
        <span>⚠</span>
        <p>
          Modules included in your <span className="font-medium">Business</span> plan are always
          active. Add-on modules are billed separately each month.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {moduleList.map((m) => (
            <div key={m.key} className="flex items-start justify-between gap-4 p-5">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                  {m.includedInPlan && (
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-600">
                      Included in plan
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500">{m.description}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {m.active
                    ? "Active — accessible to all users with the " + m.name + " permission."
                    : "Inactive — unable to give your team access to this module."}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                {!m.includedInPlan && (
                  <p className="text-sm font-medium text-slate-700">
                    {naira(m.monthlyPrice)}
                    <span className="text-xs text-slate-400"> /mo</span>
                  </p>
                )}
                {m.includedInPlan ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-400">
                    Plan included
                  </span>
                ) : (
                  <button
                    onClick={() => toggleModule(m.key)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      m.active ? "bg-sky-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        m.active ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}