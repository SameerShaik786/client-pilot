# ClientPilot — Development Roadmap

> AI-assisted operations dashboard for freelancers to manage clients, projects, and deliverables.

---

## Phase 1: Project Setup
Foundation files that configure the Flask backend.

| Step | Files | What It Does |
|------|-------|-------------|
| **1.1** | `.flaskenv`, `requirements.txt`, `app/config.py` | Flask environment config, all Python dependencies (Flask, SQLAlchemy, Marshmallow, Gemini AI, pytest), and dev/test/prod environment settings |
| **1.2** | `app/__init__.py`, `models/__init__.py`, `api/__init__.py`, `run.py`, `extensions.py`, `errors.py`, `middleware.py` | App factory (creates and wires up the Flask app), extension instances (db, marshmallow, migrate, cors), centralized error handling, request tracing middleware, and entry point |

---

## Phase 2: Domain Models
One database model per step. Each maps to a table in the database.

| Step | File | What It Does |
|------|------|-------------|
| **2.1** | `models/client.py` | Client entity — stores name, email, company, notes. Has a one-to-many relationship with Projects |
| **2.2** | `models/project.py` | Project entity with **state machine** — status transitions are enforced in code (active ↔ on_hold → completed). Invalid transitions raise errors |
| **2.3** | `models/deliverable.py` | Deliverable entity with **state machine** — (planned → in_progress ↔ blocked → completed). Belongs to a Project |
| **2.4** | `models/agent_run.py` | AgentRun + StepRun — audit trail for AI operations. Every AI call logs what it did step-by-step for traceability |

---

## Phase 3: Schemas
Validation layer between the API and the database.

| Step | File | What It Does |
|------|------|-------------|
| **3.1** | `schemas.py` | Marshmallow schemas that validate every API input (required fields, email format, string lengths, enum-only statuses). Prevents invalid data from reaching the database |

---

## Phase 4: API Routes
REST endpoints — one file per domain entity.

| Step | File | What It Does |
|------|------|-------------|
| **4.1** | `api/clients.py` | `GET/POST /api/clients`, `GET/PUT/DELETE /api/clients/<id>` — full CRUD for clients |
| **4.2** | `api/projects.py` | `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/<id>`, `PATCH /api/projects/<id>/status` — CRUD + enforced state transitions |
| **4.3** | `api/deliverables.py` | `GET/POST /api/deliverables`, `GET/PUT/DELETE /api/deliverables/<id>`, `PATCH /api/deliverables/<id>/status` — CRUD + enforced state transitions |
| **4.4** | `api/dashboard.py` | `GET /api/dashboard` — returns summary stats (total clients, active projects, overdue deliverables, upcoming deadlines) |

---

## Phase 5: Automated Tests
pytest test suite proving the system works correctly.

| Step | File | What It Does |
|------|------|-------------|
| **5.1** | `tests/conftest.py` | Shared test fixtures — creates a test app with in-memory database, provides a test client for making HTTP requests |
| **5.2** | `tests/test_clients.py` | Tests for client CRUD: create, read, update, delete, validation errors, 404 handling |
| **5.3** | `tests/test_projects.py` | Tests for project CRUD + **state machine transitions** (valid moves, invalid moves, terminal state blocking) |
| **5.4** | `tests/test_deliverables.py` | Tests for deliverable CRUD + **state machine transitions** |

---

## Phase 6: AI Services
Agentic AI features powered by Google Gemini.

| Step | File | What It Does |
|------|------|-------------|
| **6.1** | `services/ai_engine.py` | Core Gemini API wrapper with three functions: **scope structuring** (turns messy requirements into structured deliverables), **risk analysis** (scans workload for risks), **update generation** (drafts professional client emails). Each function follows an agentic workflow: read DB → plan steps → call AI → validate output → log trace |
| **6.2** | `api/ai.py` | Three API endpoints: `POST /api/ai/structure-scope`, `POST /api/ai/analyze-risk`, `POST /api/ai/generate-update` |
| **6.3** | `tests/test_ai.py` | Mocked AI tests — verifies input validation, AgentRun/StepRun logging, error handling (without calling real Gemini API) |

---

## Phase 7: Frontend
React app built with Vite. Premium dark-themed design.

| Step | What It Does |
|------|-------------|
| **7.1** | Scaffold React + Vite project in `frontend/` |
| **7.2** | Design system — global CSS, color palette, Inter font, layout shell with sidebar navigation |
| **7.3** | Dashboard page — overview cards (active clients, projects, risk score, overdue items) |
| **7.4** | Clients pages — list view with search, detail view showing client info + their projects |
| **7.5** | Project detail page — project info, deliverables table with status badges, status transition buttons |
| **7.6** | AI panels — Scope Structurer (paste requirements → get structured output), Risk Monitor (analyze workload), Client Update Generator (draft emails) |

---

## Phase 8: Assessment Deliverables
Files required for the Better Software submission.

| Step | File | What It Does |
|------|------|-------------|
| **8.1** | `agents.md` | AI guidance file — coding standards, constraints, prompting rules that guided AI agent behavior during development |
| **8.2** | `README.md` | Architecture overview, key technical decisions, tradeoffs, setup instructions, and AI usage documentation |
