'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
export default function Page(){return(<DashboardLayout><PageHeader title="Payroll · Overview" /><div className="grid gap-4 sm:grid-cols-3"><div className="card p-4"><div className="text-sm text-gray-500">Last Run</div><div className="mt-2 text-2xl font-semibold">Feb 2026</div></div><div className="card p-4"><div className="text-sm text-gray-500">Total Paid</div><div className="mt-2 text-2xl font-semibold">₦5,200,000</div></div><div className="card p-4"><div className="text-sm text-gray-500">Payees</div><div className="mt-2 text-2xl font-semibold">142</div></div></div></DashboardLayout>)}
