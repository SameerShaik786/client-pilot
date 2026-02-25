"""Clients API — full CRUD for managing clients.

Endpoints:
    GET    /api/clients                       → List all clients (for current user)
    POST   /api/clients                       → Create a new client
    GET    /api/clients/<id>                  → Get a single client
    PUT    /api/clients/<id>                  → Update a client
    DELETE /api/clients/<id>                  → Delete a client
    GET    /api/clients/<id>/projects         → List projects for this client

Design decisions:
- Every request is scoped to the current user (user_id from session).
- All inputs go through Marshmallow schemas before touching the DB.
- Responses use a consistent JSON shape: {"data": ...} or {"error": ...}
- 404 errors use the centralized NotFoundError for consistency.
"""

from flask import Blueprint, request, jsonify, session
from app.extensions import db
from app.models.client import Client
from app.models.project import Project
from app.errors import NotFoundError, AppError
from app.api.auth_utils import get_current_user_id
from app.schemas import (
    ClientCreateSchema,
    ClientUpdateSchema,
    ClientResponseSchema,
    ProjectResponseSchema,
)

clients_bp = Blueprint("clients", __name__)

# Schema instances (reusable, stateless)
_create_schema = ClientCreateSchema()
_update_schema = ClientUpdateSchema()
_response_schema = ClientResponseSchema()
_response_list_schema = ClientResponseSchema(many=True)
_project_response_list_schema = ProjectResponseSchema(many=True)


@clients_bp.route("", methods=["GET"])
def list_clients():
    """List all clients for the current user."""
    user_id = get_current_user_id()
    clients = Client.query.filter_by(user_id=user_id).order_by(Client.created_at.desc()).all()
    return jsonify({"data": _response_list_schema.dump(clients)}), 200


@clients_bp.route("", methods=["POST"])
def create_client():
    """Create a new client for the current user."""
    user_id = get_current_user_id()
    data = _create_schema.load(request.get_json())

    client = Client(
        user_id=user_id,
        name=data["name"],
        email=data["email"],
        company=data.get("company"),
        notes=data.get("notes"),
    )
    db.session.add(client)
    db.session.commit()

    return jsonify({"data": _response_schema.dump(client)}), 201


@clients_bp.route("/<int:client_id>", methods=["GET"])
def get_client(client_id):
    """Get a single client by ID."""
    user_id = get_current_user_id()
    client = Client.query.filter_by(id=client_id, user_id=user_id).first()
    if not client:
        raise NotFoundError("Client", client_id)

    return jsonify({"data": _response_schema.dump(client)}), 200


@clients_bp.route("/<int:client_id>", methods=["PUT"])
def update_client(client_id):
    """Update an existing client."""
    user_id = get_current_user_id()
    client = Client.query.filter_by(id=client_id, user_id=user_id).first()
    if not client:
        raise NotFoundError("Client", client_id)

    data = _update_schema.load(request.get_json())

    # Only update fields that were provided
    if "name" in data:
        client.name = data["name"]
    if "email" in data:
        client.email = data["email"]
    if "company" in data:
        client.company = data["company"]
    if "notes" in data:
        client.notes = data["notes"]

    db.session.commit()
    return jsonify({"data": _response_schema.dump(client)}), 200


@clients_bp.route("/<int:client_id>", methods=["DELETE"])
def delete_client(client_id):
    """Delete a client and all their projects (cascade)."""
    user_id = get_current_user_id()
    client = Client.query.filter_by(id=client_id, user_id=user_id).first()
    if not client:
        raise NotFoundError("Client", client_id)

    db.session.delete(client)
    db.session.commit()
    return jsonify({"data": {"message": f"Client '{client.name}' deleted"}}), 200


@clients_bp.route("/<int:client_id>/projects", methods=["GET"])
def list_client_projects(client_id):
    """List all projects for a specific client (scoped to current user)."""
    user_id = get_current_user_id()

    # Verify client belongs to user
    client = Client.query.filter_by(id=client_id, user_id=user_id).first()
    if not client:
        raise NotFoundError("Client", client_id)

    projects = (
        Project.query
        .filter_by(client_id=client_id)
        .order_by(Project.created_at.desc())
        .all()
    )
    return jsonify({"data": _project_response_list_schema.dump(projects)}), 200
