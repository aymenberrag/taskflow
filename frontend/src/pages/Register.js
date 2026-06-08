import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {

      await api.post("/auth/register", {
        username,
        email,
        password
      });

      alert("Account created successfully!");

      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-form">
      <label className="input-label">Username</label>
      <input
        className="input-field"
        type="text"
        placeholder="Your display name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="input-label">Email</label>
      <input
        className="input-field"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="input-label">Password</label>
      <input
        className="input-field"
        type="password"
        placeholder="Create a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="primary-btn" onClick={register}>
        Create Account
      </button>

      <div className="auth-footer">
        <span>Already have an account?</span>
        <Link to="/"> Login</Link>
      </div>
    </div>
  );
}