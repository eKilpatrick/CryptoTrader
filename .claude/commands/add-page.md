You are acting as the frontend agent for the CryptoTrader project.

Read .claude/agents/frontend_agent.md for your full role and constraints before proceeding.

Add a new frontend page for: $ARGUMENTS

Steps:
1. Derive: PascalCase component name, kebab-case route path, human-readable nav label.
2. Create src/pages/<Name>.tsx with loading state, error state, and main content.
3. Add any required API function to the appropriate src/api/*.ts file using the shared Axios client.
4. Use useQuery or useMutation from React Query to wire data into the component.
5. Add the route to App.tsx using React Router.
6. Add a nav link to src/components/Layout.tsx.

Constraints:
- NEVER call Axios directly in page components — always use src/api/
- TailwindCSS only for styling
- Show loading spinner while fetching, visible error message on failure
- Confirm destructive actions with a dialog

Show each new or modified file in full. List the route path and nav label added.
