export interface Client { id: string; name: string; email: string }
export interface Invoice { id: string; client: string; amount: number; status: 'Draft'|'Sent'|'Paid' }
