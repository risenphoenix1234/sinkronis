export interface RatingResult {
  label: string;
  color: string;
  bg: string;
}

export function getRating(score: number): RatingResult {
  if (score >= 90) {
    return {
      label: "Outstanding",
      color: "text-emerald-700",
      bg: "bg-emerald-100",
    };
  }

  if (score >= 80) {
    return {
      label: "Exceeds Expectations",
      color: "text-green-700",
      bg: "bg-green-100",
    };
  }

  if (score >= 70) {
    return {
      label: "Meets Expectations",
      color: "text-blue-700",
      bg: "bg-blue-100",
    };
  }

  if (score >= 60) {
    return {
      label: "Needs Improvement",
      color: "text-yellow-700",
      bg: "bg-yellow-100",
    };
  }

  return {
    label: "Unsatisfactory",
    color: "text-red-700",
    bg: "bg-red-100",
  };
}
