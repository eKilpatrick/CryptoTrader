from exchange.client import binance_client
from schemas.markets import MarketStats


def get_market_stats(symbol: str) -> MarketStats:
    stats = binance_client.get_24h_stats(symbol)
    return MarketStats(
        symbol=stats["symbol"],
        price=stats["lastPrice"],
        priceChange=stats["priceChange"],
        priceChangePercent=stats["priceChangePercent"],
        high=stats["highPrice"],
        low=stats["lowPrice"],
        volume=stats["volume"],
    )
