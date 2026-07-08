type Stat = {
  title: string;
  value: string;
  subtitle: string;
  change: string;
  positive: boolean;
};

type WorkDetail = {
  label: string;
  value: string;
};

type Activity = {
  title: string;
  date: string;
  description: string;
  color: string;
};

export const stats: Stat[] = [
  {
    title: "Attendance",
    value: "14/16",
    subtitle: "+2 since last Month",
    change: "8%",
    positive: true,
  },
  {
    title: "Working Hours",
    value: "2,780 H",
    subtitle: "+1 since last Month",
    change: "2%",
    positive: true,
  },
  {
    title: "Appraisal",
    value: "210",
    subtitle: "-2 since last Month",
    change: "15%",
    positive: false,
  },
];

export const workDetails: WorkDetail[] = [
  { label: "Department", value: "HR Department" },
  { label: "Date of Birth", value: "02-05-1999" },
  { label: "State", value: "Oyo" },

  { label: "Phone", value: "+234 9045674567" },
  { label: "Marital Status", value: "Single" },
  { label: "Work Mode", value: "Remote" },

  { label: "Email", value: "johnsmith@gmail.com" },
  { label: "Gender", value: "Male" },
  { label: "Address", value: "123 Main Street, Cityville, ST 12345" },

  { label: "Nationality", value: "Nigeria" },
  { label: "City", value: "Ibadan" },
  { label: "Earnings", value: "₦650,000" },
];

export const activities: Activity[] = [
  {
    title: "Check Out",
    date: "13 May 2025 06:30pm",
    description: "You have successfully checked out.",
    color: "text-red-500",
  },
  {
    title: "Appraisal",
    date: "13 May 2025 06:30pm",
    description: "The task would be completed soon.",
    color: "text-yellow-500",
  },
  {
    title: "Check In",
    date: "13 May 2025 09:30am",
    description: "You have successfully checked in.",
    color: "text-green-500",
  },
];
