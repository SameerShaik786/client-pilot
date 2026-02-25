"""Test suite for ClientPilot API.

Uses in-memory SQLite for fast, isolated tests.
Each test gets a clean database via fixtures.
"""

import pytest
import json
from app import create_app
from app.extensions import db


@pytest.fixture
def app():
    """Create application for testing."""
    app = create_app("testing")
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """Test client for making HTTP requests."""
    return app.test_client()


@pytest.fixture
def auth_token(client):
    """Register a user and return a valid JWT token."""
    # Signup
    client.post("/api/auth/signup", json={
        "email": "test@example.com",
        "password": "password123",
        "username": "testuser"
    })
    # Login
    resp = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    data = resp.get_json()
    return data["access_token"]


def auth_headers(token):
    """Helper to create authorization headers."""
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ─── AUTH TESTS ────────────────────────────────────────────────

class TestAuth:
    def test_signup_success(self, client):
        resp = client.post("/api/auth/signup", json={
            "email": "new@example.com",
            "password": "password123",
            "username": "newuser"
        })
        assert resp.status_code == 201
        data = resp.get_json()
        assert "access_token" in data

    def test_signup_duplicate_email(self, client):
        client.post("/api/auth/signup", json={
            "email": "dup@example.com",
            "password": "password123",
            "username": "user1"
        })
        resp = client.post("/api/auth/signup", json={
            "email": "dup@example.com",
            "password": "password123",
            "username": "user2"
        })
        assert resp.status_code in [400, 409]

    def test_login_success(self, client):
        client.post("/api/auth/signup", json={
            "email": "login@example.com",
            "password": "password123",
            "username": "loginuser"
        })
        resp = client.post("/api/auth/login", json={
            "email": "login@example.com",
            "password": "password123"
        })
        assert resp.status_code == 200
        assert "access_token" in resp.get_json()

    def test_login_wrong_password(self, client):
        client.post("/api/auth/signup", json={
            "email": "wrong@example.com",
            "password": "password123",
            "username": "wronguser"
        })
        resp = client.post("/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        assert resp.status_code == 401

    def test_protected_route_no_token(self, client):
        resp = client.get("/api/clients")
        assert resp.status_code == 401


# ─── CLIENTS CRUD TESTS ───────────────────────────────────────

class TestClients:
    def test_create_client(self, client, auth_token):
        resp = client.post("/api/clients", headers=auth_headers(auth_token), json={
            "name": "Acme Corp",
            "email": "acme@example.com",
            "company": "Acme"
        })
        assert resp.status_code == 201
        data = resp.get_json()["data"]
        assert data["name"] == "Acme Corp"
        assert data["email"] == "acme@example.com"

    def test_create_client_missing_name(self, client, auth_token):
        resp = client.post("/api/clients", headers=auth_headers(auth_token), json={
            "email": "no-name@example.com"
        })
        assert resp.status_code in [400, 422]

    def test_list_clients(self, client, auth_token):
        # Create two clients
        client.post("/api/clients", headers=auth_headers(auth_token), json={
            "name": "Client 1", "email": "c1@example.com"
        })
        client.post("/api/clients", headers=auth_headers(auth_token), json={
            "name": "Client 2", "email": "c2@example.com"
        })
        resp = client.get("/api/clients", headers=auth_headers(auth_token))
        assert resp.status_code == 200
        data = resp.get_json()["data"]
        assert len(data) == 2

    def test_get_client(self, client, auth_token):
        create_resp = client.post("/api/clients", headers=auth_headers(auth_token), json={
            "name": "Get Me", "email": "get@example.com"
        })
        client_id = create_resp.get_json()["data"]["id"]

        resp = client.get(f"/api/clients/{client_id}", headers=auth_headers(auth_token))
        assert resp.status_code == 200
        assert resp.get_json()["data"]["name"] == "Get Me"

    def test_update_client(self, client, auth_token):
        create_resp = client.post("/api/clients", headers=auth_headers(auth_token), json={
            "name": "Old Name", "email": "old@example.com"
        })
        client_id = create_resp.get_json()["data"]["id"]

        resp = client.put(f"/api/clients/{client_id}", headers=auth_headers(auth_token), json={
            "name": "New Name", "email": "new@example.com"
        })
        assert resp.status_code == 200
        assert resp.get_json()["data"]["name"] == "New Name"

    def test_delete_client(self, client, auth_token):
        create_resp = client.post("/api/clients", headers=auth_headers(auth_token), json={
            "name": "Delete Me", "email": "del@example.com"
        })
        client_id = create_resp.get_json()["data"]["id"]

        resp = client.delete(f"/api/clients/{client_id}", headers=auth_headers(auth_token))
        assert resp.status_code == 200

        # Verify it's gone
        resp = client.get(f"/api/clients/{client_id}", headers=auth_headers(auth_token))
        assert resp.status_code == 404

    def test_get_nonexistent_client(self, client, auth_token):
        resp = client.get("/api/clients/9999", headers=auth_headers(auth_token))
        assert resp.status_code == 404


# ─── PROJECTS CRUD TESTS ──────────────────────────────────────

class TestProjects:
    def _create_client(self, client, token):
        resp = client.post("/api/clients", headers=auth_headers(token), json={
            "name": "Project Client", "email": "pc@example.com"
        })
        return resp.get_json()["data"]["id"]

    def test_create_project(self, client, auth_token):
        client_id = self._create_client(client, auth_token)
        resp = client.post("/api/projects", headers=auth_headers(auth_token), json={
            "title": "Website Redesign",
            "client_id": client_id,
            "description": "Full redesign"
        })
        assert resp.status_code == 201
        data = resp.get_json()["data"]
        assert data["title"] == "Website Redesign"
        assert data["status"] == "active"

    def test_create_project_missing_title(self, client, auth_token):
        client_id = self._create_client(client, auth_token)
        resp = client.post("/api/projects", headers=auth_headers(auth_token), json={
            "client_id": client_id
        })
        assert resp.status_code in [400, 422]

    def test_list_client_projects(self, client, auth_token):
        client_id = self._create_client(client, auth_token)
        client.post("/api/projects", headers=auth_headers(auth_token), json={
            "title": "Project 1", "client_id": client_id
        })
        client.post("/api/projects", headers=auth_headers(auth_token), json={
            "title": "Project 2", "client_id": client_id
        })
        resp = client.get(f"/api/clients/{client_id}/projects", headers=auth_headers(auth_token))
        assert resp.status_code == 200
        assert len(resp.get_json()["data"]) == 2

    def test_delete_project(self, client, auth_token):
        client_id = self._create_client(client, auth_token)
        create_resp = client.post("/api/projects", headers=auth_headers(auth_token), json={
            "title": "To Delete", "client_id": client_id
        })
        project_id = create_resp.get_json()["data"]["id"]

        resp = client.delete(f"/api/projects/{project_id}", headers=auth_headers(auth_token))
        assert resp.status_code == 200


# ─── DELIVERABLES TESTS ───────────────────────────────────────

class TestDeliverables:
    def _setup(self, client, token):
        c_resp = client.post("/api/clients", headers=auth_headers(token), json={
            "name": "Del Client", "email": "dc@example.com"
        })
        client_id = c_resp.get_json()["data"]["id"]
        p_resp = client.post("/api/projects", headers=auth_headers(token), json={
            "title": "Del Project", "client_id": client_id
        })
        return p_resp.get_json()["data"]["id"]

    def test_create_deliverable(self, client, auth_token):
        project_id = self._setup(client, auth_token)
        resp = client.post(f"/api/projects/{project_id}/deliverables",
                          headers=auth_headers(auth_token), json={
                              "title": "Homepage Design"
                          })
        assert resp.status_code == 201
        assert resp.get_json()["data"]["title"] == "Homepage Design"
        assert resp.get_json()["data"]["status"] == "planned"

    def test_update_deliverable_status(self, client, auth_token):
        project_id = self._setup(client, auth_token)
        create_resp = client.post(f"/api/projects/{project_id}/deliverables",
                                  headers=auth_headers(auth_token), json={
                                      "title": "API Integration"
                                  })
        del_id = create_resp.get_json()["data"]["id"]

        resp = client.patch(f"/api/deliverables/{del_id}/status",
                           headers=auth_headers(auth_token), json={
                               "status": "in_progress"
                           })
        assert resp.status_code == 200
        assert resp.get_json()["data"]["status"] == "in_progress"

    def test_delete_deliverable(self, client, auth_token):
        project_id = self._setup(client, auth_token)
        create_resp = client.post(f"/api/projects/{project_id}/deliverables",
                                  headers=auth_headers(auth_token), json={
                                      "title": "To Remove"
                                  })
        del_id = create_resp.get_json()["data"]["id"]

        resp = client.delete(f"/api/deliverables/{del_id}", headers=auth_headers(auth_token))
        assert resp.status_code == 200


# ─── DASHBOARD TESTS ──────────────────────────────────────────

class TestDashboard:
    def test_dashboard_returns_stats(self, client, auth_token):
        resp = client.get("/api/dashboard", headers=auth_headers(auth_token))
        assert resp.status_code == 200
        data = resp.get_json()["data"]
        assert "client_count" in data
        assert "active_project_count" in data
