// src/app/(auth)/layout.tsx
import Image from "next/image";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-1/2 items-center justify-center bg-[#F2FBFF] lg:flex">
        <Image
          src="/logo2.png"
          alt="Sinkronis"
          width={720}
          height={420}
          priority
          className="h-auto w-3/4 max-w-[560px]"
        />
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}