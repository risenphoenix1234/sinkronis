// src/lib/payroll/wallet-styles.ts

import { TxDirection, TxType } from "@/types/payroll/wallet-data";

/**
 * Single source of truth for transaction-type and direction colors.
 * Previously duplicated inline in the wallet list page — now shared
 * with the transaction detail page so a "Wallet Funding" badge (etc.)
 * always looks the same wherever it's rendered.
 */

export const txTypeStyles: Record<TxType, string> = {
  "Payroll Disbursement": "bg-[#e4f1fd] text-[#1c72c4]",
  "Pension Remittance": "bg-[#f3e8fd] text-[#8b3fc9]",
  "PAYE Remittance": "bg-[#fdf3d4] text-[#8a6b12]",
  "NHF Remittance": "bg-[#fde8ee] text-[#c92a55]",
  "Wallet Funding": "bg-[#dcf5e4] text-[#16823b]",
};

export const directionStyles: Record<TxDirection, string> = {
  Credit: "bg-[#dcf5e4] text-[#16823b]",
  Debit: "bg-[#fde8ea] text-[#e8384f]",
};
