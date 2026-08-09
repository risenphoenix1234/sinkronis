// src/components/layout/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiBell, FiChevronDown, FiLogOut, FiSliders } from "react-icons/fi";

interface NavbarProps {
  title: string;
  notificationCount?: number;
  settingsHref?: string;
  onSignOut?: () => void;
}

export default function Navbar({
  title,
  notificationCount = 2,
  settingsHref = "/settings",
  onSignOut,
}: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">{title}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          {pathname}
        </span>
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
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces"
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