from app import db

class Project(db.Model):

    __tablename__ = "projects"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    owner_id = db.Column(
    db.Integer,
    db.ForeignKey("users.id"),
    nullable=False
)

    tasks = db.relationship(
        "Task",
        backref="project",
        lazy=True,
        cascade="all, delete"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "owner_id": self.owner_id
        }