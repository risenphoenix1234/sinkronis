// src/app/tenant-admin/notifications-alerts/page.tsx
import { redirect } from "next/navigation";

export default function NotificationsAlertsIndexPage() {
  redirect("/tenant-admin/notifications/in-app");
}