// src/components/payroll/payroll-settings/PayPeriods.tsx
"use client";

import { useEffect, useState } from "react";
import { getApiErrorMessage, getPayPeriodSettings, updatePayPeriodSettings } from "@/lib/api/payroll";

const PayPeriods = () => {
  const [payFrequency, setPayFrequency] = useState("");
  const [payDay, setPayDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPayPeriodSettings()
      .then((s) => {
        if (cancelled) return;
        setPayFrequency(s.payFrequency === "MONTHLY" ? "Monthly" : s.payFrequency);
        setPayDay(String(s.defaultPayDay));
      })
      .catch((e) => {
        if (!cancelled) setError(getApiErrorMessage(e, "Could not load pay period settings."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    const day = Number(payDay);
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      setSaved(false);
      return setError("Enter a pay day between 1 and 31.");
    }
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await updatePayPeriodSettings({ payFrequency: "MONTHLY", defaultPayDay: day });
      setSaved(true);
    } catch (e) {
      setError(getApiErrorMessage(e, "Could not save pay period settings."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="w-full bg-[#f9fafb]">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[16px] font-semibold leading-[20px] text-[#263238]">
          Pay Periods
        </h2>

        <p className="mt-2 text-[14px] font-normal leading-[20px] text-[#718096]">
          Configure how often payroll is processed and when employees are paid.
        </p>
      </div>

      {/* Settings Card */}
      <div className="w-full rounded-[4px] border border-dashed border-[#d9dee5] bg-white px-[29px] py-[27px]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-[20px]">
          {/* Pay Frequency */}
          <div className="flex flex-col">
            <label
              htmlFor="payFrequency"
              className="mb-[8px] text-[13px] font-normal leading-[18px] text-[#718096]"
            >
              Pay Frequency
            </label>

            <input
              id="payFrequency"
              type="text"
              value={loading ? "Loading..." : payFrequency}
              readOnly
              className="h-[44px] w-full rounded-[4px] border border-[#d9dee5] bg-white px-3 text-[14px] text-[#263238] outline-none transition focus:border-[#2588c9] focus:ring-1 focus:ring-[#2588c9]"
            />
          </div>

          {/* Default Pay Day */}
          <div className="flex flex-col">
            <label
              htmlFor="payDay"
              className="mb-[8px] text-[13px] font-normal leading-[18px] text-[#718096]"
            >
              Default Pay Day (Day of Month)
            </label>

            <input
              id="payDay"
              type="text"
              inputMode="numeric"
              value={payDay}
              onChange={(e) => {
                setPayDay(e.target.value.replace(/[^0-9]/g, ""));
                setSaved(false);
              }}
              disabled={loading}
              className="h-[44px] w-full rounded-[4px] border border-[#d9dee5] bg-white px-3 text-[14px] text-[#263238] outline-none transition focus:border-[#2588c9] focus:ring-1 focus:ring-[#2588c9]"
            />
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}
      {saved && <p className="mt-3 text-[13px] text-green-700">Settings saved.</p>}

      {/* Save Button */}
      <div className="mt-[16px]">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="h-[50px] rounded-[4px] bg-[#2588c9] px-[21px] text-[15px] font-semibold text-white transition hover:bg-[#197bb9] active:scale-[0.99] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </section>
  );
};

export default PayPeriods;