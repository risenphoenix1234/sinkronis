'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader title="CEO · Wallet" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <div className="text-sm text-gray-500">Balance</div>
          <div className="mt-2 text-2xl font-semibold">₦1,250,000</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Inflow</div>
          <div className="mt-2 text-2xl font-semibold">₦520,000</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Outflow</div>
          <div className="mt-2 text-2xl font-semibold">₦120,000</div>
        </div>
      </div>
    </DashboardLayout>
  )
}
