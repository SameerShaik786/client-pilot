"""Application configuration for different environments.

Design decisions:
- SQLite for development (zero-config, portable)
- In-memory SQLite for testing (fast, isolated)
- DATABASE_URL env var for production (PostgreSQL expected)
- Secret key defaults to a dev value but MUST be overridden in production
"""

import os


class Config:
    """Base configuration shared across all environments."""

    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-prod")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # AI configuration
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

    # Structured logging
    LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")


class DevelopmentConfig(Config):
    """Development configuration — SQLite file-based database."""

    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///" + os.path.join(
            os.path.abspath(os.path.dirname(__file__)), "..", "dev.db"
        ),
    )


class TestingConfig(Config):
    """Testing configuration — in-memory SQLite for fast, isolated tests."""

    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    LOG_LEVEL = "DEBUG"


class ProductionConfig(Config):
    """Production configuration — requires DATABASE_URL env var."""

    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

    @classmethod
    def init_app(cls):
        if not cls.SQLALCHEMY_DATABASE_URI:
            raise ValueError(
                "DATABASE_URL environment variable is required in production"
            )


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}
