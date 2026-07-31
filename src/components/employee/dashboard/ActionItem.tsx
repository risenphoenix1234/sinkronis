import { ChevronRight } from "lucide-react";
import { ActionItem as ActionItemType } from "@/types/employee/dashboard";

interface Props {
  item: ActionItemType;
}

const badgeStyles = {
  "Action Required": "bg-blue-100 text-blue-700",

  Approved: "bg-green-100 text-green-700",

  Upcoming: "bg-yellow-100 text-yellow-700",
};

const borderStyles = {
  "Action Required": "border-l-4 border-blue-500",

  Approved: "border-l-4 border-green-500",

  Upcoming: "border-l-4 border-yellow-500",
};

export default function ActionItem({ item }: Props) {
  return (
    <div
      className={`flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between ${borderStyles[item.status]}`}
    >
      <div>
        <h3 className="font-semibold text-gray-800">{item.title}</h3>

        <p className="mt-2 text-sm text-gray-500">{item.description}</p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-4 py-1 text-xs font-medium ${badgeStyles[item.status]}`}
        >
          {item.status}
        </span>

        <button className="rounded-full p-1 transition hover:bg-gray-100">
          <ChevronRight size={18} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}
