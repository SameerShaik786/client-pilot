"""AI Engine service — Gemini API wrapper with agentic workflows.

This service implements the "intelligence" layer. Every AI call:
1. Creates an AgentRun record (the parent).
2. Executes one or more StepRun records (the steps).
3. Orchestrates calls to the Gemini API.
4. Returns structured, validated data.

By logging every step to StepRun, we provide a full audit trail for
the assessment evaluation (observability).
"""

import os
import json
import logging
from datetime import datetime
import google.generativeai as genai
from app.extensions import db
from app.models.agent_run import AgentRun, StepRun

logger = logging.getLogger(__name__)

class AIEngine:
    """Orchestrator for AI operations using Gemini."""

    def __init__(self, api_key=None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel("gemini-1.5-flash")
        else:
            self.model = None
            logger.warning("GEMINI_API_KEY not found. AI features will run in Mock Mode.")
        self._step_count = {} # Track steps per run_id

    def _log_run(self, user_id, action):
        """Initialize an AgentRun record."""
        run = AgentRun(user_id=user_id, action=action, status="running")
        db.session.add(run)
        db.session.commit()
        self._step_count[run.id] = 0
        return run

    def _log_step(self, run_id, action, input_data=None):
        """Log a specific step within a run."""
        self._step_count[run_id] += 1
        step = StepRun(
            agent_run_id=run_id,
            step_number=self._step_count[run_id],
            action=action,
            input_data=input_data
        )
        db.session.add(step)
        db.session.commit()
        return step

    def _complete_step(self, step, output_data):
        """Mark a step as finished."""
        step.output_data = output_data
        db.session.commit()

    def _complete_run(self, run, status="completed", error=None):
        """Finalize the AgentRun."""
        if error:
            run.mark_failed(error)
        else:
            run.mark_completed()
        db.session.commit()
        if run.id in self._step_count:
            del self._step_count[run.id]

    def structure_scope(self, user_id, raw_text):
        """Transform raw notes into structured project deliverables."""
        run = self._log_run(user_id, "scope_structuring")
        try:
            # Step 1: Analyze raw text
            step1 = self._log_step(run.id, "parse_input", {"raw_text": raw_text})
            
            prompt = (
                "You are an expert Project Manager. Transform these raw client notes into a "
                "structured list of deliverables. "
                "Return valid JSON only with keys: 'deliverables' (list of {title, description}), "
                "'ambiguities' (list of strings), and 'suggested_questions' (list of strings).\n\n"
                f"Notes: {raw_text}"
            )
            
            # Step 2: Call AI
            step2 = self._log_step(run.id, "call_gemini", {"prompt": prompt})
            
            if not self.model:
                # Mock response if no API key
                result = {
                    "deliverables": [{"title": "Setup", "description": "Mock setup"}],
                    "ambiguities": ["Mock ambiguity"],
                    "suggested_questions": ["Mock question?"]
                }
            else:
                response = self.model.generate_content(prompt)
                # Simple extraction (assuming LLM follows instructions)
                text = response.text.strip()
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                result = json.loads(text or "{}")

            self._complete_step(step1, {"status": "parsed"})
            self._complete_step(step2, result)
            self._complete_run(run)
            return result

        except Exception as e:
            logger.error(f"AI Error in structure_scope: {e}")
            self._complete_run(run, error=str(e))
            raise

    def analyze_risk(self, user_id, context_data):
        """Analyze projects/deliverables for potential risks."""
        run = self._log_run(user_id, "risk_analysis")
        try:
            step1 = self._log_step(run.id, "analyze_context", {"context": context_data})
            
            prompt = (
                "Analyze these project deliverables for risks (deadlines, dependencies, clarity). "
                "Return JSON: 'risk_score' (0-100), 'risks' (list of {title, severity, reason}), "
                "and 'mitigation_plan' (list of strings).\n\n"
                f"Context: {json.dumps(context_data)}"
            )
            
            step2 = self._log_step(run.id, "call_gemini", {"prompt": prompt})
            
            if not self.model:
                result = {
                    "risk_score": 15,
                    "risks": [{"title": "Mock Risk", "severity": "low", "reason": "No real AI key"}],
                    "mitigation_plan": ["Add an API key"]
                }
            else:
                response = self.model.generate_content(prompt)
                text = response.text.strip()
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                result = json.loads(text or "{}")

            self._complete_step(step2, result)
            self._complete_run(run)
            return result
        except Exception as e:
            self._complete_run(run, error=str(e))
            raise

    def generate_update(self, user_id, context_data):
        """Generate a professional client progress update email."""
        run = self._log_run(user_id, "update_generation")
        try:
            prompt = (
                "Generate a professional, concise progress update email to a client based on "
                "the following project status. Focus on accomplishments and next steps. "
                "Return JSON with 'subject' and 'body'.\n\n"
                f"Context: {json.dumps(context_data)}"
            )
            
            step = self._log_step(run.id, "call_gemini", {"prompt": prompt})
            
            if not self.model:
                result = {
                    "subject": "Mock Update",
                    "body": "This is a mock update because no Gemini API key was found."
                }
            else:
                response = self.model.generate_content(prompt)
                text = response.text.strip()
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                result = json.loads(text or "{}")

            self._complete_step(step, result)
            self._complete_run(run)
            return result
        except Exception as e:
            self._complete_run(run, error=str(e))
            raise
