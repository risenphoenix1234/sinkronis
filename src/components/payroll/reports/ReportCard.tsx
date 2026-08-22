"use client";

import type { ReactNode } from "react";

/**
 * One card shell for every report tab. The five tabs previously each rolled
 * their own container — `rounded-xl` + shadow here, `rounded-[4px]` there, no
 * radius at all on the last three, plus a mix of Tailwind grays and raw hex
 * borders — so switching tabs visibly changed the design language.
 */
export default function ReportCard({
  title,
  subtitle,
  action,
  children,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      className="
        w-full
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      {(title || action) && (
        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            border-gray-200
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
          "
        >
          <div className="min-w-0">
            {title && (
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            )}

            {subtitle && (
              <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>

          {action}
        </div>
      )}

      {children}
    </section>
  );
}

/** Horizontal scroll container for wide report tables. */
export function ReportTableScroll({
  minWidth,
  children,
}: {
  minWidth: number;
  children: ReactNode;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth }}>{children}</div>
    </div>
  );
}
