"use client";

import { useState } from "react";

const PayPeriods = () => {
  const [payFrequency, setPayFrequency] = useState("");
  const [payDay, setPayDay] = useState("");

  const handleSave = () => {
    console.log({
      payFrequency,
      payDay,
    });
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
              value={payFrequency}
              onChange={(e) => setPayFrequency(e.target.value)}
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
              value={payDay}
              onChange={(e) => setPayDay(e.target.value)}
              className="h-[44px] w-full rounded-[4px] border border-[#d9dee5] bg-white px-3 text-[14px] text-[#263238] outline-none transition focus:border-[#2588c9] focus:ring-1 focus:ring-[#2588c9]"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-[16px]">
        <button
          type="button"
          onClick={handleSave}
          className="h-[50px] rounded-[4px] bg-[#2588c9] px-[21px] text-[15px] font-semibold text-white transition hover:bg-[#197bb9] active:scale-[0.99]"
        >
          Save Settings
        </button>
      </div>
    </section>
  );
};

export default PayPeriods;
