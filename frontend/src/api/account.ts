import apiClient from "./client";

export interface AccountInfo {
  accountType: string;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  makerCommission: number;
  takerCommission: number;
  updateTime: number;
}

export interface Balance {
  asset: string;
  free: string;
  locked: string;
  usd_value: number | null;
}

export async function getAccount(): Promise<AccountInfo> {
  const { data } = await apiClient.get<AccountInfo>("/account");
  return data;
}

export async function getBalances(): Promise<Balance[]> {
  const { data } = await apiClient.get<Balance[]>("/balances");
  return data;
}
