export interface PersonalDetails {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  maritalStatus: string;
  address: string;
  nationality: string;
}

export interface WorkDetails {
  employeeId: string;
  pensionId: string;
  taxId: string;
  status: string;
  department: string;
  position: string;
  manager: string;
  location: string;
  startDate: string;
  employmentType: string;
  workMode: string;
  earnings: string;
}

export interface NextOfKin {
  name: string;
  relationship: string;
  phone: string;
  address: string;
}

export interface EmployeeDocument {
  id: number;
  documentName: string;
  dateAdded: string;
}

export interface EmployeeProfile {
  initials: string;
  fullName: string;
  role: string;
  employeeId: string;
  personal: PersonalDetails;
  work: WorkDetails;
  nextOfKin: NextOfKin;
  documents: EmployeeDocument[];
}
