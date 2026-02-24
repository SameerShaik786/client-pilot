"""Tests for Clients API endpoints."""

def test_list_clients_empty(auth_client):
    """Test GET /api/clients returns empty list when no clients exist."""
    response = auth_client.get("/api/clients")
    assert response.status_code == 200
    assert response.get_json()["data"] == []


def test_create_client(auth_client):
    """Test POST /api/clients creates a new client."""
    payload = {
        "name": "Acme Corp",
        "email": "hello@acme.com",
        "company": "Acme Industries",
        "notes": "Premium client"
    }
    response = auth_client.post("/api/clients", json=payload)
    assert response.status_code == 201
    
    data = response.get_json()["data"]
    assert data["name"] == payload["name"]
    assert data["email"] == payload["email"]
    assert "id" in data


def test_create_client_validation_error(auth_client):
    """Test POST /api/clients returns 400 for invalid data."""
    # Missing email
    payload = {"name": "No Email"}
    response = auth_client.post("/api/clients", json=payload)
    assert response.status_code == 400
    assert response.get_json()["error"]["code"] == "VALIDATION_ERROR"


def test_get_client(auth_client):
    """Test GET /api/clients/<id> returns the correct client."""
    # Create one first
    create_resp = auth_client.post("/api/clients", json={"name": "Test", "email": "t@t.com"})
    client_id = create_resp.get_json()["data"]["id"]
    
    # Fetch it
    get_resp = auth_client.get(f"/api/clients/{client_id}")
    assert get_resp.status_code == 200
    assert get_resp.get_json()["data"]["name"] == "Test"


def test_get_client_not_found(auth_client):
    """Test GET /api/clients/<id> returns 404 for non-existent ID."""
    response = auth_client.get("/api/clients/999")
    assert response.status_code == 404
    assert response.get_json()["error"]["code"] == "NOT_FOUND"


def test_update_client(auth_client):
    """Test PUT /api/clients/<id> updates fields."""
    # Create one
    create_resp = auth_client.post("/api/clients", json={"name": "Old Name", "email": "o@o.com"})
    client_id = create_resp.get_json()["data"]["id"]
    
    # Update it
    update_resp = auth_client.put(f"/api/clients/{client_id}", json={"name": "New Name"})
    assert update_resp.status_code == 200
    assert update_resp.get_json()["data"]["name"] == "New Name"


def test_delete_client(auth_client):
    """Test DELETE /api/clients/<id> removes the client."""
    # Create one
    create_resp = auth_client.post("/api/clients", json={"name": "Delete Me", "email": "d@d.com"})
    client_id = create_resp.get_json()["data"]["id"]
    
    # Delete it
    del_resp = auth_client.delete(f"/api/clients/{client_id}")
    assert del_resp.status_code == 200
    
    # Verify it's gone
    get_resp = auth_client.get(f"/api/clients/{client_id}")
    assert get_resp.status_code == 404
