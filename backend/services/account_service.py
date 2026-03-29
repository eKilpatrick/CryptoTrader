import asyncio

from fastapi import HTTPException

from exchange.client import binance_client
from schemas.account import AccountInfo, Balance

_STABLECOINS = {"USDT", "BUSD", "USDC", "TUSD", "DAI"}


def _get_usd_price(asset: str) -> float | None:
    if asset in _STABLECOINS:
        return 1.0
    try:
        ticker = binance_client.get_symbol_ticker(f"{asset}USDT")
        return float(ticker["price"])
    except HTTPException:
        return None


def get_account_info() -> AccountInfo:
    data = binance_client.get_account()
    return AccountInfo(
        accountType=data.get("accountType", "SPOT"),
        canTrade=data.get("canTrade", False),
        canDeposit=data.get("canDeposit", False),
        canWithdraw=data.get("canWithdraw", False),
        makerCommission=data.get("makerCommission", 0),
        takerCommission=data.get("takerCommission", 0),
    )


async def get_balances() -> list[Balance]:
    raw_balances = binance_client.get_balances()

    loop = asyncio.get_event_loop()
    prices = await asyncio.gather(*[
        loop.run_in_executor(None, _get_usd_price, b["asset"])
        for b in raw_balances
    ])

    balances = []
    for b, price in zip(raw_balances, prices):
        free = b["free"]
        locked = b["locked"]
        total = float(free) + float(locked)
        usd_value = round(total * price, 2) if price is not None else None
        balances.append(
            Balance(
                asset=b["asset"],
                free=free,
                locked=locked,
                usd_value=usd_value,
            )
        )
    return balances
