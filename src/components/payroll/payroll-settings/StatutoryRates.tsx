// src/components/payroll/payroll-settings/StatutoryRates.tsx
"use client";

import { useEffect, useState } from "react";
import { getApiErrorMessage, getStatutoryRates } from "@/lib/api/payroll";
import type { StatutoryRatesData } from "@/lib/api/types/payroll.types";

type Row = { label: string; value: string };

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

const pct = (rate: string | number) => `${Number((Number(rate) * 100).toFixed(2))}%`;

const BASIS_LABELS: Record<string, string> = {
  BASIC: "Basic",
  HOUSING: "Housing",
  TRANSPORT: "Transport",
  GROSS: "Gross Salary",
};

const basisText = (basis: string | string[]) =>
  (Array.isArray(basis) ? basis : [basis]).map((b) => BASIS_LABELS[b] ?? b).join(" + ");

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

const payeeRows = (rates: StatutoryRatesData): Row[] => {
  let used = 0;
  return rates.paye.bands.map((band, i) => {
    if (band.threshold === null) {
      return { label: `Above ${naira(used)}`, value: pct(band.rate) };
    }
    const label = `${i === 0 ? "First" : "Next"} ${naira(band.threshold)}`;
    used += band.threshold;
    return { label, value: pct(band.rate) };
  });
};

type RateRowProps = {
  label: string;
  value: string;
  last?: boolean;
};

function RateRow({ label, value, last = false }: RateRowProps) {
  return (
    <div
      className={[
        "grid grid-cols-[1fr_1fr] min-h-[48px] items-center px-5 sm:px-6",
        !last ? "border-b border-dotted border-slate-200" : "",
      ].join(" ")}
    >
      <div className="text-sm text-slate-600">{label}</div>

      <div className="text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

type SectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function RateSection({ title, description, children }: SectionProps) {
  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="px-5 py-4 sm:px-6">
        <h2 className="text-sm font-semibold text-slate-800 sm:text-base">
          {title}
        </h2>

        <p className="mt-1.5 text-sm leading-5 text-slate-500">{description}</p>
      </div>

      <div>{children}</div>
    </section>
  );
}

function AlternatingRows({ rows }: { rows: Row[] }) {
  return (
    <div>
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={[
            index % 2 === 0 ? "bg-white" : "bg-slate-100/80",
            index !== rows.length - 1
              ? "border-b border-dotted border-slate-200"
              : "",
          ].join(" ")}
        >
          <RateRow
            label={row.label}
            value={row.value}
            last={index === rows.length - 1}
          />
        </div>
      ))}
    </div>
  );
}

export default function StatutoryRates() {
  const [rates, setRates] = useState<StatutoryRatesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getStatutoryRates()
      .then((r) => {
        if (!cancelled) setRates(r);
      })
      .catch((e) => {
        if (!cancelled) setError(getApiErrorMessage(e, "Could not load statutory rates."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const taxRows = rates ? payeeRows(rates) : [];
  const dueDay = rates?.paye.remittanceDueDay;

  const pensionRows: Row[] = rates
    ? [
        {
          label: "Employee Contribution",
          value: `${pct(rates.pension.employeeRate)} of (${basisText(rates.pension.basis)})`,
        },
        {
          label: "Employer Contribution",
          value: `${pct(rates.pension.employerRate)} of (${basisText(rates.pension.basis)})`,
        },
        {
          label: "Pensionable Earnings",
          value: basisText(rates.pension.basis),
        },
      ]
    : [];

  const nhfRows: Row[] = rates
    ? [
        {
          label: "Employee Contribution",
          value: `${pct(rates.nhf.employeeRate)} of ${basisText(rates.nhf.basis)}${rates.nhf.basis === "BASIC" ? " Salary" : ""}`,
        },
      ]
    : [];

  const nsitfRows: Row[] = rates
    ? [
        {
          label: "Employer Contribution",
          value: `${pct(rates.nsitf.employerRate)} of ${basisText(rates.nsitf.basis)}`,
        },
      ]
    : [];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto space-y-6">
        {/* Page heading */}
        <header className="mb-7">
          <h1 className="text-xl font-semibold tracking-tight text-slate-800">
            Statutory Rates
          </h1>

          <p className="mt-2 text-sm leading-5 text-slate-500">
            Current statutory contribution rates as prescribed by Nigerian law.
          </p>
        </header>

        {loading && <p className="text-sm text-slate-500">Loading...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {rates && (
          <div className="space-y-5">
            {/* PAYE */}
            <RateSection
              title="PAYE Income Tax (FIRS)"
              description={`Pay As You Earn — deducted from employee and remitted to FIRS monthly${dueDay ? `, by the ${ordinal(dueDay)} of the following month` : ""}.`}
            >
              <div>
                {taxRows.map((row, index) => (
                  <div
                    key={row.label}
                    className={[
                      "grid grid-cols-[1fr_1fr] min-h-[48px] items-center px-5 sm:px-6",
                      index % 2 === 0 ? "bg-white" : "bg-slate-100/80",
                      index !== taxRows.length - 1
                        ? "border-b border-dotted border-slate-200"
                        : "",
                    ].join(" ")}
                  >
                    <div className="text-sm text-slate-600">{row.label}</div>

                    <div className="text-center text-sm font-semibold text-slate-800">
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </RateSection>

            {/* Pension */}
            <RateSection
              title="Pension (PENCOM)"
              description="Contributory pension scheme — both employee and employer contribute."
            >
              <AlternatingRows rows={pensionRows} />
            </RateSection>

            {/* NHF */}
            <RateSection
              title="National Housing Fund (NHF)"
              description="Federal Mortgage Bank contribution deducted from employee."
            >
              <AlternatingRows rows={nhfRows} />
            </RateSection>

            {/* NSITF */}
            <RateSection
              title="NSITF (Work Injuries)"
              description="Nigeria Social Insurance Trust Fund — employer-only contribution."
            >
              <AlternatingRows rows={nsitfRows} />
            </RateSection>
          </div>
        )}
      </div>
    </main>
  );
}