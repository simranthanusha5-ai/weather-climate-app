import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left branding section */}
      <section className="login-hero">
        <div className="login-hero-content">

          <div className="login-brand-icon">☁</div>

          <p className="login-eyebrow">
            WEATHER INTELLIGENCE
          </p>

          <h1>
            Weather &<br />
            Climate
            <span> Dashboard</span>
          </h1>

          <p className="login-description">
            A centralized platform for monitoring current weather,
            forecasts and climate trends in one place.
          </p>

          <div className="login-feature-grid">

            <div className="login-feature">
              <span>🌡</span>
              <div>
                <strong>Temperature</strong>
                <small>Live conditions</small>
              </div>
            </div>

            <div className="login-feature">
              <span>💧</span>
              <div>
                <strong>Humidity</strong>
                <small>Atmospheric data</small>
              </div>
            </div>

            <div className="login-feature">
              <span>💨</span>
              <div>
                <strong>Wind</strong>
                <small>Current speed</small>
              </div>
            </div>

            <div className="login-feature">
              <span>📈</span>
              <div>
                <strong>Climate Trends</strong>
                <small>Historical analysis</small>
              </div>
            </div>

          </div>
        </div>

        <div className="login-decoration">
          <div className="cloud cloud-one">☁</div>
          <div className="cloud cloud-two">☁</div>
          <div className="sun">☼</div>
        </div>
      </section>

      {/* Login section */}
      <section className="login-panel">

        <div className="login-card">

          <div className="login-card-header">
            <p>WELCOME BACK</p>
            <h2>Sign in</h2>
            <span>
              Access your weather dashboard
            </span>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="login-field">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <div className="password-label">
                <label htmlFor="password">
                  Password
                </label>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="login-divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          <p className="login-register">
            Don't have an account?
            <Link to="/register">
              Create account
            </Link>
          </p>

        </div>

        <p className="login-footer">
          Centralized Weather & Climate Data Visualization System
        </p>

      </section>

    </div>
  );
};

export default Login;
