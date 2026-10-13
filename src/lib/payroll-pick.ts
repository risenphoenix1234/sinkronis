// src/lib/payroll-pick.ts
export type Rec = Record<string, unknown>;

export function pickText(obj: Rec | null | undefined, keys: string[]): string | null {
  if (!obj) return null;
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
  return null;
}

export function pickNum(obj: Rec | null | undefined, keys: string[]): number | null {
  if (!obj) return null;
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  }
  return null;
}

export const initialsOf = (name: string) => {
  const parts = name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const COLORS = ["#F79009", "#344054", "#2E90FA", "#6941C6", "#D92D20", "#12B76A"];

export const colorFor = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
};

export const isRemittedStatus = (status: string | null) => !!status && /remitted|paid|settled|complete/i.test(status);

export const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const monthLabel = (value: string) => {
  const [y, m] = value.split("-");
  const dt = new Date(Number(y), Number(m) - 1, 1);
  return `${dt.toLocaleString("en-GB", { month: "long" })} ${y}`;
};