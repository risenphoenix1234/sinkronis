import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({
  children,
  loading,
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        "rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50",
        className,
      )}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
