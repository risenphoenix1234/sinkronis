"use client";

export default function BankDetails() {
  return (
    <div className="grid gap-6 py-6 md:grid-cols-2">
      <div>
        <p className="text-xs text-gray-400">Bank Name</p>

        <p className="mt-2 font-medium">Zenith Bank</p>
      </div>

      <div>
        <p className="text-xs text-gray-400">Account Number</p>

        <p className="mt-2 font-medium">0123456789</p>
      </div>

      <div>
        <p className="text-xs text-gray-400">Account Name</p>

        <p className="mt-2 font-medium">Amara Nwosu</p>
      </div>

      <div>
        <p className="text-xs text-gray-400">BVN</p>

        <p className="mt-2 font-medium">22345678901</p>
      </div>
    </div>
  );
}
