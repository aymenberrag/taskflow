import { useState } from "react";
import api from "../api/axios";
import { validateRegisterForm } from "../utils/validation";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState({});

  const register = async (event) => {
    event?.preventDefault();

    const validationErrors = validateRegisterForm({ username, email, password });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      await api.post("/auth/register", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setMessage("Account created successfully! You can sign in now.");
      setMessageType("success");
      setUsername("");
      setEmail("");
      setPassword("");
      setErrors({});
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message ||
          "Registration failed. Please check your input and try again."
      );
      setMessageType("warning");
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form className="auth-form" onSubmit={register} noValidate>
      <div className="form-field">
        <label className="input-label" htmlFor="register-username">
          Username
        </label>
        <input
          id="register-username"
          className={`input-field ${errors.username ? "input-error" : ""}`}
          type="text"
          placeholder="Your display name"
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

      <div className="form-field">
        <label className="input-label" htmlFor="register-email">
          Email
        </label>
        <input
          id="register-email"
          className={`input-field ${errors.email ? "input-error" : ""}`}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError("email");
          }}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-field">
        <label className="input-label" htmlFor="register-password">
          Password
        </label>
        <input
          id="register-password"
          className={`input-field ${errors.password ? "input-error" : ""}`}
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError("password");
          }}
        />
        {errors.password && (
          <span className="field-error">{errors.password}</span>
        )}
      </div>

      <button
        type="submit"
        className="primary-btn auth-submit-btn"
        disabled={loading}
      >
        {loading ? <span className="button-spinner" /> : "Register"}
      </button>

      {message ? (
        <div
          className={`form-message ${
            messageType === "warning" ? "form-warning" : "form-success"
          }`}
        >
          {message}
        </div>
      ) : null}
    </form>
  );
}
