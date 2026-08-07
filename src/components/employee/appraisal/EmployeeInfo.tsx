import { Employee } from "@/types/employee/appraisal";
import Card from "./Card";

interface Props {
  employee: Employee;
}

export default function EmployeeInformation({ employee }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          Employee Information
        </h2>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        <InfoItem label="Employee Name" value={employee.name} />

        <InfoItem label="Supervisor" value={employee.supervisor} />

        <InfoItem label="Department" value={employee.department} />

        <InfoItem label="Job Title" value={employee.jobTitle} />

        <InfoItem label="Employment Date" value={employee.employmentDate} />

        <InfoItem label="Review Period" value={employee.reviewPeriod} />
      </div>
    </Card>
  );
}

interface ItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: ItemProps) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
