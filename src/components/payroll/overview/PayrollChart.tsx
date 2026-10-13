// src/components/payroll/overview/PayrollChart.tsx
"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PayrollDashboardTrendPoint } from "@/lib/api/types/payroll.types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthLabel = (period: string) => MONTHS[Number(period.split("-")[1]) - 1] ?? period;
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const millions = (n: number) => `₦${(n / 1_000_000).toFixed(1)}M`;

export default function PayrollChart({ data, currentPeriod }: { data: PayrollDashboardTrendPoint[]; currentPeriod: string }) {
  const rows = data.map((p) => ({ month: monthLabel(p.period), period: p.period, amount: p.gross }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} barSize={28}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#667085", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#667085", fontSize: 12 }} tickFormatter={(v) => millions(Number(v))} />
          <Tooltip formatter={(v) => naira(Number(v))} cursor={{ fill: "#F2F4F7" }} />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {rows.map((d) => (
              <Cell key={d.period} fill={d.period === currentPeriod ? "#F79009" : "#D0D5DD"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}