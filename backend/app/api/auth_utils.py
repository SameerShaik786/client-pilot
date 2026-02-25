"""Authentication utilities for the API.

Used to extract the current user identity from JWT tokens or sessions.
"""

import jwt
from flask import request, current_app, session
from app.errors import AppError

def get_current_user_id():
    """Extract user ID from JWT token in Authorization header.
    
    Falls back to session if no Authorization header is present (legacy/test support).
    """
    auth_header = request.headers.get("Authorization")
    
    if not auth_header:
        user_id = session.get("user_id")
        if user_id:
            return user_id
        raise AppError("Authentication required", code="AUTH_REQUIRED", status_code=401)
    
    if not auth_header.startswith("Bearer "):
        raise AppError("Invalid authentication header format", code="INVALID_AUTH_HEADER", status_code=401)
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(
            token, 
            current_app.config.get("SECRET_KEY"), 
            algorithms=["HS256"]
        )
        return int(payload["sub"])
    except jwt.ExpiredSignatureError:
        raise AppError("Token has expired. Please login again.", code="TOKEN_EXPIRED", status_code=401)
    except jwt.InvalidTokenError as e:
        raise AppError(f"Invalid authentication token: {str(e)}", code="INVALID_TOKEN", status_code=401)
    except Exception as e:
        raise AppError(f"Authentication failed: {str(e)}", code="AUTH_FAILED", status_code=401)
