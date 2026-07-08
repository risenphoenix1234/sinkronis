// components/appraisal-details/RatingScale.tsx

interface Props {
  rating: number;
  label: string;
}

export default function RatingScale({ rating, label }: Props) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((value) => (
        <div
          key={value}
          className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium
            ${
              value <= rating
                ? "bg-sky-600 text-white"
                : "border bg-white text-slate-500"
            }`}
        >
          {value}
        </div>
      ))}

      <span className="ml-3 text-sm font-medium text-sky-600">{label}</span>
    </div>
  );
}
