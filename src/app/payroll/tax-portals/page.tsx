// src/app/payroll/tax-portals/page.tsx
import { redirect } from "next/navigation";

export default function TaxPortalsRedirect() {
  redirect("/payroll/tax");
}