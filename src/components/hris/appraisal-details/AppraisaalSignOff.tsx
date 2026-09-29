"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AlertCircle, CheckCircle, Loader2, PenTool } from "lucide-react";
import { signOffAppraisal } from "@/lib/api/hris";
import type { RatingScaleEntry, SignOffType } from "@/lib/api/types/hrisTypes";

export interface AppraisalSignOffRecord {
  signOffType?: SignOffType | string;
  role?: string;
  name?: string;
  signerName?: string;
  signedAt?: string | null;
  signature?: string | null;
  status?: string;
  [key: string]: unknown;
}

const SIGN_OFF_LABELS: Record<SignOffType, string> = {
  EMPLOYEE: "Appraisee",
  MANAGER: "Line Manager / MD",
  HR: "HR Representative",
};

const ALL_SIGN_OFF_TYPES: SignOffType[] = ["EMPLOYEE", "MANAGER", "HR"];

export interface AppraisalSignOffProps {
  appraisalId?: string;
  signOffTypes?: SignOffType[];
  ratingScale?: RatingScaleEntry[];
  signOffs?: AppraisalSignOffRecord[] | unknown[];
  editable?: boolean;
  onSignOffTypesChange?: (types: SignOffType[]) => void;
  onSignOffSuccess?: (signOffType: SignOffType, result: unknown) => void;
}

export default function AppraisalSignOff({
  appraisalId,
  signOffTypes = ["EMPLOYEE", "MANAGER", "HR"],
  ratingScale = [],
  signOffs = [],
  editable = false,
  onSignOffTypesChange,
  onSignOffSuccess,
}: AppraisalSignOffProps) {
  const [midYearRating, setMidYearRating] = useState("");
  const [yearEndRating, setYearEndRating] = useState("");
  const [signingRole, setSigningRole] = useState<SignOffType | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [localSigned, setLocalSigned] = useState<
    Record<string, { signedAt?: string; signerName?: string }>
  >({});

  const toggleType = (type: SignOffType) => {
    const next = signOffTypes.includes(type)
      ? signOffTypes.filter((t) => t !== type)
      : [...signOffTypes, type];
    onSignOffTypesChange?.(next);
  };

  const handleSignOff = async (type: SignOffType) => {
    if (!appraisalId) return;

    setSigningRole(type);
    setSubmitError(null);

    try {
      const res = await signOffAppraisal(appraisalId, { signOffType: type });
      toast.success(`${SIGN_OFF_LABELS[type]} sign-off recorded successfully.`);
      setLocalSigned((prev) => ({
        ...prev,
        [type]: {
          signedAt: new Date().toISOString(),
          signerName: "Signed",
        },
      }));
      onSignOffSuccess?.(type, res);
    } catch (err) {
      console.error(`Failed to sign off as ${type}:`, err);
      if (axios.isAxiosError(err)) {
        const resData = err.response?.data;
        const msg =
          resData?.message ||
          (err.response?.status === 403
            ? "Appraisal sign-off is not permitted at the current stage."
            : `Failed to record ${SIGN_OFF_LABELS[type]} sign-off.`);
        setSubmitError(msg);
        toast.error(msg);
      } else {
        const msg =
          err instanceof Error
            ? err.message
            : `Failed to record ${SIGN_OFF_LABELS[type]} sign-off.`;
        setSubmitError(msg);
        toast.error(msg);
      }
    } finally {
      setSigningRole(null);
    }
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

        {submitError && (
          <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
            <span className="leading-relaxed">{submitError}</span>
          </div>
        )}

        <div>
          {signOffTypes.map((type) => {
            const roleLabel = SIGN_OFF_LABELS[type] ?? type;
            const existing = (signOffs as AppraisalSignOffRecord[])?.find(
              (s) =>
                s?.signOffType === type ||
                s?.role === type ||
                s?.role === roleLabel,
            );
            const isSigned =
              Boolean(existing?.signedAt) ||
              existing?.status === "SIGNED" ||
              Boolean(localSigned[type]);
            const signerName =
              existing?.signerName ||
              existing?.name ||
              (isSigned ? "Signed" : "");
            const signedDate =
              existing?.signedAt || localSigned[type]?.signedAt;

            return (
              <div
                key={type}
                className="grid grid-cols-1 gap-5 border-b border-dotted border-[#E5E7EB] px-6 py-5 last:border-b-0 md:grid-cols-[150px_1fr_1fr] md:items-center md:gap-5"
              >
                <div>
                  <p className="text-[13px] font-semibold text-[#667085]">
                    {roleLabel}
                  </p>
                </div>
                <div>
                  <label className="mb-2 block text-[12px] text-[#667085]">
                    Name
                  </label>
                  {appraisalId ? (
                    <div className="flex h-[43px] items-center rounded-md border border-[#D9DEE7] bg-[#F8FAFC] px-3 text-[13px] text-[#1F2937]">
                      {signerName || "Pending sign-off"}
                    </div>
                  ) : (
                    <input
                      type="text"
                      defaultValue=""
                      placeholder="Name..."
                      className="h-[43px] w-full rounded-md border border-[#D9DEE7] px-3 text-[13px] text-[#1F2937] outline-none placeholder:text-[#98A2B3] focus:border-[#2388D0] focus:ring-1 focus:ring-[#2388D0]"
                    />
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-[12px] text-[#667085]">
                    Signature &amp; Date
                  </label>
                  {appraisalId ? (
                    isSigned ? (
                      <div className="flex h-[43px] items-center gap-2 rounded-md bg-[#DCFCE7] px-3.5 text-[12px] font-medium text-[#16803C]">
                        <CheckCircle size={14} strokeWidth={2} />
                        <span>
                          Signed
                          {signedDate
                            ? ` on ${new Date(signedDate).toLocaleDateString()}`
                            : ""}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={signingRole !== null}
                        onClick={() => handleSignOff(type)}
                        className="inline-flex h-[43px] w-full items-center justify-center gap-2 rounded-md bg-[#2388D0] px-4 text-[12px] font-semibold text-white transition hover:bg-[#1b6aa2] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {signingRole === type ? (
                          <>
                            <Loader2
                              size={14}
                              className="animate-spin text-white"
                            />
                            <span>Signing off...</span>
                          </>
                        ) : (
                          <>
                            <PenTool size={13} />
                            <span>Sign Off as {roleLabel}</span>
                          </>
                        )}
                      </button>
                    )
                  ) : (
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      className="h-[43px] w-full rounded-md border border-[#D9DEE7] px-3 text-[13px] text-[#1F2937] outline-none placeholder:text-[#98A2B3] focus:border-[#2388D0] focus:ring-1 focus:ring-[#2388D0]"
                    />
                  )}
                </div>
              </div>
            );
          })}
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
        className="h-[43px] w-full rounded-md border border-[#D9DEE7] bg-white px-3 text-[13px] text-[#1F2937] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2388D0] focus:ring-1 focus:ring-[#2388D0] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0"
      />
    </div>
  );
}
