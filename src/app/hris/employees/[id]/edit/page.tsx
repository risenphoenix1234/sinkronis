"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditEmployeeRedirectPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly into the employee id page in edit mode
    router.replace(`/hris/employees/${params.id}?edit=true`);
  }, [params.id, router]);

  return (
    <div className="flex h-64 items-center justify-center p-6 text-sm text-slate-500">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
        <p>Loading employee editor…</p>
      </div>
    </div>
  );
}
