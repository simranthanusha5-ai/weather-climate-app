import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page register-page">
      <section className="login-hero">
        <div className="login-hero-content">
          <div className="login-brand-icon">☁</div>

          <p className="login-eyebrow">WEATHER INTELLIGENCE</p>

          <h1>
            Discover Your
            <span>Weather World</span>
          </h1>

          <p className="login-description">
            Create your account to explore live weather conditions,
            forecast upcoming changes, and discover climate trends
            from one centralized dashboard.
          </p>

          <div className="login-feature-grid">
            <div className="login-feature">
              <span>🌡️</span>
              <div>
                <strong>Live Weather</strong>
                <small>Monitor current conditions</small>
              </div>
            </div>

            <div className="login-feature">
              <span>🌦️</span>
              <div>
                <strong>Weather Forecasts</strong>
                <small>Plan for upcoming weather</small>
              </div>
            </div>

            <div className="login-feature">
              <span>📈</span>
              <div>
                <strong>Climate Insights</strong>
                <small>Explore weather history</small>
              </div>
            </div>

            <div className="login-feature">
              <span>📍</span>
              <div>
                <strong>Saved Locations</strong>
                <small>Keep places close at hand</small>
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

      <section className="login-panel">
        <div className="login-card">
          <div className="login-card-header">
            <p>GET STARTED</p>
            <h2>Create account</h2>
            <span>
              Join us to explore weather and climate data.
            </span>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="login-divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>

          <p className="login-register">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </p>
        </div>

        <p className="login-footer">
          Centralized Weather &amp; Climate Data Visualization System
        </p>
      </section>
    </div>
  );
};

export default Register;