import { useQuery } from '@tanstack/react-query'
import { listEmployees } from '@/services/employee.service'
export function useEmployees() {
  return useQuery({ queryKey: ['employees'], queryFn: listEmployees })
}
