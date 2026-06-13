import Input from "@/components/ui/Input";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}

export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}