from typing import Optional

from fastapi import HTTPException

from exchange.client import binance_client
from schemas.orders import (
    CancelOrderResponse,
    OpenOrder,
    OrderResponse,
    PlaceOrderRequest,
)


def get_order_history(symbol: str, limit: int = 50) -> list[OpenOrder]:
    if not symbol or not symbol.strip():
        raise HTTPException(
            status_code=422,
            detail={"detail": "symbol is required for order history", "code": "MISSING_SYMBOL"},
        )
    raw_orders = binance_client.get_all_orders(symbol=symbol.upper(), limit=limit)
    return [
        OpenOrder(
            orderId=o["orderId"],
            symbol=o["symbol"],
            status=o["status"],
            side=o["side"],
            type=o["type"],
            price=o["price"],
            origQty=o["origQty"],
            executedQty=o["executedQty"],
            timeInForce=o.get("timeInForce"),
            time=o.get("time"),
        )
        for o in raw_orders
    ]


def get_open_orders(symbol: Optional[str] = None) -> list[OpenOrder]:
    raw_orders = binance_client.get_open_orders(symbol=symbol)
    return [
        OpenOrder(
            orderId=o["orderId"],
            symbol=o["symbol"],
            status=o["status"],
            side=o["side"],
            type=o["type"],
            price=o["price"],
            origQty=o["origQty"],
            executedQty=o["executedQty"],
            timeInForce=o.get("timeInForce"),
            time=o.get("time"),
        )
        for o in raw_orders
    ]


def place_order(request: PlaceOrderRequest) -> OrderResponse:
    result = binance_client.create_order(
        symbol=request.symbol,
        side=request.side,
        order_type=request.type,
        quantity=request.quantity,
        price=request.price,
    )
    return OrderResponse(
        orderId=result["orderId"],
        symbol=result["symbol"],
        status=result["status"],
        side=result["side"],
        type=result["type"],
        price=result.get("price", "0.00000000"),
        origQty=result.get("origQty", str(request.quantity)),
        executedQty=result.get("executedQty", "0.00000000"),
        timeInForce=result.get("timeInForce"),
        transactTime=result.get("transactTime"),
    )


def cancel_order(order_id: int, symbol: str) -> CancelOrderResponse:
    result = binance_client.cancel_order(symbol=symbol, order_id=order_id)
    return CancelOrderResponse(
        orderId=result["orderId"],
        symbol=result["symbol"],
        status=result["status"],
    )
