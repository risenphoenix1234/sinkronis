export function RatingBadge({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
      <span className="text-xs text-[#344054]">{score}/10</span>
    </div>
  );
}
