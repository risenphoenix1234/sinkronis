type SectionTabProps = {
  active: boolean;
  onClick: () => void;
  color: "blue" | "purple";
  label: string;
  value: string;
};

export function SectionTab({
  active,
  onClick,
  color,
  label,
  value,
}: SectionTabProps) {
  const isBlue = color === "blue";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative whitespace-nowrap px-3 pb-3 pt-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
        active
          ? isBlue
            ? "text-[#2388D0]"
            : "text-purple-700"
          : "text-[#8492A6] hover:text-[#475467]"
      }`}
    >
      {label}

      <span
        className={`ml-2 inline-flex rounded-full px-2 py-1 text-[10px] ${
          active
            ? isBlue
              ? "bg-[#2388D0] text-white"
              : "bg-purple-600 text-white"
            : "bg-[#F2F4F7] text-[#98A2B3]"
        }`}
      >
        {value}
      </span>

      {active && (
        <span
          className={`absolute bottom-0 left-0 h-[2px] w-full ${
            isBlue ? "bg-[#2388D0]" : "bg-purple-600"
          }`}
        />
      )}
    </button>
  );
}
