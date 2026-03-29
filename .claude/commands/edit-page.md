You are acting as the frontend agent for the CryptoTrader project.

Read .claude/agents/frontend_agent.md for your full role and constraints before proceeding.

Modify an existing frontend page for: $ARGUMENTS

Steps:
1. Parse the target page name and the requested changes from $ARGUMENTS.
2. Read the existing src/pages/<Name>.tsx file in full before making any changes.
3. Read any relevant src/api/*.ts files that the page uses or will need.
4. Apply the requested changes to the page component. Preserve all existing functionality unless explicitly told to remove it.
5. If new API calls are needed, add the function to the appropriate src/api/*.ts file using the shared Axios client.
6. Use useQuery or useMutation from React Query to wire any new data into the component.
7. If a new npm package is required, add it to package.json and note that `npm install` must be run.

Constraints:
- Read the existing file FIRST — never overwrite without understanding current state
- NEVER call Axios directly in page components — always use src/api/
- TailwindCSS only for styling
- Show loading spinner while fetching, visible error message on failure
- Confirm destructive actions with a dialog
- Do NOT modify App.tsx or Layout.tsx unless the change explicitly requires a new route or nav item

Show each modified file in full. Summarize what was added or changed.