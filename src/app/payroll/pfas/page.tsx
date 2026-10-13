// src/app/payroll/pfas/page.tsx
import { redirect } from "next/navigation";

export default function PfasRedirect() {
  redirect("/payroll/pension");
}
