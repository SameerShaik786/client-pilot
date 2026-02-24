"""Deliverable model with enforced state machine transitions.

Follows the same state machine pattern as Project for consistency.
Status transitions are enforced via transition_status().

State diagram:
    planned     → in_progress
    in_progress → blocked
    in_progress → completed
    blocked     → in_progress
    completed   → (nothing — terminal)

Relationships:
    Project → has many → Deliverables
"""

from datetime import datetime, timezone
from app.extensions import db
from app.errors import StateTransitionError


class DeliverableStatus:
    """Valid deliverable statuses and their allowed transitions."""

    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    BLOCKED = "blocked"
    COMPLETED = "completed"

    ALL = {PLANNED, IN_PROGRESS, BLOCKED, COMPLETED}

    TRANSITIONS = {
        PLANNED: {IN_PROGRESS},
        IN_PROGRESS: {BLOCKED, COMPLETED},
        BLOCKED: {IN_PROGRESS},
        COMPLETED: set(),  # Terminal state
    }


class Deliverable(db.Model):
    """A deliverable within a project."""

    __tablename__ = "deliverables"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(
        db.Integer, db.ForeignKey("projects.id"), nullable=False, index=True
    )
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.String(20), nullable=False, default=DeliverableStatus.PLANNED
    )
    due_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def __init__(self, **kwargs):
        """Set default status at creation time (not just at DB commit)."""
        kwargs.setdefault("status", DeliverableStatus.PLANNED)
        super().__init__(**kwargs)

    def transition_status(self, new_status):
        """Transition to a new status, enforcing the state machine.

        Args:
            new_status: Target status string.

        Returns:
            The previous status (useful for logging).

        Raises:
            StateTransitionError: If the transition is not allowed.
        """
        if new_status not in DeliverableStatus.ALL:
            raise StateTransitionError(
                current_status=self.status,
                target_status=new_status,
                valid_transitions=sorted(
                    DeliverableStatus.TRANSITIONS.get(self.status, set())
                ),
            )

        allowed = DeliverableStatus.TRANSITIONS.get(self.status, set())
        if new_status not in allowed:
            raise StateTransitionError(
                current_status=self.status,
                target_status=new_status,
                valid_transitions=sorted(allowed),
            )

        old_status = self.status
        self.status = new_status
        return old_status

    def __repr__(self):
        return f"<Deliverable {self.id}: {self.title} [{self.status}]>"
