'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/ui/Button'

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader title="CEO · Plan" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { name: 'Starter', price: '₦0', features: ['Up to 5 users', 'Basic reports'] },
          { name: 'Growth', price: '₦25,000', features: ['50 users', 'Advanced reports', 'Email support'] },
          { name: 'Enterprise', price: 'Contact', features: ['Unlimited', 'SLA', 'Priority support'] },
        ].map(p => (
          <div key={p.name} className="card p-6">
            <div className="h2">{p.name}</div>
            <div className="my-2 text-3xl font-semibold">{p.price}</div>
            <ul className="mb-4 list-disc pl-5 text-sm text-gray-600">
              {p.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <Button className="w-full">Choose</Button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
