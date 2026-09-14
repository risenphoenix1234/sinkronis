import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { Table, T, TH, TR, TD } from '@/components/ui/Table'
export default function Page(){return(<DashboardLayout><PageHeader title="Payroll · Payee" /><Table><T><thead><TR><TH>Name</TH><TH>Bank</TH><TH>Account</TH></TR></thead><tbody>{[{n:'Chika Okafor',b:'GTB',a:'0123456789'},{n:'Ibrahim Musa',b:'Access',a:'9988776655'}].map((x,i)=>(<TR key={i}><TD>{x.n}</TD><TD>{x.b}</TD><TD>{x.a}</TD></TR>))}</tbody></T></Table></DashboardLayout>)}
