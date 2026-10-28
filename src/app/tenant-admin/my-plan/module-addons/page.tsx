"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiUsers, FiDollarSign, FiBookOpen, FiArrowRight } from "react-icons/fi";
import { getMyPlanActiveModules } from "@/lib/api/admin";
import { MyPlanActiveModuleDetail } from "@/lib/api/types/admin.types";
import Loader from "@/components/ui/Loader";

const moduleIcons: Record<string, typeof FiUsers> = {
  HRIS: FiUsers,
  PAYROLL: FiDollarSign,
  ACCOUNTING: FiBookOpen,
};

function naira(n: number) {
  return `₦${n.toLocaleString()}`;
}

export default function ModuleAddonsPage() {
  const [modules, setModules] = useState<MyPlanActiveModuleDetail[]>([]);
  const [currentPlanName, setCurrentPlanName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getMyPlanActiveModules();
        setModules(res.data.modules);
        setCurrentPlanName(res.data.currentPlan.name);
      } catch (err) {
        setError("Failed to load module details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader variant="page" label="Loading modules" />;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
        <span>⚠</span>
        <p>
          Modules come bundled with your plan — they can&apos;t be toggled individually. Your
          current plan is <span className="font-medium">{currentPlanName}</span>. To change which
          modules you have access to, switch plans instead.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {modules.map((m) => {
            const Icon = moduleIcons[m.code] ?? FiUsers;
            return (
              <div key={m.code} className="flex items-start justify-between gap-4 p-5">
                <div className="flex flex-1 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                      {m.active && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{m.description}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      Standalone price: {naira(m.standalonePlanPrice)}/month
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Link
        href="/tenant-admin/my-plan/plans-upgrade"
        className="flex items-center justify-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
      >
        Manage Your Plan <FiArrowRight size={14} />
      </Link>
    </div>
  );
}