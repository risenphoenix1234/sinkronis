"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";

const data = [
  {
    name: "Permanent Staff",
    value: 55,
    color: "#6941C6",
  },
  {
    name: "Consultant",
    value: 20,
    color: "#F79009",
  },
  {
    name: "Contract",
    value: 15,
    color: "#2E90FA",
  },
  {
    name: "Temporary",
    value: 10,
    color: "#12B76A",
  },
];

export default function PayeeGroupChart() {
  return (
    <div>
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-[#101828]">Payee Group</p>

          <p className="mt-1 text-sm text-[#667085]">
            Employee category distribution
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-[#EAECF0] px-3 py-2 text-sm font-medium text-[#344054] hover:bg-gray-50">
          Monthly
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Donut */}

      <div className="mx-auto h-56 w-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={90}
              dataKey="value"
              stroke="none"
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>

            {/* Center Label */}

            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[#101828] text-xl font-bold"
            >
              60
            </text>

            <text
              x="50%"
              y="61%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[#667085] text-sm"
            >
              Employees
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}

      <div className="mt-8 space-y-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span className="text-sm text-[#344054]">{item.name}</span>
            </div>

            <span className="text-sm font-semibold text-[#101828]">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
