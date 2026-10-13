// src/app/payroll/dashboard/page.tsx
import { redirect } from "next/navigation";

export default function PayrollDashboardRedirect() {
  redirect("/payroll/overview");
}
