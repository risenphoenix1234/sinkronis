interface Props {
  text: string;
  color?: "green" | "yellow" | "blue";
}

export default function StatusBadge({ text, color = "green" }: Props) {
  const styles = {
    green: "bg-[#DFF7E6] text-[#16A34A]",
    yellow: "bg-[#FFF5CC] text-[#A16207]",
    blue: "bg-[#E8F2FF] text-[#1677C8]",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[color]}`}
    >
      {text}
    </span>
  );
}
