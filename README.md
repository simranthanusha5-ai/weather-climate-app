# Centralized Weather and Climate Data Visualization System

A full-stack MERN application that brings current weather, 5-day forecasts,
historical climate trends, and saved locations into one dashboard.

## Tech Stack
- **Frontend:** React (Vite), React Router, Recharts, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcryptjs password hashing
- **Weather Data:** OpenWeatherMap API (free tier)

---

## 1. Prerequisites
- Node.js (LTS) installed — check with `node -v`
- A MongoDB connection string (MongoDB Atlas free tier, or local MongoDB)
- A free OpenWeatherMap API key: https://home.openweathermap.org/users/sign_up
  (After signing up, get your key from "My API Keys" — it can take up to a
  couple of hours to activate.)

## 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and fill in your real values:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
WEATHER_API_KEY=your_openweathermap_api_key
CLIENT_URL=http://localhost:5173
```

Run the backend:

```bash
npm run dev
```

You should see:
```
MongoDB connected: ...
Server running on port 5000
```

Test it's alive by visiting http://localhost:5000 in your browser —
you should see `{"message":"Weather & Climate API is running."}`.

## 3. Frontend Setup

Open a **second terminal** (keep the backend running):

```bash
cd client
npm install
npm run dev
```

Vite will print a local URL, typically **http://localhost:5173**.
Open it in your browser.

## 4. Using the App
1. Register a new account.
2. You'll land on the Dashboard — search a city (e.g. "Chennai").
3. Check the Forecast and Climate History pages from the navbar.
4. Save locations from the Dashboard, manage them under "Saved Locations".

---

## Project Architecture

```
USER → React Frontend (Vite, port 5173)
         │  (Axios calls, JWT in headers)
         ▼
Express + Node.js Backend (port 5000)
         │
         ├──► OpenWeatherMap API (current + forecast data)
         └──► MongoDB (Users, SavedLocations, WeatherData snapshots)
```

## Important Honest Limitation: Historical Data

OpenWeatherMap's **free tier does not include multi-year historical climate
data**. Rather than fabricate historical values (which the project brief
explicitly forbids), this app takes a technically valid approach:

**Every time a user searches a city, the real current weather snapshot is
saved to the `WeatherData` collection in MongoDB** (see
`weatherController.js` → `getCurrentWeather`). The "Climate History" page
reads back these real, accumulated snapshots and charts them.

This means:
- Historical charts are empty or sparse at first — this is expected and
  correct, not a bug.
- The more the app is used (or if you write a small script to search the
  same cities daily), the more genuine historical trend data builds up.
- This is a legitimate, defensible design decision to explain in your
  project review: **"We generate our own historical dataset by persisting
  real API responses over time, rather than relying on a paid historical
  data API or fabricating data."**

If you want richer historical data immediately for a demo, you could write
a small seed script that calls `getCurrentWeather` for a few cities once a
day for a couple of weeks before your review — using real data each time.

---

## Project Review Q&A (Quick Reference)

**1. What is your project?**
A centralized MERN web app that visualizes current weather, forecasts, and
historical climate trends for any location in one dashboard.

**2. What problem are you solving?**
Weather agencies and users need a single place to view multiple weather
parameters together instead of checking separate tools for temperature,
rainfall, wind, humidity, and historical trends.

**3. What is the existing system?**
Most weather apps show current conditions and short forecasts, but rarely
combine current + forecast + historical trend visualization with
user-specific saved locations in one clean dashboard.

**4. What is the proposed system?**
A MERN application with authenticated users, live weather data via API,
interactive charts (Recharts), and a self-built historical dataset stored
in MongoDB.

**5. Why MERN?**
MongoDB, Express, React, and Node all use JavaScript end-to-end, which
simplifies development, uses JSON naturally across the stack, and is
well-suited to a data-driven, API-integrated dashboard like this.

**6. Why MongoDB specifically?**
Weather data is naturally document-shaped (varying fields, nested objects)
and we need flexible, fast writes for frequent weather snapshots — a good
fit for MongoDB's schema flexibility.

**7. Why React?**
Component reusability (WeatherCard, ForecastCard, WeatherChart are reused
across pages) and efficient re-rendering when weather data changes.

**8. Why Node.js + Express?**
Non-blocking I/O is well suited to an app that spends most of its time
waiting on external API calls (OpenWeatherMap) and database queries.

**9. How does the system work end-to-end?**
User logs in (JWT issued) → searches a city → React calls our Express
API → Express calls OpenWeatherMap and also saves a snapshot to MongoDB →
processed data returns to React → rendered as cards and Recharts charts.

**10. What data is stored in MongoDB?**
Users (hashed passwords only), SavedLocations (per-user favorite cities),
and WeatherData (real snapshots collected over time for historical trends).

**11. What are the security measures?**
bcrypt password hashing, JWT-based route protection, environment variables
for secrets, CORS restricted to the frontend origin, and no API keys ever
exposed to the browser (weather API calls happen server-side only).

**12. What are the limitations?**
Free-tier weather API limits; historical data is self-collected over time
rather than pulled from a paid historical dataset (see section above).

**13. What are future enhancements?**
Multi-year historical data via a paid API tier, weather alerts/notifications,
map-based visualization, and unit preference (°C/°F) settings.

---

## Folder Structure

```
weather-climate-app/
├── server/          Express backend
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
└── client/          React frontend (Vite)
    └── src/
        ├── components/
        ├── pages/
        ├── context/
        └── services/
```
