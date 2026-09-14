import type { Client, Invoice } from '@/types/account'
export async function listClients(): Promise<Client[]> {
  return [
    { id: 'c1', name: 'Alpha Ltd', email: 'ops@alpha.com' },
    { id: 'c2', name: 'Beta PLC', email: 'finance@beta.com' },
  ]
}
export async function listInvoices(): Promise<Invoice[]> {
  return [
    { id: 'i1', client: 'Alpha Ltd', amount: 320000, status: 'Sent' },
    { id: 'i2', client: 'Beta PLC', amount: 210000, status: 'Draft' },
  ]
}
