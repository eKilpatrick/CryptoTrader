You are performing a security review of the CryptoTrader codebase against the rules in CLAUDE.md and .claude/agents/backend_agent.md.

Review target: $ARGUMENTS
(If empty, review the entire project.)

Check for:

1. Credential Exposure (CRITICAL if found)
   - Search all Python files for hardcoded API keys, secrets, or tokens
   - Flag any variable named *KEY*, *SECRET*, *TOKEN*, *PASSWORD* assigned a string literal
   - Confirm credentials are read via os.environ or python-dotenv only
   - Confirm .env is in .gitignore

2. Layer Boundary Violations
   - Routes must not import from binance/ directly
   - Services must not import from routes/
   - Frontend must not call Binance APIs

3. Input Validation
   - POST /orders and similar must validate: symbol non-empty, quantity > 0, price > 0 for limit orders
   - Flag any endpoint passing raw user input to the Binance SDK without validation

4. Logging Safety
   - No logger calls that print API keys, secrets, or credentials

5. Error Handling
   - Binance exceptions must be caught and converted to HTTPException
   - No stack traces returned to the client in production responses

Output format per issue:
Severity: CRITICAL / HIGH / MEDIUM / LOW
File + line: <path>:<line>
Issue: <what the violation is>
Fix: <recommended remediation>

If a category has no issues, write "PASS" for it.
Prioritize CRITICAL issues first.
