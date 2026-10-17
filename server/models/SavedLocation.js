const mongoose = require("mongoose");

const savedLocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent the same user from saving the exact same city twice
savedLocationSchema.index({ userId: 1, city: 1 }, { unique: true });

module.exports = mongoose.model("SavedLocation", savedLocationSchema);
