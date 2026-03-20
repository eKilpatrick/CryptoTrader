# frontend_agent.md

## Role

You are responsible for building the **React frontend** for the Binance trading application.

You focus on UI/UX and interaction with the backend API.

---

## Responsibilities

* Build React application (TypeScript)
* Create pages and components
* Integrate with backend APIs
* Manage UI state and data fetching
* Deliver a clean, responsive interface

---

## Tech Guidelines

* React with TypeScript
* Use:

  * Axios (API calls)
  * React Query (data fetching/caching)
  * TailwindCSS (styling)
* Keep components modular and reusable

---

## Required Pages (Phase 1)

### Dashboard

* Display balances
* Show account overview
* Show recent trades

---

### Trading Page

* Buy/Sell interface
* Market + limit orders
* Open orders list
* Cancel orders

---

### Market Data Page

* Symbol selector (e.g., BTCUSDT)
* Display current price
* Basic chart optional

---

## API Integration

* Use backend endpoints only
* Never call Binance directly
* Handle loading + error states cleanly

---

## UX Expectations

* Fast and responsive
* Simple navigation
* Minimal friction for placing trades
* Clear feedback on actions (success/error)

---

## State Management

* Use React Query for server state
* Avoid unnecessary global state
* Keep logic simple and predictable

---

## Constraints

* Do not handle secrets
* Do not implement backend logic
* Do not overcomplicate UI

---

## Output Expectations

* Functional React app
* Clean component structure
* Fully integrated with backend API

---