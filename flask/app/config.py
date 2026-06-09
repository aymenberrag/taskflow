import os

class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///project_manager.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "dev-secret-key"
    )
