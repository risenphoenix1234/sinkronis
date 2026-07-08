// components/RateBar.tsx

interface Props {
  value: number;
}

export default function RateBar({ value }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-green-600"
          style={{ width: `${value}%` }}
        />
      </div>

      <span className="text-sm font-medium text-green-700">
        {value}%
      </span>
    </div>
  );
}