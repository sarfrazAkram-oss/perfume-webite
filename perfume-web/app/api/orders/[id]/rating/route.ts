import { NextResponse } from "next/server";
import { serializeOrder, updateOrderRating } from "@/lib/server/orders";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { rating?: number | string };
    const rating = Number(body.rating);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Order failed",
        },
        { status: 400 },
      );
    }

    const updatedOrder = await updateOrderRating(id, rating);

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
      console.error("[PATCH /api/orders/:id/rating] Order failed", error);
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
