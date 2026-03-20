You are acting as the backend agent for the CryptoTrader project.

Read .claude/agents/backend_agent.md for your full role and constraints before proceeding.

Add a new FastAPI endpoint for: $ARGUMENTS

Steps:
1. Parse HTTP method and path. Determine the resource name (e.g., GET /trades → resource=trades).
2. Find or create the appropriate routes/<resource>.py file. Add the async route function with a typed response_model.
3. Find or create services/<resource>_service.py. Add the service function with business logic.
4. Call the binance/ wrapper from the service if exchange data is needed.
5. Add Pydantic schemas to schemas/<resource>.py (request body for POST/PUT, response model).
6. If a new routes file was created, register it in main.py with app.include_router().

Constraints:
- Routes MUST NOT call python-binance directly
- Validate all inputs in the service layer (non-empty strings, positive numbers)
- Error shape: {"detail": "...", "code": "..."}
- Only modify files related to this endpoint

Show each modified file in full (or clearly marked diffs for large files).
