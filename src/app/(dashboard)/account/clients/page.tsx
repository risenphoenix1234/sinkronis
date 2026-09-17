import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { Table, T, TH, TR, TD } from '@/components/ui/Table'
export default function Page(){return(<DashboardLayout><PageHeader title="Accounting · Clients" /><Table><T><thead><TR><TH>Name</TH><TH>Email</TH></TR></thead><tbody>{[{n:'Alpha Ltd',e:'ops@alpha.com'},{n:'Beta PLC',e:'finance@beta.com'}].map((x,i)=>(<TR key={i}><TD>{x.n}</TD><TD>{x.e}</TD></TR>))}</tbody></T></Table></DashboardLayout>)}
