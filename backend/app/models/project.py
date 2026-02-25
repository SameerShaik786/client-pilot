"""Project model with enforced state machine transitions.

Status transitions are validated by the model itself — calling
transition_status() with an invalid target raises StateTransitionError.
This prevents invalid states at the domain level, not just the API level.

State diagram:
    active ←→ on_hold    (can toggle between these)
    active  → completed  (terminal)
    on_hold → completed  (terminal)
    completed → (nothing) (no transitions out of completed)

Relationships:
    Client → has many → Projects → has many → Deliverables
"""

from datetime import datetime, timezone
from app.extensions import db
from app.errors import StateTransitionError


class ProjectStatus:
    """Valid project statuses and their allowed transitions."""

    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"

    ALL = {ACTIVE, ON_HOLD, COMPLETED}

    # Maps current_status → set of valid target statuses
    TRANSITIONS = {
        ACTIVE: {ON_HOLD, COMPLETED},
        ON_HOLD: {ACTIVE, COMPLETED},
        COMPLETED: set(),  # Terminal state — no transitions allowed
    }


class Project(db.Model):
    """A project belonging to a client."""

    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(
        db.Integer, db.ForeignKey("clients.id"), nullable=False, index=True
    )
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.String(20), nullable=False, default=ProjectStatus.ACTIVE
    )
    deadline = db.Column(db.Date, nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    deliverables = db.relationship(
        "Deliverable", backref="project", lazy="dynamic", cascade="all, delete-orphan"
    )

    def __init__(self, **kwargs):
        """Set default status at creation time (not just at DB commit)."""
        kwargs.setdefault("status", ProjectStatus.ACTIVE)
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
        if new_status not in ProjectStatus.ALL:
            raise StateTransitionError(
                current_status=self.status,
                target_status=new_status,
                valid_transitions=sorted(
                    ProjectStatus.TRANSITIONS.get(self.status, set())
                ),
            )

        allowed = ProjectStatus.TRANSITIONS.get(self.status, set())
        if new_status not in allowed:
            raise StateTransitionError(
                current_status=self.status,
                target_status=new_status,
                valid_transitions=sorted(allowed),
            )

        old_status = self.status
        self.status = new_status
        return old_status

    @property
    def progress_percentage(self):
        """Calculate project progress based on completed deliverables.
        
        Returns:
            Integer representing the percentage of completed deliverables.
            Returns 0 if there are no deliverables.
        """
        total = self.deliverables.count()
        if total == 0:
            return 0
        
        # Using the DeliverableStatus.COMPLETED literal directly since we don't
        # want to import Deliverable here to avoid circular imports if any.
        completed = self.deliverables.filter_by(status="completed").count()
        return int((completed / total) * 100)

    def __repr__(self):
        return f"<Project {self.id}: {self.title} [{self.status}]>"
