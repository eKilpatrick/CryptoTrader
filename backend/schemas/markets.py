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
