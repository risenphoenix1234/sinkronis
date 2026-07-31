// app/tenant-admin/general-settings/page.tsx
import { redirect } from "next/navigation";

export default function GeneralSettingsIndex() {
  redirect("/tenant-admin/general-settings/locale-region");
}