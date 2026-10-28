// src/components/ui/Loader.tsx
import type { CSSProperties } from "react";

type LoaderVariant = "inline" | "section" | "page" | "fullscreen";

interface LoaderProps {
  variant?: LoaderVariant;
  label?: string;
  className?: string;
}

const SIZES: Record<LoaderVariant, number> = {
  inline: 18,
  section: 44,
  page: 56,
  fullscreen: 64,
};

function Ring({ size }: { size: number }) {
  const stroke = Math.max(2, Math.round(size / 14));
  const core = Math.max(6, Math.round(size / 4));

  const track: CSSProperties = {
    border: `${stroke}px solid color-mix(in srgb, var(--primary) 14%, transparent)`,
  };
  const arc: CSSProperties = {
    border: `${stroke}px solid transparent`,
    borderTopColor: "var(--primary)",
    borderRightColor: "color-mix(in srgb, var(--primary) 40%, transparent)",
    animationDuration: "0.9s",
  };
  const halo: CSSProperties = {
    width: core,
    height: core,
    background: "color-mix(in srgb, var(--primary) 35%, transparent)",
    animationDuration: "1.6s",
  };
  const dot: CSSProperties = {
    width: core,
    height: core,
    background: "var(--primary)",
  };

  return (
    <span
      aria-hidden="true"
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 rounded-full" style={track} />
      <span
        className="absolute inset-0 animate-spin rounded-full motion-reduce:animate-none"
        style={arc}
      />
      <span
        className="absolute animate-ping rounded-full motion-reduce:animate-none"
        style={halo}
      />
      <span className="relative rounded-full" style={dot} />
    </span>
  );
}

function Dots() {
  return (
    <span aria-hidden="true" className="ml-0.5 inline-flex items-end gap-[3px]">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-[3px] w-[3px] animate-bounce rounded-full bg-slate-400 motion-reduce:animate-none"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

export default function Loader({
  variant = "inline",
  label,
  className = "",
}: LoaderProps) {
  const size = SIZES[variant];
  const text = label ?? "Loading";

  if (variant === "inline") {
    return (
      <span
        role="status"
        aria-live="polite"
        className={`inline-flex items-center gap-2 text-sm text-slate-500 ${className}`}
      >
        <Ring size={size} />
        {label ? <span>{label}</span> : <span className="sr-only">{text}</span>}
      </span>
    );
  }

  const wrapper =
    variant === "fullscreen"
      ? "flex min-h-screen items-center justify-center bg-slate-50"
      : variant === "page"
        ? "flex min-h-[60vh] items-center justify-center"
        : "flex items-center justify-center py-12";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${wrapper} ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <Ring size={size} />
        <p className="flex items-center text-sm font-medium text-slate-500">
          {text}
          <Dots />
        </p>
      </div>
    </div>
  );
}