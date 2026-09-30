// src/components/ui/StatCard.tsx
"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  subtext?: string;
  valueColor?: string;
  className?: string;
  onClick?: () => void;
}

export default function StatCard({
  label,
  value,
  subtext,
  valueColor = "text-[#2183c6]",
  className,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-lg border border-[#e5e7eb] bg-white px-5 py-4 transition shadow-sm",
        onClick && "cursor-pointer hover:border-[#2183c6]/40",
        className,
      )}
    >
      <p className="text-xs text-[#6b7280]">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold truncate", valueColor)}>
        {value}
      </p>
      {subtext && (
        <p className="mt-0.5 text-[11px] text-[#9ca3af] truncate">{subtext}</p>
      )}
    </div>
  );
}
