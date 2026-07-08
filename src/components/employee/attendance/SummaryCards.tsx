type Item = {
  title: string;
  value: number;
  change: string;
  positive: boolean;
};

type Props = {
  title: string;
  data: Item[];
};

export default function SummaryCards({ title, data }: Props) {
  return (
    <div>
      <h3 className="mb-5 font-semibold text-[#1F2937]">{title}</h3>

      <div className="grid grid-cols-6 gap-8">
        {data.map((item) => (
          <div key={item.title}>
            <p className="text-xs text-gray-500">{item.title}</p>

            <h4 className="mt-2 text-3xl font-semibold">{item.value}</h4>

            <p
              className={`mt-1 text-xs ${
                item.positive ? "text-green-500" : "text-red-500"
              }`}
            >
              {item.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
