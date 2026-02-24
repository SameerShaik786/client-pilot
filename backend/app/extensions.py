"""Flask extension instances.

Extensions are created here and bound to the app in the factory
(app/__init__.py). This avoids circular imports — any module can
import from extensions without importing the app.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()
cors = CORS()
