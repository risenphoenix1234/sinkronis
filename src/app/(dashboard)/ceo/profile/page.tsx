'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader title="CEO · Profile" />
      <div className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-gray-600">Full name</label>
          <Input defaultValue="Tunde CEO" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-600">Email</label>
          <Input defaultValue="ceo@sinkronis.local" />
        </div>
        <div className="sm:col-span-2">
          <Button>Save changes</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
