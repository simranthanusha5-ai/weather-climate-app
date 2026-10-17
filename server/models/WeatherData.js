const mongoose = require("mongoose");

// This collection stores a REAL snapshot every time a user looks up a city.
// Over time this becomes genuine historical data collected by the app itself,
// which is how we honestly provide "historical climate trends" without
// fabricating data or relying on a paid historical weather API.
const weatherDataSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  temperature: Number,
  humidity: Number,
  windSpeed: Number,
  rainfall: Number,
  weatherCondition: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

weatherDataSchema.index({ city: 1, date: 1 });

module.exports = mongoose.model("WeatherData", weatherDataSchema);
