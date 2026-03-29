from pydantic import BaseModel


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
