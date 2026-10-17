import React from "react";

const formatDay = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
};

// Renders one day's forecast as a small card. Used in a row/grid by the parent page.
const ForecastCard = ({ day }) => {
  return (
    <div className="forecast-card">
      <p className="forecast-day">{formatDay(day.date)}</p>
      <p className="forecast-temp">{Math.round(day.temperature)}°C</p>
      <p className="forecast-condition">{day.weatherCondition}</p>
      <div className="forecast-details">
        <span>💧 {day.humidity}%</span>
        <span>🌧 {day.rainfall} mm</span>
      </div>
    </div>
  );
};

export default ForecastCard;
