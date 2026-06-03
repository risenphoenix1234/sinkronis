export interface Employee {
  id: string
  name: string
  department: string
  position: string
  status: 'Contract' | 'Permanent' | 'Intern'
}
