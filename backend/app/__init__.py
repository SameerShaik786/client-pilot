"""Flask application factory for ClientPilot.

Design decisions:
- Factory pattern allows creating multiple app instances (useful for testing)
- Extensions are initialized here but created in extensions.py (avoids circular imports)
- Blueprints are registered via api/__init__.py (keeps this file focused)
- Tables are auto-created in dev/test (no migration needed during development)

Note: The Flask instance is named 'flask_app' (not 'app') to avoid a
Python naming conflict with the 'app' package itself.
"""

import os
import logging
from flask import Flask
from app.config import config_by_name
from app.extensions import db, ma, migrate, cors
from app.errors import register_error_handlers
from app.middleware import register_middleware


def create_app(config_name=None):
    """Create and configure the Flask application.

    Args:
        config_name: One of 'development', 'testing', 'production'.
                     Defaults to FLASK_ENV or 'development'.
    """
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "development")

    flask_app = Flask(__name__)
    flask_app.config.from_object(config_by_name[config_name])

    # Initialize extensions
    db.init_app(flask_app)
    ma.init_app(flask_app)
    migrate.init_app(flask_app, db)
    cors.init_app(flask_app, resources={r"/api/*": {"origins": "*"}})

    # Configure logging
    _configure_logging(flask_app)

    # Register error handlers and middleware
    register_error_handlers(flask_app)
    register_middleware(flask_app)

    # Register API blueprints
    from app.api import register_blueprints
    register_blueprints(flask_app)

    # Create tables (for development / testing without migrations)
    with flask_app.app_context():
        from app import models  # noqa: F401 — triggers model registration
        db.create_all()

    return flask_app


def _configure_logging(flask_app):
    """Set up structured logging."""
    log_level = getattr(logging, flask_app.config.get("LOG_LEVEL", "INFO"))

    handler = logging.StreamHandler()
    handler.setLevel(log_level)

    formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)s %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)

    flask_app.logger.handlers = [handler]
    flask_app.logger.setLevel(log_level)

    logging.getLogger("app").handlers = [handler]
    logging.getLogger("app").setLevel(log_level)
