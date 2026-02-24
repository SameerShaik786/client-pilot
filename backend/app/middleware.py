"""Request middleware for observability and cross-cutting concerns.

Every request gets:
- A unique request ID (X-Request-ID header) for tracing
- Duration timing for performance monitoring
- Structured log entry on completion

This provides observability without cluttering route logic.
"""

import uuid
import time
import logging
from flask import g, request

logger = logging.getLogger(__name__)


def register_middleware(app):
    """Register before/after request hooks."""

    @app.before_request
    def before_request():
        """Attach request ID and start timer for every request."""
        g.request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        g.start_time = time.time()

    @app.after_request
    def after_request(response):
        """Log request details and attach request ID to response."""
        duration_ms = round((time.time() - g.start_time) * 1000, 2)

        # Attach request ID to response for traceability
        response.headers["X-Request-ID"] = g.request_id

        # Structured request log
        logger.info(
            "request_completed",
            extra={
                "request_id": g.request_id,
                "method": request.method,
                "path": request.path,
                "status": response.status_code,
                "duration_ms": duration_ms,
            },
        )

        return response
