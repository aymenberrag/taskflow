import { useState } from "react";
import api from "../api/axios";

export default function RegisterForm() {

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const register = async () => {
    try {

      await api.post(
        "/auth/register",
        {
          username,
          email,
          password
        }
      );

      alert(
        "Account created successfully!"
      );

    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <br /><br />

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

      <button onClick={register}>
        Register
      </button>
    </div>
  );
}