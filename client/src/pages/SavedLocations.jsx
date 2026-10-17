
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getLocations, deleteLocation } from "../services/api";

const SavedLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState("");

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getLocations();
      setLocations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load saved locations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleDelete = async (location) => {
    const confirmed = window.confirm(
      `Remove ${location.city}${location.country ? `, ${location.country}` : ""} from your saved locations?`
    );

    if (!confirmed) return;

    setDeletingId(location._id);
    setError("");
    setNotice("");

    try {
      await deleteLocation(location._id);

      setLocations((previous) =>
        previous.filter((item) => item._id !== location._id)
      );

      setNotice(`${location.city} was removed from your saved locations.`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete this location. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="weather-dashboard saved-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            YOUR PERSONAL WEATHER COLLECTION
          </p>

          <h1>My Saved Locations</h1>

          <p className="dashboard-subtitle">
            Keep your favorite cities organized and access them whenever
            you want to explore their weather.
          </p>
        </div>

        <div className="saved-header-icon" aria-hidden="true">
          📍
        </div>
      </header>

      <section className="saved-overview">
        <div className="saved-overview-icon">★</div>

        <div className="saved-overview-text">
          <span>YOUR COLLECTION</span>
          <strong>
            {loading ? "…" : locations.length}
            <small>
              {" "}
              {locations.length === 1 ? "saved city" : "saved cities"}
            </small>
          </strong>
        </div>

        <Link to="/dashboard" className="primary-action saved-add-button">
          + Explore cities
        </Link>
      </section>

      {error && (
        <div className="dashboard-message error-message" role="alert">
          <strong>Something went wrong</strong>
          <p>{error}</p>
          <button
            className="secondary-action"
            type="button"
            onClick={fetchLocations}
          >
            Try again
          </button>
        </div>
      )}

      {notice && (
        <div className="saved-notice" role="status">
          <span>✓</span>
          {notice}
        </div>
      )}

      {loading && (
        <div className="dashboard-message loading-message" role="status">
          <div className="loading-spinner" />
          <div>
            <strong>Loading your locations...</strong>
            <p>Retrieving your saved cities.</p>
          </div>
        </div>
      )}

      {!loading && !error && locations.length === 0 && (
        <section className="dashboard-empty saved-empty">
          <div className="empty-icon">🌍</div>

          <p className="dashboard-eyebrow">START YOUR COLLECTION</p>

          <h2>No saved cities yet</h2>

          <p>
            Search for a city on your dashboard and choose “Save this
            location” to build your personal collection.
          </p>

          <Link to="/dashboard" className="primary-action">
            Explore weather →
          </Link>
        </section>
      )}

      {!loading && locations.length > 0 && (
        <section className="saved-results">
          <div className="analytics-heading">
            <div>
              <p className="dashboard-eyebrow">YOUR FAVORITES</p>
              <h2>Saved city collection</h2>
              <p>Select a city to open its weather dashboard.</p>
            </div>
          </div>

          <div className="saved-location-grid">
            {locations.map((location) => (
              <article className="saved-location-card" key={location._id}>
                <div className="saved-card-top">
                  <div className="saved-city-icon">🌤️</div>

                  <span className="saved-star" aria-label="Saved location">
                    ★
                  </span>
                </div>

                <div className="saved-city-details">
                  <h3>{location.city}</h3>
                  <p>{location.country || "Country not provided"}</p>
                </div>

                <div className="saved-card-actions">
                  <Link
                    to={`/dashboard?city=${encodeURIComponent(location.city)}`}
                    className="saved-view-button"
                  >
                    View weather <span>→</span>
                  </Link>

                  <button
                    type="button"
                    className="saved-delete-button"
                    onClick={() => handleDelete(location)}
                    disabled={deletingId === location._id}
                    aria-label={`Delete ${location.city}`}
                  >
                    {deletingId === location._id
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default SavedLocations;
