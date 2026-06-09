from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.notification import Notification
from app.services.notification_service import sync_task_notifications

notification_bp = Blueprint(
    "notifications",
    __name__,
    url_prefix="/notifications",
)


@notification_bp.route("/", methods=["GET"])
@jwt_required()
def get_notifications():
    user_id = int(get_jwt_identity())

    sync_task_notifications(user_id)

    notifications = (
        Notification.query.filter_by(user_id=user_id)
        .order_by(Notification.created_at.desc())
        .limit(50)
        .all()
    )

    unread_count = Notification.query.filter_by(
        user_id=user_id,
        read=False,
    ).count()

    return {
        "notifications": [n.to_dict() for n in notifications],
        "unread_count": unread_count,
    }


@notification_bp.route("/<int:notification_id>/read", methods=["PUT"])
@jwt_required()
def mark_notification_read(notification_id):
    user_id = int(get_jwt_identity())

    notification = Notification.query.filter_by(
        id=notification_id,
        user_id=user_id,
    ).first_or_404()

    notification.read = True
    db.session.commit()

    return notification.to_dict()


@notification_bp.route("/read-all", methods=["PUT"])
@jwt_required()
def mark_all_read():
    user_id = int(get_jwt_identity())

    Notification.query.filter_by(
        user_id=user_id,
        read=False,
    ).update({"read": True})

    db.session.commit()

    return {"message": "All notifications marked as read"}


@notification_bp.route("/", methods=["DELETE"])
@jwt_required()
def clear_notifications():
    user_id = int(get_jwt_identity())

    Notification.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return {"message": "Notifications cleared"}
