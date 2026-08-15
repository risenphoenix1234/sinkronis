import { Check } from "lucide-react";

interface Props {
  title: string;
  completed: boolean;
  active: boolean;
}

export default function ProgressStep({ title, completed, active }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold
        ${
          completed
            ? "border-blue-600 bg-blue-600 text-white"
            : active
              ? "border-blue-600 text-blue-600"
              : "border-gray-300 text-gray-400"
        }`}
      >
        {completed ? <Check size={18} /> : ""}
      </div>

      <p
        className={`text-xs ${
          active ? "font-semibold text-gray-900" : "text-gray-400"
        }`}
      >
        {title}
      </p>
    </div>
  );
}
