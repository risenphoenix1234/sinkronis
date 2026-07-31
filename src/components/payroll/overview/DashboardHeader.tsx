import { DownloadCloud } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex items-start justify-between">
      {/* Left */}
      <div>
        <p className="text-[15px] text-[#667085]">
          Welcome back,{" "}
          <span className="font-semibold text-[#101828]">Tochikwu.</span>
        </p>
      </div>

      {/* Right */}
      <button className="flex items-center gap-2 rounded-lg border border-[#EAECF0] bg-white px-4 py-2 text-sm font-medium text-[#344054] transition hover:bg-gray-50">
        <DownloadCloud size={16} />
        Export Report
      </button>
    </div>
  );
}
