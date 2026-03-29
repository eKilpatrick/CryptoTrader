from fastapi import HTTPException

from exchange.client import binance_client
from schemas.markets import Candle, MarketStats, PriceHistory

_PERIOD_MAP: dict[str, tuple[str, int]] = {
    "1h":  ("1m",  60),
    "24h": ("15m", 96),
    "7d":  ("1h",  168),
    "1m":  ("4h",  180),
    "1y":  ("1d",  365),
    "3y":  ("1w",  156),
}


def get_market_stats(symbol: str) -> MarketStats:
    stats = binance_client.get_24h_stats(symbol)
    return MarketStats(
        symbol=stats["symbol"],
        lastPrice=stats["lastPrice"],
        priceChange=stats["priceChange"],
        priceChangePercent=stats["priceChangePercent"],
        highPrice=stats["highPrice"],
        lowPrice=stats["lowPrice"],
        openPrice=stats["openPrice"],
        prevClosePrice=stats["prevClosePrice"],
        bidPrice=stats["bidPrice"],
        askPrice=stats["askPrice"],
        volume=stats["volume"],
        quoteVolume=stats["quoteVolume"],
        openTime=stats["openTime"],
        closeTime=stats["closeTime"],
    )


def get_price_history(symbol: str, period: str) -> PriceHistory:
    if period not in _PERIOD_MAP:
        raise HTTPException(
            status_code=422,
            detail={"detail": f"Invalid period '{period}'. Must be one of: {', '.join(_PERIOD_MAP)}", "code": "INVALID_PERIOD"},
        )
    interval, limit = _PERIOD_MAP[period]
    raw = binance_client.get_klines(symbol, interval, limit)
    candles = [
        Candle(
            time=k[0],
            open=k[1],
            high=k[2],
            low=k[3],
            close=k[4],
            volume=k[5],
        )
        for k in raw
    ]
    return PriceHistory(symbol=symbol, period=period, candles=candles)
