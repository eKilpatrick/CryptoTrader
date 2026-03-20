from pydantic import BaseModel


class MarketStats(BaseModel):
    symbol: str
    price: str
    priceChange: str
    priceChangePercent: str
    high: str
    low: str
    volume: str
