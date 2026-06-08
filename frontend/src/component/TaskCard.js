import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/TaskCard.css";

export default function TaskCard({ task, onEdit, onDelete }) {
  const navigate = useNavigate();

  const handleEdit = (event) => {
    event.stopPropagation();
    onEdit?.(task);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete?.(task);
  };

  return (
    <div className="task-card" onClick={() => navigate(`/tasks/${task.id}`)}>
      <div className="task-card-header">
        <div>
          <h3 className="task-title">{task.title}</h3>
          <p className="task-meta">Due: {task.due_date || '—'}</p>
        </div>

        <div className="card-actions">
          {onEdit && <button className="icon-btn edit" onClick={handleEdit}><FaEdit /></button>}
          {onDelete && <button className="icon-btn delete" onClick={handleDelete}><FaTrash /></button>}
        </div>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-footer">
        <span className={`priority ${task.priority}`}>{task.priority}</span>
        <div className="progress-wrap">
          <div className="progress-text">{task.progress || 0}%</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${task.progress || 0}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}