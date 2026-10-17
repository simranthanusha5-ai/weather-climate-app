
import React, { useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import WeatherChart from "../components/WeatherChart";
import { getHistory } from "../services/api";

const formatLabel = (dateStr) => {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const Historical = () => {
  const [city, setCity] = useState("");
  const [records, setRecords] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (searchCity) => {
    setError("");
    setLoading(true);
    setCity(searchCity);
    setRecords([]);
    setNote("");

    try {
      const { data } = await getHistory(searchCity);

      setRecords(Array.isArray(data.records) ? data.records : []);
      setNote(data.note || "");
    } catch (err) {
      setRecords([]);
      setError(
        err.response?.data?.message ||
          "Could not fetch historical data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const tempData = records.map((record) => ({
    label: formatLabel(record.date),
    temperature:
      record.temperature == null ? null : Number(record.temperature),
  }));

  const rainData = records.map((record) => ({
    label: formatLabel(record.date),
    rainfall:
      record.rainfall == null ? null : Number(record.rainfall),
  }));

  const humidityData = records.map((record) => ({
    label: formatLabel(record.date),
    humidity:
      record.humidity == null ? null : Number(record.humidity),
  }));

  const stats = useMemo(() => {
    const temperatures = records
      .filter((record) => record.temperature != null)
      .map((record) => Number(record.temperature))
      .filter(Number.isFinite);

    const rainfall = records
      .filter((record) => record.rainfall != null)
      .map((record) => Number(record.rainfall))
      .filter(Number.isFinite);

    const humidity = records
      .filter((record) => record.humidity != null)
      .map((record) => Number(record.humidity))
      .filter(Number.isFinite);

    return {
      highest:
        temperatures.length > 0
          ? `${Math.max(...temperatures).toFixed(1)}°C`
          : "—",
      average:
        temperatures.length > 0
          ? `${(
              temperatures.reduce((sum, value) => sum + value, 0) /
              temperatures.length
            ).toFixed(1)}°C`
          : "—",
      averageHumidity:
        humidity.length > 0
          ? `${(
              humidity.reduce((sum, value) => sum + value, 0) /
              humidity.length
            ).toFixed(0)}%`
          : "—",
      totalRainfall:
        rainfall.length > 0
          ? `${rainfall.reduce((sum, value) => sum + value, 0).toFixed(1)} mm`
          : "—",
    };
  }, [records]);

  return (
    <main className="weather-dashboard history-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            CLIMATE DATA INTELLIGENCE
          </p>

          <h1>Historical Climate Analysis</h1>

          <p className="dashboard-subtitle">
            Explore recorded weather observations and analyze temperature,
            rainfall, and humidity patterns for a selected city.
          </p>
        </div>

        <div className="history-header-icon" aria-hidden="true">
          📈
        </div>
      </header>

      <section className="search-section">
        <div className="search-heading">
          <div>
            <h2>Choose a location</h2>
            <p>Search for a city with historical records in your application.</p>
          </div>

          <span className="live-status">
            <span className="location-dot" />
            Historical records
          </span>
        </div>

        <SearchBar onSearch={handleSearch} />
      </section>

      {loading && (
        <div className="dashboard-message loading-message" role="status">
          <div className="loading-spinner" />
          <div>
            <strong>Loading climate records...</strong>
            <p>Retrieving available observations for {city}.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="dashboard-message error-message" role="alert">
          <strong>Unable to load climate records</strong>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && !city && (
        <section className="dashboard-empty">
          <div className="empty-icon">📊</div>

          <p className="dashboard-eyebrow">DISCOVER CLIMATE PATTERNS</p>

          <h2>Your historical insights start here</h2>

          <p>
            Search for a city to explore recorded observations and available
            climate trends from your application's stored data.
          </p>
        </section>
      )}

      {!loading && city && (
        <>
          <section className="history-location-banner">
            <div>
              <p className="dashboard-eyebrow">SELECTED LOCATION</p>
              <h2>📍 {city}</h2>
              <p>
                {records.length} recorded{" "}
                {records.length === 1 ? "observation" : "observations"}
              </p>
            </div>

            <div className="history-header-icon" aria-hidden="true">
              🌍
            </div>
          </section>

          {note && (
            <div className="history-data-note">
              <span>ⓘ</span>
              <p>{note}</p>
            </div>
          )}

          {records.length > 0 ? (
            <>
              <section className="history-stats-grid">
                <article className="weather-stat-card">
                  <div className="stat-icon">🌡️</div>
                  <div>
                    <span>Highest recorded temperature</span>
                    <strong>{stats.highest}</strong>
                  </div>
                </article>

                <article className="weather-stat-card">
                  <div className="stat-icon">📊</div>
                  <div>
                    <span>Average recorded temperature</span>
                    <strong>{stats.average}</strong>
                  </div>
                </article>

                <article className="weather-stat-card">
                  <div className="stat-icon">💧</div>
                  <div>
                    <span>Average recorded humidity</span>
                    <strong>{stats.averageHumidity}</strong>
                  </div>
                </article>

                <article className="weather-stat-card">
                  <div className="stat-icon">🌧️</div>
                  <div>
                    <span>Total recorded rainfall</span>
                    <strong>{stats.totalRainfall}</strong>
                  </div>
                </article>
              </section>

              <section className="history-charts-section">
                <div className="analytics-heading">
                  <div>
                    <p className="dashboard-eyebrow">DATA VISUALIZATION</p>
                    <h2>Climate trends</h2>
                    <p>
                      Charts are based on available records returned by your
                      history service.
                    </p>
                  </div>
                </div>

                <div className="chart-grid history-chart-grid">
                  <div className="chart-panel">
                    <WeatherChart
                      title="Temperature Trend"
                      type="line"
                      data={tempData}
                      dataKey="temperature"
                      color="#fb7185"
                      unit="°C"
                    />
                  </div>

                  <div className="chart-panel">
                    <WeatherChart
                      title="Rainfall Trend"
                      type="bar"
                      data={rainData}
                      dataKey="rainfall"
                      color="#38bdf8"
                      unit=" mm"
                    />
                  </div>

                  <div className="chart-panel">
                    <WeatherChart
                      title="Humidity Trend"
                      type="line"
                      data={humidityData}
                      dataKey="humidity"
                      color="#2dd4bf"
                      unit="%"
                    />
                  </div>
                </div>
              </section>
            </>
          ) : (
            !loading && (
              <section className="dashboard-empty history-no-data">
                <div className="empty-icon">🗂️</div>
                <h2>No historical records available yet</h2>
                <p>
                  Your history service did not return recorded observations
                  for this city. Search another city or collect more data
                  before drawing climate conclusions.
                </p>
              </section>
            )
          )}
        </>
      )}
    </main>
  );
};

export default Historical;
