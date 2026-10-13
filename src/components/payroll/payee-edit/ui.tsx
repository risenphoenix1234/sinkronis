// src/components/payroll/payee-edit/ui.tsx
"use client";

import type { ReactNode } from "react";

export const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#2183C6]";

export const primaryBtn =
  "rounded-md bg-[#2183C6] px-5 py-2 text-sm font-medium text-white hover:opacity-90";

export const ghostBtn =
  "rounded-md bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 mt-6 text-sm font-semibold text-slate-900 first:mt-0">{children}</h3>;
}

export const banks = [
  "Access Bank",
  "First Bank of Nigeria",
  "Guaranty Trust Bank",
  "United Bank for Africa",
  "Zenith Bank",
  "Fidelity Bank",
  "Stanbic IBTC Bank",
  "Sterling Bank",
  "Union Bank",
  "Wema Bank",
  "Kuda Bank",
  "Opay",
  "Palmpay",
];

export const taxStates = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
];

export const payeeGroupOptions = ["Permanent Staff", "Contract (Pensionable)", "Contract (Regular)", "Consultant"];

export function fmtDate(iso: string) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export function fmtLongDate(iso: string) {
  if (!iso) return "-";
  const dt = new Date(iso + "T00:00:00");
  const day = dt.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${day}${suffix} ${dt.toLocaleString("en-GB", { month: "long" })}, ${dt.getFullYear()}`;
}

export const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
