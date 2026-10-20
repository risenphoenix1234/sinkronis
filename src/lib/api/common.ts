// src/lib/api/common.ts
import api from "./axios";

export interface Bank {
  code: string;
  name: string;
  country: string;
  currency: string;
  active: boolean;
  provider: string;
}

export interface BankDirectoryMetadata {
  source: string;
  refreshedAt: string;
  stale: boolean;
  cacheTtlSeconds: number;
}

export interface BankDirectoryResponse {
  success: boolean;
  message: string;
  data: Bank[];
  metadata?: BankDirectoryMetadata;
}

export interface GetBanksParams {
  country?: string;
  currency?: string;
}

export const getBanks = async (
  params: GetBanksParams = { country: "NG", currency: "NGN" },
) => {
  const { data } = await api.get<BankDirectoryResponse>("/common/banks", {
    params,
  });
  return data;
};