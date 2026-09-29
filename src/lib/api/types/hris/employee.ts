export interface NextOfKin {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
}

export interface Guarantor {
  lastName: string;
  firstName: string;
  relationship: string;
  phoneNumber: string;
  address: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: string;
  contact: string;
  dateAdded: string;
  email: string;
  dob: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  address: string;
  city: string;
  state: string;
  country: string;
  nextOfKin?: NextOfKin;
  employeeID: string;
  position: string;
  workMode: string;
  dateJoined: string;
  salary?: string;
  guarantor?: Guarantor;
  leaves?: number;
  workingHours?: number;
  appraisals?: number;
  [key: string]: unknown;
}
