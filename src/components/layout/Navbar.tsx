// src/components/layout/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiBell, FiBriefcase, FiChevronDown, FiChevronRight, FiLogOut, FiSliders } from "react-icons/fi";

interface NavbarProps {
  title: string;
  notificationCount?: number;
  tenantAdminHref?: string;
  onSignOut?: () => void;
}

// Turns a URL segment like "general-settings" or "locale-region" into
// readable breadcrumb text. Handles the segments that need a special-cased
// label (acronyms, "&", renamed routes) and falls back to Title Case.
const SEGMENT_LABEL_OVERRIDES: Record<string, string> = {
  hris: "HRIS",
  "general-settings": "Settings",
  "locale-region": "Locale & Region",
  "roles-permissions": "Roles & Permissions",
  "branches-locations": "Branches & Locations",
  "my-plan": "My Plan",
  "module-addons": "Active Modules",
  "plans-upgrade": "Plans & Modules",
  "billing-history": "Billing History",
  "payment-method": "Payment Method",
  "user-management": "User Management",
  "audit-log": "Audit Log",
  "data-privacy": "Data & Privacy",
  "company-profile": "Company",
  "work-schedule": "Work Schedule",
};

function humanizeSegment(segment: string): string {
  if (SEGMENT_LABEL_OVERRIDES[segment]) return SEGMENT_LABEL_OVERRIDES[segment];
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function useBreadcrumb(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  let hrefSoFar = "";
  return segments.map((segment) => {
    hrefSoFar += `/${segment}`;
    return { label: humanizeSegment(segment), href: hrefSoFar };
  });
}

// Some modules use a different settings route name than the default
// "settings" (e.g. tenant-admin uses "general-settings"). Add module
// roots here only when their settings route deviates from the default.
const MODULE_SETTINGS_SEGMENT: Record<string, string> = {
  "tenant-admin": "general-settings",
};

// Builds the settings link for whichever module the user is currently in,
// e.g. /accounting/*   -> /accounting/settings
//      /tenant-admin/* -> /tenant-admin/general-settings
//      /hris/*         -> /hris/settings
function useSettingsHref(pathname: string): string {
  const moduleRoot = pathname.split("/").filter(Boolean)[0];
  if (!moduleRoot) return "/settings";
  const settingsSegment = MODULE_SETTINGS_SEGMENT[moduleRoot] ?? "settings";
  return `/${moduleRoot}/${settingsSegment}`;
}

export default function Navbar({
  title,
  notificationCount = 2,
  tenantAdminHref = "/tenant-admin/overview",
  onSignOut,
}: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const breadcrumb = useBreadcrumb(pathname);
  const settingsHref = useSettingsHref(pathname);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Close the menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="shrink-0 text-lg font-semibold">{title}</span>
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 overflow-hidden">
          {breadcrumb.map((crumb, i) => {
            const isLast = i === breadcrumb.length - 1;
            return (
              <span key={crumb.href} className="flex shrink-0 items-center gap-1">
                {i > 0 && <FiChevronRight size={12} className="text-slate-300" />}
                {isLast ? (
                  <span className="truncate rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="truncate text-xs text-slate-400 hover:text-slate-600 hover:underline"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      <nav className="mr-16 flex items-center gap-4 text-sm text-slate-500">
        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <FiBell size={18} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-medium leading-none text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Link>

        {/* Avatar + Settings dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-2.5 transition-colors ${
              menuOpen
                ? "border-[#2183C6] bg-[#2183C6]/5"
                : "border-slate-200 hover:border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span className="overflow-hidden rounded-full border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=faces"
                alt="User avatar"
                width={36}
                height={36}
                className="h-9 w-9 object-cover"
              />
            </span>
            <FiChevronDown
              size={16}
              strokeWidth={2.5}
              className={`transition-transform ${
                menuOpen ? "rotate-180 text-[#2183C6]" : "text-slate-500"
              }`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+10px)] z-20 w-52 origin-top-right animate-[dropdown_0.12s_ease-out] overflow-hidden rounded-lg border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5">
              <Link
                href={tenantAdminHref}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <FiBriefcase size={16} className="text-slate-500" />
                Tenant Admin
              </Link>

              <Link
                href={settingsHref}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <FiSliders size={16} className="text-slate-500" />
                Settings
              </Link>

              {onSignOut && (
                <>
                  <div className="my-1 h-px bg-slate-100" />
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut size={16} />
                    Sign out
                  </button>
                </>
              )}
            </div>
          )}

          <style jsx>{`
            @keyframes dropdown {
              from {
                opacity: 0;
                transform: scale(0.96) translateY(-4px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}</style>
        </div>
      </nav>
    </header>
  );
}