import { Employee } from "@/types/hris/appraisal";

type AppraisalHeaderProps = {
  employee: Employee;
};

export function AppraisalHeader({ employee }: AppraisalHeaderProps) {
  return (
    <section className="mt-5 rounded-md border border-dashed border-[#D9DEE7] px-5 py-5">
      <h2 className="text-[12px] font-bold uppercase tracking-wide text-[#94A3B8]">
        Appraisal Header
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-x-20 gap-y-4 md:grid-cols-2">
        <div className="space-y-4">
          <InfoRow label="Employee Name:" value={employee.name} />
          <InfoRow label="Role:" value={employee.role} />
          <InfoRow label="Department / Unit:" value={employee.department} />
        </div>

        <div className="space-y-4">
          <InfoRow label="Supervisor's Name:" value={employee.supervisorName} />

          <InfoRow label="Supervisor's Role:" value={employee.supervisorRole} />

          <InfoRow label="Employee's Start Date:" value={employee.startDate} />
        </div>
      </div>
    </section>
  );
}

/* Info Row */

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="grid grid-cols-[165px_1fr] items-center">
      <span className="text-[12px] text-[#94A3B8]">{label}</span>

      <span className="text-[13px] font-semibold text-[#1F2937]">{value}</span>
    </div>
  );
}
