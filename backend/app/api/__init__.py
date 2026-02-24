"""API blueprint registration.

Each domain gets its own blueprint for clear module boundaries.
Blueprints are registered here to keep the app factory clean.
"""


def register_blueprints(app):
    """Register all API blueprints on the Flask app."""

    from app.api.clients import clients_bp
    from app.api.projects import projects_bp
    app.register_blueprint(clients_bp, url_prefix="/api/clients")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
