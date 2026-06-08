import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Modal from "../component/Modal";
import { FaExclamationTriangle } from "react-icons/fa";
import "../styles/TaskPage.css";

export default function TaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");

  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [showEditSubtaskModal, setShowEditSubtaskModal] = useState(false);
  const [showDeleteSubtaskModal, setShowDeleteSubtaskModal] = useState(false);
  const [editSubtaskTitle, setEditSubtaskTitle] = useState("");
  const [editSubtaskDescription, setEditSubtaskDescription] = useState("");
  const [editSubtaskStatus, setEditSubtaskStatus] = useState("todo");

  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState("medium");

  useEffect(() => {
    loadTask();
  }, []);

  const loadTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}/subtasks`);

      setTask(res.data.task);
      setSubtasks(res.data.subtasks || []);

      console.log("TASK:", res.data.task);
      console.log("SUBTASKS:", res.data.subtasks);

    } catch (err) {
      console.error(err);
    }
  };

  const createSubtask = async () => {
    if (!newSubtask.trim()) return;

    try {
      await api.post("/subtasks/", {
        title: newSubtask,
        task_id: task.id
      });

      setNewSubtask("");

      loadTask();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditTask = () => {
    setEditTaskTitle(task.title || "");
    setEditTaskDescription(task.description || "");
    setEditTaskPriority(task.priority || "medium");
    setShowEditTaskModal(true);
  };

  const saveTaskChanges = async () => {
    try {
      await api.put(`/tasks/${task.id}`, {
        title: editTaskTitle,
        description: editTaskDescription,
        priority: editTaskPriority,
        due_date: task.due_date,
      });

      setShowEditTaskModal(false);
      loadTask();
    } catch (err) {
      console.error(err);
      alert("Failed to save task changes");
    }
  };

  const openDeleteTask = () => {
    setShowDeleteTaskModal(true);
  };

  const deleteTask = async () => {
    try {
      await api.delete(`/tasks/${task.id}`);
      navigate(`/projects/${task.project_id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  const openEditSubtask = (subtask) => {
    setSelectedSubtask(subtask);
    setEditSubtaskTitle(subtask.title || "");
    setEditSubtaskDescription(subtask.description || "");
    setEditSubtaskStatus(subtask.status || "todo");
    setShowEditSubtaskModal(true);
  };

  const saveSubtaskChanges = async () => {
    if (!selectedSubtask) return;

    try {
      await api.put(`/subtasks/${selectedSubtask.id}`, {
        title: editSubtaskTitle,
        description: editSubtaskDescription,
        status: editSubtaskStatus,
      });

      setShowEditSubtaskModal(false);
      setSelectedSubtask(null);
      loadTask();
    } catch (err) {
      console.error(err);
      alert("Failed to save subtask changes");
    }
  };

  const openDeleteSubtask = (subtask) => {
    setSelectedSubtask(subtask);
    setShowDeleteSubtaskModal(true);
  };

  const deleteSubtask = async () => {
    if (!selectedSubtask) return;

    try {
      await api.delete(`/subtasks/${selectedSubtask.id}`);
      setShowDeleteSubtaskModal(false);
      setSelectedSubtask(null);
      loadTask();
    } catch (err) {
      console.error(err);
      alert("Failed to delete subtask");
    }
  };

  const toggleSubtask = async (subtaskId) => {
    try {
      await api.put(
        `/subtasks/${subtaskId}/toggle`
      );

      loadTask();
    } catch (err) {
      console.error(err);
    }
  };

  if (!task) {
    return <p>Loading...</p>;
  }

  const progress = task.progress || 0;

  let progressColor = "#ef4444";

  if (progress >= 70) {
    progressColor = "#22c55e";
  } else if (progress >= 40) {
    progressColor = "#f59e0b";
  }

  return (
    <div className="task-page">

      <button
        className="back-btn"
        onClick={() =>
          navigate(`/projects/${task.project_id}`)
        }
      >
        ← Back To Project
      </button>

      <div className="task-container">

        <div className="task-header-row">
          <div>
            <h1>{task.title}</h1>
            <p className="task-desc">
              {task.description}
            </p>
          </div>

          <div className="task-actions-row">
            <button onClick={openEditTask}>
              Edit Task
            </button>
            <button
              className="delete-task-btn"
              onClick={openDeleteTask}
            >
              Delete Task
            </button>
          </div>
        </div>

        <div
          className="progress-circle"
          style={{
            background: `conic-gradient(
              ${progressColor}
              ${progress * 3.6}deg,
              #e5e7eb 0deg
            )`
          }}
        >
          <div className="progress-inner">
            {progress}%
          </div>
        </div>

        <div className="priority-row">

          <span
            className={`priority ${task.priority}`}
          >
            {task.priority}
          </span>

          <span className="due-date">
            Due: {task.due_date}
          </span>

        </div>

        <hr />

        <h2>Subtasks</h2>

        <div className="add-subtask">
          <form className="create-subtask-form" onSubmit={(e) => { e.preventDefault(); createSubtask(); }}>
            <div className="form-field" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                className="input-field"
                type="text"
                placeholder="New subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                style={{ flex: 1 }}
              />

              <button className="primary-btn" type="submit">Add</button>
            </div>
          </form>
        </div>

        <div className="subtasks-list">

          {subtasks.length === 0 ? (
            <p>No subtasks yet.</p>
          ) : (
            subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="subtask-item"
              >
                <input
                  type="checkbox"
                  checked={
                    subtask.status === "done"
                  }
                  onChange={() =>
                    toggleSubtask(
                      subtask.id
                    )
                  }
                />

                <span
                  className={
                    subtask.status === "done"
                      ? "completed"
                      : ""
                  }
                >
                  {subtask.title}
                </span>

                <div className="subtask-actions">
                  <button
                    onClick={() =>
                      openEditSubtask(
                        subtask
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="delete-subtask-btn"
                    onClick={() =>
                      openDeleteSubtask(
                        subtask
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}

        </div>

      </div>

      {showEditTaskModal && (
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

      {showDeleteTaskModal && (
        <Modal
          title="Delete Task"
          onClose={() => setShowDeleteTaskModal(false)}
        >
          <div className="delete-modal">
            <div className="delete-top">
              <FaExclamationTriangle className="danger-icon" />
              <div>
                <h3>Are you sure?</h3>
                <p className="danger-text">This will permanently delete the task "{task.title}" and its subtasks. This action cannot be undone.</p>
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

      {showEditSubtaskModal && selectedSubtask && (
        <Modal
          title="Edit Subtask"
          onClose={() => setShowEditSubtaskModal(false)}
        >
          <form className="edit-subtask-form modal-form">
            <div className="form-field">
              <label className="input-label">Subtask Title</label>
              <input
                className="input-field"
                placeholder="Subtask Title"
                value={editSubtaskTitle}
                onChange={(e) => setEditSubtaskTitle(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="input-label">Description</label>
              <textarea
                className="input-field"
                placeholder="Description"
                value={editSubtaskDescription}
                onChange={(e) => setEditSubtaskDescription(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="input-label">Status</label>
              <select
                className="input-field"
                value={editSubtaskStatus}
                onChange={(e) => setEditSubtaskStatus(e.target.value)}
              >
                <option value="todo">Todo</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="primary-btn" onClick={(e) => { e.preventDefault(); saveSubtaskChanges(); }}>
                Save Changes
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowEditSubtaskModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showDeleteSubtaskModal && selectedSubtask && (
        <Modal
          title="Delete Subtask"
          onClose={() => setShowDeleteSubtaskModal(false)}
        >
          <div className="delete-modal">
            <div className="delete-top">
              <FaExclamationTriangle className="danger-icon" />
              <div>
                <h3>Are you sure?</h3>
                <p className="danger-text">This will permanently delete the subtask "{selectedSubtask.title}". This action cannot be undone.</p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="danger-btn" onClick={deleteSubtask}>
                Delete Subtask
              </button>
              <button
                className="secondary-button"
                onClick={() => setShowDeleteSubtaskModal(false)}
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