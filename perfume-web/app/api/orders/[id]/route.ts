import { NextResponse } from "next/server";
import { removeOrder, serializeOrder, updateOrderStatus } from "@/lib/server/orders";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { status?: string };
    const nextStatus = body.status === "delivered" ? "delivered" : "pending";
    const updatedOrder = await updateOrderStatus(id, nextStatus);

    if (!updatedOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Order failed",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order: serializeOrder(updatedOrder),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[PATCH /api/orders/:id] Order failed", error);
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

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deletedOrder = await removeOrder(id);

    if (!deletedOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Order failed",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[DELETE /api/orders/:id] Order failed", error);
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
