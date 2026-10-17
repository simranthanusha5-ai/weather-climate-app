import React from "react";

// Displays the current weather for one location.
// All values come from the backend - nothing here is hardcoded.
const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="weather-card">
      <div className="weather-card-main">
        <div>
          <h2>
            {weather.city}
            {weather.country ? `, ${weather.country}` : ""}
          </h2>
          <p className="weather-condition">{weather.weatherCondition}</p>
          {weather.description && <p className="weather-description">{weather.description}</p>}
        </div>
        <div className="weather-temp">{Math.round(weather.temperature)}°C</div>
      </div>

      <div className="weather-stats-grid">
        <div className="stat-box">
          <span className="stat-label">Feels Like</span>
          <span className="stat-value">
            {weather.feelsLike !== undefined ? `${Math.round(weather.feelsLike)}°C` : "N/A"}
          </span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Humidity</span>
          <span className="stat-value">{weather.humidity}%</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Wind</span>
          <span className="stat-value">{weather.windSpeed} m/s</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Rainfall</span>
          <span className="stat-value">{weather.rainfall} mm</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
