import UploadZone from "./UploadZone";

interface UploadFieldProps {
  label: string;
  id: string;
  hint?: string;
}

export default function UploadField({ label, id, hint }: UploadFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-gray-600">
        {label}
      </label>

      <UploadZone id={id} />

      {hint && <p className="mt-1.5 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}
