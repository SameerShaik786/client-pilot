"""Deliverables API — CRUD and status transitions.

Endpoints:
    GET    /api/deliverables          → List all deliverables for current user
    POST   /api/deliverables          → Create a new deliverable for a project
    GET    /api/deliverables/<id>     → Get deliverable details
    PUT    /api/deliverables/<id>     → Update deliverable metadata
    PATCH  /api/deliverables/<id>/status → Transition status (state machine)
    DELETE /api/deliverables/<id>     → Delete a deliverable

Design decisions:
- User scoping: Joins Deliverable -> Project -> Client to ensure ownership.
- Status logic: Enforced via PATCH /status only.
- 404/422 errors: Consistent with rest of API.
"""

from flask import Blueprint, request, jsonify, session
from app.extensions import db
from app.models.client import Client
from app.models.project import Project
from app.models.deliverable import Deliverable
from app.errors import NotFoundError, AppError
from app.api.auth_utils import get_current_user_id
from app.schemas import (
    DeliverableCreateSchema,
    DeliverableUpdateSchema,
    DeliverableStatusSchema,
    DeliverableResponseSchema,
)

deliverables_bp = Blueprint("deliverables", __name__)

# Schema instances
_create_schema = DeliverableCreateSchema()
_update_schema = DeliverableUpdateSchema()
_status_schema = DeliverableStatusSchema()
_response_schema = DeliverableResponseSchema()
_response_list_schema = DeliverableResponseSchema(many=True)


@deliverables_bp.route("", methods=["GET"])
def list_deliverables():
    """List all deliverables for the current user."""
    user_id = get_current_user_id()
    
    # Complex join to ensure full ownership chain
    deliverables = (
        Deliverable.query.join(Project).join(Client)
        .filter(Client.user_id == user_id)
        .order_by(Deliverable.created_at.desc())
        .all()
    )
    return jsonify({"data": _response_list_schema.dump(deliverables)}), 200


@deliverables_bp.route("", methods=["POST"])
def create_deliverable():
    """Create a new deliverable."""
    user_id = get_current_user_id()
    data = _create_schema.load(request.get_json())
    
    # Verify the project exists and belongs to the user via client
    project = (
        Project.query.join(Client)
        .filter(Project.id == data["project_id"], Client.user_id == user_id)
        .first()
    )
    if not project:
        raise NotFoundError("Project", data["project_id"])
    
    deliverable = Deliverable(
        project_id=data["project_id"],
        title=data["title"],
        description=data.get("description"),
        due_date=data.get("due_date")
    )
    db.session.add(deliverable)
    db.session.commit()
    
    return jsonify({"data": _response_schema.dump(deliverable)}), 201


@deliverables_bp.route("/<int:deliverable_id>", methods=["GET"])
def get_deliverable(deliverable_id):
    """Get deliverable details."""
    user_id = get_current_user_id()
    
    deliverable = (
        Deliverable.query.join(Project).join(Client)
        .filter(Deliverable.id == deliverable_id, Client.user_id == user_id)
        .first()
    )
    if not deliverable:
        raise NotFoundError("Deliverable", deliverable_id)
    
    return jsonify({"data": _response_schema.dump(deliverable)}), 200


@deliverables_bp.route("/<int:deliverable_id>", methods=["PUT"])
def update_deliverable(deliverable_id):
    """Update deliverable metadata (title, description, due_date)."""
    user_id = get_current_user_id()
    
    deliverable = (
        Deliverable.query.join(Project).join(Client)
        .filter(Deliverable.id == deliverable_id, Client.user_id == user_id)
        .first()
    )
    if not deliverable:
        raise NotFoundError("Deliverable", deliverable_id)
    
    data = _update_schema.load(request.get_json())
    
    if "title" in data:
        deliverable.title = data["title"]
    if "description" in data:
        deliverable.description = data["description"]
    if "due_date" in data:
        deliverable.due_date = data["due_date"]
        
    db.session.commit()
    return jsonify({"data": _response_schema.dump(deliverable)}), 200


@deliverables_bp.route("/<int:deliverable_id>/status", methods=["PATCH"])
def transition_deliverable_status(deliverable_id):
    """Transition deliverable status using the state machine."""
    user_id = get_current_user_id()
    
    deliverable = (
        Deliverable.query.join(Project).join(Client)
        .filter(Deliverable.id == deliverable_id, Client.user_id == user_id)
        .first()
    )
    if not deliverable:
        raise NotFoundError("Deliverable", deliverable_id)
    
    data = _status_schema.load(request.get_json())
    
    # The model handles the transition logic and validation
    deliverable.transition_status(data["status"])
    
    db.session.commit()
    return jsonify({"data": _response_schema.dump(deliverable)}), 200


@deliverables_bp.route("/<int:deliverable_id>", methods=["DELETE"])
def delete_deliverable(deliverable_id):
    """Delete a deliverable."""
    user_id = get_current_user_id()
    
    deliverable = (
        Deliverable.query.join(Project).join(Client)
        .filter(Deliverable.id == deliverable_id, Client.user_id == user_id)
        .first()
    )
    if not deliverable:
        raise NotFoundError("Deliverable", deliverable_id)
    
    db.session.delete(deliverable)
    db.session.commit()
    return jsonify({"data": {"message": f"Deliverable '{deliverable.title}' deleted"}}), 200
