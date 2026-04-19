const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in .env");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
    return mongoose.connection;
  } catch (error) {
    console.warn("MongoDB connection failed, starting API with local fallback store.");
    console.warn(error instanceof Error ? error.message : error);
    return null;
  }
}

module.exports = connectDB;
