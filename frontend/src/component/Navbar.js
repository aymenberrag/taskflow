import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineFolder,
  HiFolder,
  HiOutlineClipboardDocumentList,
  HiClipboardDocumentList,
  HiOutlineBell,
  HiBell,
  HiOutlineUserCircle,
  HiChevronDown,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

import "../styles/Navbar.css";
import {
  fetchNotifications,
  markAllRead,
  clearNotifications,
} from "../utils/notifications";

function NavPill({ active, label, onClick, icon: Icon, activeIcon: ActiveIcon, badge }) {
  const IconComponent = active ? ActiveIcon : Icon;

  return (
    <button
      type="button"
      className={`nav-pill ${active ? "active" : ""}`}
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
    >
      <span className="nav-pill-icon">
        <IconComponent />
        {badge > 0 && (
          <span className="nav-pill-badge">{badge > 99 ? "99+" : badge}</span>
        )}
      </span>
      <span className="nav-pill-label">{label}</span>
      {active && <span className="nav-pill-indicator" />}
    </button>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || "User"
  );
  const notifRef = useRef();
  const profileRef = useRef();

  const loadNotifications = useCallback(async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  useEffect(() => {
    const onProfileUpdate = () => {
      setUsername(localStorage.getItem("username") || "User");
    };

    window.addEventListener("profile-updated", onProfileUpdate);
    return () => window.removeEventListener("profile-updated", onProfileUpdate);
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const location = useLocation();
  const currentPath = location.pathname;

  const isProjectsActive =
    currentPath.startsWith("/dashboard") ||
    currentPath.startsWith("/projects");
  const isTasksActive = currentPath.startsWith("/tasks");
  const isNotificationsActive = currentPath.startsWith("/notifications");
  const isProfileActive = currentPath.startsWith("/profile");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/");
  };

  const handleNotifToggle = () => {
    const next = !notifOpen;
    setNotifOpen(next);
    if (next) {
      loadNotifications();
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllRead();
      await loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = async () => {
    try {
      await clearNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="app-nav">
      <button
        type="button"
        className="nav-brand-btn"
        onClick={() => navigate("/dashboard")}
      >
        <span className="nav-brand-mark">TF</span>
        <span className="nav-brand-text">TaskFlow</span>
      </button>

      <nav className="nav-center">
        <NavPill
          label="Projects"
          active={isProjectsActive}
          onClick={() => navigate("/dashboard")}
          icon={HiOutlineFolder}
          activeIcon={HiFolder}
        />

        <NavPill
          label="Tasks"
          active={isTasksActive}
          onClick={() => navigate("/tasks")}
          icon={HiOutlineClipboardDocumentList}
          activeIcon={HiClipboardDocumentList}
        />

        <div className="nav-notif-wrap" ref={notifRef}>
          <NavPill
            label="Alerts"
            active={isNotificationsActive || notifOpen}
            onClick={handleNotifToggle}
            icon={HiOutlineBell}
            activeIcon={HiBell}
            badge={unreadCount}
          />

          {notifOpen && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <strong>Notifications</strong>
                <div>
                  <button className="small-btn" onClick={handleMarkAll}>
                    Mark all
                  </button>
                  <button className="small-btn" onClick={handleClear}>
                    Clear
                  </button>
                </div>
              </div>

              <div className="notif-list">
                {notifications.length === 0 && (
                  <div className="notif-empty">No notifications</div>
                )}

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item ${n.read ? "read" : ""} notif-${n.type}`}
                  >
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-msg">{n.message}</div>
                    <div className="notif-time">
                      {new Date(n.date).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="notif-view-all"
                onClick={() => {
                  setNotifOpen(false);
                  navigate("/notifications");
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="nav-right" ref={profileRef}>
        <button
          type="button"
          className={`profile-trigger ${isProfileActive || profileOpen ? "active" : ""}`}
          onClick={() => setProfileOpen(!profileOpen)}
        >
          <span className="profile-trigger-icon">
            <HiOutlineUserCircle />
          </span>
          <span className="profile-name">{username}</span>
          <HiChevronDown className={`chev ${profileOpen ? "open" : ""}`} />
        </button>

        {profileOpen && (
          <div className="profile-dropdown">
            <div className="profile-info">
              <span className="profile-avatar-sm">
                {username.charAt(0).toUpperCase()}
              </span>
              <div>
                <div className="pname">{username}</div>
                <div className="pemail">{localStorage.getItem("email") || ""}</div>
              </div>
            </div>

            <div className="profile-actions">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/profile");
                }}
                className="action-row"
              >
                Profile settings
              </button>
              <button onClick={logout} className="action-row logout">
                <HiArrowRightOnRectangle /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
