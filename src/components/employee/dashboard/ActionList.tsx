import { actionItems } from "@/data/employee/dashboard";
import ActionItem from "./ActionItem";
import { Bell } from "lucide-react";

export default function ActionList() {
  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-sky-600" />

          <h2 className="text-lg font-semibold text-gray-800">Action Items</h2>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {actionItems.map((item) => (
          <ActionItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
