// src/app/platform-admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { SidebarItem } from "@/components/layout/Sidebar";
import { getMe } from "@/lib/api/auth";

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/platform-admin/overview",
    icon: "dashboard",
  },
  {
    label: "Tenants",
    href: "/platform-admin/tenants",
    icon: "tenants",
  },
  {
    label: "Pricing & Plans",
    href: "/platform-admin/plans",
    icon: "pricing",
  },
  {
    label: "Billing & Revenue",
    href: "/platform-admin/billing",
    icon: "billing",
  },
  {
    label: "Users",
    href: "/platform-admin/users",
    icon: "users",
  },
  {
    label: "Modules",
    href: "/platform-admin/modules",
    icon: "modules",
  },
  {
    label: "Analytics",
    href: "/platform-admin/analytics",
    icon: "analytics",
  },
  {
    label: "Support",
    href: "/platform-admin/support",
    icon: "support",
  },
];

export default function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await getMe();
        if (res.user.accountType === "PLATFORM_ADMIN") {
          setAuthorized(true);
        } else {
          router.replace("/tenant-admin/overview");
        }
      } catch (err) {
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">Checking access...</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="min-w-0 flex-1 overflow-x-auto">
        <DashboardLayout
          sidebarTitle="Platform Admin"
          sidebarItems={sidebarItems}
        >
          {children}
        </DashboardLayout>
      </div>
    </div>
  );
}