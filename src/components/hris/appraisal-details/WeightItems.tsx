export function WeightItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <span>
      <span className={`mr-1 inline-block h-2 w-2 rounded-full ${color}`} />
      {label}: <strong>{value}%</strong>
    </span>
  );
}
