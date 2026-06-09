import re

from flask import Blueprint, request
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from app import db
from app.models.user import User

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
USERNAME_RE = re.compile(r"^[a-zA-Z0-9_]+$")

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth"
)


def _validate_register_payload(data):
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if len(username) < 3:
        return None, {"message": "Username must be at least 3 characters"}, 400

    if len(username) > 30:
        return None, {"message": "Username must be 30 characters or less"}, 400

    if not USERNAME_RE.match(username):
        return None, {
            "message": "Username can only contain letters, numbers, and underscores"
        }, 400

    if not email or not EMAIL_RE.match(email):
        return None, {"message": "Enter a valid email address"}, 400

    if len(password) < 8:
        return None, {"message": "Password must be at least 8 characters"}, 400

    return {"username": username, "email": email, "password": password}, None, None


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json() or {}
    validated, error_body, status = _validate_register_payload(data)

    if error_body:
        return error_body, status

    data = validated

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

    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not EMAIL_RE.match(email):
        return {"message": "Enter a valid email address"}, 400

    if not password:
        return {"message": "Password is required"}, 400

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:
        return {
            "message": "Invalid credentials"
        }, 401

    if not check_password_hash(
        user.password,
        password
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


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return user.to_dict(), 200


@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    username = (data.get("username") or user.username).strip()
    email = (data.get("email") or user.email).strip().lower()
    current_password = data.get("current_password") or ""
    new_password = data.get("new_password") or ""

    if len(username) < 3:
        return {"message": "Username must be at least 3 characters"}, 400

    if len(username) > 30:
        return {"message": "Username must be 30 characters or less"}, 400

    if not USERNAME_RE.match(username):
        return {
            "message": "Username can only contain letters, numbers, and underscores"
        }, 400

    if not EMAIL_RE.match(email):
        return {"message": "Enter a valid email address"}, 400

    existing_username = User.query.filter(
        User.username == username,
        User.id != user.id,
    ).first()

    if existing_username:
        return {"message": "Username already exists"}, 400

    existing_email = User.query.filter(
        User.email == email,
        User.id != user.id,
    ).first()

    if existing_email:
        return {"message": "Email already exists"}, 400

    if new_password:
        if not current_password:
            return {"message": "Current password is required"}, 400

        if not check_password_hash(user.password, current_password):
            return {"message": "Current password is incorrect"}, 400

        if len(new_password) < 8:
            return {"message": "New password must be at least 8 characters"}, 400

        user.password = generate_password_hash(new_password)

    user.username = username
    user.email = email
    db.session.commit()

    return {
        "message": "Profile updated successfully",
        "user": user.to_dict(),
    }, 200