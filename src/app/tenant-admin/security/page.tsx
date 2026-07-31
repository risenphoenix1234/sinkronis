// src/app/tenant-admin/security/page.tsx
import { redirect } from "next/navigation";

export default function SecurityIndexPage() {
  redirect("/tenant-admin/security/password-policy");
}