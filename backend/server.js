const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const {
  updateOrderRating,
  updateOrderStatus,
  deleteOrder,
} = require("./controllers/orderController");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/orders", orderRoutes);
app.patch("/api/orders/:id/rating", updateOrderRating);
app.patch("/api/orders/:id", updateOrderStatus);
app.delete("/api/orders/:id", deleteOrder);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error("[Server Error]", error);

  res.status(500).json({
    success: false,
    message: "Order failed",
  });
});

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

void startServer();
