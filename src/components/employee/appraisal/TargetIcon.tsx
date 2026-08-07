export function TargetIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className={className ?? "w-5 h-5"}
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}
