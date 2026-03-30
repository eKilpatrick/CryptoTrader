from typing import Optional

from pydantic import BaseModel


class SymbolInfo(BaseModel):
    symbol: str
    baseAsset: str
    quoteAsset: str
    stepSize: Optional[str] = None      # LOT_SIZE filter
    tickSize: Optional[str] = None      # PRICE_FILTER filter
    minNotional: Optional[str] = None   # MIN_NOTIONAL filter


class MarketStats(BaseModel):
    symbol: str
    lastPrice: str
    priceChange: str
    priceChangePercent: str
    highPrice: str
    lowPrice: str
    openPrice: str
    prevClosePrice: str
    bidPrice: str
    askPrice: str
    volume: str
    quoteVolume: str
    openTime: int
    closeTime: int


class Candle(BaseModel):
    time: int    # kline open time in ms
    open: str
    high: str
    low: str
    close: str
    volume: str


class PriceHistory(BaseModel):
    symbol: str
    period: str
    candles: list[Candle]
