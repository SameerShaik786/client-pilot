"""Authentication API — registration and login.

Endpoints:
    POST /api/auth/signup → Register a new user
    POST /api/auth/login  → Authenticate and get a JWT token
"""

import jwt
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from app.models.user import User
from app.schemas import UserRegistrationSchema, UserLoginSchema, UserResponseSchema
from app.errors import AppError

auth_bp = Blueprint("auth", __name__)

# Schema instances
_registration_schema = UserRegistrationSchema()
_login_schema = UserLoginSchema()
_user_response_schema = UserResponseSchema()


def _create_token(user_id):
    """Generate a JWT token for a user ID."""
    payload = {
        'exp': datetime.now(timezone.utc) + timedelta(days=1),
        'iat': datetime.now(timezone.utc),
        'sub': str(user_id)
    }
    return jwt.encode(
        payload,
        current_app.config.get('SECRET_KEY'),
        algorithm='HS256'
    )


@auth_bp.route("/signup", methods=["POST"])
def signup():
    """Register a new user."""
    data = _registration_schema.load(request.get_json())

    # Check if user already exists
    if User.query.filter_by(email=data["email"]).first():
        raise AppError("Email already registered", code="EMAIL_ALREADY_EXISTS", status_code=400)
    if User.query.filter_by(username=data["username"]).first():
        raise AppError("Username already taken", code="USERNAME_ALREADY_EXISTS", status_code=400)

    user = User(
        username=data["username"],
        email=data["email"]
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    token = _create_token(user.id)

    return jsonify({
        "data": _user_response_schema.dump(user),
        "access_token": token
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate and return a token."""
    data = _login_schema.load(request.get_json())

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not user.check_password(data["password"]):
        raise AppError("Invalid email or password", code="INVALID_CREDENTIALS", status_code=401)

    token = _create_token(user.id)

    return jsonify({
        "data": _user_response_schema.dump(user),
        "access_token": token
    }), 200
