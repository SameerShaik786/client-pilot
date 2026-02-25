"""AI API — endpoints for agentic operations.

Endpoints:
    POST /api/ai/structure-scope  → Raw notes to deliverables
    POST /api/ai/analyze-risk     → Find risks in projects/deliverables
    POST /api/ai/generate-update  → Generate progress email draft

This API bridges the frontend to the AIEngine service. It handles
user-scoping (only analyze data the user owns) and returns results
from the AI (or mock results if no API key).
"""

from flask import Blueprint, request, jsonify
from app.services.ai_engine import AIEngine
from app.models.client import Client
from app.models.project import Project
from app.errors import AppError, NotFoundError
from app.api.auth_utils import get_current_user_id

ai_bp = Blueprint("ai", __name__)
engine = AIEngine()


@ai_bp.route("/structure-scope", methods=["POST"])
def structure_scope():
    """Analyze raw text and return structured project data."""
    user_id = get_current_user_id()
    data = request.get_json()
    
    raw_text = data.get("text")
    if not raw_text:
        raise AppError("Missing 'text' in request body", code="VALIDATION_ERROR", status_code=400)
    
    result = engine.structure_scope(user_id, raw_text)
    return jsonify({"data": result}), 200


@ai_bp.route("/analyze-risk", methods=["POST"])
def analyze_risk():
    """Analyze a specific project's deliverables for risk."""
    user_id = get_current_user_id()
    data = request.get_json()
    
    project_id = data.get("project_id")
    if not project_id:
        raise AppError("Missing 'project_id' in request body", code="VALIDATION_ERROR", status_code=400)
    
    # 1. Verify project ownership and fetch context
    project = (
        Project.query.join(Client)
        .filter(Project.id == project_id, Client.user_id == user_id)
        .first()
    )
    if not project:
        raise NotFoundError("Project", project_id)
    
    # 2. Build context for AI
    deliverables = project.deliverables.all()
    context = {
        "project_title": project.title,
        "deadline": project.deadline.isoformat() if project.deadline else "None",
        "deliverables": [
            {
                "title": d.title,
                "status": d.status,
                "due_date": d.due_date.isoformat() if d.due_date else "None"
            } for d in deliverables
        ]
    }
    
    result = engine.analyze_risk(user_id, context)
    return jsonify({"data": result}), 200


@ai_bp.route("/generate-update", methods=["POST"])
def generate_update():
    """Generate a client update email draft."""
    user_id = get_current_user_id()
    data = request.get_json()
    
    project_id = data.get("project_id")
    if not project_id:
        raise AppError("Missing 'project_id' in request body", code="VALIDATION_ERROR", status_code=400)
    
    project = (
        Project.query.join(Client)
        .filter(Project.id == project_id, Client.user_id == user_id)
        .first()
    )
    if not project:
        raise NotFoundError("Project", project_id)
    
    # Context for writing
    deliverables = project.deliverables.all()
    context = {
        "client_name": project.client.name,
        "company": project.client.company,
        "project_title": project.title,
        "deliverables": [
            {"title": d.title, "status": d.status} for d in deliverables
        ]
    }
    
    result = engine.generate_update(user_id, context)
    return jsonify({"data": result}), 200
