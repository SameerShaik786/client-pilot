"""Client model — represents a freelancer's client.

This is a simple entity with no state machine. Clients are always
"active" once created. Soft-delete is intentionally not implemented
(YAGNI — we can add it later if needed without breaking anything).

Relationships:
    User → has many → Clients → has many → Projects
"""

from datetime import datetime, timezone
from app.extensions import db


class Client(db.Model):
    """A client that the freelancer works with."""

    __tablename__ = "clients"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False, index=True
    )
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(254), nullable=False)
    company = db.Column(db.String(120), nullable=True)
    notes = db.Column(db.Text, nullable=True)
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
    projects = db.relationship(
        "Project", backref="client", lazy="dynamic", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Client {self.id}: {self.name}>"
