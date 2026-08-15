import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function TextArea({ label, className, ...props }: Props) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-slate-600">{label}</label>
      )}

      <textarea
        {...props}
        rows={5}
        className={cn(
          "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          className,
        )}
      />
    </div>
  );
}
