from typing import Optional

from fastapi import APIRouter, Query

from schemas.orders import (
    CancelOrderResponse,
    OpenOrder,
    OrderResponse,
    PlaceOrderRequest,
)
from services.order_service import cancel_order, get_open_orders, get_order_history, place_order

router = APIRouter()


@router.get("/orders", response_model=list[OpenOrder])
async def list_orders(symbol: Optional[str] = Query(default=None)) -> list[OpenOrder]:
    return get_open_orders(symbol=symbol.upper() if symbol else None)


@router.post("/orders", response_model=OrderResponse, status_code=201)
async def create_order(request: PlaceOrderRequest) -> OrderResponse:
    return place_order(request)


@router.get("/orders/history", response_model=list[OpenOrder])
async def list_order_history(
    symbol: str = Query(..., description="Trading pair symbol, e.g. BTCUSDT"),
    limit: int = Query(default=50, ge=1, le=500),
) -> list[OpenOrder]:
    return get_order_history(symbol=symbol.upper(), limit=limit)


@router.delete("/orders/{order_id}", response_model=CancelOrderResponse)
async def delete_order(
    order_id: int,
    symbol: str = Query(..., description="Trading pair symbol, e.g. BTCUSDT"),
) -> CancelOrderResponse:
    return cancel_order(order_id=order_id, symbol=symbol.upper())
