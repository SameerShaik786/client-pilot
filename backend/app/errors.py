"""Centralized error handling for the Flask API.

All errors are returned as structured JSON responses with consistent shape:
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Human-readable description",
        "details": { ... }  // optional
    }
}

Design decision: Every error — validation, not-found, state machine,
server crash — returns the same JSON shape. This makes the API
predictable for frontend consumers and easy to debug.
"""

from flask import jsonify
from marshmallow import ValidationError
import logging

logger = logging.getLogger(__name__)


class AppError(Exception):
    """Base application error with structured response."""

    def __init__(self, message, code="APP_ERROR", status_code=400, details=None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details


class NotFoundError(AppError):
    """Resource not found."""

    def __init__(self, resource, identifier):
        super().__init__(
            message=f"{resource} with id '{identifier}' not found",
            code="NOT_FOUND",
            status_code=404,
        )


class StateTransitionError(AppError):
    """Invalid state machine transition.

    Raised when code attempts to move a Project or Deliverable
    to a status that is not allowed from its current status.
    """

    def __init__(self, current_status, target_status, valid_transitions):
        super().__init__(
            message=f"Cannot transition from '{current_status}' to '{target_status}'",
            code="INVALID_STATE_TRANSITION",
            status_code=422,
            details={
                "current_status": current_status,
                "target_status": target_status,
                "valid_transitions": valid_transitions,
            },
        )


class ConflictError(AppError):
    """Business rule conflict (e.g. deleting client with active projects)."""

    def __init__(self, message, details=None):
        super().__init__(
            message=message,
            code="CONFLICT",
            status_code=409,
            details=details,
        )


def register_error_handlers(app):
    """Register all error handlers on the Flask app."""

    @app.errorhandler(AppError)
    def handle_app_error(error):
        logger.warning(
            "Application error: %s (code=%s, status=%d)",
            error.message,
            error.code,
            error.status_code,
        )
        response = {
            "error": {
                "code": error.code,
                "message": error.message,
            }
        }
        if error.details:
            response["error"]["details"] = error.details
        return jsonify(response), error.status_code

    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        logger.warning("Validation error: %s", error.messages)
        return jsonify({
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Input validation failed",
                "details": error.messages,
            }
        }), 400

    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({
            "error": {
                "code": "NOT_FOUND",
                "message": "The requested resource was not found",
            }
        }), 404

    @app.errorhandler(500)
    def handle_internal_error(error):
        logger.error("Internal server error: %s", str(error), exc_info=True)
        return jsonify({
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred",
            }
        }), 500
