"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmployeesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/payroll/payees");
  }, [router]);

  return (
    <div className="flex h-[60vh] items-center justify-center text-sm text-[#6b7280]">
      Redirecting to Payees Directory…
    </div>
  );
}
