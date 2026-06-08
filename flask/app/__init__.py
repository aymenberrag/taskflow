from flask import Flask, app
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object("app.config.Config")

    db.init_app(app)
    jwt.init_app(app)

    # Import models
    from app.models import User, Project, Task, SubTask

    # Register blueprints
    from app.routes.project_routes import project_bp
    app.register_blueprint(project_bp)

    from app.routes.task_routes import task_bp
    app.register_blueprint(task_bp)

    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)

    from app.routes.subtask_routes import subtask_bp
    app.register_blueprint(subtask_bp)

    from app.routes.dashboard_routes import dashboard_bp
    app.register_blueprint(dashboard_bp,url_prefix="/dashboard")

    with app.app_context():
        db.create_all()

    return app