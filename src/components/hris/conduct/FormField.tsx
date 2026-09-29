type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-[10px] text-[#8C95A3]">{label}</label>
      {children}
    </div>
  );
}
