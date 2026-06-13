interface UploadZoneProps {
  id: string;
}

export default function UploadZone({
  id,
}: UploadZoneProps) {
  return (
    <div>
      <input
        id={id}
        type="file"
        className="hidden"
      />
    </div>
  );
}