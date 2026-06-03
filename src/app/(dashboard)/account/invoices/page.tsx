import DashboardLayout from '@/components/layout/DashboardLayout'
import PageHeader from '@/components/shared/PageHeader'
import { Table, T, TH, TR, TD } from '@/components/ui/Table'
export default function Page(){return(<DashboardLayout><PageHeader title="Accounting · Invoices" /><Table><T><thead><TR><TH>#</TH><TH>Client</TH><TH>Amount</TH><TH>Status</TH></TR></thead><tbody>{[{i:'INV-001',c:'Alpha Ltd',a:'₦320,000',s:'Sent'},{i:'INV-002',c:'Beta PLC',a:'₦210,000',s:'Draft'}].map((x,i)=>(<TR key={i}><TD>{x.i}</TD><TD>{x.c}</TD><TD>{x.a}</TD><TD>{x.s}</TD></TR>))}</tbody></T></Table></DashboardLayout>)}
