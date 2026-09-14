import type { ActionItem as ActionItemType } from "@/types/employee/dashboard";

interface Props {
  item: ActionItemType;
}

const statusMap: Record<
  string,
  { label: string; badge: string; border: string }
> = {
  ACTION_REQUIRED: {
    label: "Action Required",
    badge: "bg-blue-100 text-blue-700",
    border: "border-l-4 border-blue-500",
  },
  APPROVED: {
    label: "Approved",
    badge: "bg-green-100 text-green-700",
    border: "border-l-4 border-green-500",
  },
  UPCOMING: {
    label: "Upcoming",
    badge: "bg-yellow-100 text-yellow-700",
    border: "border-l-4 border-yellow-500",
  },
};

export default function ActionItem({ item }: Props) {
  const style = statusMap[item.status] ?? {
    label: item.status,
    badge: "bg-gray-100 text-gray-700",
    border: "border-l-4 border-gray-300",
  };

  return (
    <div
      className={`flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between ${style.border}`}
    >
      <div>
        <h3 className="font-semibold text-gray-800">{item.title}</h3>
        <p className="mt-2 text-sm text-gray-500">{item.description}</p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-4 py-1 text-xs font-medium ${style.badge}`}
        >
          {style.label}
        </span>
      </div>
    </div>
  );
}
