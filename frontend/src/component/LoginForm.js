import { useState } from "react";
import api from "../api/axios";
import { validateLoginForm } from "../utils/validation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState({});

  const login = async (event) => {
    event?.preventDefault();

    const validationErrors = validateLoginForm({ email, password });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("email", res.data.user.email);

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
      setMessageType("warning");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={login} noValidate>
      <div className="form-field">
        <label className="input-label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          className={`input-field ${errors.email ? "input-error" : ""}`}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: "" }));
            }
          }}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-field">
        <label className="input-label" htmlFor="login-password">
          Password
        </label>
        <input
          id="login-password"
          className={`input-field ${errors.password ? "input-error" : ""}`}
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: "" }));
            }
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
        {loading ? <span className="button-spinner" /> : "Login"}
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
