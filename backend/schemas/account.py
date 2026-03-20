from pydantic import BaseModel


class AccountInfo(BaseModel):
    accountType: str
    canTrade: bool
    canDeposit: bool
    canWithdraw: bool
    makerCommission: int
    takerCommission: int


class Balance(BaseModel):
    asset: str
    free: str
    locked: str


class BalancesResponse(BaseModel):
    balances: list[Balance]
