interface Props {
  selected: number;
  title: string;
  subtitle: string;
}

export default function RatingScale({ selected, title, subtitle }: Props) {
  return (
    <div>
      <h5 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </h5>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((number) => (
          <div
            key={number}
            className={`flex h-10 w-10 items-center justify-center rounded-md font-semibold
            ${
              number <= selected ? "bg-[#1677C8] text-white" : "bg-white border"
            }`}
          >
            {number}
          </div>
        ))}

        <span className="ml-4 self-center text-sm font-semibold text-[#1677C8]">
          {subtitle}
        </span>
      </div>
    </div>
  );
}
