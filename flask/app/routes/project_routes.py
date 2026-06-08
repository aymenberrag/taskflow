from flask import Blueprint, request
from app.models.project import Project
from app import db
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

project_bp = Blueprint(
    "projects",
    __name__,
    url_prefix="/projects"
)

@project_bp.route("/", methods=["GET"])
@jwt_required()
def get_projects():

    user_id = int(get_jwt_identity())

    projects = Project.query.filter_by(
        owner_id=user_id
    ).all()

    return {
        "projects": [
            project.to_dict()
            for project in projects
        ]
    }

@project_bp.route("/", methods=["POST"])
@jwt_required()
def create_project():

    user_id = int(get_jwt_identity())   

    data = request.get_json()

    project = Project(
        name=data["name"],
        description=data.get("description"),
        owner_id=user_id
    )

    db.session.add(project)
    db.session.commit()

    return project.to_dict(), 201
@project_bp.route("/<int:project_id>", methods=["GET"])
@jwt_required()
def get_project(project_id):

    user_id = int(get_jwt_identity())

    project = Project.query.filter_by(
        id=project_id,
        owner_id=user_id
    ).first()

    if not project:
        return {"message": "Project not found"}, 404

    return project.to_dict()
@project_bp.route("/<int:project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id):

    user_id = int(get_jwt_identity())

    project = Project.query.filter_by(
        id=project_id,
        owner_id=user_id
    ).first()

    if not project:
        return {"message": "Project not found"}, 404

    data = request.get_json()

    project.name = data.get(
        "name",
        project.name
    )

    project.description = data.get(
        "description",
        project.description
    )

    db.session.commit()

    return project.to_dict()
@project_bp.route("/<int:project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):

    user_id = int(get_jwt_identity())

    project = Project.query.filter_by(
        id=project_id,
        owner_id=user_id
    ).first()

    if not project:
        return {"message": "Project not found"}, 404

    db.session.delete(project)
    db.session.commit()

    return {
        "message": "Project deleted successfully"
    }