const mongoose = require("mongoose");
const Order = require("../models/Order");

const isProduction = process.env.NODE_ENV === "production";

function logServerError(message, error) {
  if (!isProduction) {
    console.error(message, error);
  }
}

function isValidObjectId(id) {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : NaN;
}

function normalizeProduct(product) {
  if (!product || typeof product !== "object") {
    return null;
  }

  const name = cleanText(product.name);
  const price = toNumber(product.price);
  const quantity = toNumber(product.quantity);

  if (!name || !Number.isFinite(price) || !Number.isFinite(quantity) || quantity < 1) {
    return null;
  }

  return { name, price, quantity };
}

function normalizeOrderPayload(body) {
  const name = cleanText(body.name || body.fullName);
  const phone = cleanText(body.phone);
  const address = cleanText(body.address);
  const city = cleanText(body.city);
  const paymentMethod = body.paymentMethod === "online" ? "online" : "cod";
  const total = toNumber(body.total ?? body.totalPrice);
  const ratingValue = body.rating == null || body.rating === "" ? null : toNumber(body.rating);
  const products = Array.isArray(body.products)
    ? body.products.map(normalizeProduct).filter(Boolean)
    : [];

  return {
    name,
    fullName: cleanText(body.fullName) || name,
    phone,
    address,
    city,
    paymentMethod,
    status: body.status === "delivered" ? "delivered" : "pending",
    rating: Number.isFinite(ratingValue) ? ratingValue : null,
    products,
    total,
    totalPrice: Number.isFinite(total) ? total : NaN,
  };
}

function serializeOrder(order) {
  return {
    id: String(order._id),
    name: order.name,
    fullName: order.fullName || order.name,
    phone: order.phone,
    address: order.address,
    city: order.city || "",
    paymentMethod: order.paymentMethod || "cod",
    status: order.status === "delivered" ? "delivered" : "pending",
    rating: order.rating == null ? null : Number(order.rating),
    products: Array.isArray(order.products)
      ? order.products.map((product) => ({
          name: product.name,
          price: Number(product.price),
          quantity: Number(product.quantity),
        }))
      : [],
    total: Number(order.total ?? order.totalPrice ?? 0),
    totalPrice: Number(order.totalPrice ?? order.total ?? 0),
    createdAt: order.createdAt ? new Date(order.createdAt) : null,
  };
}

async function createOrder(req, res) {
  try {
    const payload = normalizeOrderPayload(req.body || {});

    if (
      !payload.name ||
      !payload.phone ||
      !payload.address ||
      !Array.isArray(payload.products) ||
      payload.products.length === 0 ||
      !Number.isFinite(payload.total)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order payload",
      });
    }

    const order = await Order.create({
      name: payload.name,
      fullName: payload.fullName,
      phone: payload.phone,
      address: payload.address,
      city: payload.city,
      paymentMethod: payload.paymentMethod,
      status: payload.status,
      rating: payload.rating,
      products: payload.products,
      total: payload.total,
      totalPrice: payload.totalPrice,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      id: String(order._id),
    });
  } catch (error) {
    logServerError("[POST /api/orders] Order failed", error);

    return res.status(500).json({
      success: false,
      message: "Order failed",
    });
  }
}

async function updateOrderRating(req, res) {
  try {
    const { id } = req.params;
    const rating = toNumber(req.body?.rating);

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Invalid rating value",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { rating },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order: serializeOrder(updatedOrder),
    });
  } catch (error) {
    logServerError("[PATCH /api/orders/:id/rating] Order failed", error);

    return res.status(500).json({
      success: false,
      message: "Order failed",
    });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const nextStatus = req.body?.status === "delivered" ? "delivered" : "pending";

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: nextStatus },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order: serializeOrder(updatedOrder),
    });
  } catch (error) {
    logServerError("[PATCH /api/orders/:id] Order failed", error);

    return res.status(500).json({
      success: false,
      message: "Order failed",
    });
  }
}

async function deleteOrder(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const deletedOrder = await Order.findByIdAndDelete(id).lean();

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    logServerError("[DELETE /api/orders/:id] Order failed", error);

    return res.status(500).json({
      success: false,
      message: "Order failed",
    });
  }
}

async function getOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      orders: orders.map(serializeOrder),
    });
  } catch (error) {
    logServerError("[GET /api/orders] Failed to load orders", error);

    return res.status(500).json({
      success: false,
      message: "Order failed",
    });
  }
}

module.exports = {
  createOrder,
  updateOrderRating,
  updateOrderStatus,
  deleteOrder,
  getOrders,
};
