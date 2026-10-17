
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <span className="navbar-logo">☁</span>
        <span>Weather &amp; Climate</span>
      </Link>

      {user && (
        <div className="navbar-links">
          <NavLink to="/dashboard" className="navbar-link">
            Dashboard
          </NavLink>
          <NavLink to="/forecast" className="navbar-link">
            Forecast
          </NavLink>
          <NavLink to="/history" className="navbar-link">
            Climate History
          </NavLink>
          <NavLink to="/saved" className="navbar-link">
            Saved Locations
          </NavLink>
          <NavLink to="/map" className="navbar-link">
  Weather Map
</NavLink>

          <span className="navbar-user">
            Hi, {user.name || user.username || "there"}
          </span>

          <button
            type="button"
            className="navbar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
