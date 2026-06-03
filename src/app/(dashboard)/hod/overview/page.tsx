'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import Input from '@/components/ui/Input'

function StatTile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {sub ? <div className="mt-1 text-xs text-gray-400">{sub}</div> : null}
    </div>
  )
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2 text-sm">
      <div className="col-span-1 text-gray-500">{k}</div>
      <div className="col-span-2 text-gray-800">{v}</div>
    </div>
  )
}

export default function Page() {
  return (
    <DashboardLayout>
      {/* Top bar with logo-ish mark and search, like the Figma header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-[#2183C6]" />
          <div className="text-lg font-semibold text-gray-800">Sinkronis</div>
        </div>
        <div className="w-[420px]">
          <div className="relative">
            <Input placeholder="Search" />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Search</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Breadcrumb-ish section title */}
      <PageHeader title="HOD · Overview" />

      {/* Profile header card */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200" />
            <div>
              <div className="font-semibold text-gray-900">John Smith</div>
              <div className="text-xs text-gray-500">HR Director</div>
            </div>
          </div>
          <button className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
            Employee
          </button>
        </div>
      </div>

      {/* KPI tiles row */}
      <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Attendance" value="14/16" sub={<span className="text-green-600">+2 since last Month</span> as any} />
        <StatTile label="Working Hours" value="2,780 h" sub={<span className="text-green-600">+2%</span> as any} />
        <StatTile label="Appraisal" value="210" sub={<span className="text-red-500">-1% last month</span> as any} />
        <StatTile label="Approvals" value="48" sub="Pending this month" />
      </div>

      {/* Work details split card */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 text-sm">
          <div className="font-medium text-gray-800">Work Details</div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">
              Confirmed
            </span>
            <div className="hidden text-xs text-gray-500 sm:block">Employee ID: <span className="font-medium">OO3546AE</span></div>
            <button className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">Hide</button>
          </div>
        </div>
        <div className="grid gap-6 px-4 py-4 md:grid-cols-2">
          <div className="rounded-md bg-gray-50 p-4">
            <KV k="Department" v="HR Department" />
            <KV k="Phone" v="+234 9045674567" />
            <KV k="Email" v="johnsmith@gmail.com" />
            <KV k="Nationality" v="Nigeria" />
            <KV k="City" v="Ibadan" />
            <KV k="Work mode" v="Remote" />
          </div>
          <div className="rounded-md bg-gray-50 p-4">
            <KV k="Date of Birth" v="02-05-1999" />
            <KV k="Marital Status" v="Single" />
            <KV k="Gender" v="Male" />
            <KV k="State" v="Oyo" />
            <KV k="Address" v="123 Main Street, Cityville, ST 12345" />
            <KV k="Earnings" v="₦650,000" />
          </div>
        </div>
      </div>

      {/* Employee Activity timeline */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-800">Employee Activity</div>
        <ol className="space-y-4 px-6 py-5">
          {[
            { t: 'Check Out', ts: '13 May 2026 05:30pm', d: 'You have successfully checked out.' },
            { t: 'Appraisal', ts: '13 May 2026 05:30pm', d: 'The task would be completed soon.' },
            { t: 'Check In', ts: '13 May 2026 09:30am', d: 'You have successfully checked in.' },
          ].map((e, i) => (
            <li key={i} className="relative pl-6">
              <span className="absolute left-0 top-1 grid h-3 w-3 place-items-center rounded-full border-2 border-[#2183C6] bg-white" />
              <div className="text-sm font-medium text-gray-800">{e.t}</div>
              <div className="text-xs text-gray-400">{e.ts}</div>
              <div className="mt-1 text-sm text-gray-600">{e.d}</div>
            </li>
          ))}
        </ol>
      </div>
    </DashboardLayout>
  )
}
