export type EmployeeStatus = "Confirmed" | "Probation" | "Exited";
export type WorkMode = "Remote" | "Hybrid" | "On-site";

export type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  status: EmployeeStatus;
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
  nextOfKin: {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
  };
  // Professional
  employeeID: string;
  position: string;
  workMode: WorkMode;
  dateJoined: string;
  salary: string;
  guarantor: {
    lastName: string;
    firstName: string;
    relationship: string;
    phoneNumber: string;
    address: string;
  };
  // Stats
  leaves: number;
  workingHours: number;
  appraisals: number;
  avatar?: string;
};