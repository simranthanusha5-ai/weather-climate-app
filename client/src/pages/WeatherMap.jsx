
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCurrentWeather } from "../services/api";

const DEFAULT_CENTER = [20.5937, 78.9629];

const cityIcon = new L.DivIcon({
  className: "weather-map-marker",
  html: '<div class="weather-marker-dot">☁</div>',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -18],
});

function MapController({ target }) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lon], 10, {
        duration: 0.8,
      });
    }
  }, [target, map]);

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function WeatherMap() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState({
    name: "India",
    lat: DEFAULT_CENTER[0],
    lon: DEFAULT_CENTER[1],
  });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapStyle, setMapStyle] = useState("standard");

  // Both styles use free OpenStreetMap tiles.
  const tileUrls = {
    standard:
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark:
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  };

  const fetchWeather = async (city) => {
    if (!city) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await getCurrentWeather(city);
      const data = response?.data ?? response;

      const current =
        data?.current ??
        data?.weather ??
        data?.data?.current ??
        data?.data?.weather ??
        data?.data ??
        data;

      setWeather({
        temperature:
          current?.temperature ??
          current?.temp ??
          current?.main?.temp ??
          current?.current?.temperature_2m,
        condition:
          current?.condition ??
          current?.weatherCondition ??
          current?.description ??
          current?.weather?.[0]?.description ??
          current?.weather?.[0]?.main ??
          "Current conditions",
        humidity:
          current?.humidity ?? current?.main?.humidity,
        wind:
          current?.windSpeed ??
          current?.wind_speed ??
          current?.wind?.speed ??
          current?.current?.wind_speed_10m,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Couldn't load weather for this location. Try another city."
      );
    } finally {
      setLoading(false);
    }
  };

  const searchCity = async (event) => {
    event.preventDefault();

    const city = query.trim();
    if (!city) return;

    setError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        throw new Error("Location search failed");
      }

      const results = await response.json();

      if (!results.length) {
        setError("City not found. Try another name.");
        return;
      }

      const result = results[0];

      const next = {
        name: result.display_name.split(",")[0],
        lat: Number(result.lat),
        lon: Number(result.lon),
      };

      setLocation(next);
      await fetchWeather(next.name);
    } catch {
      setError(
        "Couldn't find that city. Check your connection and try again."
      );
    }
  };

  const pickMapLocation = async (lat, lon) => {
    setError("");
    setLoading(true);
    setWeather(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );

      if (!response.ok) {
        throw new Error("Location lookup failed");
      }

      const result = await response.json();
      const address = result.address || {};

      const city =
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        address.state ||
        "Selected location";

      setLocation({ name: city, lat, lon });
      setQuery(city);

      await fetchWeather(city);
    } catch {
      setLocation({
        name: "Selected location",
        lat,
        lon,
      });

      setError(
        "Couldn't identify this spot. Try searching for a city instead."
      );
      setLoading(false);
    }
  };

  const temperature = weather?.temperature;

  return (
    <main className="weather-map-page">
      <header className="weather-map-heading">
        <div>
          <p className="weather-map-eyebrow">EXPLORE THE WORLD</p>
          <h1>Interactive Weather Map</h1>
          <p className="weather-map-subtitle">
            Search for a city or click anywhere on the map to explore its weather.
          </p>
        </div>

        <div className="weather-map-heading-icon">🌍</div>
      </header>

      <form
        className="weather-map-search"
        onSubmit={searchCity}
      >
        <span aria-hidden="true">⌕</span>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a city, e.g. Chennai"
          aria-label="Search city"
        />

        <button
          type="submit"
          disabled={!query.trim() || loading}
        >
          {loading ? "Loading..." : "Find city"}
        </button>
      </form>

      {error && (
        <div className="weather-map-error" role="alert">
          {error}
        </div>
      )}

      <section className="weather-map-layout">
        <div className="weather-map-frame">
          <div className="weather-map-toolbar">
            <span>
              <span className="weather-map-live-dot" /> Interactive map
            </span>

            <label>
              Map style
              <select
                value={mapStyle}
                onChange={(event) => setMapStyle(event.target.value)}
              >
                <option value="standard">Standard</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>

          <MapContainer
            center={DEFAULT_CENTER}
            zoom={4}
            scrollWheelZoom={true}
            className="weather-leaflet-map"
          >
            <MapController target={location} />

            <MapClickHandler onPick={pickMapLocation} />

            <TileLayer
              key={mapStyle}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={tileUrls[mapStyle]}
            />

            <Marker
              position={[location.lat, location.lon]}
              icon={cityIcon}
            >
              <Popup>
                <strong>{location.name}</strong>
                <br />
                {temperature != null
                  ? `${temperature}° temperature`
                  : "Selected location"}
              </Popup>
            </Marker>
          </MapContainer>

          <p className="weather-map-hint">
            Tip: click any point on the map to look up its nearest named location.
          </p>
        </div>

        <aside className="weather-map-details">
          <div className="weather-map-details-top">
            <span className="weather-map-location-icon">📍</span>

            <div>
              <p>SELECTED LOCATION</p>
              <h2>{location.name}</h2>
              <small>
                {location.lat.toFixed(3)}, {location.lon.toFixed(3)}
              </small>
            </div>
          </div>

          <div className="weather-map-weather">
            <p className="weather-map-section-label">
              CURRENT WEATHER
            </p>

            {loading ? (
              <div className="weather-map-empty">
                Loading weather data...
              </div>
            ) : weather ? (
              <>
                <div className="weather-map-temperature">
                  {temperature != null ? `${temperature}°` : "—"}
                  <span>Temperature</span>
                </div>

                <p className="weather-map-condition">
                  {weather.condition}
                </p>

                <div className="weather-map-metrics">
                  <div>
                    <span>💧</span>
                    <small>Humidity</small>
                    <strong>
                      {weather.humidity != null
                        ? `${weather.humidity}%`
                        : "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>💨</span>
                    <small>Wind speed</small>
                    <strong>
                      {weather.wind != null
                        ? `${weather.wind} ${
                            Number(weather.wind) < 30 ? "m/s" : ""
                          }`
                        : "N/A"}
                    </strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="weather-map-empty">
                Search for a city to load its current weather.
              </div>
            )}
          </div>

          <button
            type="button"
            className="weather-map-refresh"
            onClick={() => fetchWeather(location.name)}
            disabled={
              loading ||
              location.name === "India" ||
              location.name === "Selected location"
            }
          >
            ↻ Refresh weather
          </button>

          <p className="weather-map-disclaimer">
            Weather details are retrieved from your project's existing weather API.
            Map tiles and location lookup are provided separately.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default WeatherMap;
