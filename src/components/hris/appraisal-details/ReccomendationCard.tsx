import { CheckCircle2, ChevronRight } from "lucide-react";

interface RecommendationProps {
  selected?: "improve" | "meets" | "exceeds";
}

const recommendations = [
  {
    id: "improve",
    title: "Needs Improvement",
    description: "Performance requires significant improvement.",
  },
  {
    id: "meets",
    title: "Meets Expectations",
    description: "Performance meets the expected requirements.",
  },
  {
    id: "exceeds",
    title: "Exceeds Expectations",
    description: "Performance consistently exceeds expectations.",
  },
] as const;

export default function RecommendationCard({
  selected = "improve",
}: RecommendationProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b px-6 py-5">
        <h2 className="font-semibold text-slate-800">Manager Recommendation</h2>

        <p className="mt-1 text-xs text-slate-400">
          Recommended overall performance rating
        </p>
      </div>

      <div className="space-y-3 p-6">
        {recommendations.map((recommendation) => {
          const isSelected = recommendation.id === selected;

          return (
            <div
              key={recommendation.id}
              className={`flex items-center justify-between rounded-lg border p-4 transition ${
                isSelected
                  ? "border-[#1677C8] bg-[#F0F7FF]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    isSelected
                      ? "bg-[#1677C8] text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  )}
                </div>

                <div>
                  <h3
                    className={`text-sm font-semibold ${
                      isSelected ? "text-[#1677C8]" : "text-slate-700"
                    }`}
                  >
                    {recommendation.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    {recommendation.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <ChevronRight size={18} className="text-[#1677C8]" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
