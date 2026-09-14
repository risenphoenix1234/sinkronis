import AddEmployeeForm from "@/components/employees/AddEmployeeForm";

export default function AddEmployeePage() {
  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Add New Employee</h1>
      </div>
      <AddEmployeeForm />
    </section>
  );
}