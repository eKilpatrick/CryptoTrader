import apiClient from "./client";

export interface TradingSymbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  stepSize: string;
  tickSize: string;
  minNotional: string;
}

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
  bidPrice: string;
  askPrice: string;
  openTime: number;
  closeTime: number;
}

export interface Candle {
  time: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface PriceHistory {
  symbol: string;
  period: string;
  candles: Candle[];
}

export async function getMarketData(symbol: string): Promise<MarketData> {
  const { data } = await apiClient.get<MarketData>(`/markets/${symbol}`);
  return data;
}

export async function getPriceHistory(symbol: string, period: string): Promise<PriceHistory> {
  const { data } = await apiClient.get<PriceHistory>(`/markets/${symbol}/history`, {
    params: { period },
  });
  return data;
}

export async function getSymbols(): Promise<TradingSymbol[]> {
  const { data } = await apiClient.get<TradingSymbol[]>("/symbols");
  return data;
}
