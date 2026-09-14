export interface Payee { id: string; name: string; bank: string; account: string }
export interface PayrollRun { id: string; month: string; total: number; status: 'Draft'|'Processed'|'Paid' }
