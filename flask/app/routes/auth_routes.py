from flask import Blueprint, request
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)
from flask_jwt_extended import create_access_token

from app import db
from app.models.user import User

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth"
)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    # Check if username already exists
    existing_user = User.query.filter_by(
        username=data["username"]
    ).first()

    if existing_user:
        return {
            "message": "Username already exists"
        }, 400

    # Check if email already exists
    existing_email = User.query.filter_by(
        email=data["email"]
    ).first()

    if existing_email:
        return {
            "message": "Email already exists"
        }, 400

    hashed_password = generate_password_hash(
        data["password"]
    )

    user = User(
        username=data["username"],
        email=data["email"],
        password=hashed_password
    )

    db.session.add(user)
    db.session.commit()

    return {
        "message": "User registered successfully"
    }, 201


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    user = User.query.filter_by(
        email=data["email"]
    ).first()

    if not user:
        return {
            "message": "Invalid credentials"
        }, 401

    if not check_password_hash(
        user.password,
        data["password"]
    ):
        return {
            "message": "Invalid credentials"
        }, 401

    access_token = create_access_token(
        identity=str(user.id)
    )

    return {
        "access_token": access_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }, 200