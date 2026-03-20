from fastapi import APIRouter

from schemas.markets import MarketStats
from services.market_service import get_market_stats

router = APIRouter()


@router.get("/markets/{symbol}", response_model=MarketStats)
async def market(symbol: str) -> MarketStats:
    return get_market_stats(symbol.upper())
