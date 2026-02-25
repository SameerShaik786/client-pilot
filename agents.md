# AI Agent Guidance — ClientPilot

## Role & Constraints

You are an AI coding assistant helping build ClientPilot, a freelance project management tool. Follow these rules strictly:

### Architecture Rules
1. **Backend is Flask with Blueprints.** Each domain (auth, clients, projects, deliverables, ai) is a separate Blueprint. Never put cross-domain logic in a single file.
2. **Frontend is React with React Query.** All server state must go through `@tanstack/react-query` hooks. Do not use `useEffect` for data fetching.
3. **Database is SQLAlchemy + SQLite.** Models go in `app/models/`. All schema validation goes through Marshmallow in `app/schemas.py`.
4. **Auth is JWT-based.** Use `get_current_user_id()` from `app/api/auth_utils.py` in all protected endpoints. Never use session-based auth.

### Code Quality Rules
5. **No inline SQL.** Use SQLAlchemy ORM exclusively.
6. **No raw error responses.** Use `AppError`, `NotFoundError`, or `ValidationError` from `app/errors.py`.
7. **Every new endpoint must be in a Blueprint** and registered in `app/api/__init__.py`.
8. **Frontend components must be functional components** with hooks. No class components.
9. **Styling uses Tailwind CSS.** Use the established dark theme (`neutral-800`, `neutral-900` palette). No CSS files for component styles.

### Safety Rules
10. **All user inputs must be validated** through Marshmallow schemas before touching the database.
11. **All endpoints must be scoped to the authenticated user.** Never return data belonging to other users.
12. **Delete operations must cascade properly.** Deleting a client must delete its projects and their deliverables.
13. **AI responses must be JSON-parsed safely.** Always wrap `json.loads()` in try/except.

### AI-Specific Rules
14. **AI operations must create AgentRun records.** Every AI call must have an audit trail via `AgentRun` and `StepRun` models.
15. **AI must gracefully degrade.** If no Gemini API key is set, return mock responses — never crash.
16. **AI prompts must request structured JSON output.** Always specify the exact JSON schema in the prompt.

### Testing Rules
17. **Tests use the `testing` config** (in-memory SQLite). Each test gets a fresh database.
18. **Test both happy paths and error cases.** Every CRUD endpoint needs at least: create, read, update, delete, and 404 tests.
19. **Use fixtures** for auth tokens and test data setup.

### What NOT to Do
- Do not add new npm packages without explicit approval
- Do not modify the auth flow without discussion
- Do not store sensitive data (passwords, tokens) in plain text
- Do not create endpoints that bypass user scoping
- Do not use `console.log` in production frontend code — use React Query error handling
