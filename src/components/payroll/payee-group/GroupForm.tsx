// src/components/payroll/payee-group/GroupForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BreakdownConfig } from "@/lib/payroll-payee-groups-static";

const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#2183C6]";

const PENSION_RE = /^(.*?)\s*\((\d+(?:\.\d+)?)%\)$/;

function parsePension(value: string) {
  const m = value.match(PENSION_RE);
  return m ? { type: m[1], pct: m[2] } : { type: value, pct: "" };
}

function pensionTypes(options: string[]) {
  return Array.from(new Set(options.map((o) => parsePension(o).type)));
}

type Props = {
  initial: BreakdownConfig;
  heading: string;
  withName?: boolean;
  submitLabel?: string;
  onSubmit: (cfg: BreakdownConfig, name: string) => string | null;
};

export default function GroupForm({ initial, heading, withName = false, submitLabel = "Save", onSubmit }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [items, setItems] = useState(initial.items);
  const [rates, setRates] = useState(initial.rates);
  const [selects, setSelects] = useState(initial.selects);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const total = items.reduce((s, i) => s + (Number(i.percent) || 0), 0);
  const touch = () => {
    setSaved(false);
    setError("");
  };

  const submit = () => {
    if (withName && !name.trim()) {
      setError("Enter a group name.");
      return;
    }
    if (items.some((i) => !i.name.trim() || !i.percent)) {
      setError("Fill in the name and percentage for every salary item, or remove it.");
      return;
    }
    const msg = onSubmit({ ...initial, items, rates, selects }, name.trim());
    if (msg) {
      setError(msg);
      return;
    }
    setSaved(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-900">{heading}</h1>

      <div className="mt-6 max-w-3xl space-y-6">
        {withName && (
          <label className="block">
            <span className="mb-1.5 block text-xs text-slate-500">Group Name</span>
            <input
              className={inputCls}
              placeholder="-input group name-"
              value={name}
              onChange={(e) => {
                touch();
                setName(e.target.value);
              }}
            />
          </label>
        )}

        <section>
          <h2 className="mb-3 text-sm font-medium text-slate-800">Salary Breakdown</h2>
          <div className="space-y-4">
            {items.length === 0 && <p className="text-xs text-slate-500">No salary items yet. Click Add Item to start.</p>}
            {items.map((i) => (
              <div key={i.id} className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  className={inputCls}
                  placeholder="-add new item-"
                  value={i.name}
                  onChange={(e) => {
                    touch();
                    setItems((p) => p.map((x) => (x.id === i.id ? { ...x, name: e.target.value } : x)));
                  }}
                />
                <div className="relative">
                  <input
                    className={`${inputCls} pr-8`}
                    placeholder="0"
                    inputMode="decimal"
                    value={i.percent}
                    onChange={(e) => {
                      touch();
                      setItems((p) => p.map((x) => (x.id === i.id ? { ...x, percent: e.target.value.replace(/[^0-9.]/g, "") } : x)));
                    }}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    touch();
                    setItems((p) => p.filter((x) => x.id !== i.id));
                  }}
                  className="rounded-md px-3 py-2 text-xs text-red-500 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  touch();
                  setItems((p) => [...p, { id: Date.now(), name: "", percent: "" }]);
                }}
                className="rounded-md bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Add Item
              </button>
              {items.length > 0 && <span className="text-xs text-slate-500">Total: {total}%</span>}
            </div>
          </div>
        </section>

        {(rates.length > 0 || selects.length > 0) && (
          <section>
            <h2 className="mb-3 text-sm font-medium text-slate-800">Statutory Settings</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {rates.map((r) => (
                <label key={r.key} className="block">
                  <span className="mb-1.5 block text-xs text-slate-500">{r.label}</span>
                  <div className="relative">
                    <input
                      className={`${inputCls} pr-8`}
                      inputMode="decimal"
                      placeholder="0"
                      value={r.value}
                      onChange={(e) => {
                        touch();
                        setRates((p) => p.map((x) => (x.key === r.key ? { ...x, value: e.target.value.replace(/[^0-9.]/g, "") } : x)));
                      }}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
                  </div>
                </label>
              ))}
              {selects.map((s) => {
                const setValue = (v: string) => {
                  touch();
                  setSelects((p) => p.map((x) => (x.key === s.key ? { ...x, value: v } : x)));
                };
                if (s.key === "pension") {
                  const cur = parsePension(s.value);
                  const types = pensionTypes(s.options);
                  const off = cur.type === "Disabled";
                  return (
                    <label key={s.key} className="block">
                      <span className="mb-1.5 block text-xs text-slate-500">{s.label}</span>
                      <div className="flex gap-2">
                        <select
                          className={inputCls}
                          value={cur.type}
                          onChange={(e) => {
                            const t = e.target.value;
                            if (t === "Disabled") return setValue("Disabled");
                            const fallback = t.toLowerCase().includes("employee") ? "8" : "10";
                            setValue(`${t} (${cur.pct || fallback}%)`);
                          }}
                        >
                          {types.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                        <div className="relative w-28 shrink-0">
                          <input
                            className={`${inputCls} pr-8 disabled:bg-slate-50 disabled:text-slate-400`}
                            inputMode="decimal"
                            placeholder="0"
                            disabled={off}
                            value={cur.pct}
                            onChange={(e) => setValue(`${cur.type} (${e.target.value.replace(/[^0-9.]/g, "")}%)`)}
                          />
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
                        </div>
                      </div>
                    </label>
                  );
                }
                return (
                  <label key={s.key} className="block">
                    <span className="mb-1.5 block text-xs text-slate-500">{s.label}</span>
                    <select className={inputCls} value={s.value} onChange={(e) => setValue(e.target.value)}>
                      {s.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                );
              })}
            </div>
          </section>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && <span className="text-sm text-green-600">Saved</span>}
          <button
            type="button"
            onClick={() => router.push("/payroll/payee-groups")}
            className="rounded-md bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="rounded-md bg-[#2183C6] px-5 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}