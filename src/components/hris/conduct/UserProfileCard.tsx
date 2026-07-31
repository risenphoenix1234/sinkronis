// components/UserProfileCard.tsx

import { User, Wallet, Users, LogIn } from "lucide-react";

export default function UserProfileCard() {
  return (
    <div className="fixed right-6 top-5 z-[60] w-[250px] rounded-xl bg-white shadow-xl">
      <div className="p-5">
        <div className="flex items-center gap-3">
          <img src="/avatar2.png" alt="" className="h-12 w-12 rounded-full" />

          <div>
            <h3 className="font-semibold text-[#101828]">Nwokaego Adella</h3>

            <p className="text-xs text-[#667085]">Consultant</p>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-sm text-[#667085]">
          <button className="flex items-center gap-2">
            <User size={16} />
            View Profile
          </button>

          <button className="flex items-center gap-2">
            <Wallet size={16} />
            Wallet
          </button>

          <button className="flex items-center gap-2">
            <Users size={16} />
            Manage Users
          </button>
        </div>

        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#D0D5DD] py-2 text-sm">
          <LogIn size={16} />
          Sign in with a different account
        </button>
      </div>
    </div>
  );
}
