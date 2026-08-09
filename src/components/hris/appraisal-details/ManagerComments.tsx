import { CalendarDays, UserRound } from "lucide-react";

export default function ManagerComment() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b px-6 py-5">
        <h2 className="font-semibold text-slate-800">Manager Sign-off</h2>

        <p className="mt-1 text-xs text-slate-400">
          Final comments from the reviewing manager
        </p>
      </div>

      <div className="p-6">
        <div className="rounded-lg border bg-[#F8FAFC] p-5">
          <p className="text-sm leading-7 text-slate-600">
            Tunde has made meaningful contributions this quarter and has
            demonstrated a clear willingness to improve operational processes.
            The next quarter should focus on stronger execution against agreed
            targets and improved stakeholder follow-up.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-8 border-t pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF4FF]">
              <UserRound size={16} className="text-[#1677C8]" />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">Reviewed by</p>

              <p className="text-sm font-semibold text-slate-700">
                Chukwumeka Obi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF4FF]">
              <CalendarDays size={16} className="text-[#1677C8]" />
            </div>

            <div>
              <p className="text-[11px] text-slate-400">Review Date</p>

              <p className="text-sm font-semibold text-slate-700">
                30 June 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
