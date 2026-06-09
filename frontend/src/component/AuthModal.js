import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../styles/AuthModal.css";

export default function AuthModal({ close }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          width: "400px",
          borderRadius: "10px"
        }}
      >
        <button onClick={close}>
          X
        </button>

        {isLogin ? (
          <>
            <LoginForm />

            <p>
              No account?
              <button
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm />

            <p>
              Already have an account?
              <button
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}