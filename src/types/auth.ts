// src/types/auth.ts
export type Role = 'ceo' | 'hr' | 'hod' | 'employee' | 'payroll' | 'account'
export type User = {
  email: string
  role: Role
}
export type UserProfile = {
  name: string
  phone?: string
  department?: string
}