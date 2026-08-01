import { currentPhaseIndex, phases } from "@/types/employee/appraisal";

export function RatingBadge({ score }: { score: number }) {
  const color =
    score >= 4
      ? "bg-green-100 text-green-700"
      : score >= 3
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}
    >
      {score}/5
    </span>
  );
}

export function PhaseStepper() {
  return (
    <div className="flex items-start gap-0 mt-6 mb-2">
      {phases.map((phase, i) => {
        const done = i < currentPhaseIndex;
        const active = i === currentPhaseIndex;
        const isLast = i === phases.length - 1;

        return (
          <div key={phase} className="flex items-start flex-1 min-w-0">
            {/* Step + label */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors text-sm font-semibold ${
                  done
                    ? "bg-blue-600 border-blue-600 text-white"
                    : active
                      ? "bg-white border-blue-600 text-blue-600"
                      : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {done ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth={2.5}
                    className="w-4 h-4"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`mt-2 text-[11px] font-medium text-center leading-tight max-w-[80px] ${
                  active
                    ? "text-blue-600"
                    : done
                      ? "text-gray-600"
                      : "text-gray-400"
                }`}
              >
                {phase}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 h-px mt-5 mx-1">
                <div
                  className={`h-full ${done ? "bg-blue-500" : "bg-gray-200"}`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
