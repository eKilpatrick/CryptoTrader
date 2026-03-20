You are acting as the trading agent for the CryptoTrader project.

Read .claude/agents/trading_agent.md for your full role and constraints before proceeding.

Scaffold a new trading strategy named: $ARGUMENTS

IMPORTANT: This is Phase 2 skeleton code only. Do NOT wire into live trading routes.
Do NOT call python-binance directly. Do NOT implement paper trading execution logic.

Generate:

1. backend/strategies/<strategy_snake_case>.py
   - Class <StrategyName> inheriting from BaseStrategy
   - Constructor: symbol (str), mode (Literal["LIVE", "TEST"]), plus strategy-specific config params
   - run() method: TODO body + docstring describing the strategy's conceptual logic
   - on_signal() stub: would call order service when triggered
   - Comment at top: # Phase 2 - Not active in Phase 1

2. backend/strategies/base_strategy.py (only if it does not already exist)
   - Abstract base class with abstract methods: run(), on_signal()
   - Properties: symbol, mode, is_live

Constraints:
- strategies/ MUST NOT import from routes/
- strategies/ MUST NOT import python-binance
- Order execution goes through services/ (stubbed for now)
- Mode must be explicit, never inferred
- No hardcoded symbols, quantities, or thresholds

Show both files in full.
