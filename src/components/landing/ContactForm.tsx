// src/components/landing/ContactForm.tsx
"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import {
  BASE_PLAN_NAMES,
  formatPrice,
  parsePrice,
  plans,
} from "@/components/landing/Pricingsection";

const CONTACT_EMAIL = "info@peopleadvisor.org";

const inputClass =
  "h-12 w-full rounded-lg border border-[#E5E9F0] bg-white px-4 text-[15px] text-[#1F2937] outline-none placeholder:text-[#98A2B3] focus:border-[#2388D0]";

function parsePlansParam(raw: string | null): string[] {
  if (!raw) return [];
  const valid = plans.map((p) => p.name);
  const picked = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => valid.includes(s));
  const unique = Array.from(new Set(picked));
  if (unique.includes("All-in-One")) return ["All-in-One"];
  return BASE_PLAN_NAMES.every((p) => unique.includes(p)) ? ["All-in-One"] : unique;
}

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>(() => parsePlansParam(searchParams.get("plans")));
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const togglePlan = (name: string) => {
    setSelected((prev) => {
      if (name === "All-in-One") return prev.includes(name) ? [] : ["All-in-One"];
      const next = prev.includes(name)
        ? prev.filter((p) => p !== name)
        : [...prev.filter((p) => p !== "All-in-One"), name];
      return BASE_PLAN_NAMES.every((p) => next.includes(p)) ? ["All-in-One"] : next;
    });
  };

  const total = selected.reduce((sum, name) => {
    const plan = plans.find((p) => p.name === name);
    return sum + (plan ? parsePrice(plan.price) : 0);
  }, 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !company.trim()) {
      setError("Please fill in your name, work email and company name.");
      return;
    }
    if (selected.length === 0) {
      setError("Select at least one plan you would like to subscribe to.");
      return;
    }
    const subject = `Sinkronis access request - ${company.trim()}`;
    const body = [
      `Name: ${fullName.trim()}`,
      `Email: ${email.trim()}`,
      `Phone: ${phone.trim() || "-"}`,
      `Company: ${company.trim()}`,
      `Plans: ${selected.join(", ")} (${formatPrice(total)}/month)`,
      "",
      message.trim() || "-",
    ].join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section className="bg-[#F5FAFE] px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] lg:px-[80px]">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-[32px] font-bold leading-[40px] text-[#1F2937] sm:text-[44px] sm:leading-[52px]">
            Request access
          </h2>
          <p className="mt-5 text-[16px] leading-[26px] text-[#667085] sm:text-[18px] sm:leading-[28px]">
            Tell us about your company and the plan you want. Our team will set up your
            organisation and send your admin login details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 max-w-[760px] rounded-2xl border border-[#E5E9F0] bg-white p-6 sm:p-10"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[13px] font-medium text-[#344054]">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-medium text-[#344054]">Work email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-medium text-[#344054]">Company name</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Ltd"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-medium text-[#344054]">
                Phone <span className="font-normal text-[#98A2B3]">(optional)</span>
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0801 234 5678"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-[13px] font-medium text-[#344054]">Selected plan(s)</label>
            <input
              readOnly
              value={selected.length ? selected.join(", ") : ""}
              placeholder="Choose a plan below"
              className={`${inputClass} mb-3 bg-[#F9FAFB] font-semibold text-[#2388D0]`}
            />
            <div className="flex flex-wrap gap-3">
              {plans.map((plan) => {
                const active = selected.includes(plan.name);
                return (
                  <button
                    key={plan.name}
                    type="button"
                    onClick={() => togglePlan(plan.name)}
                    aria-pressed={active}
                    className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-[14px] font-semibold transition ${
                      active
                        ? "border-[#2388D0] bg-[#2388D0] text-white"
                        : "border-[#2388D0] text-[#2388D0] hover:bg-[#F5FAFE]"
                    }`}
                  >
                    {active && <Check className="h-4 w-4" strokeWidth={3} />}
                    {plan.name} · {plan.price}
                  </button>
                );
              })}
            </div>
            {selected.length > 0 && (
              <p className="mt-3 text-[14px] text-[#667085]">
                Total:{" "}
                <span className="font-semibold text-[#1F2937]">{formatPrice(total)}/month</span>
              </p>
            )}
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-[13px] font-medium text-[#344054]">
              Message <span className="font-normal text-[#98A2B3]">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Anything we should know? Number of employees, go-live date, etc."
              className="w-full rounded-lg border border-[#E5E9F0] bg-white px-4 py-3 text-[15px] text-[#1F2937] outline-none placeholder:text-[#98A2B3] focus:border-[#2388D0]"
            />
          </div>

          {error && <p className="mt-4 text-[14px] text-[#D92D20]">{error}</p>}
          {sent && !error && (
            <p className="mt-4 text-[14px] text-[#1B7A34]">
              Your email app should open with your request. Just press send and we will get back to you.
            </p>
          )}

          <button
            type="submit"
            className="mt-8 flex h-[56px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#1F88C7] to-[#0CB4D1] px-8 font-semibold text-white transition hover:opacity-90"
          >
            Send request
          </button>
        </form>
      </div>
    </section>
  );
}