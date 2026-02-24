"""Tests for Projects API endpoints and state machine."""
from datetime import date

def test_create_project(auth_client):
    """Test POST /api/projects creates a project for a client."""
    # 1. Create client
    c_resp = auth_client.post("/api/clients", json={"name": "Client A", "email": "a@a.com"})
    client_id = c_resp.get_json()["data"]["id"]
    
    # 2. Create project
    payload = {
        "client_id": client_id,
        "title": "New Project",
        "description": "Test desc",
        "deadline": date.today().isoformat()
    }
    p_resp = auth_client.post("/api/projects", json=payload)
    assert p_resp.status_code == 201
    assert p_resp.get_json()["data"]["title"] == "New Project"
    assert p_resp.get_json()["data"]["status"] == "active"


def test_create_project_invalid_client(auth_client):
    """Test 404 when creating project for non-existent client."""
    payload = {"client_id": 999, "title": "Fail"}
    response = auth_client.post("/api/projects", json=payload)
    assert response.status_code == 404


def test_project_state_machine_api(auth_client):
    """Test PATCH /api/projects/<id>/status enforces transitions."""
    # 1. Setup
    c_resp = auth_client.post("/api/clients", json={"name": "C", "email": "c@c.com"})
    client_id = c_resp.get_json()["data"]["id"]
    p_resp = auth_client.post("/api/projects", json={"client_id": client_id, "title": "P"})
    project_id = p_resp.get_json()["data"]["id"]
    
    # 2. Transition: active -> on_hold (VALID)
    r = auth_client.patch(f"/api/projects/{project_id}/status", json={"status": "on_hold"})
    assert r.status_code == 200
    assert r.get_json()["data"]["status"] == "on_hold"
    
    # 3. Transition: on_hold -> active (VALID)
    r = auth_client.patch(f"/api/projects/{project_id}/status", json={"status": "active"})
    assert r.status_code == 200
    
    # 4. Transition: active -> completed (VALID)
    r = auth_client.patch(f"/api/projects/{project_id}/status", json={"status": "completed"})
    assert r.status_code == 200
    
    # 5. Transition: completed -> active (INVALID)
    r = auth_client.patch(f"/api/projects/{project_id}/status", json={"status": "active"})
    assert r.status_code == 422
    assert r.get_json()["error"]["code"] == "INVALID_STATE_TRANSITION"


def test_get_project_scoped_to_user(client):
    """Test that User B cannot see User A's projects."""
    # 1. User A creates a project
    with client.session_transaction() as sess:
        sess["user_id"] = 1
    c_resp = client.post("/api/clients", json={"name": "A", "email": "a@a.com"})
    pid = client.post("/api/projects", json={"client_id": 1, "title": "Private"}).get_json()["data"]["id"]
    
    # 2. User B tries to access it
    with client.session_transaction() as sess:
        sess["user_id"] = 2
    r = client.get(f"/api/projects/{pid}")
    assert r.status_code == 404  # Should be 404, not 200 or 403 (security by obscurity)


def test_delete_project_cascades(auth_client):
    """Test deleting project works."""
    c_resp = auth_client.post("/api/clients", json={"name": "C", "email": "c@c.com"})
    client_id = c_resp.get_json()["data"]["id"]
    p_resp = auth_client.post("/api/projects", json={"client_id": client_id, "title": "P"})
    project_id = p_resp.get_json()["data"]["id"]
    
    # Delete
    auth_client.delete(f"/api/projects/{project_id}")
    
    # Verify gone
    assert auth_client.get(f"/api/projects/{project_id}").status_code == 404
