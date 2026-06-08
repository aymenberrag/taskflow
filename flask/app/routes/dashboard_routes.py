from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models.project import Project
from app.models.task import Task

dashboard_bp = Blueprint(
    "dashboard",
    __name__
)


@dashboard_bp.route(
    "/stats",
    methods=["GET"]
)
@jwt_required()
def get_stats():

    user_id = int(
        get_jwt_identity()
    )

    projects_count = (
        Project.query
        .filter_by(owner_id=user_id)
        .count()
    )

    tasks = (
        Task.query
        .join(Project)
        .filter(
            Project.owner_id == user_id
        )
        .all()
    )

    tasks_count = len(tasks)

    completed_count = len([
        task
        for task in tasks
        if task.status == "done"
    ])

    return jsonify({
        "projects": projects_count,
        "tasks": tasks_count,
        "completed": completed_count
    }), 200