// src/app/dashboard/page.tsx
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { MODULES, CONSTANT_IDS, type ModuleId } from "@/lib/modules";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const raw = searchParams.get("modules")?.split(",").filter(Boolean) as ModuleId[] | undefined;

  const activeIds = Array.from(new Set([...(raw ?? []), ...CONSTANT_IDS]));
  const activeModules = MODULES.filter((m) => activeIds.includes(m.id));

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-6 py-12">
      <div className="mx-auto max-w-[1160px]">
        <div className="mb-10">
          <h1 className="text-[32px] font-bold text-[#1F2937]">Your Dashboard</h1>
          <p className="mt-1 text-[15px] text-[#667085]">
            Active modules for this session
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {activeModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="rounded-2xl border border-[#E5E9F0] bg-white p-8"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${mod.iconBg}`}
                  >
                    <Icon className={`h-6 w-6 ${mod.iconColor}`} strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#1F2937]">{mod.name}</h3>
                    <p className="text-[13px] text-[#98A2B3]">{mod.subtitle}</p>
                  </div>
                </div>

                <p className="mt-5 text-[14px] leading-[22px] text-[#667085]">
                  {mod.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {mod.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 rounded-full border border-[#E5E9F0] px-3 py-1.5 text-[12px] text-[#475467]"
                    >
                      <Check className="h-3 w-3 text-[#2388D0]" strokeWidth={3} />
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => router.push(mod.href)}
                  className="mt-7 flex h-[48px] w-full items-center justify-center rounded-lg bg-[#2388D0] font-semibold text-white transition hover:bg-[#1D78BA]"
                >
                  Open {mod.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}