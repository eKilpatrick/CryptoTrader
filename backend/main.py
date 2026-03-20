from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.account import router as account_router
from routes.markets import router as markets_router
from routes.orders import router as orders_router

app = FastAPI(title="CryptoTrader API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(account_router, tags=["account"])
app.include_router(markets_router, tags=["markets"])
app.include_router(orders_router, tags=["orders"])


@app.get("/health", tags=["health"])
async def health() -> dict:
    return {"status": "ok"}
