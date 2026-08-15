"use client";

interface Rating {
  score: number;
  title: string;
  range: string;
  bgColor: string;
  textColor: string;
}

const ratings: Rating[] = [
  {
    score: 5,
    title: "Outstanding",
    range: ">121%",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  {
    score: 4,
    title: "Above Expectation",
    range: "101–120%",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    score: 3,
    title: "Meets Expectation",
    range: "80–100%",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
  {
    score: 2,
    title: "Below Expectation",
    range: "60–79%",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  {
    score: 1,
    title: "Poor Performance",
    range: "0–59%",
    bgColor: "bg-red-100",
    textColor: "text-red-600",
  },
];

export default function OverallRating() {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Rating Scale Reference
        </h2>
      </div>

      {/* Rating Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {ratings.map((rating) => (
          <div
            key={rating.score}
            className={`${rating.bgColor} flex min-h-[95px] flex-col justify-center border-r border-white p-4 last:border-r-0`}
          >
            <h3 className={`text-3xl font-bold ${rating.textColor}`}>
              {rating.score}
            </h3>

            <p className={`mt-2 text-sm font-semibold ${rating.textColor}`}>
              {rating.title}
            </p>

            <p className="mt-1 text-xs text-gray-500">{rating.range}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
