"""Entry point for running the Flask application.

Usage:
    flask run         (recommended — uses .flaskenv)
    python run.py     (alternative)
"""

from app import create_app

application = create_app()

if __name__ == "__main__":
    application.run(host="0.0.0.0", port=5000, debug=True)
