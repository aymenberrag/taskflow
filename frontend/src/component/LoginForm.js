import { useState } from "react";
import api from "../api/axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const login = async () => {
    try {
      const res = await api.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      window.location.href =
        "/dashboard";

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br /><br />

      <button onClick={login}>
        Login
      </button>
    </div>
  );
}