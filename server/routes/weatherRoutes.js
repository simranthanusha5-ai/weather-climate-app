const express = require("express");
const router = express.Router();
const { getCurrentWeather, getForecast, getHistory } = require("../controllers/weatherController");

// Weather routes are public - anyone can check the weather without logging in.
// Only saving locations requires an account.
router.get("/current/:city", getCurrentWeather);
router.get("/forecast/:city", getForecast);
router.get("/history/:city", getHistory);

module.exports = router;
