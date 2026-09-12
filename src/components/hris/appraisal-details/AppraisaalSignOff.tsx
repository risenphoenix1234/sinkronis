"use client";

import { useState } from "react";
import type { RatingScaleEntry, SignOffType } from "@/lib/api/types/hrisTypes";

type SignOffRow = {
  role: string;
  name: string;
  placeholder?: string;
};

const SIGN_OFF_LABELS: Record<SignOffType, string> = {
  EMPLOYEE: "Appraisee",
  MANAGER: "Line Manager / MD",
  HR: "HR Representative",
};

const ALL_SIGN_OFF_TYPES: SignOffType[] = ["EMPLOYEE", "MANAGER", "HR"];

type AppraisalSignOffProps = {
  signOffTypes?: SignOffType[];
  ratingScale?: RatingScaleEntry[];
  editable?: boolean;
  onSignOffTypesChange?: (types: SignOffType[]) => void;
};

export default function AppraisalSignOff({
  signOffTypes = ["EMPLOYEE"],
  ratingScale = [],
  editable = false,
  onSignOffTypesChange,
}: AppraisalSignOffProps) {
  const [midYearRating, setMidYearRating] = useState("");
  const [yearEndRating, setYearEndRating] = useState("");

  const signOffRows: SignOffRow[] = signOffTypes.map((type) => ({
    role: SIGN_OFF_LABELS[type] ?? type,
    name: "",
    placeholder: "Name...",
  }));

  const toggleType = (type: SignOffType) => {
    const next = signOffTypes.includes(type)
      ? signOffTypes.filter((t) => t !== type)
      : [...signOffTypes, type];
    onSignOffTypesChange?.(next);
  };

  return (
    <div className="w-full space-y-5 bg-white">
      <section className="overflow-hidden rounded-md border border-[#E2E8F0] bg-white">
        <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2">
          <RatingInput
            label="Employee's Achieved Rating – Mid-Year"
            value={midYearRating}
            onChange={setMidYearRating}
          />
          <RatingInput
            label="Employee's Achieved Rating – Year End"
            value={yearEndRating}
            onChange={setYearEndRating}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-md border border-[#E2E8F0] bg-white">
        <div className="border-b border-dashed border-[#D9DEE7] px-6 py-3">
          <h2 className="text-[12px] font-bold uppercase tracking-wide text-[#94A3B8]">
            Rating Scale
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5">
          {ratingScale.length === 0 ? (
            <p className="col-span-full px-6 py-4 text-sm text-slate-400">
              No rating scale available.
            </p>
          ) : (
            ratingScale.map((rating, index) => (
              <div
                key={rating.key}
                className={`min-h-[98px] px-5 py-4 bg-[#F3F5F7] text-[#667085] ${
                  index !== ratingScale.length - 1
                    ? "border-r border-white/60"
                    : ""
                }`}
              >
                <p className="text-[22px] font-bold leading-6">
                  {rating.value}
                </p>
                <p className="mt-2 text-[12px] font-semibold">
                  {rating.key.replace(/_/g, " ")}
                </p>
                <p className="mt-1 text-[10px] opacity-80">
                  {rating.minimumExclusive != null
                    ? `>${rating.minimumExclusive}%`
                    : `${rating.minimum ?? 0}%+`}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-md border border-[#E2E8F0] bg-white">
        <div className="border-b border-dashed border-[#D9DEE7] px-6 py-4">
          <h2 className="text-[12px] font-bold uppercase tracking-wide text-[#94A3B8]">
            Sign-Off
          </h2>
        </div>

        {editable && (
          <div className="flex flex-wrap gap-4 border-b border-dashed border-[#D9DEE7] px-6 py-4">
            {ALL_SIGN_OFF_TYPES.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 text-[13px] text-[#667085]"
              >
                <input
                  type="checkbox"
                  checked={signOffTypes.includes(type)}
                  onChange={() => toggleType(type)}
                  className="h-4 w-4 rounded border-[#D9DEE7] text-[#2388D0] focus:ring-[#2388D0]"
                />
                {SIGN_OFF_LABELS[type]}
              </label>
            ))}
          </div>
        )}

        <div>
          {signOffRows.map((row) => (
            <SignOffRow key={row.role} {...row} />
          ))}
        </div>
      </section>
    </div>
  );
}

type RatingInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function RatingInput({ label, value, onChange }: RatingInputProps) {
  return (
    <div>
      <label className="mb-2 block text-[13px] text-[#667085]">{label}</label>
      <input
        type="number"
        min="1"
        max="5"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter rating score..."
        className="h-[43px] w-full rounded-md border border-[#D9DEE7] bg-white px-3 text-[13px] text-[#1F2937] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2388D0] focus:ring-1 focus:ring-[#2388D0]"
      />
    </div>
  );
}

function SignOffRow({ role, name, placeholder = "" }: SignOffRow) {
  return (
    <div className="grid grid-cols-1 gap-5 border-b border-dotted border-[#E5E7EB] px-6 py-5 last:border-b-0 md:grid-cols-[150px_1fr_1fr] md:items-center md:gap-5">
      <div>
        <p className="text-[13px] font-semibold text-[#667085]">{role}</p>
      </div>
      <div>
        <label className="mb-2 block text-[12px] text-[#667085]">Name</label>
        <input
          type="text"
          defaultValue={name}
          placeholder={placeholder}
          className="h-[43px] w-full rounded-md border border-[#D9DEE7] px-3 text-[13px] text-[#1F2937] outline-none placeholder:text-[#98A2B3] focus:border-[#2388D0] focus:ring-1 focus:ring-[#2388D0]"
        />
      </div>
      <div>
        <label className="mb-2 block text-[12px] text-[#667085]">
          Signature & Date
        </label>
        <input
          type="text"
          placeholder="DD/MM/YYYY"
          className="h-[43px] w-full rounded-md border border-[#D9DEE7] px-3 text-[13px] text-[#1F2937] outline-none placeholder:text-[#98A2B3] focus:border-[#2388D0] focus:ring-1 focus:ring-[#2388D0]"
        />
      </div>
    </div>
  );
}
