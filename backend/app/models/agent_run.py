"""AgentRun and StepRun models for AI operation traceability.

Every time an AI feature is used (scope structuring, risk analysis, etc.),
we create ONE AgentRun with MULTIPLE StepRun children. This gives a
full audit trail of what the AI did, step by step.

Example:
    AgentRun (action="scope_structuring", status="completed")
      ├── StepRun (step=1, action="read_project", input={...}, output={...})
      ├── StepRun (step=2, action="call_gemini", input={...}, output={...})
      └── StepRun (step=3, action="save_deliverables", input={...}, output={...})

This is critical for the "Observability" assessment criteria — every AI
call is logged and inspectable.

Relationships:
    User → has many → AgentRuns → has many → StepRuns
"""

from datetime import datetime, timezone
from app.extensions import db


class AgentRun(db.Model):
    """A single AI agent execution (e.g., one scope structuring run)."""

    __tablename__ = "agent_runs"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False, index=True
    )
    action = db.Column(db.String(80), nullable=False)  # e.g. "scope_structuring"
    status = db.Column(db.String(20), nullable=False, default="running")
    error_message = db.Column(db.Text, nullable=True)
    started_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    finished_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    steps = db.relationship(
        "StepRun", backref="agent_run", lazy="dynamic",
        cascade="all, delete-orphan", order_by="StepRun.step_number"
    )

    def mark_completed(self):
        """Mark this agent run as successfully completed."""
        self.status = "completed"
        self.finished_at = datetime.now(timezone.utc)

    def mark_failed(self, error_message):
        """Mark this agent run as failed with an error message."""
        self.status = "failed"
        self.error_message = error_message
        self.finished_at = datetime.now(timezone.utc)

    def __repr__(self):
        return f"<AgentRun {self.id}: {self.action} [{self.status}]>"


class StepRun(db.Model):
    """A single step within an AI agent run."""

    __tablename__ = "step_runs"

    id = db.Column(db.Integer, primary_key=True)
    agent_run_id = db.Column(
        db.Integer, db.ForeignKey("agent_runs.id"), nullable=False, index=True
    )
    step_number = db.Column(db.Integer, nullable=False)
    action = db.Column(db.String(80), nullable=False)  # e.g. "call_gemini"
    input_data = db.Column(db.JSON, nullable=True)   # What was sent to AI
    output_data = db.Column(db.JSON, nullable=True)  # What came back
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self):
        return f"<StepRun {self.id}: step {self.step_number} - {self.action}>"
