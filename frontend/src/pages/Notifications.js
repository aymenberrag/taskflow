import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  markAllRead,
  clearNotifications,
  markNotificationRead,
} from "../utils/notifications";
import "../styles/Notifications.css";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchNotifications();
      setNotifications(data.notifications);
    } catch (err) {
      console.error(err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkAll = async () => {
    try {
      await markAllRead();
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = async () => {
    try {
      await clearNotifications();
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
      } catch (err) {
        console.error(err);
      }
    }

    if (notification.task_id) {
      navigate(`/tasks/${notification.task_id}`);
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay on top of tasks due today and overdue items.</p>
        </div>

        <div className="notifications-actions">
          <button className="notif-action-btn" onClick={handleMarkAll}>
            Mark all read
          </button>
          <button className="notif-action-btn danger" onClick={handleClear}>
            Clear all
          </button>
        </div>
      </div>

      {error && <div className="notifications-error">{error}</div>}

      {loading ? (
        <div className="notifications-loading">Loading notifications…</div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty">
          <p>No notifications yet.</p>
          <span>You'll be notified when tasks are due today or overdue.</span>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              className={`notification-card ${n.read ? "read" : "unread"} notif-${n.type}`}
              onClick={() => handleItemClick(n)}
            >
              <div className="notification-card-top">
                <span className={`notification-type ${n.type}`}>
                  {n.type === "due_today" ? "Due today" : "Overdue"}
                </span>
                {!n.read && <span className="unread-dot" />}
              </div>
              <h3>{n.title}</h3>
              <p>{n.message}</p>
              <time>{new Date(n.date).toLocaleString()}</time>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
