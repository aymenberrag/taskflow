from datetime import datetime, timedelta

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.task import Task
from app.models.subtask import SubTask

task_bp = Blueprint(
    "tasks",
    __name__,
    url_prefix="/tasks"
)

# -----------------------------
# GET TASKS FOR CURRENT USER
# -----------------------------
@task_bp.route("/", methods=["GET"])
@jwt_required()
def get_user_tasks():
    user_id = int(get_jwt_identity())
    filter_type = request.args.get("filter", "all")
    date_str = request.args.get("date")

    query = Task.query.filter_by(assigned_user_id=user_id)

    if date_str:
        try:
            selected_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            query = query.filter(Task.due_date == selected_date)
        except ValueError:
            return {"message": "Invalid date format. Use YYYY-MM-DD."}, 400
    elif filter_type == "today":
        today = datetime.today().date()
        query = query.filter(Task.due_date == today)
    elif filter_type == "week":
        today = datetime.today().date()
        week_end = today + timedelta(days=6)
        query = query.filter(Task.due_date >= today, Task.due_date <= week_end)

    tasks = query.order_by(Task.due_date.asc()).all()

    return {
        "tasks": [task.to_dict() for task in tasks]
    }


# -----------------------------
# CREATE TASK
# -----------------------------
@task_bp.route("/", methods=["POST"])
@jwt_required()
def create_task():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    task = Task(
        title=data["title"],
        description=data.get("description"),
        status=data.get("status", "todo"),
        priority=data.get("priority", "medium"),

        due_date=datetime.strptime(
            data["due_date"],
            "%Y-%m-%d"
        ).date() if data.get("due_date") else None,

        project_id=data["project_id"],
        assigned_user_id=user_id
    )

    db.session.add(task)
    db.session.commit()

    return task.to_dict(), 201


# -----------------------------
# GET TASKS BY PROJECT
# -----------------------------
@task_bp.route("/project/<int:project_id>", methods=["GET"])
@jwt_required()
def get_tasks_by_project(project_id):

    tasks = Task.query.filter_by(
        project_id=project_id
    ).all()

    return {
        "tasks": [task.to_dict() for task in tasks]
    }


# -----------------------------
# GET SINGLE TASK
# -----------------------------
@task_bp.route("/<int:task_id>", methods=["GET"])
@jwt_required()
def get_task(task_id):

    task = Task.query.get_or_404(task_id)

    return task.to_dict()


# -----------------------------
# UPDATE TASK
# -----------------------------
@task_bp.route("/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):

    task = Task.query.get_or_404(task_id)
    data = request.get_json()

    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.status = data.get("status", task.status)
    task.priority = data.get("priority", task.priority)
    task.due_date = data.get("due_date", task.due_date)
    task.assigned_user_id = data.get("assigned_user_id", task.assigned_user_id)

    db.session.commit()

    return task.to_dict()


# -----------------------------
# DELETE TASK
# -----------------------------
@task_bp.route("/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):

    task = Task.query.get_or_404(task_id)

    db.session.delete(task)
    db.session.commit()

    return {
        "message": "Task deleted successfully"
    }


# -----------------------------
# GET TASK WITH SUBTASKS
# -----------------------------
@task_bp.route("/<int:task_id>/subtasks", methods=["GET"])
@jwt_required()
def get_task_with_subtasks(task_id):

    task = Task.query.get_or_404(task_id)

    subtasks = SubTask.query.filter_by(
        task_id=task_id
    ).all()

    return {
        "task": task.to_dict(),
        "subtasks": [
            subtask.to_dict()
            for subtask in subtasks
        ]
    }
