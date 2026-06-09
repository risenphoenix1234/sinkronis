// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  const sections = [
    { href: "/login", label: "Auth - Login" },
    { href: "/platform-admin/overview", label: "Platform Admin" },
    { href: "/tenant-admin/overview", label: "Tenant Admin" },
    { href: "/hris/overview", label: "HRIS" },
    { href: "/hr/overview", label: "HR" },
    { href: "/manager/overview", label: "Manager" },
    { href: "/employee/overview", label: "Employee" },
    { href: "/payroll/overview", label: "Payroll" },
    { href: "/accounting/dashboard", label: "Accounting" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Multi-Role Dashboard Prototype</h1>
        <p className="text-slate-500">
          Static Next.js + TypeScript + Tailwind app with multiple dashboards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium shadow-sm hover:bg-slate-50"
          >
            {section.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
