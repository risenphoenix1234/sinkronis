// src/components/ui/SearchableCreatableSelect.tsx
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SearchableCreatableSelectProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  className?: string;
}

export default function SearchableCreatableSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select or type custom...",
  required,
  disabled = false,
  hint,
  className,
}: SearchableCreatableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep query in sync when value changes from outside
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on query
  const filteredOptions = useMemo(() => {
    if (!query) return options;
    const lower = query.toLowerCase().trim();
    return options.filter((opt) => opt.toLowerCase().includes(lower));
  }, [options, query]);

  const exactMatch = useMemo(() => {
    if (!query) return false;
    const lower = query.toLowerCase().trim();
    return options.some((opt) => opt.toLowerCase() === lower);
  }, [options, query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setQuery(newVal);
    onChange(newVal);
    if (!isOpen) setIsOpen(true);
  };

  const handleSelectOption = (option: string) => {
    setQuery(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery("");
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {label && (
        <label className="mb-1 block text-xs font-medium text-[#4b5563]">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required && !query}
          autoComplete="off"
          className={cn(
            "h-10 w-full rounded-md border border-[#e5e7eb] bg-white px-3 pr-16 text-sm outline-none transition",
            "focus:border-[#2183c6] focus:ring-2 focus:ring-[#2183c6]/20",
            disabled && "cursor-not-allowed bg-[#f9fafb] text-[#9ca3af]",
          )}
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[#9ca3af]">
          {query && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded p-0.5 hover:bg-[#f3f4f6] hover:text-[#4b5563]"
              title="Clear"
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (!disabled) {
                setIsOpen((prev) => !prev);
                inputRef.current?.focus();
              }
            }}
            className="rounded p-0.5 hover:bg-[#f3f4f6] hover:text-[#4b5563]"
            tabIndex={-1}
          >
            <ChevronDown
              size={16}
              className={cn("transition-transform", isOpen && "rotate-180")}
            />
          </button>
        </div>
      </div>

      {hint && <p className="mt-1 text-[11px] text-[#6b7280]">{hint}</p>}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-md border border-[#e5e7eb] bg-white py-1 shadow-lg">
          {/* If user typed custom text that doesn't match an option exactly */}
          {query.trim() && !exactMatch && (
            <button
              type="button"
              onClick={() => handleSelectOption(query.trim())}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-[#2183c6] hover:bg-[#f0f9ff] border-b border-[#f3f4f6]"
            >
              <span className="truncate">
                Use custom: <strong className="font-semibold">{query}</strong>
              </span>
              <span className="text-[10px] uppercase font-bold text-[#2183c6] bg-[#e0f2fe] px-1.5 py-0.5 rounded">
                Custom
              </span>
            </button>
          )}

          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
              const isSelected =
                value && opt.toLowerCase() === value.toLowerCase();
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-left text-xs text-[#374151] transition hover:bg-[#f3f4f6]",
                    isSelected && "bg-[#f0f9ff] font-semibold text-[#0284c7]",
                  )}
                >
                  <span className="truncate">{opt}</span>
                  {isSelected && (
                    <Check size={14} className="text-[#0284c7] shrink-0" />
                  )}
                </button>
              );
            })
          ) : !query.trim() ? (
            <div className="px-3 py-2 text-center text-xs text-[#9ca3af]">
              No options available
            </div>
          ) : exactMatch ? null : (
            <div className="px-3 py-2 text-xs text-[#6b7280]">
              Press enter or select "Use custom" above to apply.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Pre-populated Nigerian Commercial & FinTech Banks */
export const NIGERIAN_BANKS = [
  "Access Bank",
  "Access Bank (Diamond)",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Jaiz Bank",
  "Keystone Bank",
  "Kuda Bank",
  "Lotus Bank",
  "Moniepoint MFB",
  "OPay",
  "Optimus Bank",
  "Palmpay",
  "Parallex Bank",
  "Polaris Bank",
  "Premium Trust Bank",
  "Providus Bank",
  "Rubies MFB",
  "Signature Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "SunTrust Bank",
  "TAJ Bank",
  "Titan Trust Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "VFD Microfinance Bank",
  "Wema Bank (ALAT)",
  "Zenith Bank",
];

/** Pre-populated PENCOM Licensed Pension Fund Administrators (PFAs) */
export const NIGERIAN_PFAS = [
  "Access Pensions Limited",
  "ARM Pension Managers",
  "CrusaderSterling Pensions",
  "FCMB Pensions Limited",
  "Fidelity Pension Managers",
  "Guaranty Trust Pension Managers (GTCO)",
  "Leadway Pensure PFA",
  "Nigerian Police Force Pensions (NPF)",
  "NLPC PFA Limited",
  "Norrenberger Pensions",
  "Oak Pensions Limited",
  "Pensions Alliance Limited (PAL Pensions)",
  "Premium Pension Limited",
  "Radix Pension Managers",
  "Stanbic IBTC Pension Managers",
  "Tangerine APT Pensions",
  "Trustfund Pensions Limited",
  "Veritas Glanvills Pensions",
];
