import os
from typing import Optional

from binance.client import Client
from binance.exceptions import BinanceAPIException
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()


class BinanceClient:
    def __init__(self) -> None:
        api_key = os.getenv("BINANCE_API_KEY", "")
        api_secret = os.getenv("BINANCE_API_SECRET", "")
        self._client = Client(api_key, api_secret, tld='US')

    def get_account(self) -> dict:
        try:
            return self._client.get_account()
        except BinanceAPIException as e:
            raise HTTPException(
                status_code=400,
                detail={"detail": e.message, "code": str(e.code)},
            )

    def get_balances(self) -> list[dict]:
        try:
            account = self._client.get_account()
            return [
                b for b in account.get("balances", [])
                if float(b["free"]) > 0 or float(b["locked"]) > 0
            ]
        except BinanceAPIException as e:
            raise HTTPException(
                status_code=400,
                detail={"detail": e.message, "code": str(e.code)},
            )

    def get_symbol_ticker(self, symbol: str) -> dict:
        try:
            return self._client.get_symbol_ticker(symbol=symbol)
        except BinanceAPIException as e:
            raise HTTPException(
                status_code=400,
                detail={"detail": e.message, "code": str(e.code)},
            )

    def get_24h_stats(self, symbol: str) -> dict:
        try:
            return self._client.get_ticker(symbol=symbol)
        except BinanceAPIException as e:
            raise HTTPException(
                status_code=400,
                detail={"detail": e.message, "code": str(e.code)},
            )

    def get_all_orders(self, symbol: str, limit: int = 50) -> list[dict]:
        try:
            return self._client.get_all_orders(symbol=symbol, limit=limit)
        except BinanceAPIException as e:
            raise HTTPException(
                status_code=400,
                detail={"detail": e.message, "code": str(e.code)},
            )

    def get_open_orders(self, symbol: Optional[str] = None) -> list[dict]:
        try:
            if symbol:
                return self._client.get_open_orders(symbol=symbol)
            return self._client.get_open_orders()
        except BinanceAPIException as e:
            raise HTTPException(
                status_code=400,
                detail={"detail": e.message, "code": str(e.code)},
            )

    def create_order(
        self,
        symbol: str,
        side: str,
        order_type: str,
        quantity: float,
        price: Optional[float] = None,
    ) -> dict:
        try:
            params: dict = {
                "symbol": symbol,
                "side": side,
                "type": order_type,
                "quantity": quantity,
            }
            if order_type == "LIMIT":
                if price is None:
                    raise HTTPException(
                        status_code=422,
                        detail={"detail": "price is required for LIMIT orders", "code": "MISSING_PRICE"},
                    )
                params["price"] = price
                params["timeInForce"] = "GTC"
            return self._client.create_order(**params)
        except HTTPException:
            raise
        except BinanceAPIException as e:
            raise HTTPException(
                status_code=400,
                detail={"detail": e.message, "code": str(e.code)},
            )

    def cancel_order(self, symbol: str, order_id: int) -> dict:
        try:
            return self._client.cancel_order(symbol=symbol, orderId=order_id)
        except BinanceAPIException as e:
            raise HTTPException(
                status_code=400,
                detail={"detail": e.message, "code": str(e.code)},
            )

    def get_klines(self, symbol: str, interval: str, limit: int) -> list:
        try:
            return self._client.get_klines(symbol=symbol, interval=interval, limit=limit)
        except BinanceAPIException as e:
            raise HTTPException(
                status_code=400,
                detail={"detail": e.message, "code": str(e.code)},
            )

    def get_exchange_info(self) -> dict:
        try:
            return self._client.get_exchange_info()
        except BinanceAPIException as e:
            raise HTTPException(
                status_code=400,
                detail={"detail": e.message, "code": str(e.code)},
            )


binance_client = BinanceClient()
