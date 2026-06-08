from app import db

class Task(db.Model):

    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(150), nullable=False)

    description = db.Column(db.Text)

    status = db.Column(db.String(20), default="todo")

    priority = db.Column(db.String(20), default="medium")

    due_date = db.Column(db.Date, nullable=True)

    project_id = db.Column(
        db.Integer,
        db.ForeignKey("projects.id"),
        nullable=False
    )

    assigned_user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=True
    )
    subtasks = db.relationship(
        "SubTask",
        backref="task",
        lazy=True,
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "due_date": str(self.due_date) if self.due_date else None,
            "project_id": self.project_id,
            "assigned_user_id": self.assigned_user_id,
            "progress": self.calculate_progress()
        }
    def calculate_progress(self):
        if not self.subtasks:
            return 0

        done = len([s for s in self.subtasks if s.status == "done"])
        total = len(self.subtasks)

        return int((done / total) * 100)