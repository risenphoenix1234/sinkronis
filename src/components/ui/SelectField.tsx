interface SelectFieldProps {
  label: string;
  name: string;
  options: string[];
}

export default function SelectField({
  label,
  name,
  options,
}: SelectFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        id={name}
        name={name}
        className="w-full text-xs rounded-md border border-gray-300 px-3 py-2"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
