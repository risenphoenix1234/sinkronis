import { cn } from "@/lib/utils";
import { BadgeVariant } from "@/types/employee/appraisal";

interface Props {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const variants = {
  success: "bg-green-100 text-green-700",

  warning: "bg-yellow-100 text-yellow-700",

  danger: "bg-red-100 text-red-700",

  info: "bg-blue-100 text-blue-700",

  gray: "bg-gray-100 text-gray-700",
};

export default function Badge({ variant, children }: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
      )}
    >
      {children}
    </span>
  );
}
