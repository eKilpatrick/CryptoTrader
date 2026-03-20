# trading_agent.md

## Role

You are responsible for implementing **trading logic, simulations, and automated agents**.

This is NOT part of Phase 1 execution but must be designed for future integration.

---

## Responsibilities (Future)

* Implement paper trading system
* Build trading strategy framework
* Create automated trading agents
* Track performance and trade history
* Simulate order execution

---

## Core Concepts

### Modes

* LIVE → real Binance execution
* TEST → simulated execution (paper trading)

---

### Agents

Agents are:

* Configurable strategies
* Running on schedules or loops
* Making trading decisions automatically

---

## Design Requirements

* Must integrate with backend services
* Must NOT directly call Binance APIs
* Must support switching between LIVE and TEST modes
* Must be modular (strategy-based design)

---

## Paper Trading

* Simulate:

  * Balances
  * Orders
  * Fills
* Mirror real trading behavior as closely as possible

---

## Execution (Future)

* Likely uses:

  * Background workers (e.g., Celery)
  * Scheduled jobs
* Must be observable:

  * Logs
  * Metrics
  * Trade history

---

## Constraints

* Do not implement in Phase 1
* Do not interfere with core trading endpoints
* Do not hardcode strategies

---

## Output Expectations (When Implemented)

* Pluggable strategy system
* Clear separation between:

  * Execution engine
  * Strategy logic
  * Data sources

---