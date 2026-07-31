interface Props {
  title: string;
  value: number;
  color: string;
}

export default function LeaveSummaryCard({
  title,
  value,
  color,
}: Props) {
  return (
    <div className="bg-white border rounded-md p-5">

      <p className="text-xs text-gray-400">
        {title}
      </p>

      <h2 className={`text-3xl font-bold mt-3 ${color}`}>
        {value}
      </h2>

    </div>
  );
}