"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Sinkronis"
            width={160}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-[#2182C5] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1C6EA7]"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen((open) => !open)}
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-slate-700" />
          ) : (
            <Menu className="h-6 w-6 text-slate-700" />
          )}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="border-t border-slate-100 px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-slate-600"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-center text-sm font-semibold text-slate-700"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2182C5] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}