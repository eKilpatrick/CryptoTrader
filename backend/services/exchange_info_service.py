import time

from exchange.client import binance_client
from schemas.markets import SymbolInfo

_CACHE_TTL_SECONDS = 86400  # 24 hours

_cached_symbols: list[SymbolInfo] | None = None
_cache_timestamp: float = 0.0


def _extract_filter(filters: list[dict], filter_type: str, field: str) -> str | None:
    for f in filters:
        if f.get("filterType") == filter_type:
            return f.get(field)
    return None


def _build_symbol_list() -> list[SymbolInfo]:
    info = binance_client.get_exchange_info()
    result: list[SymbolInfo] = []
    for s in info.get("symbols", []):
        if s.get("status") != "TRADING" or not s.get("isSpotTradingAllowed", False):
            continue
        filters = s.get("filters", [])
        result.append(
            SymbolInfo(
                symbol=s["symbol"],
                baseAsset=s["baseAsset"],
                quoteAsset=s["quoteAsset"],
                stepSize=_extract_filter(filters, "LOT_SIZE", "stepSize"),
                tickSize=_extract_filter(filters, "PRICE_FILTER", "tickSize"),
                minNotional=_extract_filter(filters, "MIN_NOTIONAL", "minNotional"),
            )
        )
    return result


def get_symbols() -> list[SymbolInfo]:
    global _cached_symbols, _cache_timestamp

    now = time.monotonic()
    if _cached_symbols is None or (now - _cache_timestamp) > _CACHE_TTL_SECONDS:
        _cached_symbols = _build_symbol_list()
        _cache_timestamp = now

    return _cached_symbols
