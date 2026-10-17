const express = require("express");
const router = express.Router();
const { addLocation, getLocations, deleteLocation } = require("../controllers/locationController");
const { protect } = require("../middleware/authMiddleware");

// All location routes require a logged-in user
router.post("/", protect, addLocation);
router.get("/", protect, getLocations);
router.delete("/:id", protect, deleteLocation);

module.exports = router;
