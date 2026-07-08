import { AppraisalRow } from "@/types/employee/appraisal";

export const appraisalData: AppraisalRow[] = [
  {
    objective: "Customer Service/ Compliance with Road Safety",
    kpis: [
      "Customer Service Delivery: Ensure Internal employees satisfaction index of 95%",
      "Law enforcement agencies: Ensure zero infractions with law enforcement agencies",
      "Accidents: zero records of accidents",
      "Passenger satisfaction: Ensure 95% Passengers satisfaction rate/feedback",
      "Payvis: Check Payvis website on a weekly basis to confirm possible traffic offense bookings",
    ],
    employeeRating: 10,
    employeeComment:
      "I was able to complete my tasks save for a few blockers which I was able to resolve",
    managerRating: 7,
    managerComment: "Task was completed on time and properly done",
  },
  {
    objective: "Administrative Functions",
    kpis: [
      "Electrical solutions: Achieve the management/resolution of electrical matters",
      "Plumbing matters: Achieve the management and resolution of plumbing matters",
      "Vendors/Artisans: Ensure 100% supervision of vendors/artisans",
      "Partner facilities: Achieve zero downtime",
      "Pickups and Delivery: Ensure pickups and delivery of items",
    ],
    employeeRating: 7,
    employeeComment:
      "I was able to complete my tasks save for a few blockers which I was able to resolve",
    managerRating: 5,
    managerComment: "Task was completed on time and properly done",
  },
  {
    objective: "Vehicle Maintenance",
    kpis: [
      "Vehicle Cleanliness: Achieve 95% rate of Tacoma/Corolla cleanliness",
      "Issue detection: Issues with vehicles once detected should be reported within 24 hours",
      "Fuel outage: Achieve zero fuel outage times",
    ],
    employeeRating: 7,
    employeeComment:
      "I was able to complete my tasks save for a few blockers which I was able to resolve",
    managerRating: 5,
    managerComment: "Task was completed on time and properly done",
  },
];