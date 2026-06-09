from datetime import datetime, date

from app import db
from app.models.task import Task
from app.models.notification import Notification


def sync_task_notifications(user_id: int) -> None:
    today = date.today()

    tasks = Task.query.filter_by(assigned_user_id=user_id).all()

    for task in tasks:
        if not task.due_date or task.status == "done":
            continue

        if task.due_date == today:
            _ensure_notification(
                user_id=user_id,
                task=task,
                notif_type="due_today",
                title="Task due today",
                message=f'"{task.title}" is due today.',
            )
        elif task.due_date < today:
            _ensure_notification(
                user_id=user_id,
                task=task,
                notif_type="overdue",
                title="Task overdue",
                message=f'"{task.title}" passed its due date ({task.due_date}).',
            )

    db.session.commit()


def _ensure_notification(
    user_id: int,
    task: Task,
    notif_type: str,
    title: str,
    message: str,
) -> None:
    today_start = datetime.combine(date.today(), datetime.min.time())

    exists = Notification.query.filter(
        Notification.user_id == user_id,
        Notification.task_id == task.id,
        Notification.type == notif_type,
        Notification.created_at >= today_start,
    ).first()

    if exists:
        return

    notification = Notification(
        user_id=user_id,
        task_id=task.id,
        title=title,
        message=message,
        type=notif_type,
    )
    db.session.add(notification)
