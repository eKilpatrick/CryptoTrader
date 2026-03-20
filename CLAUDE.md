# CLAUDE.md

## Objective

Build a **full-stack web application** that serves as a user interface for interacting with a Binance account using the `python-binance` SDK.

This is Phase 1 of a larger system that will later support:

* Paper trading
* Automated trading agents

---

## Tech Stack (Required)

* **Backend:** FastAPI (Python, async)
* **Frontend:** React (TypeScript)
* **Binance SDK:** python-binance

You may introduce supporting libraries if they improve developer experience or UI quality.

---

## Phase 1 Scope

Deliver a working application with the following capabilities:

### 1. Account Access

* Accept Binance API key + secret
* Backend handles all Binance communication
* Never expose secrets to frontend

---

### 2. Dashboard

* Display account balances
* Show basic account information
* Show recent trades

---

### 3. Trading

* Place market orders
* Place limit orders
* View open orders
* Cancel orders

---

### 4. Market Data

* Fetch current prices
* Support symbol selection (e.g., BTCUSDT)
* Basic charting is a plus, not required

---

## System Design Rules

* Backend owns all business logic
* Frontend is strictly a UI layer
* All Binance calls must go through a backend service layer
* Code must be modular and extensible

---

## Security Rules (Strict)

* Do NOT expose API keys to frontend
* Do NOT store secrets in plaintext
* Use environment variables or secure storage
* Validate all inputs before executing trades

---

## Backend Expectations

* Use FastAPI with async endpoints
* Use clear separation:

  * Routes (API layer)
  * Services (logic)
  * Binance integration (wrapper layer)
* Return clean, typed responses

---

## Frontend Expectations

* Clean, modern UI
* Simple navigation:

  * Dashboard
  * Trading
  * Market data
* Responsive and fast
* Use common libraries where helpful (e.g., React Query, Axios, Tailwind)

---

## API (Minimum)

Implement endpoints similar to:

* `GET /account`
* `GET /balances`
* `GET /markets/{symbol}`
* `GET /orders`
* `POST /orders`
* `DELETE /orders/{id}`

---

## Future Considerations (Design For, Do Not Build Yet)

* Paper trading mode (simulated execution)
* Automated trading agents
* Real-time updates (WebSockets)
* Background workers (e.g., Celery)

---

## Deliverable

A working full-stack application where a user can:

* Connect their Binance account
* View balances and activity
* Execute and manage trades

---

## Instructions

* Generate complete, runnable code
* Prefer simple, maintainable solutions
* Avoid over-engineering
* Ensure backend and frontend integrate cleanly

---

End of file.
