interface Props {
  status: "Present" | "Late" | "Absent";
}

export const styles = {
  Present: "bg-green-100 text-green-700",
  Late: "bg-yellow-100 text-yellow-700",
  Absent: "bg-red-100 text-red-600",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}