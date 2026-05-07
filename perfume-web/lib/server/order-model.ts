import mongoose, { type Model } from "mongoose";

const orderProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    status: {
      type: String,
      enum: ["pending", "delivered"],
      default: "pending",
    },
    rating: {
      type: Number,
      default: null,
      min: 1,
      max: 5,
    },
    products: {
      type: [orderProductSchema],
      required: true,
      validate: {
        validator: (products: unknown[]) => Array.isArray(products) && products.length > 0,
        message: "Order must include at least one product.",
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

type OrderModel = Model<{
  name: string;
  fullName?: string;
  phone: string;
  address: string;
  city?: string;
  paymentMethod?: "cod" | "online";
  status?: "pending" | "delivered";
  rating?: number | null;
  products: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  totalPrice?: number;
  createdAt?: Date;
}>;

export const Order: OrderModel = (mongoose.models.Order as OrderModel) || mongoose.model("Order", orderSchema);
