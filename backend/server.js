const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isLocalDevelopmentOrigin(origin) {
  if (!origin || isProduction) {
    return false;
  }

  try {
    const parsedOrigin = new URL(origin);
    return ["localhost", "127.0.0.1", "::1"].includes(parsedOrigin.hostname);
  } catch {
    return false;
  }
}

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || isLocalDevelopmentOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : mongoose.connection.readyState === 2
          ? "connecting"
          : "disconnected",
  });
});

app.use("/api/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  if (!isProduction) {
    console.error("[Server Error]", error);
  }

  const statusCode = Number.isInteger(error?.statusCode)
    ? error.statusCode
    : Number.isInteger(error?.status)
      ? error.status
      : 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : error.message || "Request failed",
  });
});

let server;

async function startServer() {
  try {
    await connectDB();

    server = app.listen(PORT, "0.0.0.0", () => {
      if (!isProduction) {
        console.log(`Server running on port ${PORT}`);
      }
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

function shutdown(signal) {
  if (!isProduction) {
    console.log(`Received ${signal}, shutting down gracefully`);
  }

  if (!server) {
    process.exit(0);
    return;
  }

  server.close((error) => {
    if (error) {
      console.error("Failed to close server cleanly", error);
      process.exit(1);
      return;
    }

    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

void startServer();
