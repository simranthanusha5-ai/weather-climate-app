
import React, { useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import ForecastCard from "../components/ForecastCard";
import { getForecast } from "../services/api";

const formatDay = (date) => {
  if (!date) return "Forecast";

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) return "Forecast";

  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const Forecast = () => {
  const [cityName, setCityName] = useState("");
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (city) => {
    setError("");
    setLoading(true);

    try {
      const { data } = await getForecast(city);

      setCityName(
        [data.city, data.country].filter(Boolean).join(", ") || city
      );

      setForecast(
        Array.isArray(data.forecast) ? data.forecast : []
      );
    } catch (err) {
      setForecast([]);
      setCityName("");
      setError(
        err.response?.data?.message ||
          "Could not fetch forecast. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => {
    const validTemperatures = forecast
      .map((day) => Number(day.temperature))
      .filter((value, index) =>
        forecast[index]?.temperature != null && Number.isFinite(value)
      );

    const validRainfall = forecast
      .map((day) =>
        day.rainfall == null ? null : Number(day.rainfall)
      )
      .filter((value) => value !== null && Number.isFinite(value));

    return {
      highest:
        validTemperatures.length > 0
          ? Math.round(Math.max(...validTemperatures))
          : null,
      lowest:
        validTemperatures.length > 0
          ? Math.round(Math.min(...validTemperatures))
          : null,
      totalRain:
        validRainfall.length > 0
          ? validRainfall.reduce((total, value) => total + value, 0)
          : null,
      rainyDays: forecast.filter(
        (day) =>
          day.rainfall != null &&
          Number.isFinite(Number(day.rainfall)) &&
          Number(day.rainfall) > 0
      ).length,
    };
  }, [forecast]);

  return (
    <main className="weather-dashboard forecast-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            WEATHER INTELLIGENCE PLATFORM
          </p>

          <h1>5-Day Forecast</h1>

          <p className="dashboard-subtitle">
            Plan ahead with upcoming temperatures, precipitation and
            daily weather conditions.
          </p>
        </div>

        <div className="forecast-header-icon" aria-hidden="true">
          🌦️
        </div>
      </header>

      <section className="search-section">
        <div className="search-heading">
          <div>
            <h2>Explore a city</h2>
            <p>Search for a location to see its forecast.</p>
          </div>

          <span className="live-status">
            <span className="location-dot" />
            Forecast search
          </span>
        </div>

        <SearchBar onSearch={handleSearch} />
      </section>

      {loading && (
        <div className="dashboard-message loading-message" role="status">
          <div className="loading-spinner" />
          <div>
            <strong>Loading forecast...</strong>
            <p>Retrieving the latest forecast data.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="dashboard-message error-message" role="alert">
          <strong>Unable to load forecast</strong>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && forecast.length === 0 && (
        <section className="dashboard-empty forecast-empty">
          <div className="empty-icon">🌤️</div>

          <p className="dashboard-eyebrow">YOUR NEXT FIVE DAYS</p>

          <h2>Your forecast starts here</h2>

          <p>
            Search for a city to explore upcoming temperatures,
            rainfall estimates and daily conditions.
          </p>
        </section>
      )}

      {!loading && forecast.length > 0 && (
        <>
          <section className="forecast-location-banner">
            <div>
              <p className="dashboard-eyebrow">FORECAST LOCATION</p>
              <h2>📍 {cityName}</h2>
              <p>
                {forecast.length} forecast entries returned by your weather
                service.
              </p>
            </div>

            <div className="forecast-location-symbol" aria-hidden="true">
              ☁️
            </div>
          </section>

          <section className="forecast-summary-grid">
            <article className="weather-stat-card">
              <div className="stat-icon">🌡️</div>
              <div>
                <span>Highest temperature</span>
                <strong>
                  {summary.highest == null ? "—" : `${summary.highest}°C`}
                </strong>
              </div>
            </article>

            <article className="weather-stat-card">
              <div className="stat-icon">❄️</div>
              <div>
                <span>Lowest temperature</span>
                <strong>
                  {summary.lowest == null ? "—" : `${summary.lowest}°C`}
                </strong>
              </div>
            </article>

            <article className="weather-stat-card">
              <div className="stat-icon">🌧️</div>
              <div>
                <span>Reported forecast rainfall</span>
                <strong>
                  {summary.totalRain == null
                    ? "—"
                    : `${summary.totalRain.toFixed(1)} mm`}
                </strong>
              </div>
            </article>

            <article className="weather-stat-card">
              <div className="stat-icon">📅</div>
              <div>
                <span>Entries with rainfall</span>
                <strong>{summary.rainyDays}</strong>
              </div>
            </article>
          </section>

          <section className="forecast-results-section">
            <div className="analytics-heading">
              <div>
                <p className="dashboard-eyebrow">DAY-BY-DAY OUTLOOK</p>
                <h2>Upcoming conditions</h2>
                <p>
                  Forecast information supplied by your existing API.
                </p>
              </div>
            </div>

            <div className="forecast-grid forecast-card-grid">
              {forecast.map((day, index) => (
                <article
                  className="forecast-card"
                  key={`${day.date || "day"}-${index}`}
                >
                  <p className="forecast-date">
                    {formatDay(day.date)}
                  </p>

                  <div className="forecast-weather-icon">
                    {day.weatherCondition?.toLowerCase().includes("rain") ||
                    day.condition?.toLowerCase().includes("rain")
                      ? "🌧️"
                      : day.weatherCondition?.toLowerCase().includes("cloud") ||
                        day.condition?.toLowerCase().includes("cloud")
                      ? "☁️"
                      : day.weatherCondition?.toLowerCase().includes("clear") ||
                        day.condition?.toLowerCase().includes("clear")
                      ? "☀️"
                      : "🌤️"}
                  </div>

                  <ForecastCard day={day} />
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Forecast;
