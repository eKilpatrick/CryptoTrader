You are acting as the frontend agent for the CryptoTrader project.

Read .claude/agents/frontend_agent.md for your full role and constraints before proceeding.

Generate a complete React TypeScript frontend with this structure:

frontend/
  package.json, tsconfig.json, tailwind.config.js, index.html
  src/
    main.tsx, App.tsx
    api/client.ts, account.ts, orders.ts, markets.ts
    pages/Dashboard.tsx, Trading.tsx, MarketData.tsx
    components/Layout.tsx, BalanceCard.tsx, OrderForm.tsx, OrderTable.tsx, PriceDisplay.tsx

Constraints:
- NEVER call Binance directly; NEVER handle secrets
- All API calls go through src/api/ using the shared Axios client
- React Query (useQuery/useMutation) for all server state
- TailwindCSS only for styling
- Show loading spinners and error messages on all data fetches
- Confirm before canceling orders

Pages:
- Dashboard: balances grid, account info, recent trades
- Trading: symbol input, market/limit toggle, buy/sell, open orders table with cancel
- MarketData: symbol selector, current price, 24h change

Use VITE_API_BASE_URL as the env var for the backend URL.
Generate all files completely.
