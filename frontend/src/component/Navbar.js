import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFolderOpen,
  FaBell,
  FaTasks,
  FaUserCircle,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";

import "../styles/Navbar.css";
import {
  getNotifications,
  markAllRead,
  clearNotifications,
} from "../utils/notifications";

export default function Navbar() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const username = localStorage.getItem("username") || "User";
  const notifRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    setNotifications(getNotifications());

    const onStorage = () => setNotifications(getNotifications());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="app-nav">
      <div className="nav-left" onClick={() => navigate("/dashboard")}> 
        <h3 className="nav-brand">TaskFlow</h3>
      </div>

      <nav className="nav-center">
        <div className="nav-item" onClick={() => navigate("/dashboard")}>
          <FaFolderOpen className="nav-icon" />
          <span className="nav-label">Projects</span>
        </div>

        <div className="nav-item" onClick={() => navigate("/dashboard")}>
          <FaTasks className="nav-icon" />
          <span className="nav-label">Tasks</span>
        </div>

        <div className="nav-item" ref={notifRef}>
          <button
            className="icon-btn"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <FaBell className="nav-icon" />
            {unread > 0 && <span className="notif-badge">{unread}</span>}
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <strong>Notifications</strong>
                <div>
                  <button
                    className="small-btn"
                    onClick={() => {
                      markAllRead();
                      setNotifications(getNotifications());
                    }}
                  >
                    Mark all
                  </button>
                  <button
                    className="small-btn"
                    onClick={() => {
                      clearNotifications();
                      setNotifications([]);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="notif-list">
                {notifications.length === 0 && (
                  <div className="notif-empty">No notifications</div>
                )}

                {notifications.map((n) => (
                  <div key={n.id} className={`notif-item ${n.read ? "read" : ""}`}>
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-msg">{n.message}</div>
                    <div className="notif-time">{new Date(n.date).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="nav-right" ref={profileRef}>
        <div className="profile-area" onClick={() => setProfileOpen(!profileOpen)}>
          <FaUserCircle className="profile-icon" />
          <div className="profile-name">{username}</div>
          <FaChevronDown className="chev" />
        </div>

        {profileOpen && (
          <div className="profile-dropdown">
            <div className="profile-info">
              <FaUserCircle className="profile-large" />
              <div>
                <div className="pname">{username}</div>
                <div className="pemail">{localStorage.getItem("email") || ""}</div>
              </div>
            </div>

            <div className="profile-actions">
              <button onClick={() => navigate("/profile")} className="action-row">Profile</button>
              <button onClick={logout} className="action-row logout"><FaSignOutAlt /> Logout</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}