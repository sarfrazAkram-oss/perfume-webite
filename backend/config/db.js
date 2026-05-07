const mongoose = require("mongoose");

let connectionPromise = null;

async function connectDB() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

  if (!mongoUri) {
    throw new Error("Missing MongoDB connection string. Set MONGO_URI for the backend deployment.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    return connectionPromise || mongoose.connection.asPromise();
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  await connectionPromise;

  connectionPromise = null;

  return mongoose.connection;
}

module.exports = connectDB;
