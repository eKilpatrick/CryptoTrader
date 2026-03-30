from fastapi import APIRouter

from schemas.markets import MarketStats, PriceHistory, SymbolInfo
from services.exchange_info_service import get_symbols
from services.market_service import get_market_stats, get_price_history

router = APIRouter()


@router.get("/symbols", response_model=list[SymbolInfo])
async def symbols() -> list[SymbolInfo]:
    return get_symbols()


@router.get("/markets/{symbol}/history", response_model=PriceHistory)
async def market_history(symbol: str, period: str = "24h") -> PriceHistory:
    return get_price_history(symbol.upper(), period)


@router.get("/markets/{symbol}", response_model=MarketStats)
async def market(symbol: str) -> MarketStats:
    return get_market_stats(symbol.upper())
