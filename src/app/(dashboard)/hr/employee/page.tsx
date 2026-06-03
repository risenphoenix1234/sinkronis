'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { Table, T, TH, TR, TD } from '@/components/ui/Table'
import Button from '@/components/ui/Button'

const rows = [
  { id: 'e1', name: 'Chika Okafor', dept: 'Engineering', status: 'Permanent' },
  { id: 'e2', name: 'Ibrahim Musa', dept: 'HR', status: 'Contract' },
]

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader title="HR · Employee" actions={<Button>Add employee</Button>} />
      <Table>
        <T>
          <thead>
            <TR><TH>Name</TH><TH>Department</TH><TH>Status</TH><TH></TH></TR>
          </thead>
          <tbody>
            {rows.map(r => (
              <TR key={r.id}>
                <TD>{r.name}</TD><TD>{r.dept}</TD><TD>{r.status}</TD>
                <TD className="text-right"><Button size="sm" variant="outline">View</Button></TD>
              </TR>
            ))}
          </tbody>
        </T>
      </Table>
    </DashboardLayout>
  )
}
