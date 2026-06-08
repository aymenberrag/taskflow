import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaChevronRight } from "react-icons/fa";

import "../styles/ProjectCard.css";

export default function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate();

  const handleEdit = (event) => {
    event.stopPropagation();
    onEdit?.(project);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete?.(project);
  };

  return (
    <div className="project-card" onClick={() => navigate(`/projects/${project.id}`)}>
      <div className="project-card-top">
        <div className="project-avatar">{(project.name || "").slice(0,1).toUpperCase()}</div>
        <div className="project-info">
          <h3 className="project-title">{project.name}</h3>
          <p className="project-desc">{project.description}</p>
        </div>

        <div className="project-actions">
          {onEdit && <button className="icon-btn edit" onClick={handleEdit}><FaEdit /></button>}
          {onDelete && <button className="icon-btn delete" onClick={handleDelete}><FaTrash /></button>}
        </div>
      </div>

      <div className="project-card-footer">
        <div className="project-stats">
          {(project.tasks_count || project.tasks?.length) > 0 && (
            <span className="stat">{project.tasks_count || project.tasks?.length || 0} tasks</span>
          )}
          {(project.completed) > 0 && (
            <span className="stat">{project.completed} done</span>
          )}
        </div>
        <div className="open-link">Open <FaChevronRight /></div>
      </div>
    </div>
  );
}