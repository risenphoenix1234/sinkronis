// ActionList.tsx
import ActionItem from "./ActionItem";
import { Bell } from "lucide-react";
import type { ActionItem as ActionItemType } from "@/types/employee/dashboard";

interface Props {
  items: ActionItemType[];
}

export default function ActionList({ items }: Props) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-sky-600" />
          <h2 className="text-lg font-semibold text-gray-800">Action Items</h2>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {items.length === 0 ? (
          <p className="p-5 text-sm text-gray-500">No pending action items.</p>
        ) : (
          items.map((item) => <ActionItem key={item.id} item={item} />)
        )}
      </div>
    </section>
  );
}
