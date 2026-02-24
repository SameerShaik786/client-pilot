"""Tests for Deliverables API endpoints and state machine."""

def test_create_deliverable(auth_client):
    """Test POST /api/deliverables creates a deliverable for a project."""
    # 1. Setup chain: Client -> Project
    c_resp = auth_client.post("/api/clients", json={"name": "Client A", "email": "a@a.com"})
    client_id = c_resp.get_json()["data"]["id"]
    p_resp = auth_client.post("/api/projects", json={"client_id": client_id, "title": "Project P"})
    project_id = p_resp.get_json()["data"]["id"]
    
    # 2. Create deliverable
    payload = {
        "project_id": project_id,
        "title": "Task 1",
        "description": "Initial task"
    }
    d_resp = auth_client.post("/api/deliverables", json=payload)
    assert d_resp.status_code == 201
    assert d_resp.get_json()["data"]["title"] == "Task 1"
    assert d_resp.get_json()["data"]["status"] == "planned"


def test_deliverable_state_machine_api(auth_client):
    """Test PATCH /api/deliverables/<id>/status enforces transitions."""
    # 1. Setup
    c_resp = auth_client.post("/api/clients", json={"name": "C", "email": "c@c.com"})
    client_id = c_resp.get_json()["data"]["id"]
    p_resp = auth_client.post("/api/projects", json={"client_id": client_id, "title": "P"})
    project_id = p_resp.get_json()["data"]["id"]
    d_resp = auth_client.post("/api/deliverables", json={"project_id": project_id, "title": "D"})
    del_id = d_resp.get_json()["data"]["id"]
    
    # 2. Transition: planned -> in_progress (VALID)
    r = auth_client.patch(f"/api/deliverables/{del_id}/status", json={"status": "in_progress"})
    assert r.status_code == 200
    assert r.get_json()["data"]["status"] == "in_progress"
    
    # 3. Transition: in_progress -> blocked (VALID)
    r = auth_client.patch(f"/api/deliverables/{del_id}/status", json={"status": "blocked"})
    assert r.status_code == 200
    
    # 4. Transition: blocked -> in_progress (VALID)
    r = auth_client.patch(f"/api/deliverables/{del_id}/status", json={"status": "in_progress"})
    assert r.status_code == 200
    
    # 5. Transition: in_progress -> completed (VALID)
    r = auth_client.patch(f"/api/deliverables/{del_id}/status", json={"status": "completed"})
    assert r.status_code == 200
    
    # 6. Transition: planned -> completed (INVALID - must start first)
    d_resp2 = auth_client.post("/api/deliverables", json={"project_id": project_id, "title": "D2"})
    del_id2 = d_resp2.get_json()["data"]["id"]
    r = auth_client.patch(f"/api/deliverables/{del_id2}/status", json={"status": "completed"})
    assert r.status_code == 422
    assert r.get_json()["error"]["code"] == "INVALID_STATE_TRANSITION"


def test_deliverable_user_scoping(client):
    """Test that User B cannot see User A's deliverables."""
    # 1. User A creates a deliverable
    with client.session_transaction() as sess:
        sess["user_id"] = 1
    client.post("/api/clients", json={"name": "A", "email": "a@a.com"})
    client.post("/api/projects", json={"client_id": 1, "title": "P"})
    did = client.post("/api/deliverables", json={"project_id": 1, "title": "Secret"}).get_json()["data"]["id"]
    
    # 2. User B tries to access it
    with client.session_transaction() as sess:
        sess["user_id"] = 2
    r = client.get(f"/api/deliverables/{did}")
    assert r.status_code == 404


def test_delete_deliverable(auth_client):
    """Test deleting a deliverable."""
    c_resp = auth_client.post("/api/clients", json={"name": "C", "email": "c@c.com"})
    client_id = c_resp.get_json()["data"]["id"]
    p_resp = auth_client.post("/api/projects", json={"client_id": client_id, "title": "P"})
    project_id = p_resp.get_json()["data"]["id"]
    d_resp = auth_client.post("/api/deliverables", json={"project_id": project_id, "title": "D"})
    del_id = d_resp.get_json()["data"]["id"]
    
    # Delete
    auth_client.delete(f"/api/deliverables/{del_id}")
    
    # Verify gone
    assert auth_client.get(f"/api/deliverables/{del_id}").status_code == 404
