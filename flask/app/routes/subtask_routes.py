from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from flask import Blueprint, jsonify
from app import db
from app.models.subtask import SubTask

subtask_bp = Blueprint(
    "subtasks",
    __name__,
    url_prefix="/subtasks"
)

@subtask_bp.route("/", methods=["POST"])
@jwt_required()
def create_subtask():

    data = request.get_json()

    subtask = SubTask(
        title=data["title"],
        description=data.get("description"),
        task_id=data["task_id"]
    )

    db.session.add(subtask)
    db.session.commit()

    return subtask.to_dict(), 201

@subtask_bp.route("/task/<int:task_id>", methods=["GET"])
@jwt_required()
def get_subtasks(task_id):

    subtasks = SubTask.query.filter_by(
        task_id=task_id
    ).all()

    return {
        "subtasks": [s.to_dict() for s in subtasks]
    }

@subtask_bp.route("/<int:subtask_id>", methods=["PUT"])
@jwt_required()
def update_subtask(subtask_id):

    subtask = SubTask.query.get_or_404(subtask_id)
    data = request.get_json()

    subtask.title = data.get("title", subtask.title)
    subtask.description = data.get("description", subtask.description)
    subtask.status = data.get("status", subtask.status)

    db.session.commit()

    return subtask.to_dict()

@subtask_bp.route("/<int:subtask_id>", methods=["DELETE"])
@jwt_required()
def delete_subtask(subtask_id):

    subtask = SubTask.query.get_or_404(subtask_id)

    db.session.delete(subtask)
    db.session.commit()

    return {
        "message": "SubTask deleted"
    }

@subtask_bp.route(
    "/<int:id>/toggle",
    methods=["PUT"]
)
@jwt_required()
def toggle_subtask(id):

    subtask = SubTask.query.get_or_404(id)

    if subtask.status == "done":
        subtask.status = "todo"
    else:
        subtask.status = "done"

    db.session.commit()

    return jsonify({
        "message": "updated",
        "status": subtask.status
    })