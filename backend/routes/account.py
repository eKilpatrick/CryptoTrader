from fastapi import APIRouter

from schemas.account import AccountInfo, Balance
from services.account_service import get_account_info, get_balances

router = APIRouter()


@router.get("/account", response_model=AccountInfo)
async def account() -> AccountInfo:
    return get_account_info()


@router.get("/balances", response_model=list[Balance])
async def balances() -> list[Balance]:
    return get_balances()
