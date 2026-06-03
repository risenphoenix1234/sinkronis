'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import { APP_NAME } from '@/lib/constants'

const groups = [
  { base: '/ceo', label: 'CEO', items: [
    { href: '/ceo/profile', label: 'Profile' },
    { href: '/ceo/users', label: 'Users' },
    { href: '/ceo/plan', label: 'Plan' },
    { href: '/ceo/wallet', label: 'Wallet' },
    { href: '/ceo/settings', label: 'Settings' },
  ]},
  { base: '/hr', label: 'HR', items: [
    { href: '/hr/overview', label: 'Overview' },
    { href: '/hr/employee', label: 'Employee' },
    { href: '/hr/attendance', label: 'Attendance' },
    { href: '/hr/leave-tracking', label: 'Leave' },
    { href: '/hr/appraisal', label: 'Appraisal' },
    { href: '/hr/conduct', label: 'Conduct' },
    { href: '/hr/settings', label: 'Settings' },
  ]},
  { base: '/hod', label: 'HOD', items: [
    { href: '/hod/overview', label: 'Overview' },
    { href: '/hod/reportee', label: 'Reportee' },
    { href: '/hod/attendance', label: 'Attendance' },
    { href: '/hod/leave-tracking', label: 'Leave' },
    { href: '/hod/appraisal', label: 'Appraisal' },
    { href: '/hod/conduct', label: 'Conduct' },
    { href: '/hod/settings', label: 'Settings' },
  ]},
  { base: '/employee', label: 'Employee', items: [
    { href: '/employee/overview', label: 'Overview' },
    { href: '/employee/attendance', label: 'Attendance' },
    { href: '/employee/leave-tracking', label: 'Leave' },
    { href: '/employee/appraisal', label: 'Appraisal' },
    { href: '/employee/conduct', label: 'Conduct' },
    { href: '/employee/settings', label: 'Settings' },
  ]},
  { base: '/payroll', label: 'Payroll', items: [
    { href: '/payroll/overview', label: 'Overview' },
    { href: '/payroll/payee', label: 'Payee' },
    { href: '/payroll/payroll', label: 'Payroll' },
    { href: '/payroll/pension', label: 'Pension' },
    { href: '/payroll/tax', label: 'Tax' },
    { href: '/payroll/settings', label: 'Settings' },
  ]},
  { base: '/account', label: 'Accounting', items: [
    { href: '/account/dashboard', label: 'Dashboard' },
    { href: '/account/clients', label: 'Clients' },
    { href: '/account/items-services', label: 'Items & Services' },
    { href: '/account/projects', label: 'Projects' },
    { href: '/account/invoices', label: 'Invoices' },
    { href: '/account/agents', label: 'Agents' },
    { href: '/account/payment-requests', label: 'Payment Requests' },
    { href: '/account/expenses', label: 'Expenses' },
    { href: '/account/reminders', label: 'Reminders' },
    { href: '/account/reports', label: 'Reports' },
    { href: '/account/tax', label: 'Tax' },
    { href: '/account/wallets', label: 'Wallets' },
    { href: '/account/settings', label: 'Settings' },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="sticky top-0 h-screen w-[264px] shrink-0 border-r border-border bg-white">
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="h-8 w-8 rounded bg-primary" />
        <div className="font-semibold">{APP_NAME}</div>
      </div>
      <nav className="space-y-6 p-3">
        {groups.map(g => (
          <div key={g.base}>
            <div className="mb-2 px-2 text-xs font-semibold uppercase text-gray-500">{g.label}</div>
            <ul className="space-y-1">
              {g.items.map(i => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm hover:bg-gray-100',
                      pathname.startsWith(i.href) && 'bg-primary/10 text-primary'
                    )}
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
