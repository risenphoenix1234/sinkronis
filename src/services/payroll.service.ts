import type { Payee, PayrollRun } from '@/types/payroll'
export async function listPayees(): Promise<Payee[]> {
  return [
    { id: 'p1', name: 'Chika Okafor', bank: 'GTB', account: '0123456789' },
    { id: 'p2', name: 'Ibrahim Musa', bank: 'Access', account: '9988776655' },
  ]
}
export async function listPayrollRuns(): Promise<PayrollRun[]> {
  return [
    { id: 'r1', month: 'Jan 2026', total: 5200000, status: 'Paid' },
    { id: 'r2', month: 'Feb 2026', total: 5050000, status: 'Processed' },
  ]
}
