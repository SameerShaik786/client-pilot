"""Marshmallow schemas for input validation and serialization.

Design decisions:
- Every API input passes through a schema BEFORE touching the database.
- Status fields are dump_only — they can never be set directly via API.
  Status changes must go through the state machine endpoints.
- Sensitive fields like password_hash are load_only (accepted on input)
  but never returned in API responses.
- Each schema validates: required fields, string lengths, email format.

This is the "Interface Safety" layer — guards against invalid data
at the API boundary so the database never sees bad input.
"""

from marshmallow import fields, validate, validates, ValidationError
from app.extensions import ma
from app.models.user import User
from app.models.client import Client
from app.models.project import Project, ProjectStatus
from app.models.deliverable import Deliverable, DeliverableStatus
from app.models.agent_run import AgentRun, StepRun


# ── User Schemas ──────────────────────────────────────────────

class UserRegistrationSchema(ma.Schema):
    """Schema for user registration — requires username, email, password."""

    username = fields.String(
        required=True,
        validate=validate.Length(min=3, max=80),
    )
    email = fields.String(
        required=True,
        validate=[validate.Email(), validate.Length(max=254)],
    )
    password = fields.String(
        required=True,
        load_only=True,
        validate=validate.Length(min=8, max=128),
    )


class UserLoginSchema(ma.Schema):
    """Schema for login — requires email and password."""

    email = fields.String(required=True, validate=validate.Email())
    password = fields.String(required=True, load_only=True)


class UserResponseSchema(ma.SQLAlchemyAutoSchema):
    """Schema for returning user data — never exposes password_hash."""

    class Meta:
        model = User
        exclude = ("password_hash",)
        dump_only = ("id", "created_at")


# ── Client Schemas ────────────────────────────────────────────

class ClientCreateSchema(ma.Schema):
    """Schema for creating a client — name and email required."""

    name = fields.String(
        required=True,
        validate=validate.Length(min=1, max=120),
    )
    email = fields.String(
        required=True,
        validate=[validate.Email(), validate.Length(max=254)],
    )
    company = fields.String(
        validate=validate.Length(max=120),
        load_default=None,
    )
    logo_url = fields.URL(validate=validate.Length(max=500), load_default=None)
    notes = fields.String(load_default=None)


class ClientUpdateSchema(ma.Schema):
    """Schema for updating a client — all fields optional."""

    name = fields.String(validate=validate.Length(min=1, max=120))
    email = fields.String(
        validate=[validate.Email(), validate.Length(max=254)]
    )
    company = fields.String(validate=validate.Length(max=120))
    logo_url = fields.URL(validate=validate.Length(max=500))
    notes = fields.String()


class ClientResponseSchema(ma.SQLAlchemyAutoSchema):
    """Schema for returning client data."""

    class Meta:
        model = Client
        include_fk = True
        dump_only = ("id", "user_id", "created_at", "updated_at")


# ── Project Schemas ───────────────────────────────────────────

class ProjectCreateSchema(ma.Schema):
    """Schema for creating a project — title and client_id required."""

    client_id = fields.Integer(required=True)
    title = fields.String(
        required=True,
        validate=validate.Length(min=1, max=200),
    )
    description = fields.String(load_default=None)
    deadline = fields.Date(load_default=None)


class ProjectUpdateSchema(ma.Schema):
    """Schema for updating a project — all fields optional. Status NOT here."""

    title = fields.String(validate=validate.Length(min=1, max=200))
    description = fields.String()
    deadline = fields.Date()


class ProjectStatusSchema(ma.Schema):
    """Schema for status transition — only accepts a valid status string."""

    status = fields.String(
        required=True,
        validate=validate.OneOf(sorted(ProjectStatus.ALL)),
    )


class ProjectResponseSchema(ma.SQLAlchemyAutoSchema):
    """Schema for returning project data."""

    class Meta:
        model = Project
        include_fk = True
        dump_only = ("id", "status", "progress_percentage", "created_at", "updated_at")


# ── Deliverable Schemas ──────────────────────────────────────

class DeliverableCreateSchema(ma.Schema):
    """Schema for creating a deliverable — title required. project_id handled by route."""

    project_id = fields.Integer(load_default=None) # Optional because URL takes precedence
    title = fields.String(
        required=True,
        validate=validate.Length(min=1, max=200),
    )
    description = fields.String(load_default=None)
    due_date = fields.Date(load_default=None)


class DeliverableUpdateSchema(ma.Schema):
    """Schema for updating a deliverable — all fields optional. Status NOT here."""

    title = fields.String(validate=validate.Length(min=1, max=200))
    description = fields.String()
    due_date = fields.Date()


class DeliverableStatusSchema(ma.Schema):
    """Schema for status transition — only accepts a valid status string."""

    status = fields.String(
        required=True,
        validate=validate.OneOf(sorted(DeliverableStatus.ALL)),
    )


class DeliverableResponseSchema(ma.SQLAlchemyAutoSchema):
    """Schema for returning deliverable data."""

    class Meta:
        model = Deliverable
        include_fk = True
        dump_only = ("id", "status", "created_at", "updated_at")


# ── AgentRun Schemas ─────────────────────────────────────────

class AgentRunResponseSchema(ma.SQLAlchemyAutoSchema):
    """Schema for returning agent run data (read-only, never created via API)."""

    class Meta:
        model = AgentRun
        include_fk = True


class StepRunResponseSchema(ma.SQLAlchemyAutoSchema):
    """Schema for returning step run data (read-only)."""

    class Meta:
        model = StepRun
        include_fk = True
