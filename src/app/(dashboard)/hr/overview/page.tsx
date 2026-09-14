'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'

const bars = [
  { name: 'Jan', hrs: 120 }, { name: 'Feb', hrs: 98 }, { name: 'Mar', hrs: 160 },
  { name: 'Apr', hrs: 130 }, { name: 'May', hrs: 170 }, { name: 'Jun', hrs: 110 },
]
const pie = [
  { name: 'Contract', value: 222, color: '#22c55e' },
  { name: 'Permanent', value: 13, color: '#f59e0b' },
  { name: 'Intern', value: 4, color: '#ef4444' },
]

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader title="HR · Overview" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { k: 'Total Employees', v: '350', h: '+2.1%' },
          { k: 'Departments', v: '14' },
          { k: 'New Hires', v: '8', h: '+1.2%' },
          { k: 'Approval Cycle', v: '210' },
        ].map(x => (
          <div key={x.k} className="card p-4">
            <div className="text-sm text-gray-500">{x.k}</div>
            <div className="mt-2 text-2xl font-semibold">{x.v}</div>
            {x.h && <div className="mt-1 text-xs text-green-600">{x.h}</div>}
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-4 lg:col-span-2">
          <div className="mb-3 font-medium">Employee Work Hours</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar dataKey="hrs" fill="#FFA34D" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-4">
          <div className="mb-3 font-medium">Employee Status</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {pie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
