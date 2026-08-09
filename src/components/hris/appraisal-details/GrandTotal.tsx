import StatusBadge from "../appraisal/StatusBadge";

export default function GrandTotal() {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[#232C39] px-6 py-4">
      <h2 className="text-sm font-semibold uppercase text-white">
        Grand Total — Q2
      </h2>

      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-[#D8A72C]">65.8%</span>

        <StatusBadge text="Below Expectation" color="yellow" />
      </div>
    </div>
  );
}
