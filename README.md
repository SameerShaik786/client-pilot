# ClientPilot — AI-Powered Client & Project Management

A freelance project management tool with an AI agent that transforms raw client requirements into structured deliverables. Built with Flask + React + SQLite.

## Quick Start

```bash
# Backend
cd backend
pip install -r requirements.txt
python run.py

# Frontend
cd frontend
npm install
npm run dev

# Seed dummy data (optional)
cd backend
python seed.py
```

**Login:** `test_1771996042@example.com` / `password123`

## Architecture

```
statuslens/
├── backend/           # Flask REST API
│   ├── app/
│   │   ├── api/       # Route blueprints (auth, clients, projects, deliverables, ai, dashboard)
│   │   ├── models/    # SQLAlchemy models
│   │   ├── services/  # AI engine (Gemini integration)
│   │   ├── config.py  # Environment configs
│   │   ├── errors.py  # Centralized error handling
│   │   └── middleware.py  # Request logging & observability
│   └── tests/         # pytest test suite
├── frontend/          # React SPA
│   ├── src/
│   │   ├── pages/     # Dashboard, ClientDetail, ProjectDetail, Clients
│   │   ├── components/# Modals, AI Scope Agent, Layout
│   │   ├── hooks/     # React Query hooks for API
│   │   └── services/  # API client
│   └── ...
└── agents.md          # AI guidance rules
```

## Key Technical Decisions

### 1. Domain-Driven Blueprint Structure
Each API domain (auth, clients, projects, deliverables, ai) is a separate Flask Blueprint. This enforces clear module boundaries — adding a new domain doesn't touch existing files.

### 2. Factory Pattern + Config Classes
`create_app(config_name)` supports dev/test/prod configs. Tests use in-memory SQLite (`:memory:`), dev uses file-based SQLite. This means zero infrastructure needed to run or test.

### 3. JWT Auth with Centralized Utility
Auth is handled via JWT tokens. `auth_utils.py` provides `get_current_user_id()` — a single function all protected endpoints call. This makes auth changes a one-file edit.

### 4. AI Agent as a Service Layer
The `AIEngine` class wraps Gemini API calls. Every AI operation creates an `AgentRun` with `StepRun` records — a full audit trail. If no API key is set, it returns mock responses (graceful degradation).

### 5. Schema Validation via Marshmallow
All input/output goes through Marshmallow schemas. Invalid data is caught at the boundary, not inside business logic. Serialization is consistent and type-safe.

### 6. React Query for Server State
Frontend uses `@tanstack/react-query` for data fetching, caching, and cache invalidation. CRUD mutations automatically invalidate related queries (e.g., creating a deliverable refreshes both the deliverable list and project progress).

### 7. Progress as a Computed Property
`Project.progress_percentage` is calculated server-side as `completed_deliverables / total_deliverables * 100`. This is a `@property`, not a stored field — it's always accurate and never stale.

## AI Agent Feature

The AI Scope Agent is the core differentiator:

1. **User pastes raw client requirements** (e.g., emails, Slack messages, meeting notes)
2. **AI agent (Gemini)** acts as a project manager — structures the raw text into deliverables, flags ambiguities, and suggests follow-up questions
3. **User reviews the plan** — sees structured deliverables, ambiguities, and suggested questions
4. **User approves** → deliverables are automatically added to the project

This flow is implemented end-to-end:
- Backend: `POST /api/ai/structure-scope` → `AIEngine.structure_scope()` → Gemini API
- Frontend: `<AIScopeAgent>` component in ProjectDetail page

## AI Usage

This project was built with AI assistance (Gemini via Antigravity agent). AI was used for:
- Scaffolding initial file structures
- Writing boilerplate (schemas, models, CRUD endpoints)
- Generating test cases
- CSS styling classes

Every AI-generated piece was reviewed and modified. Key areas where I made manual decisions:
- Database schema design and relationships
- Auth flow architecture
- AI agent audit trail design (AgentRun/StepRun)
- Frontend component hierarchy and state management

## Risks & Tradeoffs

| Decision | Tradeoff |
|----------|----------|
| SQLite | Simple but not suitable for concurrent production writes. Migration to PostgreSQL is a config change. |
| JWT in localStorage | Vulnerable to XSS. HttpOnly cookies would be safer but add CORS complexity. |
| No pagination | Fine for small datasets. Would need cursor-based pagination for scale. |
| Gemini mock fallback | If no API key is set, AI returns mock data. Good for dev/demo but masks real behavior. |
| No WebSocket | Dashboard doesn't auto-refresh. React Query polling could be added. |

## Running Tests

```bash
cd backend
pip install pytest
python -m pytest tests/ -v
```

## Extension Approach

To add a new feature (e.g., "Time Tracking"):
1. Create `app/models/time_entry.py` (model)
2. Add schema in `app/schemas.py`
3. Create `app/api/time_tracking.py` (blueprint)
4. Register in `app/api/__init__.py`
5. Add React Query hook in `frontend/src/hooks/useTimeTracking.js`
6. Build the page component

No existing files need significant changes — the blueprint pattern makes this additive.
