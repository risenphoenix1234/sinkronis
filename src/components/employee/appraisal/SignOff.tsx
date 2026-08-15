"use client";

interface SignOffItem {
  role: string;
  name: string;
  signature: string;
}

const signOffData: SignOffItem[] = [
  {
    role: "Appraisee (Employee)",
    name: "Amara Nwosu",
    signature: "Signed on submission",
  },
  {
    role: "Line Manager / MD",
    name: "Pending sign-off",
    signature: "Pending",
  },
  {
    role: "HR Representative",
    name: "Pending sign-off",
    signature: "Pending",
  },
];

export default function SignOff() {
  return (
    <section className="overflow-hidden rounded-md border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Sign-Off
        </h2>
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-100">
        {signOffData.map((item) => (
          <div
            key={item.role}
            className="grid grid-cols-1 gap-6 px-6 py-5 lg:grid-cols-12"
          >
            {/* Role */}
            <div className="lg:col-span-2 flex items-center">
              <p className="text-sm font-medium text-gray-700">{item.role}</p>
            </div>

            {/* Name */}
            <div className="lg:col-span-5">
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Name
              </label>

              <input
                type="text"
                value={item.name}
                readOnly
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-600 outline-none"
              />
            </div>

            {/* Signature */}
            <div className="lg:col-span-5">
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Signature & Date
              </label>

              <input
                type="text"
                value={item.signature}
                readOnly
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-400 outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
