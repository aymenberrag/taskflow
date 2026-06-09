import { useEffect, useState } from "react";
import api from "../api/axios";
import { validateProfileForm } from "../utils/validation";
import "../styles/Profile.css";

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setUsername(res.data.username || "");
        setEmail(res.data.email || "");
      } catch (err) {
        console.error(err);
        setMessage("Unable to load profile.");
        setMessageType("warning");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateProfileForm({
      username,
      email,
      currentPassword,
      newPassword,
      confirmPassword,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSaving(true);
    setMessage("");
    setMessageType("");

    try {
      const payload = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
      };

      if (newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }

      const res = await api.put("/auth/profile", payload);

      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("email", res.data.user.email);
      window.dispatchEvent(new Event("profile-updated"));

      setUsername(res.data.user.username);
      setEmail(res.data.user.email);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage("Profile updated successfully.");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
      setMessageType("warning");
    } finally {
      setSaving(false);
    }
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile…</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar">{getInitials(username)}</div>
        <div>
          <h1>{username || "Your Profile"}</h1>
          <p>{email}</p>
        </div>
      </div>

      <form className="profile-card" onSubmit={handleSubmit} noValidate>
        <div className="profile-section">
          <h2>Personal information</h2>
          <p>Update your account details used across TaskFlow.</p>

          <div className="profile-grid">
            <div className="profile-field">
              <label htmlFor="profile-username">Username</label>
              <input
                id="profile-username"
                className={errors.username ? "has-error" : ""}
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearError("username");
                }}
              />
              {errors.username && (
                <span className="field-error">{errors.username}</span>
              )}
            </div>

            <div className="profile-field">
              <label htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                className={errors.email ? "has-error" : ""}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Change password</h2>
          <p>Leave blank to keep your current password.</p>

          <div className="profile-grid">
            <div className="profile-field full-width">
              <label htmlFor="profile-current-password">Current password</label>
              <input
                id="profile-current-password"
                className={errors.currentPassword ? "has-error" : ""}
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  clearError("currentPassword");
                }}
              />
              {errors.currentPassword && (
                <span className="field-error">{errors.currentPassword}</span>
              )}
            </div>

            <div className="profile-field">
              <label htmlFor="profile-new-password">New password</label>
              <input
                id="profile-new-password"
                className={errors.newPassword ? "has-error" : ""}
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  clearError("newPassword");
                }}
              />
              {errors.newPassword && (
                <span className="field-error">{errors.newPassword}</span>
              )}
            </div>

            <div className="profile-field">
              <label htmlFor="profile-confirm-password">
                Confirm new password
              </label>
              <input
                id="profile-confirm-password"
                className={errors.confirmPassword ? "has-error" : ""}
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError("confirmPassword");
                }}
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`profile-message ${
              messageType === "warning" ? "warning" : "success"
            }`}
          >
            {message}
          </div>
        )}

        <div className="profile-actions">
          <button type="submit" className="profile-save-btn" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
