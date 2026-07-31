 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight } from "lucide-react";
import { MODULES, CONSTANT_IDS, type ModuleId, type ModuleDef } from "@/lib/modules";

export default function HomePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ModuleId[]>(CONSTANT_IDS);

  const toggleModule = (mod: ModuleDef) => {
    if (mod.constant) return;
    setSelected((prev) =>
      prev.includes(mod.id) ? prev.filter((id) => id !== mod.id) : [...prev, mod.id]
    );
  };

  const handleContinue = () => {
    router.push(`/dashboard?modules=${selected.join(",")}`);
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-6 py-12">
      <div className="mx-auto max-w-[1160px]">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[32px] font-bold text-[#1F2937]">
            Welcome back, Bravo Admin
          </h1>
          <p className="mt-1 text-[15px] text-[#667085]">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            — Select a module to continue
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            const isSelected = selected.includes(mod.id);
            return (
              <div
                key={mod.id}
                className={`rounded-2xl bg-white p-8 transition ${
                  isSelected
                    ? "border-2 border-[#2388D0] ring-2 ring-[#2388D0]/15"
                    : "border border-[#E5E9F0]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${mod.iconBg}`}
                    >
                      <Icon className={`h-6 w-6 ${mod.iconColor}`} strokeWidth={2} />
                    </span>
                    <div>
                      <h3 className="text-[18px] font-bold text-[#1F2937]">
                        {mod.name}
                      </h3>
                      <p className="text-[13px] text-[#98A2B3]">{mod.subtitle}</p>
                    </div>
                  </div>

                  {!mod.constant && (
                    <button
                      type="button"
                      onClick={() => toggleModule(mod)}
                      aria-pressed={isSelected}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF3FB] text-[#2388D0] transition hover:bg-[#DCEBF9]"
                    >
                      {isSelected ? (
                        <Check className="h-4 w-4" strokeWidth={3} />
                      ) : (
                        <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                      )}
                    </button>
                  )}
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
                  onClick={() =>
                    mod.constant ? router.push(mod.href) : toggleModule(mod)
                  }
                  className={`mt-7 flex h-[48px] w-full items-center justify-center gap-2 rounded-lg font-semibold transition ${
                    mod.constant
                      ? "bg-[#2388D0] text-white hover:bg-[#1D78BA]"
                      : isSelected
                      ? "border-2 border-[#2388D0] bg-[#2388D0] text-white"
                      : "border-2 border-[#2388D0] text-[#2388D0] hover:bg-[#2388D0] hover:text-white"
                  }`}
                >
                  {mod.constant
                    ? `Open ${mod.name}`
                    : isSelected
                    ? "Selected"
                    : `Select ${mod.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Continue CTA */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="text-[14px] text-[#667085]">
            {selected.length} module{selected.length > 1 ? "s" : ""} selected:{" "}
            <span className="font-semibold text-[#1F2937]">
              {selected
                .map((id) => MODULES.find((m) => m.id === id)?.name)
                .join(", ")}
            </span>
          </p>
          <button
            type="button"
            onClick={handleContinue}
            className="flex h-[56px] w-full max-w-[400px] items-center justify-center rounded-lg bg-[#2388D0] px-8 font-semibold text-white transition hover:bg-[#1D78BA]"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}