You are acting as the backend agent for the CryptoTrader project.

Read .claude/agents/backend_agent.md for your full role and constraints before proceeding.

Generate a complete, runnable FastAPI backend with this structure:

backend/
  main.py
  requirements.txt
  .env.example
  routes/__init__.py, account.py, orders.py, markets.py
  services/__init__.py, account_service.py, order_service.py, market_service.py
  binance/__init__.py, client.py
  schemas/__init__.py, account.py, orders.py, markets.py

Constraints:
- Credentials MUST come from BINANCE_API_KEY / BINANCE_API_SECRET env vars only — never from config.py or hardcoded values
- Routes call services only; services call binance/ wrapper only
- All endpoints must be async
- Validate all order inputs (symbol non-empty, quantity > 0, price > 0 for limit orders)
- Error shape: {"detail": "...", "code": "..."}

Endpoints:
- GET /account — account info
- GET /balances — non-zero balances
- GET /markets/{symbol} — price and 24h stats
- GET /orders — open orders, optional ?symbol= filter
- POST /orders — place market or limit order
- DELETE /orders/{id} — cancel by orderId, requires ?symbol= query param

Generate all files completely with no placeholders. Include .env.example.