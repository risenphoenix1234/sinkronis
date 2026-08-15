interface Props {
  title: string;
  weight: string;
  color?: "blue" | "purple";
}

export default function SectionHeader({
  title,
  weight,
  color = "blue",
}: Props) {
  return (
    <div
      className={`flex items-center justify-between px-6 py-3 text-white

      ${color === "blue" ? "bg-[#1677C8]" : "bg-[#8B26B4]"}`}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide">{title}</h2>

      <span className="text-xs">Total weight: {weight}</span>
    </div>
  );
}
