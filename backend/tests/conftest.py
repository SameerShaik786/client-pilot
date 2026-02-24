"""pytest fixtures for backend testing.

Design decisions:
- Use in-memory SQLite for speed and isolation.
- App factory pattern makes it easy to create a fresh app for tests.
- Fixtures handle database setup/teardown automatically.
- Provides a pre-authenticated test client to reduce boilerplate.

This setup ensures every test starts with a clean slate.
"""

import pytest
from app import create_app
from app.extensions import db


@pytest.fixture(scope="session")
def app():
    """Session-wide Flask application fixture."""
    # Use 'testing' config which uses sqlite:///:memory:
    flask_app = create_app("testing")
    
    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.drop_all()


@pytest.fixture
def client(app):
    """A fresh test client for each test."""
    return app.test_client()


@pytest.fixture
def auth_client(client):
    """A test client with an active session (user_id=1)."""
    with client.session_transaction() as sess:
        sess["user_id"] = 1
    return client


@pytest.fixture
def db_session(app):
    """Provides a clean database session for each test."""
    with app.app_context():
        # Clear data from all tables but keep the schema
        for table in reversed(db.metadata.sorted_tables):
            db.session.execute(table.delete())
        db.session.commit()
        yield db.session
