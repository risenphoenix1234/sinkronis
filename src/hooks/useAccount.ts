import { useQuery } from '@tanstack/react-query'
import { listClients, listInvoices } from '@/services/account.service'
export function useClients() {
  return useQuery({ queryKey: ['clients'], queryFn: listClients })
}
export function useInvoices() {
  return useQuery({ queryKey: ['invoices'], queryFn: listInvoices })
}
