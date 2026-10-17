const mongoose = require("mongoose");

// Connects to MongoDB using the URI stored in .env
// If the connection fails, we log a clear error and exit,
// rather than letting the server run in a broken state.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
