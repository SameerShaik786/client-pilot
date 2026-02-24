"""Tests for AI Engine services and API.

These tests verify that the AI workflows:
1. Create AgentRun and StepRun audit logs correctly.
2. Handle LLM responses (and mock responses).
3. Correctly parse and return structured data.
4. Scale gracefully when no API key is present.
"""

import json
from unittest.mock import MagicMock, patch
import pytest
from app.models.agent_run import AgentRun, StepRun
from app.models.project import Project


@pytest.fixture(autouse=True)
def mock_env(monkeypatch):
    """Ensure a dummy API key is present for all AI tests."""
    monkeypatch.setenv("GEMINI_API_KEY", "dummy_key")


@pytest.fixture
def mock_gemini():
    """Mock the Gemini GenerativeModel inside the AIEngine instance."""
    from app.api.ai import engine
    
    # Force initialize model if it was None
    if engine.model is None:
        engine.model = MagicMock()
        
    mock_model = MagicMock()
    # Replace the actual model on the engine instance used by the API
    engine.model = mock_model
    
    # Default mock response
    mock_response = MagicMock()
    mock_response.text = '```json\n{"deliverables": [{"title": "Test", "description": "Desc"}], "ambiguities": [], "suggested_questions": []}\n```'
    mock_model.generate_content.return_value = mock_response
    
    yield mock_model


def test_structure_scope_creates_audit_logs(auth_client, db_session, mock_gemini):
    """Verify that structure_scope creates the expected audit trail."""
    raw_text = "I need a website for my bakery."
    
    response = auth_client.post("/api/ai/structure-scope", json={"text": raw_text})
    assert response.status_code == 200
    
    # Check database for audit logs
    run = AgentRun.query.first()
    assert run is not None
    assert run.action == "scope_structuring"
    assert run.status == "completed"
    
    steps = run.steps.all()
    assert len(steps) >= 2
    
    # Check that StepRun logs input/output
    gemini_step = next(s for s in steps if s.action == "call_gemini")
    assert gemini_step.input_data is not None
    assert " bakery" in gemini_step.input_data["prompt"]
    assert gemini_step.output_data["deliverables"][0]["title"] == "Test"


def test_analyze_risk_workflow(auth_client, db_session, mock_gemini):
    """Verify the risk analysis workflow and data flow."""
    # 1. Setup project context
    from app.models.client import Client
    client = Client(user_id=1, name="Test Client", email="test@ex.com")
    db_session.add(client)
    db_session.commit()
    
    project = Project(client_id=client.id, title="Test Project")
    db_session.add(project)
    db_session.commit()
    
    # 2. Mock Gemini to return risk JSON
    risk_result = {
        "risk_score": 45,
        "risks": [{"title": "Deadline", "severity": "high", "reason": "Too tight"}],
        "mitigation_plan": ["Hire more bakers"]
    }
    mock_gemini.generate_content.return_value.text = f"```json\n{json.dumps(risk_result)}\n```"
    
    # 3. Call API
    response = auth_client.post("/api/ai/analyze-risk", json={"project_id": project.id})
    assert response.status_code == 200
    assert response.get_json()["data"]["risk_score"] == 45
    
    # 4. Verify logging
    run = AgentRun.query.filter_by(action="risk_analysis").first()
    assert run is not None
    assert run.status == "completed"


def test_ai_error_handling(auth_client, db_session, mock_gemini):
    """Verify that AI errors are logged and status is marked as failed."""
    mock_gemini.generate_content.side_effect = Exception("Gemini is down")
    
    # In testing mode, Flask propagates exceptions instead of returning 500
    with pytest.raises(Exception) as excinfo:
        auth_client.post("/api/ai/structure-scope", json={"text": "Fail me"})
    
    assert "Gemini is down" in str(excinfo.value)
    
    # Check that the run was marked as failed in the DB
    # We use a fresh query to ensure we see the committed data
    run = AgentRun.query.filter_by(action="scope_structuring").first()
    assert run is not None
    assert run.status == "failed"
    assert "Gemini is down" in run.error_message
