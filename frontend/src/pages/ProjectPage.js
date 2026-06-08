import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

import TaskCard from "../component/TaskCard";
import Modal from "../component/Modal";
import { FaExclamationTriangle } from "react-icons/fa";

import "../styles/ProjectPage.css";

export default function ProjectPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const [selectedTask, setSelectedTask] = useState(null);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState("medium");
  const [editTaskDueDate, setEditTaskDueDate] = useState("");

  useEffect(() => {
    loadProject();
    loadTasks();
  }, []);

  const loadProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTasks = async () => {
    try {
      const res = await api.get(`/tasks/project/${id}`);
      setTasks(res.data.tasks || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createTask = async () => {
    if (!title.trim()) return alert("Title required");

    try {
      await api.post("/tasks/", {
        title,
        description,
        priority,
        due_date: dueDate,
        project_id: id,
      });

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");

      loadTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    }
  };

  const openEditTask = (task) => {
    setSelectedTask(task);
    setEditTaskTitle(task.title || "");
    setEditTaskDescription(task.description || "");
    setEditTaskPriority(task.priority || "medium");
    setEditTaskDueDate(task.due_date || "");
    setShowEditTaskModal(true);
  };

  const saveTaskChanges = async () => {
    if (!selectedTask) return;

    try {
      await api.put(`/tasks/${selectedTask.id}`, {
        title: editTaskTitle,
        description: editTaskDescription,
        priority: editTaskPriority,
        due_date: editTaskDueDate,
      });

      setShowEditTaskModal(false);
      setSelectedTask(null);
      await loadTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    }
  };

  const openDeleteTask = (task) => {
    setSelectedTask(task);
    setShowDeleteTaskModal(true);
  };

  const deleteTask = async () => {
    if (!selectedTask) return;

    try {
      await api.delete(`/tasks/${selectedTask.id}`);
      setShowDeleteTaskModal(false);
      setSelectedTask(null);
      await loadTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };


  if (!project) return <p>Loading project...</p>;

  return (
    <div className="project-page">

      {/* HEADER */}
      <div className="project-header">
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </div>

      {/* CREATE TASK */}
      <div className="task-form-card dark">
        <h2>Create New Task</h2>

        <form className="create-task-form">
          <div className="form-field">
            <label className="input-label">Title</label>
            <input
              className="input-field"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="input-label">Description</label>
            <textarea
              className="input-field"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="input-label">Priority</label>
            <select
              className="input-field"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-field">
            <label className="input-label">Due Date</label>
            <input
              className="input-field"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="button" className="primary-btn" onClick={createTask}>
              Create Task
            </button>
          </div>
        </form>
      </div>

      {/* TASK GRID */}
      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <p>No tasks yet</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditTask}
              onDelete={openDeleteTask}
            />
          ))
        )}
      </div>

      {showEditTaskModal && selectedTask && (
        <Modal
          title="Edit Task"
          onClose={() => setShowEditTaskModal(false)}
        >
          <form className="edit-task-form modal-form">
            <div className="form-field">
              <label className="input-label">Title</label>
              <input
                className="input-field"
                placeholder="Title"
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="input-label">Description</label>
              <textarea
                className="input-field"
                placeholder="Description"
                value={editTaskDescription}
                onChange={(e) => setEditTaskDescription(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="input-label">Priority</label>
              <select
                className="input-field"
                value={editTaskPriority}
                onChange={(e) => setEditTaskPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-field">
              <label className="input-label">Due Date</label>
              <input
                className="input-field"
                type="date"
                value={editTaskDueDate}
                onChange={(e) => setEditTaskDueDate(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="primary-btn" onClick={(e) => { e.preventDefault(); saveTaskChanges(); }}>
                Save Changes
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowEditTaskModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showDeleteTaskModal && selectedTask && (
        <Modal
          title="Delete Task"
          onClose={() => setShowDeleteTaskModal(false)}
        >
          <div className="delete-modal">
            <div className="delete-top">
              <FaExclamationTriangle className="danger-icon" />
              <div>
                <h3>Are you sure?</h3>
                <p className="danger-text">This will permanently delete the task "{selectedTask.title}". This action cannot be undone.</p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="danger-btn" onClick={deleteTask}>
                Delete Task
              </button>
              <button
                className="secondary-button"
                onClick={() => setShowDeleteTaskModal(false)}
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