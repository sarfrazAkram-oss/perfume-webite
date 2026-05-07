import { connectToDatabase } from "@/lib/server/mongoose";
import { Order } from "@/lib/server/order-model";

type OrderProduct = {
  name: string;
  price: number;
  quantity: number;
};

type NormalizedOrder = {
  name: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: "cod" | "online";
  status: "pending" | "delivered";
  rating: number | null;
  products: OrderProduct[];
  total: number;
  totalPrice: number;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : NaN;
}

function normalizeProduct(product: unknown): OrderProduct | null {
  if (!product || typeof product !== "object") {
    return null;
  }

  const record = product as Record<string, unknown>;
  const name = cleanText(record.name);
  const price = toNumber(record.price);
  const quantity = toNumber(record.quantity);

  if (!name || !Number.isFinite(price) || !Number.isFinite(quantity) || quantity < 1) {
    return null;
  }

  return { name, price, quantity };
}

export function normalizeOrderPayload(body: Record<string, unknown>): NormalizedOrder {
  const name = cleanText(body.name || body.fullName);
  const phone = cleanText(body.phone);
  const address = cleanText(body.address);
  const city = cleanText(body.city);
  const paymentMethod = body.paymentMethod === "online" ? "online" : "cod";
  const total = toNumber(body.total ?? body.totalPrice);
  const ratingValue = body.rating == null || body.rating === "" ? null : toNumber(body.rating);
  const products = Array.isArray(body.products)
    ? body.products.map(normalizeProduct).filter((product): product is OrderProduct => Boolean(product))
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

export function serializeOrder(order: Record<string, unknown>) {
  return {
    id: String(order._id ?? order.id ?? ""),
    name: typeof order.name === "string" ? order.name : "",
    fullName: typeof order.fullName === "string" ? order.fullName : typeof order.name === "string" ? order.name : "",
    phone: typeof order.phone === "string" ? order.phone : "",
    address: typeof order.address === "string" ? order.address : "",
    city: typeof order.city === "string" ? order.city : "",
    paymentMethod: order.paymentMethod === "online" ? "online" : "cod",
    status: order.status === "delivered" ? "delivered" : "pending",
    rating: order.rating == null ? null : Number(order.rating),
    products: Array.isArray(order.products)
      ? order.products.map((product) => ({
          name: cleanText((product as Record<string, unknown>).name),
          price: Number((product as Record<string, unknown>).price ?? 0),
          quantity: Number((product as Record<string, unknown>).quantity ?? 0),
        }))
      : [],
    total: Number(order.total ?? order.totalPrice ?? 0),
    totalPrice: Number(order.totalPrice ?? order.total ?? 0),
    createdAt: order.createdAt ? new Date(order.createdAt as string | number | Date) : null,
  };
}

export async function listOrders() {
  await connectToDatabase();
  return Order.find().sort({ createdAt: -1 }).lean();
}

export async function createOrderRecord(body: Record<string, unknown>) {
  await connectToDatabase();

  const payload = normalizeOrderPayload(body);

  if (
    !payload.name ||
    !payload.phone ||
    !payload.address ||
    !Array.isArray(payload.products) ||
    payload.products.length === 0 ||
    !Number.isFinite(payload.total)
  ) {
    const error = new Error("Order failed");
    throw error;
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

  return order.toObject();
}

export async function updateOrderRating(orderId: string, rating: number) {
  await connectToDatabase();
  return Order.findByIdAndUpdate(orderId, { rating }, { new: true, runValidators: true }).lean();
}

export async function updateOrderStatus(orderId: string, status: "pending" | "delivered") {
  await connectToDatabase();
  return Order.findByIdAndUpdate(orderId, { status }, { new: true, runValidators: true }).lean();
}

export async function removeOrder(orderId: string) {
  await connectToDatabase();
  return Order.findByIdAndDelete(orderId).lean();
}
