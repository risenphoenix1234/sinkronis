"use client";

import { Mail } from "lucide-react";
import Reveal from "./Reveal";

export default function CTASection() {
  return (
    <section className="bg-[#232a31] px-6 py-20 sm:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to simplify your business?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-300">
          Join hundreds of businesses already using Sinkronis to manage their
          people and finances.
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
  );
}