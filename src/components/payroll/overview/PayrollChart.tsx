"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";
import { ChevronDown } from "lucide-react";

const payrollData = [
  { month: "Jan", amount: 420000 },
  { month: "Feb", amount: 470000 },
  { month: "Mar", amount: 510000 },
  { month: "Apr", amount: 650000 },
  { month: "May", amount: 480000 },
  { month: "Jun", amount: 550000 },
  { month: "Jul", amount: 460000 },
  { month: "Oct", amount: 650000 },
  { month: "Sept", amount: 480000 },
  { month: "Nov", amount: 550000 },
  { month: "Dec", amount: 460000 },
  { month: "Aug", amount: 460000 },
  { month: "Jan", amount: 650000 },
  { month: "Sept", amount: 480000 },
  { month: "Nov", amount: 550000 },
  { month: "Dec", amount: 460000 },
];

export default function PayrollChart() {
  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#667085]">Payroll Summary</p>

          <h2 className="mt-2 text-4xl font-bold text-[#101828]">₦650,000</h2>
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-[#EAECF0] bg-white px-4 py-2 text-sm font-medium text-[#344054] hover:bg-gray-50">
          Monthly
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Chart */}

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={payrollData}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#98A2B3", fontSize: 12 }}
            />

            <Tooltip
              cursor={{ fill: "#F2F4F7" }}
              formatter={(value: number) => `₦${value.toLocaleString()}`}
            />

            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {payrollData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.month === "Apr" ? "#F79009" : "#D0D5DD"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
