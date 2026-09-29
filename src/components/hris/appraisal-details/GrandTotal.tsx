interface GrandTotalProps {
  quarter?: string | null;
  score?: number | string | null;
  ratingLabel?: string | null;
}

export default function GrandTotal({
  quarter,
  score,
  ratingLabel,
}: GrandTotalProps = {}) {
  const displayScore =
    score != null && score !== ""
      ? typeof score === "number"
        ? `${score}%`
        : score
      : "—";

  const displayRating = ratingLabel || "Pending Evaluation";
  const displayQuarter = quarter ? `GRAND TOTAL – ${quarter}` : "GRAND TOTAL";

  return (
    <div className="flex items-center justify-between rounded-lg bg-[#1E293B] px-6 py-3.5 shadow-xs">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
        {displayQuarter}
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-lg font-bold text-slate-300">
          {displayScore}
        </span>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-2xs">
          {displayRating}
        </span>
      </div>
    </div>
  );
}
