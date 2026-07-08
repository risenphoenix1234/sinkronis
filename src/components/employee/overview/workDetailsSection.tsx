import { workDetails } from "@/data/employee/overview";

export function WorkDetailsSection() {
  return (
    <section className="rounded border border-[#E5E7EB] bg-white">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-8 py-6">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold">Work Details</h3>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
            Confirmed
          </span>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-[#6B7280]">
            Employee ID:
            <span className="ml-2 font-semibold text-black">003546AE</span>
          </p>

          <button className="rounded border border-[#E5E7EB] px-4 py-2 text-sm">
            Hide
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-y-8 px-8 py-8">
        {workDetails.map((item) => (
          <div key={item.label}>
            <p className="text-sm text-[#9CA3AF]">{item.label}</p>

            <p className="mt-2 font-semibold text-[#1F2937]">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
