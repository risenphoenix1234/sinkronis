"use client";

import Image from "next/image";
import { User, Settings, LogOut } from "lucide-react";
import { logoutAndRedirectToLogin } from "@/utils/authSession";

export default function ProfileDropdown() {
  return (
    <div className="w-[184px] bg-white rounded-md shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Image
            src="/avatar.png"
            alt="Profile"
            width={48}
            height={48}
            className="rounded-full object-cover"
          />

          <div>
            <h3 className="text-[14px] font-medium text-[#1D2939]">
              Nwakaego Adella
            </h3>

            <p className="text-[10px] text-[#98A2B3]">
              OsolaseMary11@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#EAECF0]" />

      {/* Menu Items */}
      <div>
        <button className="flex w-full items-center gap-3 px-4 py-3 text-[12px] text-[#667085] hover:bg-gray-50">
          <User size={14} />
          View profile
        </button>

        <button className="flex w-full items-center gap-3 px-4 py-3 text-[12px] text-[#667085] hover:bg-gray-50">
          <Settings size={14} />
          Settings
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-[#EAECF0]" />

      {/* Footer */}
      <button className="flex w-full items-center gap-3 px-4 py-3 text-[12px] text-[#1684E0] hover:bg-blue-50">
        <LogOut size={14} />
        Sign in with a different account
      </button>

      {/* Sign Out Link */}
      <button
        onClick={() => logoutAndRedirectToLogin("employee_signout")}
        className="absolute top-3 right-4 text-[11px] font-medium text-[#F04438] hover:text-red-600"
      >
        Sign out
      </button>
    </div>
  );
}