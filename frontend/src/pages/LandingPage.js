import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";

import "../styles/LandingPage.css";
import "../styles/AuthModal.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="landing-page new-landing">
      <header className="nav-bar">
        <h2 className="brand">TaskFlow</h2>
        <div>
          <button
            className="ghost-btn"
            onClick={() => setShowModal(true)}
          >
            Sign in
          </button>
        </div>
      </header>

      <section className="hero-panel">
        <div className="hero-content">
          <h1 className="hero-title">Organize. Track. Deliver.</h1>
          <p className="hero-sub">
            A beautiful workspace to manage projects, tasks and team progress with clarity.
          </p>

          <div className="hero-cta">
            <button
              className="primary-btn"
              onClick={() => {
                setIsLogin(true);
                setShowModal(true);
              }}
            >
              Get Started
            </button>
            <button
              className="secondary-btn"
              onClick={() => {
                setIsLogin(false);
                setShowModal(true);
              }}
            >
              Create Account
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="mock-card">
            <div className="mock-header" />
            <div className="mock-body">
              <div className="line short" />
              <div className="line" />
              <div className="line" />
            </div>
          </div>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature">
          <h3>Projects</h3>
          <p>Organize everything with clear boards and timelines.</p>
        </div>
        <div className="feature">
          <h3>Tasks</h3>
          <p>Break work into tasks and subtasks with progress tracking.</p>
        </div>
        <div className="feature">
          <h3>Analytics</h3>
          <p>Visualize completion rates and team throughput.</p>
        </div>
      </section>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-inner">
              <div className="modal-left">
                <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
                <p className="modal-desc">
                  {isLogin
                    ? "Sign in to continue to your dashboard."
                    : "Create your account and start organizing your work."}
                </p>
              </div>

              <div className="modal-right">
                {isLogin ? <Login /> : <Register />}

                <div className="auth-switch">
                  {isLogin ? (
                    <>
                      Don't have an account?{' '}
                      <span onClick={() => setIsLogin(false)}>Register</span>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <span onClick={() => setIsLogin(true)}>Login</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}