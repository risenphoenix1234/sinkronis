// src/components/landing/Hero.tsx
"use client";

import Image from "next/image";
import { ArrowRight, Play, ShieldCheck, Zap, Globe } from "lucide-react";

export default function Hero() {
  return (
    <>
      <section
        className="relative w-full overflow-hidden"
      >
        {/* Hero background */}
        <Image
          src="/whitebg.png"
          alt=""
          fill
          priority
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />

        <div
          className="relative z-10 mx-auto max-w-[1440px]
                     pt-[40px] pb-[48px] px-4
                     sm:px-6 sm:pt-[60px] sm:pb-[60px]
                     lg:pt-[100px] lg:pr-[80px] lg:pb-[80px] lg:pl-[80px]
                     lg:h-[648px]"
        >
          <div className="grid h-full grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-[80px]">
          {/* Left column */}
          <div className="max-w-[630px] animate-slide-in-left">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-[#C7E2F5] bg-[#F5FAFE] px-4 py-1.5 sm:px-5 sm:py-2">
              <div className="mr-2 h-[6px] w-[6px] rounded-full bg-[#2388D0]" />
              <span className="text-[10px] font-semibold tracking-[0.14em] sm:text-[11px] sm:tracking-[0.18em] text-[#2388D0] uppercase">
                Compact ERP Platform
              </span>
            </div>

            {/* Heading — REMOVED custom font, kept all other styles */}
            <h1
              className="mt-6 flex flex-col gap-1 pb-4 font-bold
                         text-[28px] leading-[34px] tracking-[0%] text-[#1F2937]
                         sm:mt-8 sm:text-[40px] sm:leading-[46px]
                         md:text-[46px] md:leading-[52px]
                         lg:mt-10 lg:text-[52px] lg:leading-[58.24px]"
            >
              <span className="block">Manage Your People.</span>
              <span className="block">Run Your Numbers.</span>
          <span className="block">
  <span className="text-[#2183C6]">Scale Your</span>{" "}
  <span className="inline-block -rotate-[2deg] bg-[#2183C6] px-2 py-1 text-white sm:px-3">
    Business.
  </span>
</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 max-w-[360px] text-[16px] font-normal sm:mt-7 sm:text-[20px] text-[#667085]">
              Smart HR, payroll and accounting
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-10 sm:gap-10">
              <button className="flex h-[48px] items-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] px-6 text-sm font-semibold sm:h-[56px] sm:px-8 sm:text-base text-white transition hover:opacity-90">
                Start Free Trial
                <ArrowRight className="ml-3 h-5 w-5" />
              </button>

              <button className="flex items-center gap-3 font-semibold text-[#1F2937]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full">
                  <Play className="h-4 w-4 fill-[#EF4444] text-[#EF4444]" />
                </div>
                See Demo
              </button>
            </div>

            {/* Features */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-[#667085] sm:mt-10 sm:gap-8 sm:text-[14px]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#2388D0]" strokeWidth={1.7} />
                Secure &amp; private
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#2388D0]" strokeWidth={1.7} />
                5-minute setup
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#2388D0]" strokeWidth={1.7} />
                Naira-native
              </div>
            </div>
          </div>

          {/* Right column — woman photo + floating icons */}
          <div className="relative z-10 mx-auto flex justify-center animate-slide-in-right">
            <div className="relative h-[300px] w-[300px] max-w-full sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
              <Image
                src="/hero-main.png"
                alt="Sinkronis platform user"
                fill
                priority
                className="object-contain"
              />

              {/* floating avatar cards */}
              <div className="absolute left-[-6px] top-[26%] h-14 w-32 animate-slide-in-right sm:left-[-10px] sm:h-24 sm:w-56" style={{ animationDelay: "0.3s" }}>
                <Image src="/avatar-1.png" alt="User avatar" fill className="object-contain" />
              </div>

              <div className="absolute bottom-[4%] right-[-6px] h-14 w-32 animate-slide-in-right sm:h-24 sm:w-56" style={{ animationDelay: "0.45s" }}>
                <Image src="/avatar-2.png" alt="User avatar" fill className="object-contain" />
              </div>

              {/* floating folder icon */}
            <div className="absolute left-[24%] top-[20%] h-10 w-10 rotate-[-6deg] sm:h-16 sm:w-16 z-20 animate-slide-in-right" style={{ animationDelay: "0.6s" }}>
              <Image src="/file.png" alt="" fill className="object-contain" />
            </div>

            <div className="absolute bottom-[16%] right-[-3%] h-10 w-10 rotate-[8deg] sm:h-14 sm:w-14 z-20 animate-slide-in-right" style={{ animationDelay: "0.75s" }}>
              <Image src="/bell.png" alt="" fill className="object-contain" />
            </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Trusted-by strip */}
      <section className="w-full bg-[#0B3A63] py-6 sm:py-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-[80px]">
          <p className="text-center text-[13px] font-medium text-[#9FC2DE] sm:text-[14px] lg:whitespace-nowrap">
            Built for African Businesses
          </p>

         
        </div>
      </section>
      <style jsx global>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out both;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out both;
        }
      `}</style>
    </>
  );
}