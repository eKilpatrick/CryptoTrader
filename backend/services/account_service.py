from exchange.client import binance_client
from schemas.account import AccountInfo, Balance


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


def get_balances() -> list[Balance]:
    raw_balances = binance_client.get_balances()
    return [
        Balance(
            asset=b["asset"],
            free=b["free"],
            locked=b["locked"],
        )
        for b in raw_balances
    ]
