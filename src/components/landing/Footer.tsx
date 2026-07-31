"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import Reveal from "./Reveal";

const linkColumns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
  },
];

const socials = [
  { label: "Twitter", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

export default function Footer() {
  return (
    <>
      {/* CTA Section — inlined directly here */}
      <section className="bg-[#212B36] px-6 py-20 sm:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to simplify your business?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Join hundreds of businesses already using Sinkronis to manage
            their people and finances.
          </p>

          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="Enter your work email"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2182C5]"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-[#2182C5] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1C6EA7]"
            >
              Request Access
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-500">
            {/* No credit card required. Free 30-day trial. */}
          </p>
        </Reveal>
      </section>

      <footer className="border-t border-[#212B36] bg-[#1A2230] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Image
                src="/logo.png"
                alt="Sinkronis"
                width={160}
                height={36}
                className="h-9 w-auto"
              />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                The all-in-one ERP platform built for African businesses.
              </p>
            </div>

            {linkColumns.map((column) => (
              <div key={column.heading}>
                <p className="text-sm font-semibold text-white">
                  {column.heading}
                </p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#212B36] pt-8 sm:flex-row">
            <p className="text-sm text-slate-500">
              © 2026 Sinkronis, All Rights Reserved.
              A product of People Advisor Limited
            </p>
            <div className="flex gap-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}