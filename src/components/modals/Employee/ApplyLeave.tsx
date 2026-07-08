"use client";

import { CalendarDays, ChevronDown } from "lucide-react";

interface ApplyForLeaveProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function ApplyLeave({ isOpen, onClose }: ApplyForLeaveProps) {
  if (!isOpen) return null;
  return (
    <div className="bg-white min-h-screen space-y-6 p-6">
      {/* Title */}
      <h1 className="text-[32px] font-semibold text-[#1D2939] mb-6">
        Apply Leave
      </h1>

      {/* Form */}
      <div className="max-w-[520px]">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {/* From */}
          <div>
            <label className="block text-[11px] text-[#98A2B3] mb-1">
              From
            </label>

            <div className="relative">
              <input
                type="date"
                className="w-full h-[40px] border border-[#D0D5DD] rounded-md px-3 text-sm outline-none focus:ring-1 focus:ring-[#2196F3]"
              />

              <CalendarDays
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none"
              />
            </div>
          </div>

          {/* To */}
          <div>
            <label className="block text-[11px] text-[#98A2B3] mb-1">To</label>

            <div className="relative">
              <input
                type="date"
                className="w-full h-[40px] border border-[#D0D5DD] rounded-md px-3 text-sm outline-none focus:ring-1 focus:ring-[#2196F3]"
              />

              <CalendarDays
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-5 mb-8">
          {/* Leave Type */}
          <div>
            <label className="block text-[11px] text-[#98A2B3] mb-1">
              Leave Type
            </label>

            <div className="relative">
              <select className="w-full h-[40px] border border-[#D0D5DD] rounded-md px-3 appearance-none text-sm text-[#344054] outline-none focus:ring-1 focus:ring-[#2196F3]">
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Annual Leave</option>
                <option>Half-Day Leave</option>
              </select>

              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none"
              />
            </div>
          </div>

          {/* Remaining Leave */}
          <div>
            <label className="block text-[11px] text-[#98A2B3] mb-1">
              Remaining Leaves
            </label>

            <input
              type="text"
              value="10"
              readOnly
              className="w-full h-[40px] border border-[#D0D5DD] rounded-md px-3 text-sm text-[#667085] bg-white"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="h-[40px] px-5 border border-[#D0D5DD] rounded-md text-sm font-medium text-[#344054] hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="h-[40px] px-10 bg-[#1684E0] hover:bg-[#1474c5] text-white rounded-md text-sm font-medium"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
