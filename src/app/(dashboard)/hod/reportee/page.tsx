import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { Table, T, TH, TR, TD } from '@/components/ui/Table'
export default function Page(){return(<DashboardLayout><PageHeader title="HOD · Reportee" /><Table><T><thead><TR><TH>Name</TH><TH>Role</TH><TH>Status</TH></TR></thead><tbody>{[{n:'Chika',r:'FE Dev',s:'Active'},{n:'Ngozi',r:'QA',s:'Leave'}].map((x,i)=>(<TR key={i}><TD>{x.n}</TD><TD>{x.r}</TD><TD>{x.s}</TD></TR>))}</tbody></T></Table></DashboardLayout>)}
