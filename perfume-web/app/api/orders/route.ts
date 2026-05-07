import { NextResponse } from "next/server";
import { createOrderRecord, listOrders, serializeOrder } from "@/lib/server/orders";

export const runtime = "nodejs";

export async function GET() {
  try {
    const orders = await listOrders();

    return NextResponse.json({
      success: true,
      orders: orders.map(serializeOrder),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[GET /api/orders] Failed to load orders", error);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Order failed",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const order = await createOrderRecord(body);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        id: String(order._id),
      },
      { status: 201 },
    );
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[POST /api/orders] Order failed", error);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Order failed",
      },
      { status: 500 },
    );
  }
}
