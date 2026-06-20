import { ChevronUp, ChevronDown } from "lucide-react";

export function TableHead({ title }: { title: string }) {
  return (
    <th className="px-4 py-4 text-left text-xs font-medium text-slate-500">
      <div className="flex items-center gap-1">
        {title}
        <div className="flex flex-col">
          <ChevronUp size={10} />
          <ChevronDown size={10} className="-mt-1" />
        </div>
      </div>
    </th>
  );
}
