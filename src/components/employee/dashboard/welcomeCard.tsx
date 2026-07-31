"use client";

export default function WelcomeCard() {
  return (
    <div className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 p-8 text-white shadow">
      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <div>
          <h2 className="text-3xl font-bold">Good morning, Amara 👋</h2>

          <p className="mt-4 text-sm text-blue-100">
            HR Manager • Human Resources
          </p>

          <p className="mt-1 text-sm text-blue-100">Saturday, 11 July 2026</p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-sm text-blue-100">Employee ID</p>

          <h3 className="mt-1 text-3xl font-bold">EMP-0042</h3>

          <p className="mt-2 text-sm text-blue-100">Lagos Head Office</p>
        </div>
      </div>
    </div>
  );
}
