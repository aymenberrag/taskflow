import { useEffect, useState } from "react";

import api from "../api/axios";
import { FaFolderOpen, FaTasks, FaCheckCircle } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";

import ProjectCard from "../component/ProjectCard";
import StatsCard from "../component/StatsCard";
import Modal from "../component/Modal";

import "../styles/Dashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);

  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completed: 0,
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [selectedProject, setSelectedProject] = useState(null);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    loadProjects();
    loadStats();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await api.get("/projects/");

      if (res.data.projects) {
        setProjects(res.data.projects);
      } else {
        setProjects(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");

      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createProject = async () => {
    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      await api.post("/projects/", {
        name,
        description,
      });

      setName("");
      setDescription("");

      await loadProjects();
      await loadStats();
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  const openEditProject = (project) => {
    setSelectedProject(project);
    setEditName(project.name || "");
    setEditDescription(project.description || "");
    setShowEditProjectModal(true);
  };

  const saveProjectChanges = async () => {
    if (!selectedProject) return;

    try {
      await api.put(`/projects/${selectedProject.id}`, {
        name: editName,
        description: editDescription,
      });

      setShowEditProjectModal(false);
      setSelectedProject(null);
      await loadProjects();
      await loadStats();
    } catch (err) {
      console.error(err);
      alert("Failed to update project");
    }
  };

  const openDeleteProject = (project) => {
    setSelectedProject(project);
    setShowDeleteProjectModal(true);
  };

  const deleteProject = async () => {
    if (!selectedProject) return;

    try {
      await api.delete(`/projects/${selectedProject.id}`);
      setShowDeleteProjectModal(false);
      setSelectedProject(null);
      await loadProjects();
      await loadStats();
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  };


  return (
    <div className="dashboard-container">
      {/* Welcome Card */}
      <div className="welcome-card">
        <h1>
          Welcome back,{" "}
          {localStorage.getItem("username") || "User"}
        </h1>

        <p>
          Here's an overview of your work.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.projects > 0 && (
          <StatsCard
            title="Projects"
            value={stats.projects}
            icon={FaFolderOpen}
          />
        )}

        {stats.tasks > 0 && (
          <StatsCard
            title="Tasks"
            value={stats.tasks}
            icon={FaTasks}
          />
        )}

        {stats.completed > 0 && (
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={FaCheckCircle}
          />
        )}
      </div>

      {/* Create Project Card */}
      <div className="project-form-card dark">
        <h2>Create New Project</h2>

        <form className="create-project-form">
          <div className="form-field">
            <label className="input-label">Project Name</label>
            <input
              className="input-field"
              type="text"
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="input-label">Description</label>
            <textarea
              className="input-field"
              rows="4"
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button type="button" className="primary-btn" onClick={createProject}>
              Create Project
            </button>
          </div>
        </form>
      </div>

      {/* Projects */}
      <h2 className="dashboard-title">
        My Projects
      </h2>

      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="empty-projects">
            No projects found.
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEditProject}
              onDelete={openDeleteProject}
            />
          ))
        )}
      </div>

      {showEditProjectModal && selectedProject && (
        <Modal
          title="Edit Project"
          onClose={() => setShowEditProjectModal(false)}
        >
          <form className="edit-project-form">
            <div className="form-field">
              <label className="input-label">Project Name</label>
              <input
                className="input-field"
                type="text"
                placeholder="Project Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="input-label">Description</label>
              <textarea
                className="input-field"
                rows="4"
                placeholder="Project Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="primary-btn" onClick={(e) => { e.preventDefault(); saveProjectChanges(); }}>
                Save Changes
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowEditProjectModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showDeleteProjectModal && selectedProject && (
        <Modal
          title="Delete Project"
          onClose={() => setShowDeleteProjectModal(false)}
        >
          <div className="delete-modal">
            <div className="delete-top">
              <FaExclamationTriangle className="danger-icon" />
              <div>
                <h3>Are you sure?</h3>
                <p className="danger-text">This will permanently delete the project "{selectedProject.name}" and all its tasks and subtasks. This action cannot be undone.</p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="danger-btn" onClick={deleteProject}>
                Delete Project
              </button>
              <button
                className="secondary-button"
                onClick={() => setShowDeleteProjectModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}