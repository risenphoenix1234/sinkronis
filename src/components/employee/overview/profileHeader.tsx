import Image from "next/image";

export function ProfileHeader() {
  return (
    <header className="flex items-center justify-between border-b border-[#E5E7EB] pb-5">
      <div className="flex items-center gap-5">
        <div className="relative h-14 w-14 overflow-hidden rounded-full">
          <Image
            src="/avatar.jpg"
            alt="employee"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-[32px] font-semibold text-[#1F2937]">
            John Smith
          </h1>

          <p className="text-sm text-[#9CA3AF]">HR Director</p>
        </div>
      </div>

      <button className="rounded-full border border-[#F97316] px-6 py-2 text-sm text-[#F97316]">
        Employee
      </button>
    </header>
  );
}
