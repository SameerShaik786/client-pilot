"""Projects API — CRUD and status transitions.

Endpoints:
    GET    /api/projects          → List all projects for current user
    POST   /api/projects          → Create a new project for a client
    GET    /api/projects/<id>     → Get project details
    PUT    /api/projects/<id>     → Update project info (not status)
    PATCH  /api/projects/<id>/status → Transition project status (state machine)
    DELETE /api/projects/<id>     → Delete a project

Design decisions:
- Status cannot be changed via PUT/POST — must use the PATCH /status endpoint.
- Every project belongs to a client, which must belong to the current user.
- PATCH /status uses the model's transition_status() to enforce state machine rules.
"""

from flask import Blueprint, request, jsonify, session
from app.extensions import db
from app.models.client import Client
from app.models.project import Project
from app.errors import NotFoundError, AppError
from app.api.auth_utils import get_current_user_id
from app.schemas import (
    ProjectCreateSchema,
    ProjectUpdateSchema,
    ProjectStatusSchema,
    ProjectResponseSchema,
)

projects_bp = Blueprint("projects", __name__)

# Schema instances
_create_schema = ProjectCreateSchema()
_update_schema = ProjectUpdateSchema()
_status_schema = ProjectStatusSchema()
_response_schema = ProjectResponseSchema()
_response_list_schema = ProjectResponseSchema(many=True)


@projects_bp.route("", methods=["GET"])
def list_projects():
    """List all projects for the current user."""
    user_id = get_current_user_id()
    
    # We join with Client to ensure we only see projects for clients that belong to this user
    projects = (
        Project.query.join(Client)
        .filter(Client.user_id == user_id)
        .order_by(Project.created_at.desc())
        .all()
    )
    return jsonify({"data": _response_list_schema.dump(projects)}), 200


@projects_bp.route("", methods=["POST"])
def create_project():
    """Create a new project."""
    user_id = get_current_user_id()
    data = _create_schema.load(request.get_json())
    
    # Verify the client exists and belongs to the user
    client = Client.query.filter_by(id=data["client_id"], user_id=user_id).first()
    if not client:
        raise NotFoundError("Client", data["client_id"])
    
    project = Project(
        client_id=data["client_id"],
        title=data["title"],
        description=data.get("description"),
        deadline=data.get("deadline")
    )
    db.session.add(project)
    db.session.commit()
    
    return jsonify({"data": _response_schema.dump(project)}), 201


@projects_bp.route("/<int:project_id>", methods=["GET"])
def get_project(project_id):
    """Get project details."""
    user_id = get_current_user_id()
    
    project = (
        Project.query.join(Client)
        .filter(Project.id == project_id, Client.user_id == user_id)
        .first()
    )
    if not project:
        raise NotFoundError("Project", project_id)
    
    return jsonify({"data": _response_schema.dump(project)}), 200


@projects_bp.route("/<int:project_id>", methods=["PUT"])
def update_project(project_id):
    """Update project metadata (title, description, deadline)."""
    user_id = get_current_user_id()
    
    project = (
        Project.query.join(Client)
        .filter(Project.id == project_id, Client.user_id == user_id)
        .first()
    )
    if not project:
        raise NotFoundError("Project", project_id)
    
    data = _update_schema.load(request.get_json())
    
    if "title" in data:
        project.title = data["title"]
    if "description" in data:
        project.description = data["description"]
    if "deadline" in data:
        project.deadline = data["deadline"]
        
    db.session.commit()
    return jsonify({"data": _response_schema.dump(project)}), 200


@projects_bp.route("/<int:project_id>/status", methods=["PATCH"])
def transition_project_status(project_id):
    """Transition project status using the state machine."""
    user_id = get_current_user_id()
    
    project = (
        Project.query.join(Client)
        .filter(Project.id == project_id, Client.user_id == user_id)
        .first()
    )
    if not project:
        raise NotFoundError("Project", project_id)
    
    data = _status_schema.load(request.get_json())
    
    # The model handles the transition logic and validation
    project.transition_status(data["status"])
    
    db.session.commit()
    return jsonify({"data": _response_schema.dump(project)}), 200


@projects_bp.route("/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):
    """Delete a project."""
    user_id = get_current_user_id()
    
    project = (
        Project.query.join(Client)
        .filter(Project.id == project_id, Client.user_id == user_id)
        .first()
    )
    if not project:
        raise NotFoundError("Project", project_id)
    
    db.session.delete(project)
    db.session.commit()
    return jsonify({"data": {"message": f"Project '{project.title}' deleted"}}), 200


@projects_bp.route("/<int:project_id>/deliverables", methods=["POST"])
def create_project_deliverable(project_id):
    """Create a new deliverable for a specific project."""
    from app.models.deliverable import Deliverable
    from app.schemas import DeliverableCreateSchema, DeliverableResponseSchema

    user_id = get_current_user_id()

    # Verify project belongs to user
    project = (
        Project.query.join(Client)
        .filter(Project.id == project_id, Client.user_id == user_id)
        .first()
    )
    if not project:
        raise NotFoundError("Project", project_id)

    schema = DeliverableCreateSchema()
    data = schema.load(request.get_json())

    deliverable = Deliverable(
        project_id=project_id,
        title=data["title"],
        description=data.get("description"),
        due_date=data.get("due_date")
    )
    db.session.add(deliverable)
    db.session.commit()

    res_schema = DeliverableResponseSchema()
    return jsonify({"data": res_schema.dump(deliverable)}), 201


@projects_bp.route("/<int:project_id>/deliverables", methods=["GET"])
def list_project_deliverables(project_id):
    """List all deliverables for a specific project (scoped to current user)."""
    from app.models.deliverable import Deliverable
    from app.schemas import DeliverableResponseSchema

    user_id = get_current_user_id()

    # Verify project belongs to user via client
    project = (
        Project.query.join(Client)
        .filter(Project.id == project_id, Client.user_id == user_id)
        .first()
    )
    if not project:
        raise NotFoundError("Project", project_id)

    deliverables = (
        Deliverable.query
        .filter_by(project_id=project_id)
        .order_by(Deliverable.created_at.desc())
        .all()
    )
    schema = DeliverableResponseSchema(many=True)
    return jsonify({"data": schema.dump(deliverables)}), 200
