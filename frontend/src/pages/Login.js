import { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            const res = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data.access_token);
            localStorage.setItem("username", res.data.user.username);

            window.location.href = "/dashboard";

        } catch (err) {
            alert("Login failed. Check your credentials.");
        }
    };

    return (
        <div className="auth-form">
            <label className="input-label">Email</label>
            <input
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label className="input-label">Password</label>
            <input
                className="input-field"
                placeholder="Your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="primary-btn" onClick={login}>
                Sign in
            </button>

            <div className="auth-footer">
                <span>Don't have an account?</span>
                <Link to="/register"> Register</Link>
            </div>
        </div>
    );
}