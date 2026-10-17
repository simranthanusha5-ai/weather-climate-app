
const axios = require("axios");
const WeatherData = require("../models/WeatherData");

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// @route   GET /api/weather/current/:city
// @access  Public
const getCurrentWeather = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city || !city.trim()) {
      return res.status(400).json({
        message: "Please provide a city name.",
      });
    }

    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const data = response.data;

    const weatherResult = {
      city: data.name,
      country: data.sys?.country || "",
      temperature: data.main?.temp,
      feelsLike: data.main?.feels_like,
      humidity: data.main?.humidity,
      windSpeed: data.wind?.speed,
      rainfall: data.rain?.["1h"] ?? 0,
      weatherCondition: data.weather?.[0]?.main || "Unknown",
      description: data.weather?.[0]?.description || "",
      icon: data.weather?.[0]?.icon || "",
    };

    // Save a snapshot for historical weather tracking.
    try {
      await WeatherData.create({
        city: weatherResult.city,
        country: weatherResult.country,
        temperature: weatherResult.temperature,
        humidity: weatherResult.humidity,
        windSpeed: weatherResult.windSpeed,
        rainfall: weatherResult.rainfall,
        weatherCondition: weatherResult.weatherCondition,
      });
    } catch (dbError) {
      console.error(
        "Failed to save weather snapshot:",
        dbError.message
      );
    }

    return res.json(weatherResult);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "City not found. Please check the location name.",
      });
    }

    console.error("Current weather fetch error:", error.message);

    return res.status(500).json({
      message:
        "Unable to fetch weather data right now. Please try again later.",
    });
  }
};

// @route   GET /api/weather/forecast/:city
// @access  Public
// Uses OpenWeatherMap's 5-day / 3-hour forecast endpoint.
const getForecast = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city || !city.trim()) {
      return res.status(400).json({
        message: "Please provide a city name.",
      });
    }

    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const list = response.data.list || [];

    // Group forecast entries by calendar date.
    const dailyMap = {};

    list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
      const hour = entry.dt_txt.split(" ")[1];

      // Prefer the midday forecast as the representative reading.
      if (
        !dailyMap[date] ||
        hour === "12:00:00"
      ) {
        dailyMap[date] = entry;
      }
    });

    const forecast = Object.keys(dailyMap)
      .slice(0, 5)
      .map((date) => {
        const entry = dailyMap[date];

        // Get all available forecast periods for this date.
        const dailyEntries = list.filter(
          (item) => item.dt_txt.split(" ")[0] === date
        );

        // Sum the reported 3-hour rainfall amounts.
        const rainfall = dailyEntries.reduce(
          (total, item) =>
            total + Number(item.rain?.["3h"] ?? 0),
          0
        );

        return {
          date,
          temperature: entry.main?.temp,
          humidity: entry.main?.humidity,
          rainfall: Number(rainfall.toFixed(2)),
          weatherCondition:
            entry.weather?.[0]?.main || "Unknown",
          description:
            entry.weather?.[0]?.description || "",
          icon: entry.weather?.[0]?.icon || "",
        };
      });

    return res.json({
      city: response.data.city?.name,
      country: response.data.city?.country,
      forecast,
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "City not found. Please check the location name.",
      });
    }

    console.error("Forecast fetch error:", error.message);

    return res.status(500).json({
      message:
        "Unable to fetch forecast data right now. Please try again later.",
    });
  }
};

// @route   GET /api/weather/history/:city
// @access  Public
// Returns real weather snapshots collected by this application.
const getHistory = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city || !city.trim()) {
      return res.status(400).json({
        message: "Please provide a city name.",
      });
    }

    const records = await WeatherData.find({
      city: {
        $regex: new RegExp(`^${city}$`, "i"),
      },
    })
      .sort({ date: 1 })
      .limit(500);

    return res.json({
      city,
      count: records.length,
      note:
        records.length === 0
          ? "No historical data collected yet for this city. Search this city a few times (ideally on different days) to build up real trend data."
          : undefined,
      records,
    });
  } catch (error) {
    console.error("History fetch error:", error.message);

    return res.status(500).json({
      message:
        "Unable to fetch historical data right now.",
    });
  }
};

module.exports = {
  getCurrentWeather,
  getForecast,
  getHistory,
};
