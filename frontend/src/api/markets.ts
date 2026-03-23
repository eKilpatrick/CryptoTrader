import apiClient from "./client";

export interface MarketData {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  bidPrice: string;
  askPrice: string;
  openTime: number;
  closeTime: number;
}

export async function getMarketData(symbol: string): Promise<MarketData> {
  const { data } = await apiClient.get<MarketData>(`/markets/${symbol}`);
  return data;
}
