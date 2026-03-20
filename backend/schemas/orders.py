from typing import Optional
from pydantic import BaseModel, field_validator


class PlaceOrderRequest(BaseModel):
    symbol: str
    side: str
    type: str
    quantity: float
    price: Optional[float] = None

    @field_validator("symbol")
    @classmethod
    def symbol_must_not_be_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("symbol must not be empty")
        return v.upper().strip()

    @field_validator("side")
    @classmethod
    def side_must_be_valid(cls, v: str) -> str:
        v = v.upper()
        if v not in ("BUY", "SELL"):
            raise ValueError("side must be BUY or SELL")
        return v

    @field_validator("type")
    @classmethod
    def type_must_be_valid(cls, v: str) -> str:
        v = v.upper()
        if v not in ("MARKET", "LIMIT"):
            raise ValueError("type must be MARKET or LIMIT")
        return v

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("quantity must be greater than 0")
        return v

    @field_validator("price")
    @classmethod
    def price_must_be_positive_if_present(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v <= 0:
            raise ValueError("price must be greater than 0")
        return v


class OrderResponse(BaseModel):
    orderId: int
    symbol: str
    status: str
    side: str
    type: str
    price: str
    origQty: str
    executedQty: str
    timeInForce: Optional[str] = None
    transactTime: Optional[int] = None


class OpenOrder(BaseModel):
    orderId: int
    symbol: str
    status: str
    side: str
    type: str
    price: str
    origQty: str
    executedQty: str
    timeInForce: Optional[str] = None
    time: Optional[int] = None


class CancelOrderResponse(BaseModel):
    orderId: int
    symbol: str
    status: str
