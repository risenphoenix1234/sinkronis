"use client";

import Image from "next/image";
import {
  Users,
  BarChart3,
  Clock,
  CalendarDays,
  Star,
  AlertTriangle,
  FileText,
  CreditCard,
  Receipt,
  BarChart2,
  Wallet,
  Landmark,
  LayoutGrid,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type ModuleCard = {
  moduleLabel: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  linkColor: string;
  exploreLabel: string;
  featureIconBg: string;
  featureIconColor: string;
  features: Feature[];
};

const modules: ModuleCard[] = [
  {
    moduleLabel: "Module 01",
    title: "HRIS",
    description:
      "Human Resource Information System — manage your people from onboarding to off-boarding.",
    icon: Users,
    iconBg: "bg-[#2182C5]/10",
    iconColor: "text-[#2182C5]",
    linkColor: "text-[#2182C5]",
    exploreLabel: "Explore HRIS features",
    featureIconBg: "bg-[#2182C5]/10",
    featureIconColor: "text-[#2182C5]",
    features: [
      {
        icon: Clock,
        title: "Attendance",
        description:
          "Clock-ins, shift scheduling, overtime tracking, and dispute resolution in one place.",
      },
      {
        icon: CalendarDays,
        title: "Leave Management",
        description:
          "Approve leave requests, track balances, and manage team availability effortlessly.",
      },
      {
        icon: Star,
        title: "Performance Appraisals",
        description:
          "Set goals, run review cycles, and surface top performers with structured appraisals.",
      },
      {
        icon: AlertTriangle,
        title: "Conduct & Discipline",
        description:
          "Log incidents, issue queries, and maintain a transparent conduct trail.",
      },
    ],
  },
  {
    moduleLabel: "Module 02",
    title: "Accounting",
    description:
      "Full accounting suite — manage clients, invoices, expenses, and tax without a separate tool.",
    icon: BarChart3,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    linkColor: "text-emerald-600",
    exploreLabel: "Explore Accounting features",
    featureIconBg: "bg-emerald-50",
    featureIconColor: "text-emerald-600",
    features: [
      {
        icon: FileText,
        title: "Invoices & Payments",
        description:
          "Generate professional invoices, track payment status, and send automated reminders.",
      },
      {
        icon: CreditCard,
        title: "Expense Logging",
        description:
          "Categorise and record expenses with full approval workflows and reporting.",
      },
      {
        icon: Receipt,
        title: "Tax & Compliance",
        description:
          "Compute VAT, generate tax summaries, and stay ahead of reporting obligations.",
      },
      {
        icon: BarChart2,
        title: "Financial Reports",
        description:
          "P&L snapshots, revenue trends, and agent commission reports — always up to date.",
      },
    ],
  },
  {
    moduleLabel: "Module 03",
    title: "Payroll",
    description:
      "Comprehensive payroll management handles employee payments, deductions, benefits, and tax filings all in one place.",
    icon: Wallet,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    linkColor: "text-orange-600",
    exploreLabel: "Explore Payroll features",
    featureIconBg: "bg-orange-50",
    featureIconColor: "text-orange-600",
    features: [
      {
        icon: FileText,
        title: "Calculate staff breakdown",
        description:
          "Create detailed invoices, monitor payment progress, and automate reminder notifications.",
      },
      {
        icon: LayoutGrid,
        title: "Bulk Salary Disburse & One-Off Payment",
        description:
          "Easily manage bulk salary disbursements and one-off payments with streamlined approval processes.",
      },
      {
        icon: Landmark,
        title: "Remit Taxes & Pension",
        description:
          "Ensure timely remittance of taxes and pension to support employees' future financial security.",
      },
      {
        icon: BarChart2,
        title: "Payroll Report & Audit",
        description:
          "Our Payroll Report & Audit service ensures your payroll data is precise and up-to-date.",
      },
    ],
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden px-6 py-24">
      {/* Background image + dark-blue overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/happy-african-american-bank-manager-shaking-hands-with-client.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#004F84]/85" />
      </div>

      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">
            Platform Features
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Everything your business needs
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/80">
            Three powerful modules. One unified workspace.
          </p>
        </Reveal>

        {/* Module cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {modules.map((mod, index) => (
            <Reveal
              key={mod.title}
              delay={index * 150}
              className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-8"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${mod.iconBg}`}
                >
                  <mod.icon className={`h-5 w-5 ${mod.iconColor}`} />
                </span>
                <div>
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${mod.iconColor}`}
                  >
                    {mod.moduleLabel}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900">
                    {mod.title}
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                {mod.description}
              </p>

              <div className="mt-6 space-y-5 border-t border-slate-100 pt-6">
                {mod.features.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${mod.featureIconBg}`}
                    >
                      <feature.icon className={`h-4 w-4 ${mod.featureIconColor}`} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {feature.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              
                <a href="#"
                className={`mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold ${mod.linkColor} transition hover:gap-1.5`}
              >
                {mod.exploreLabel}
                <ChevronRight className="h-4 w-4" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}