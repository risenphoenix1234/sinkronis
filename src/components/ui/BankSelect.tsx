// src/components/ui/BankSelect.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useBanks } from "@/hooks/useBanks";

interface BankSelectProps {
  code: string;
  name?: string;
  onChange: (bank: { code: string; name: string }) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

export default function BankSelect({
  code,
  name = "",
  onChange,
  className,
  disabled,
  placeholder = "Select bank",
}: BankSelectProps) {
  const { banks, loading, error, reload } = useBanks();

  const matched = useMemo(() => {
    if (code || banks.length === 0) return null;
    const target = normalise(name);
    if (!target) return null;
    const exact = banks.find((bank) => normalise(bank.name) === target);
    if (exact) return exact;
    const partial = banks.filter((bank) => {
      const candidate = normalise(bank.name);
      return candidate.startsWith(target) || target.startsWith(candidate);
    });
    return partial.length === 1 ? partial[0] : null;
  }, [code, name, banks]);

  useEffect(() => {
    if (matched) onChange({ code: matched.code, name: matched.name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  const selectedCode = code || matched?.code || "";

  if (error) {
    return (
      <div className="space-y-1">
        <select disabled className={className} value="">
          <option value="">Bank list unavailable</option>
        </select>
        <p className="text-[13px] text-red-500">
          {error}{" "}
          <button
            type="button"
            onClick={reload}
            className="font-medium underline"
          >
            Retry
          </button>
        </p>
      </div>
    );
  }

  return (
    <select
      className={className}
      disabled={disabled || loading}
      value={selectedCode}
      onChange={(e) => {
        const bank = banks.find((item) => item.code === e.target.value);
        onChange(
          bank ? { code: bank.code, name: bank.name } : { code: "", name: "" },
        );
      }}
    >
      <option value="">{loading ? "Loading banks..." : placeholder}</option>
      {banks.map((bank, index) => (
        <option key={`${bank.code}-${index}`} value={bank.code}>
          {bank.name}
        </option>
      ))}
    </select>
  );
}