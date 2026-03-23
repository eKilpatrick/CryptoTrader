from exchange.client import binance_client
from schemas.markets import MarketStats


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
