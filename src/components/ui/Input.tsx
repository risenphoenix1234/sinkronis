import { cn } from "@/utils/cn";
export default function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30",
        props.className,
      )}
    />
  );
}

export function DisabledInput({ placeholder }: { placeholder: string }) {
  return (
    <input
      disabled
      placeholder={placeholder}
      className="h-7 rounded border border-[#E5E9EF] bg-[#F8FAFC] px-2 text-[8px]"
    />
  );
}
