import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Forecast from "./pages/Forecast";
import Historical from "./pages/Historical";
import SavedLocations from "./pages/SavedLocations";
import WeatherMap from "./pages/WeatherMap";

function App() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="app">
      {!isAuthPage && <Navbar />}

      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route path="/map" element={<WeatherMap />} />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Forecast */}
        <Route
          path="/forecast"
          element={
            <ProtectedRoute>
              <Forecast />
            </ProtectedRoute>
          }
        />

        {/* Historical Climate */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Historical />
            </ProtectedRoute>
          }
        />

        {/* Saved Locations */}
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedLocations />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
