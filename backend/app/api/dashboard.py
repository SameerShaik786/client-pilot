"""Dashboard API — aggregated stats for the overview page.

Endpoints:
    GET /api/dashboard → Summary statistics for the current user.

Stats included:
    - client_count: Total number of clients
    - active_project_count: Number of projects with 'active' status
    - pending_deliverable_count: Deliverables with 'planned' or 'in_progress' status
    - overdue_deliverable_count: Deliverables past their due date (not completed)
    - upcoming_deadlines: Next 5 projects/deliverables due soon
"""

from datetime import datetime, timezone
from flask import Blueprint, jsonify
from app.api.auth_utils import get_current_user_id
from app.extensions import db
from app.models.client import Client
from app.models.project import Project, ProjectStatus
from app.models.deliverable import Deliverable, DeliverableStatus
from app.errors import AppError

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("", methods=["GET"])
def get_summary():
    """Get aggregated dashboard statistics."""
    user_id = get_current_user_id()
    now = datetime.now(timezone.utc)

    # 1. Client count
    client_count = Client.query.filter_by(user_id=user_id).count()

    # 2. Active projects (status='active')
    active_project_count = (
        Project.query.join(Client)
        .filter(Client.user_id == user_id, Project.status == ProjectStatus.ACTIVE)
        .count()
    )

    # 3. Pending deliverables (planned or in_progress)
    pending_deliverable_count = (
        Deliverable.query.join(Project).join(Client)
        .filter(
            Client.user_id == user_id,
            Deliverable.status.in_([DeliverableStatus.PLANNED, DeliverableStatus.IN_PROGRESS])
        )
        .count()
    )

    # 4. Overdue deliverables (due_date < now AND status != completed)
    overdue_deliverable_count = (
        Deliverable.query.join(Project).join(Client)
        .filter(
            Client.user_id == user_id,
            Deliverable.due_date < now,
            Deliverable.status != DeliverableStatus.COMPLETED
        )
        .count()
    )

    # 5. Upcoming milestones (Deliverables or Projects due soon)
    # Just getting next 5 deliverables due soon for now
    upcoming = (
        Deliverable.query.join(Project).join(Client)
        .filter(
            Client.user_id == user_id,
            Deliverable.due_date >= now,
            Deliverable.status != DeliverableStatus.COMPLETED
        )
        .order_by(Deliverable.due_date.asc())
        .limit(5)
        .all()
    )

    milestones = []
    for d in upcoming:
        milestones.append({
            "type": "deliverable",
            "id": d.id,
            "title": d.title,
            "project_title": d.project.title,
            "due_date": d.due_date.isoformat() if d.due_date else None
        })

    return jsonify({
        "data": {
            "client_count": client_count,
            "active_project_count": active_project_count,
            "pending_deliverable_count": pending_deliverable_count,
            "overdue_deliverable_count": overdue_deliverable_count,
            "upcoming_milestones": milestones
        }
    }), 200
