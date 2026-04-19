
export interface OrderProduct {
  name: string;
  price: number;
  quantity: number;
}

export interface CreateOrderInput {
  fullName: string;
  city: string;
  address: string;
  phone: string;
  paymentMethod: "cod" | "online";
  products: OrderProduct[];
  totalPrice: number;
}

export interface StoredOrder extends CreateOrderInput {
  id: string;
  createdAt: Date | null;
  name?: string;
  total?: number;
  status?: "pending" | "delivered";
  rating?: number | null;
}

export interface CreateOrderResult {
  id: string;
  storage: "mongodb";
}

export type OrdersListenerCallbacks = {
  onData: (orders: StoredOrder[]) => void;
  onError?: (error: Error) => void;
};

type BackendOrderResponse = {
  success?: boolean;
  message?: string;
  id?: string;
  orders?: unknown[];
  order?: unknown;
};

const ORDERS_API_BASE_URL =
  process.env.NEXT_PUBLIC_ORDERS_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

const ORDERS_ENDPOINT = `${ORDERS_API_BASE_URL}/api/orders`;

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : NaN;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function safeParseDate(value: unknown) {
  if (typeof value !== "string" && !(value instanceof Date)) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

async function readResponseBody(response: Response): Promise<BackendOrderResponse | null> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as BackendOrderResponse;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as BackendOrderResponse;
  } catch {
    return { success: response.ok, message: text };
  }
}

function formatFailureMessage(action: "read" | "write") {
  return action === "write" ? "Order failed, try again" : "Failed to load orders, try again";
}

export function describeFirebaseOrderError(error: unknown, action: "read" | "write") {
  if (error instanceof Error && error.message) {
    if (action === "write") {
      return formatFailureMessage(action);
    }

    return error.message;
  }

  return formatFailureMessage(action);
}

function mapOrderToStoredOrder(order: Record<string, unknown>): StoredOrder | null {
  const id = typeof order.id === "string" ? order.id : String(order._id || "");

  if (!id) {
    return null;
  }

  const products = Array.isArray(order.products)
    ? order.products
        .map((item) => {
          if (!isRecord(item)) {
            return null;
          }

          const productName = cleanText(item.name);
          const price = toNumber(item.price);
          const quantity = toNumber(item.quantity);

          if (!productName || !Number.isFinite(price) || !Number.isFinite(quantity)) {
            return null;
          }

          return {
            name: productName,
            price,
            quantity,
          };
        })
        .filter((item): item is OrderProduct => Boolean(item))
    : [];

  return {
    id,
    name: typeof order.name === "string" ? order.name : undefined,
    fullName: typeof order.fullName === "string" ? order.fullName : cleanText(order.name),
    city: typeof order.city === "string" ? order.city : "",
    address: typeof order.address === "string" ? order.address : "",
    phone: typeof order.phone === "string" ? order.phone : "",
    paymentMethod: order.paymentMethod === "online" ? "online" : "cod",
    status: order.status === "delivered" ? "delivered" : "pending",
    rating:
      order.rating == null || order.rating === ""
        ? null
        : Math.min(5, Math.max(1, Math.round(Number(order.rating)))),
    products,
    total: toNumber(order.total ?? order.totalPrice),
    totalPrice: toNumber(order.totalPrice ?? order.total),
    createdAt: safeParseDate(order.createdAt),
  };
}

async function sendJsonRequest(path: string, method: "PATCH" | "DELETE", body?: unknown) {
  const response = await fetch(`${ORDERS_API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await readResponseBody(response);

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Order failed, try again");
  }

  return data;
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  if (!input.products.length) {
    throw new Error("Order must include at least one product.");
  }

  const orderData = {
    name: input.fullName.trim(),
    fullName: input.fullName.trim(),
    city: input.city.trim(),
    address: input.address.trim(),
    phone: input.phone.trim(),
    paymentMethod: input.paymentMethod,
    products: input.products.map((item) => ({
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
    })),
    total: Number(input.totalPrice),
    totalPrice: Number(input.totalPrice),
  };

  try {
    const response = await fetch(ORDERS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const data = await readResponseBody(response);

    if (!response.ok || !data?.success) {
      throw new Error(data?.message || formatFailureMessage("write"));
    }

    return {
      id: data.id || "",
      storage: "mongodb",
    };
  } catch (error) {
    console.error("[createOrder] Order write failed", error);
    throw error;
  }
}

export async function updateOrderRating(orderId: string, rating: number) {
  await sendJsonRequest(`/api/orders/${orderId}/rating`, "PATCH", { rating });
}

export async function updateOrderStatus(orderId: string, status: "pending" | "delivered") {
  await sendJsonRequest(`/api/orders/${orderId}`, "PATCH", { status });
}

export async function deleteOrder(orderId: string) {
  await sendJsonRequest(`/api/orders/${orderId}`, "DELETE");
}

export function observeOrders(callbacks: OrdersListenerCallbacks) {
  const abortController = new AbortController();
  let isActive = true;

  void (async () => {
    try {
      const response = await fetch(ORDERS_ENDPOINT, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: abortController.signal,
      });

      const data = await readResponseBody(response);

      if (!response.ok || !data?.success || !Array.isArray(data.orders)) {
        throw new Error(data?.message || formatFailureMessage("read"));
      }

      const orders = data.orders
        .map((order) => (isRecord(order) ? mapOrderToStoredOrder(order) : null))
        .filter((order): order is StoredOrder => Boolean(order));

      if (isActive) {
        callbacks.onData(orders);
      }
    } catch (error) {
      if (!isActive || (error instanceof Error && error.name === "AbortError")) {
        return;
      }

      callbacks.onError?.(error instanceof Error ? error : new Error(formatFailureMessage("read")));
    }
  })();

  return () => {
    isActive = false;
    abortController.abort();
  };
}
