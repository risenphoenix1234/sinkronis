// src/app/tenant-admin/user-management/page.tsx
import { redirect } from "next/navigation";

export default function UserManagementIndexPage() {
  redirect("/tenant-admin/user-management/users");
}