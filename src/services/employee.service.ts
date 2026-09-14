import type { Employee } from '@/types/employee'
export async function listEmployees(): Promise<Employee[]> {
  return [
    { id: 'e1', name: 'Chika Okafor', department: 'Engineering', position: 'Frontend Dev', status: 'Permanent' },
    { id: 'e2', name: 'Ibrahim Musa', department: 'HR', position: 'People Ops', status: 'Contract' },
  ]
}
