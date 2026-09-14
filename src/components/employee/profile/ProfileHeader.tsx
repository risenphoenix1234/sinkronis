// // components/employee/profile/ProfileHeader.tsx
// "use client";

// import { Upload } from "lucide-react";
// import { getInitials } from "@/lib/format";
// import { ProfileHeaderData } from "@/lib/api/employee";

// export default function ProfileHeader({ data }: { data: ProfileHeaderData }) {
//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//       <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
//         <div className="flex items-center gap-5">
//           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-600 text-xl font-extrabold text-white">
//             {getInitials(data.fullName)}
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold text-gray-900">
//               {data.fullName}
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               {data.role.name} • {data.employeeId}
//             </p>

//             <button className="mt-4 inline-flex items-center gap-2 rounded-lg border border-sky-200 px-4 py-2 text-sm font-medium text-sky-600 transition hover:bg-sky-50">
//               <Upload size={16} />
//               Upload Photo
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/employee/profile/ProfileHeader.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { getInitials } from "@/lib/format";
import { ProfileHeaderData } from "@/lib/api/employee";

interface ProfileHeaderProps {
  data: ProfileHeaderData;
  onPhotoUploaded: () => void; // caller should refetch the profile
}

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProfileHeader({
  data,
  onPhotoUploaded,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Avoid leaking the blob URL when a new preview replaces the old one, or on unmount.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch("/api/v1/employee/profile/photo", {
        method: "PATCH",
        body: formData,
      });

      if (res.status === 400)
        throw new Error("Image missing, too large, or an invalid file.");
      if (res.status === 401)
        throw new Error("Your session has expired. Please sign in again.");
      if (res.status === 403)
        throw new Error("You don't have access to update this record.");
      if (res.status === 404) throw new Error("Employee record not found.");
      if (res.status === 500)
        throw new Error("Upload failed on our end — try again shortly.");
      if (!res.ok) throw new Error("Upload failed.");

      // Response body is {} — no URL comes back, so ask the parent to refetch
      // the profile to pick up the new profileImage. Keep showing the local
      // preview in the meantime.
      onPhotoUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPreview(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const avatarSrc = preview ?? data.profileImage;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-sky-600 text-xl font-extrabold text-white">
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt={data.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(data.fullName)
            )}

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 size={20} className="animate-spin text-white" />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {data.fullName}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {data.role.name} • {data.employeeId}
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={handleClick}
              disabled={isUploading}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-sky-200 px-4 py-2 text-sm font-medium text-sky-600 transition hover:bg-sky-50 disabled:opacity-50"
            >
              <Upload size={16} />
              {isUploading ? "Uploading…" : "Upload Photo"}
            </button>

            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
