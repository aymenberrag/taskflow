from app import db

class SubTask(db.Model):

    __tablename__ = "subtasks"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(150), nullable=False)

    description = db.Column(db.Text)

    status = db.Column(db.String(20), default="todo")  # todo / done

    task_id = db.Column(
        db.Integer,
        db.ForeignKey("tasks.id"),
        nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "task_id": self.task_id
        }