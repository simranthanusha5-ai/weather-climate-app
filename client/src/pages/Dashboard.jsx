
import React, { useState } from "react";
import { Link } from "react-router-dom";

import SearchBar from "../components/SearchBar";
import WeatherChart from "../components/WeatherChart";

import {
  getCurrentWeather,
  getForecast,
  addLocation,
} from "../services/api";

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const handleSearch = async (city) => {
    setError("");
    setSaveMessage("");
    setLoading(true);

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city),
      ]);

      setWeather(weatherRes.data);

      setForecast(
        Array.isArray(forecastRes.data.forecast)
          ? forecastRes.data.forecast
          : []
      );
    } catch (err) {
      setWeather(null);
      setForecast([]);

      setError(
        err.response?.data?.message ||
          "Unable to fetch weather data. Check that the backend is running and your weather API configuration is valid."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!weather) return;

    try {
      await addLocation({
        city: weather.city,
        country: weather.country,
      });

      setSaveMessage(`${weather.city} saved to your locations.`);
    } catch (err) {
      setSaveMessage(
        err.response?.data?.message || "Could not save location."
      );
    }
  };

  const tempChartData = forecast.map((item) => ({
    label: formatDate(item.date),
    temperature:
      item.temperature == null ? null : Number(item.temperature),
  }));

  const rainChartData = forecast.map((item) => ({
    label: formatDate(item.date),
    rainfall:
      item.rainfall == null ? null : Number(item.rainfall),
  }));

  const humidityChartData = forecast.map((item) => ({
    label: formatDate(item.date),
    humidity:
      item.humidity == null ? null : Number(item.humidity),
  }));

  const weatherIcon = (condition) => {
    const value = (condition || "").toLowerCase();

    if (value.includes("thunder")) return "⛈️";
    if (value.includes("snow")) return "❄️";
    if (value.includes("rain") || value.includes("drizzle")) return "🌧️";
    if (value.includes("cloud")) return "☁️";
    if (value.includes("clear")) return "☀️";
    if (value.includes("mist") || value.includes("fog")) return "🌫️";

    return "🌤️";
  };

  return (
    <main className="weather-dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            WEATHER INTELLIGENCE PLATFORM
          </p>

          <h1>Weather &amp; Climate Dashboard</h1>

          <p className="dashboard-subtitle">
            Explore live weather conditions, upcoming forecasts, and
            atmospheric trends in one place.
          </p>
        </div>

        <Link to="/saved" className="saved-top-button">
          ★ Saved Locations
        </Link>
      </header>

      <section className="search-section">
        <div className="search-heading">
          <div>
            <h2>Explore a location</h2>
            <p>Search for a city to view its weather data.</p>
          </div>

          <span className="live-status">
            <span className="location-dot" />
            Weather search
          </span>
        </div>

        <SearchBar onSearch={handleSearch} />
      </section>

      {loading && (
        <div className="dashboard-message loading-message" role="status">
          <div className="loading-spinner" />

          <div>
            <strong>Loading weather data...</strong>
            <p>Fetching current conditions and forecast information.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="dashboard-message error-message" role="alert">
          <strong>Unable to load weather</strong>
          <p>{error}</p>
          <p>
            Check that your backend is running, then try searching again.
          </p>
        </div>
      )}

      {!weather && !loading && !error && (
        <section className="dashboard-empty">
          <div className="empty-icon">🌦️</div>

          <p className="dashboard-eyebrow">YOUR WEATHER AT A GLANCE</p>

          <h2>Discover weather around the world</h2>

          <p>
            Search for a city to explore its current temperature, humidity,
            rainfall, wind conditions, and forecast trends.
          </p>
        </section>
      )}

      {weather && !loading && (
        <>
          <section className="weather-hero">
            <div className="weather-hero-main">
              <div className="location-label">
                <span className="location-dot" />
                CURRENT CONDITIONS
              </div>

              <h2>
                {weather.city}
                {weather.country && (
                  <span className="country-code">
                    , {weather.country}
                  </span>
                )}
              </h2>

              <div className="hero-temperature">
                {weather.temperature == null
                  ? "—"
                  : Math.round(weather.temperature)}
                <span>°C</span>
              </div>

              <p className="hero-condition">
                {weather.weatherCondition || "Conditions unavailable"}
              </p>

              <p className="hero-description">
                {weather.description || "Current weather conditions"}
              </p>

              <p className="feels-like">
                Feels like{" "}
                {weather.feelsLike == null
                  ? "—"
                  : `${Math.round(weather.feelsLike)}°C`}
              </p>
            </div>

            <div className="weather-hero-icon">
              <div className="weather-symbol">
                {weatherIcon(weather.weatherCondition)}
              </div>
              <span>Current weather</span>
            </div>
          </section>

          <section className="weather-stats">
            <article className="weather-stat-card">
              <div className="stat-icon humidity-icon">💧</div>
              <div>
                <span>Humidity</span>
                <strong>
                  {weather.humidity == null
                    ? "—"
                    : `${weather.humidity}%`}
                </strong>
              </div>
            </article>

            <article className="weather-stat-card">
              <div className="stat-icon wind-icon">💨</div>
              <div>
                <span>Wind speed</span>
                <strong>
                  {weather.windSpeed == null
                    ? "—"
                    : `${weather.windSpeed} m/s`}
                </strong>
              </div>
            </article>

            <article className="weather-stat-card">
              <div className="stat-icon rain-icon">🌧️</div>
              <div>
                <span>Reported rainfall</span>
                <strong>
                  {weather.rainfall == null
                    ? "—"
                    : `${weather.rainfall} mm`}
                </strong>
              </div>
            </article>

            <article className="weather-stat-card">
              <div className="stat-icon condition-icon">
                {weatherIcon(weather.weatherCondition)}
              </div>
              <div>
                <span>Conditions</span>
                <strong>
                  {weather.weatherCondition || "Unavailable"}
                </strong>
              </div>
            </article>
          </section>

          <section className="dashboard-action-row">
            <button
              className="primary-action"
              onClick={handleSaveLocation}
              disabled={loading}
            >
              ★ Save this location
            </button>

            <Link to="/history" className="secondary-action">
              View Historical Trends →
            </Link>

            <Link to="/forecast" className="secondary-action">
              View Full Forecast →
            </Link>
          </section>

          {saveMessage && (
            <div className="save-message" role="status">
              {saveMessage}
            </div>
          )}

          {forecast.length > 0 && (
            <>
              <section className="analytics-heading">
                <div>
                  <p className="dashboard-eyebrow">
                    FORECAST ANALYTICS
                  </p>
                  <h2>Weather trends</h2>
                  <p>
                    Explore available temperature, rainfall, and humidity
                    forecast data.
                  </p>
                </div>

                <span className="forecast-period">Next 5 days</span>
              </section>

              <section className="chart-grid modern-chart-grid">
                <div className="chart-panel">
                  <WeatherChart
                    title="Temperature Trend"
                    type="line"
                    data={tempChartData}
                    dataKey="temperature"
                    color="#fb7185"
                    unit="°C"
                  />
                </div>

                <div className="chart-panel">
                  <WeatherChart
                    title="Rainfall Forecast"
                    type="bar"
                    data={rainChartData}
                    dataKey="rainfall"
                    color="#38bdf8"
                    unit=" mm"
                  />
                </div>

                <div className="chart-panel">
                  <WeatherChart
                    title="Humidity Trend"
                    type="line"
                    data={humidityChartData}
                    dataKey="humidity"
                    color="#2dd4bf"
                    unit="%"
                  />
                </div>
              </section>

              <section className="forecast-preview">
                <div className="analytics-heading">
                  <div>
                    <p className="dashboard-eyebrow">
                      UPCOMING CONDITIONS
                    </p>
                    <h2>Forecast overview</h2>
                  </div>

                  <Link to="/forecast" className="secondary-action">
                    Full forecast →
                  </Link>
                </div>

                <div className="forecast-card-grid">
                  {forecast.slice(0, 5).map((item, index) => (
                    <article
                      className="forecast-card"
                      key={`${item.date || "forecast"}-${index}`}
                    >
                      <p className="forecast-date">
                        {formatDate(item.date)}
                      </p>

                      <div className="forecast-weather-icon">
                        {weatherIcon(
                          item.weatherCondition || item.condition
                        )}
                      </div>

                      <strong className="forecast-temperature">
                        {item.temperature == null
                          ? "—"
                          : `${Math.round(item.temperature)}°C`}
                      </strong>

                      <p>
                        {item.weatherCondition ||
                          item.condition ||
                          "Forecast"}
                      </p>

                      <span>
                        Rain:{" "}
                        {item.rainfall == null
                          ? "—"
                          : `${item.rainfall} mm`}
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

          <section className="weather-insight">
            <div className="insight-icon">✦</div>

            <div>
              <p className="dashboard-eyebrow">WEATHER SUMMARY</p>

              <h3>Current atmospheric conditions</h3>

              <p>
                {weather.city} is currently reporting{" "}
                <strong>
                  {weather.temperature == null
                    ? "an unavailable temperature"
                    : `${Math.round(weather.temperature)}°C`}
                </strong>
                {" "}with{" "}
                <strong>
                  {(weather.weatherCondition || "unknown").toLowerCase()}
                </strong>
                {" "}conditions. Humidity is{" "}
                <strong>
                  {weather.humidity == null
                    ? "unavailable"
                    : `${weather.humidity}%`}
                </strong>
                , and reported rainfall is{" "}
                <strong>
                  {weather.rainfall == null
                    ? "unavailable"
                    : `${weather.rainfall} mm`}
                </strong>
                .
              </p>

              <p className="insight-note">
                Summary based on the weather data returned by your service.
                Missing values are shown as unavailable.
              </p>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Dashboard;
