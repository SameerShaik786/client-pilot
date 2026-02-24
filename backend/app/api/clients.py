"""Clients API — full CRUD for managing clients.

Endpoints:
    GET    /api/clients          → List all clients (for current user)
    POST   /api/clients          → Create a new client
    GET    /api/clients/<id>     → Get a single client
    PUT    /api/clients/<id>     → Update a client
    DELETE /api/clients/<id>     → Delete a client

Design decisions:
- Every request is scoped to the current user (user_id from session).
- All inputs go through Marshmallow schemas before touching the DB.
- Responses use a consistent JSON shape: {"data": ...} or {"error": ...}
- 404 errors use the centralized NotFoundError for consistency.
"""

from flask import Blueprint, request, jsonify, session
from app.extensions import db
from app.models.client import Client
from app.errors import NotFoundError, AppError
from app.schemas import (
    ClientCreateSchema,
    ClientUpdateSchema,
    ClientResponseSchema,
)

clients_bp = Blueprint("clients", __name__)

# Schema instances (reusable, stateless)
_create_schema = ClientCreateSchema()
_update_schema = ClientUpdateSchema()
_response_schema = ClientResponseSchema()
_response_list_schema = ClientResponseSchema(many=True)


def _get_current_user_id():
    """Get the logged-in user's ID from the session.

    Raises AppError if not authenticated. This will be replaced
    with proper auth middleware later.
    """
    user_id = session.get("user_id")
    if not user_id:
        raise AppError(
            message="Authentication required",
            code="AUTH_REQUIRED",
            status_code=401,
        )
    return user_id


@clients_bp.route("", methods=["GET"])
def list_clients():
    """List all clients for the current user."""
    user_id = _get_current_user_id()
    clients = Client.query.filter_by(user_id=user_id).order_by(Client.created_at.desc()).all()
    return jsonify({"data": _response_list_schema.dump(clients)}), 200


@clients_bp.route("", methods=["POST"])
def create_client():
    """Create a new client for the current user."""
    user_id = _get_current_user_id()
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
    user_id = _get_current_user_id()
    client = Client.query.filter_by(id=client_id, user_id=user_id).first()
    if not client:
        raise NotFoundError("Client", client_id)

    return jsonify({"data": _response_schema.dump(client)}), 200


@clients_bp.route("/<int:client_id>", methods=["PUT"])
def update_client(client_id):
    """Update an existing client."""
    user_id = _get_current_user_id()
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
    user_id = _get_current_user_id()
    client = Client.query.filter_by(id=client_id, user_id=user_id).first()
    if not client:
        raise NotFoundError("Client", client_id)

    db.session.delete(client)
    db.session.commit()
    return jsonify({"data": {"message": f"Client '{client.name}' deleted"}}), 200
