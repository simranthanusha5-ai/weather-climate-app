import axios from "axios";

// Central place for all API calls to our Express backend.
// The weather API key stays safely on the backend.

const api = axios.create({
        baseURL: "/api",
});

// Attach JWT token to every protected request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---- Auth ----

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const getProfile = () =>
  api.get("/auth/profile");

// ---- Weather ----

export const getCurrentWeather = (city) =>
  api.get(`/weather/current/${encodeURIComponent(city)}`);

export const getForecast = (city) =>
  api.get(`/weather/forecast/${encodeURIComponent(city)}`);

export const getHistory = (city) =>
  api.get(`/weather/history/${encodeURIComponent(city)}`);

// ---- Saved Locations ----

export const addLocation = (data) =>
  api.post("/locations", data);

export const getLocations = () =>
  api.get("/locations");

export const deleteLocation = (id) =>
  api.delete(`/locations/${id}`);

