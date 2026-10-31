// src/components/layout/Navbar.tsx
"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiSliders,
} from "react-icons/fi";
import { logoutAndRedirectToLogin } from "@/utils/authSession";
import { useBranding } from "@/hooks/useBranding";

interface NavbarProps {
  notificationCount?: number;
  onSignOut?: () => void;
}

const MODULE_SETTINGS_SEGMENT: Record<string, string> = {
  "tenant-admin": "general-settings",
};

function useSettingsHref(pathname: string): string {
  const moduleRoot = pathname.split("/").filter(Boolean)[0];

  if (!moduleRoot) {
    return "/settings";
  }

  const settingsSegment = MODULE_SETTINGS_SEGMENT[moduleRoot] ?? "settings";

  return `/${moduleRoot}/${settingsSegment}`;
}

export default function Navbar({
  notificationCount = 2,
  onSignOut,
}: NavbarProps) {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const settingsHref = useSettingsHref(pathname);
  const branding = useBranding();

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Close dropdown when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full shrink-0 items-center border-b border-slate-200 bg-white px-6">
      {/* =====================================================
          LEFT — LOGO
      ====================================================== */}
      <div className="flex w-1/3 items-center">
        <Link href="/" className="flex items-center">
          {branding?.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt="Logo"
              className="h-auto max-h-14 w-[110px] object-contain"
            />
          ) : (
            <Image
              src="/Logo.png"
              alt="Sinkronis"
              width={110}
              height={110}
              priority
              className="h-auto w-[110px] object-contain"
            />
          )}
        </Link>
      </div>

      {/* =====================================================
          CENTER — SEARCH
      ====================================================== */}
      <div className="flex w-1/3 justify-center">
        <div className="flex h-[52px] w-[462px] max-w-full items-center rounded-full bg-[#F4F6F8] px-[13px]">
          <Search
            size={24}
            strokeWidth={2}
            className="shrink-0 text-[#718096]"
          />

          <input
            type="text"
            placeholder="Search"
            aria-label="Search"
            className="ml-[14px] h-full w-full bg-transparent text-[16px] font-normal text-[#334155] outline-none placeholder:text-[#C3CBD5]"
          />
        </div>
      </div>

      {/* =====================================================
          RIGHT — NOTIFICATIONS + PROFILE
      ====================================================== */}
      <div className="flex w-1/3 items-center justify-end gap-4">
        {/* Notifications */}
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <FiBell size={19} />

          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-medium leading-none text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Link>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-2.5 transition-colors ${
              menuOpen
                ? "border-[#2183C6] bg-[#2183C6]/5"
                : "border-slate-200 hover:bg-slate-100"
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

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-52 origin-top-right animate-[dropdown_0.12s_ease-out] overflow-hidden rounded-lg border border-slate-200 bg-white py-1.5 shadow-xl ring-1 ring-black/5">
              <Link
                href={settingsHref}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <FiSliders size={16} className="text-slate-500" />
                Settings
              </Link>

              <div className="my-1 h-px bg-slate-100" />

              <button
                type="button"
                onClick={onSignOut || (() => logoutAndRedirectToLogin("manual_signout"))}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <FiLogOut size={16} />
                Sign out
              </button>
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
      </div>
    </header>
  );
}