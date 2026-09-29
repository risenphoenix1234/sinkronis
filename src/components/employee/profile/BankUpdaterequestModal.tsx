// // components/employee/profile/BankUpdateRequestModal.tsx
// "use client";

// import { useState } from "react";
// import { X, Loader2 } from "lucide-react";
// import { toast } from "react-toastify";
// import {
//   BankDetailsData,
//   requestBankDetailsUpdate,
// } from "@/lib/api/employee";

// interface BankUpdateRequestModalProps {
//   initialData?: BankDetailsData;
//   onClose: () => void;
//   onSubmitted: () => void; // parent refetches the profile
// }

// interface FormState {
//   bankCode: string;
//   bankName: string;
//   accountNumber: string;
//   accountName: string;
//   accountType: "SAVINGS" | "CURRENT";
//   reason: string;
// }

// export default function BankUpdateRequestModal({
//   initialData,
//   onClose,
//   onSubmitted,
// }: BankUpdateRequestModalProps) {
//   const [form, setForm] = useState<FormState>({
//     bankCode:
//       initialData?.bank?.code && initialData.bank.code !== "—"
//         ? initialData.bank.code
//         : "",
//     bankName:
//       initialData?.bank?.name && initialData.bank.name !== "—"
//         ? initialData.bank.name
//         : "",
//     accountNumber: "",
//     accountName:
//       initialData?.accountName && initialData.accountName !== "—"
//         ? initialData.accountName
//         : "",
//     accountType:
//       initialData?.accountType === "CURRENT" ? "CURRENT" : "SAVINGS",
//     reason: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   function handleChange<K extends keyof FormState>(
//     key: K,
//     value: FormState[K],
//   ) {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   }

//   function validate(): string | null {
//     if (!form.bankCode.trim()) return "Bank code is required.";
//     if (!form.bankName.trim()) return "Bank name is required.";
//     if (!/^\d{10}$/.test(form.accountNumber.trim())) {
//       return "Account number must be 10 digits.";
//     }
//     if (!form.accountName.trim()) return "Account name is required.";
//     if (!form.reason.trim()) return "Please provide a reason for this change.";
//     return null;
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     const validationError = validate();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const res = await requestBankDetailsUpdate({
//         bankCode: form.bankCode.trim(),
//         bankName: form.bankName.trim(),
//         accountNumber: form.accountNumber.trim(),
//         accountName: form.accountName.trim(),
//         accountType: form.accountType,
//         reason: form.reason.trim(),
//       });

//       toast.success(
//         res?.message || "Bank update request submitted successfully",
//       );
//       onSubmitted();
//       onClose();
//     } catch (err: unknown) {
//       let message = "Something went wrong";
//       if (typeof err === "object" && err !== null && "response" in err) {
//         const axiosError = err as {
//           response?: { data?: { message?: string; error?: string } };
//         };
//         message =
//           axiosError.response?.data?.message ||
//           axiosError.response?.data?.error ||
//           message;
//       } else if (err instanceof Error) {
//         message = err.message;
//       }
//       setError(message);
//       toast.error(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
//         <div className="mb-4 flex items-center justify-between">
//           <h3 className="text-lg font-semibold text-gray-900">
//             Request Bank Update
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <p className="mb-4 text-sm text-gray-500">
//           This won&apos;t change your bank details immediately — it submits a
//           request for HR to review and approve.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="text-xs font-medium text-gray-500">
//               Bank Name
//             </label>
//             <input
//               type="text"
//               value={form.bankName}
//               onChange={(e) => handleChange("bankName", e.target.value)}
//               className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
//             />
//           </div>

//           <div>
//             <label className="text-xs font-medium text-gray-500">
//               Bank Code
//             </label>
//             <input
//               type="text"
//               value={form.bankCode}
//               onChange={(e) => handleChange("bankCode", e.target.value)}
//               className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
//             />
//           </div>

//           <div>
//             <label className="text-xs font-medium text-gray-500">
//               Account Number
//             </label>
//             <input
//               type="text"
//               inputMode="numeric"
//               maxLength={10}
//               value={form.accountNumber}
//               onChange={(e) =>
//                 handleChange("accountNumber", e.target.value.replace(/\D/g, ""))
//               }
//               className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
//             />
//           </div>

//           <div>
//             <label className="text-xs font-medium text-gray-500">
//               Account Name
//             </label>
//             <input
//               type="text"
//               value={form.accountName}
//               onChange={(e) => handleChange("accountName", e.target.value)}
//               className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
//             />
//           </div>

//           <div>
//             <label className="text-xs font-medium text-gray-500">
//               Account Type
//             </label>
//             <select
//               value={form.accountType}
//               onChange={(e) =>
//                 handleChange(
//                   "accountType",
//                   e.target.value as "SAVINGS" | "CURRENT",
//                 )
//               }
//               className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
//             >
//               <option value="SAVINGS">Savings</option>
//               <option value="CURRENT">Current</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-xs font-medium text-gray-500">
//               Reason for Change
//             </label>
//             <textarea
//               value={form.reason}
//               onChange={(e) => handleChange("reason", e.target.value)}
//               rows={3}
//               className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
//             />
//           </div>

//           {error && <p className="text-sm text-red-600">{error}</p>}

//           <div className="flex justify-end gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isSubmitting}
//               className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
//             >
//               {isSubmitting && <Loader2 size={15} className="animate-spin" />}
//               Submit Request
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
