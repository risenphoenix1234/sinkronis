'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { Table, T, TH, TR, TD } from '@/components/ui/Table'
import Button from '@/components/ui/Button'

const rows = [
  { id: '1', name: 'Ada Lovelace', role: 'Admin', email: 'ada@company.com' },
  { id: '2', name: 'Chika Okafor', role: 'Editor', email: 'chika@company.com' },
]

export default function Page() {
  return (
    <DashboardLayout>
      <PageHeader title="CEO · Users" actions={<Button>Add user</Button>} />
      <Table>
        <T>
          <thead>
            <TR>
              <TH>Name</TH><TH>Email</TH><TH>Role</TH><TH></TH>
            </TR>
          </thead>
          <tbody>
            {rows.map(r => (
              <TR key={r.id}>
                <TD>{r.name}</TD>
                <TD>{r.email}</TD>
                <TD>{r.role}</TD>
                <TD className="text-right"><Button variant="outline" size="sm">Edit</Button></TD>
              </TR>
            ))}
          </tbody>
        </T>
      </Table>
    </DashboardLayout>
  )
}
