// src/components/payroll/overview/PayeeGroupChart.tsx
"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = ["#6941C6", "#2E90FA", "#66C61C", "#F79009", "#EE46BC", "#12B76A"];
const RADIAN = Math.PI / 180;

type Slice = { name: string; value: number; color: string; percent: number };

const text = (v: unknown) => (typeof v === "string" && v.trim() ? v : null);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

function toSlices(items: Record<string, unknown>[]): Slice[] {
  const base = items
    .map((i, idx) => {
      const group = i.group as { name?: unknown; displayColor?: unknown } | null | undefined;
      return {
        name: text(i.name) ?? text(i.groupName) ?? text(i.label) ?? text(group?.name) ?? "Unassigned",
        value: num(i.count) ?? num(i.participantCount) ?? num(i.total) ?? num(i.amount) ?? num(i.value) ?? 0,
        color: text(i.displayColor) ?? text(group?.displayColor) ?? COLORS[idx % COLORS.length],
      };
    })
    .filter((s) => s.value > 0);
  const sum = base.reduce((s, b) => s + b.value, 0);
  return base.map((b) => ({ ...b, percent: sum > 0 ? Math.round((b.value / sum) * 100) : 0 }));
}

function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, payload }: any) {
  const r = innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" fontSize={11} textAnchor="middle" dominantBaseline="central">
      {payload.percent}%
    </text>
  );
}

export default function PayeeGroupChart({ items }: { items: Record<string, unknown>[] }) {
  const slices = toSlices(items);
  if (slices.length === 0) {
    return <p className="py-16 text-center text-sm text-slate-400">No payroll has been run yet.</p>;
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-56 w-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={slices} dataKey="value" innerRadius={55} outerRadius={100} paddingAngle={2} labelLine={false} label={renderLabel}>
              {slices.map((g) => (
                <Cell key={g.name} fill={g.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full space-y-2 text-sm">
        {slices.map((g) => (
          <li key={g.name} className="flex items-center gap-2 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: g.color }} />
            {g.name}
          </li>
        ))}
      </ul>
    </div>
  );
}