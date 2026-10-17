const SavedLocation = require("../models/SavedLocation");

// @route   POST /api/locations
// @access  Private
const addLocation = async (req, res) => {
  try {
    const { city, country } = req.body;

    if (!city || !city.trim()) {
      return res.status(400).json({ message: "City name is required." });
    }

    const location = await SavedLocation.create({
      userId: req.user._id,
      city: city.trim(),
      country: country?.trim() || "",
    });

    res.status(201).json(location);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "This location is already saved." });
    }
    res.status(500).json({ message: "Failed to save location.", error: error.message });
  }
};

// @route   GET /api/locations
// @access  Private
const getLocations = async (req, res) => {
  try {
    const locations = await SavedLocation.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch saved locations." });
  }
};

// @route   DELETE /api/locations/:id
// @access  Private
const deleteLocation = async (req, res) => {
  try {
    const location = await SavedLocation.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ message: "Location not found." });
    }

    // Make sure users can only delete their own saved locations
    if (location.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this location." });
    }

    await location.deleteOne();
    res.json({ message: "Location removed." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete location." });
  }
};

module.exports = { addLocation, getLocations, deleteLocation };
