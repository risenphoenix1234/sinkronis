import { EmployeeProfile } from "@/types/employee/profile";

export const profile: EmployeeProfile = {
  initials: "AN",

  fullName: "Amara Nwosu",

  role: "HR Manager",

  employeeId: "EMP-0042",

  personal: {
    fullName: "Amara Nwosu",
    dateOfBirth: "14 August 1990",
    gender: "Female",
    email: "amara.personal@gmail.com",
    maritalStatus: "Single",
    address: "123, Iffi.",
    nationality: "Nigerian",
  },

  work: {
    employeeId: "EMP-0042",
    pensionId: "PEN-001V",
    taxId: "TAX-0019",
    status: "Active",
    department: "Human Resources",
    position: "HR Manager",
    manager: "Chukwuemeka Obi",
    location: "Lagos Head Office",
    startDate: "12 March 2022",
    employmentType: "Full-Time",
    workMode: "Remote",
    earnings: "₦450,000",
  },

  nextOfKin: {
    name: "Emeka Nwosu (Husband)",
    relationship: "Husband",
    phone: "+234 803 123 4567",
    address: "125 Iffi",
  },

  documents: [
    {
      id: 1,
      documentName: "Employment Contract",
      dateAdded: "15 March 2022",
    },
    {
      id: 2,
      documentName: "Offer Letter",
      dateAdded: "11 March 2022",
    },
    {
      id: 3,
      documentName: "NDA Agreement",
      dateAdded: "15 March 2022",
    },
  ],
};