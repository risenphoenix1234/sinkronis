interface Props {
  rating: string;
}

export default function RatingBadge({ rating }: Props) {
  const success = rating.includes("Exceeds");

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        success ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
      }`}
    >
      {rating}
    </span>
  );
}
