'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  createOrder,
  describeFirebaseOrderError,
  updateOrderRating,
} from "@/lib/firebase/orders";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/products";
import StarRating from "./StarRating";

const SHIPPING_FEE = 150;

export default function CartPage() {
  const { items, count, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    city: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<typeof customerInfo>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSavingRating, setIsSavingRating] = useState(false);

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const total = subtotal + (items.length > 0 ? SHIPPING_FEE : 0);

  const validateForm = () => {
    const nextErrors: Partial<typeof customerInfo> = {};
    const cleanedPhone = customerInfo.phone.replace(/\D/g, "");

    if (!customerInfo.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!customerInfo.city.trim()) {
      nextErrors.city = "City is required.";
    }

    if (!customerInfo.address.trim()) {
      nextErrors.address = "Complete address is required.";
    }

    if (cleanedPhone.length < 10) {
      nextErrors.phone = "Enter a valid phone number with at least 10 digits.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting || isOrderPlaced) {
      return;
    }

    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderResult = await createOrder({
        fullName: customerInfo.fullName.trim(),
        city: customerInfo.city.trim(),
        address: customerInfo.address.trim(),
        phone: customerInfo.phone.trim(),
        paymentMethod,
        products: items.map((item) => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        totalPrice: total,
      });

      clearCart();
      setPlacedOrderId(orderResult.id);
      setIsOrderPlaced(true);
      setSelectedRating(0);
      setCustomerInfo({
        fullName: "",
        city: "",
        address: "",
        phone: "",
      });
      setErrors({});
      setPaymentMethod("cod");
    } catch (error) {
      console.error("[CartPage] Order placement failed", error);
      setSubmitError(describeFirebaseOrderError(error, "write"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingSelect = async (nextRating: number) => {
    if (!placedOrderId || isSavingRating) {
      return;
    }

    setSelectedRating(nextRating);
    setIsSavingRating(true);

    try {
      await updateOrderRating(placedOrderId, nextRating);
    } catch (error) {
      console.error("[CartPage] Rating save failed", error);
    } finally {
      setIsSavingRating(false);
    }
  };

  return (
    <main className="min-h-screen overflow-y-auto bg-[#F6F0E8] text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-black/10 pb-5 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
              Cart Context Page
            </p>
            <h1 className="mt-2 text-[28px] font-semibold tracking-tight sm:text-[32px]">
              Your Cart
            </h1>
            <p className="mt-2 text-sm leading-6 text-black/55 sm:text-base">
              Review your selected fragrance, confirm the shipping cost, and proceed to checkout.
            </p>
          </div>

          <span className="inline-flex w-full items-center justify-center rounded-full border border-black/10 px-4 py-3 text-sm font-semibold text-black/70 sm:w-auto">
            Checkout Panel
          </span>
        </div>

        <section className="flex-1 py-6 sm:py-8">
          {isOrderPlaced && (
            <div className="mx-auto flex min-h-[calc(100dvh-220px)] w-full max-w-3xl items-center justify-center rounded-[26px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 text-center shadow-[0_20px_40px_rgba(16,185,129,0.12)] sm:p-10">
              <div className="w-full">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-700/80">
                Order Confirmed
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-900 sm:text-4xl">
                Thank you for your order
              </h2>
              <p className="mt-4 text-sm leading-7 text-emerald-900/80 sm:text-base">
                Your order has been placed successfully. Our team will process your order details
                soon.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3">
                <StarRating value={selectedRating} onChange={handleRatingSelect} disabled={isSavingRating} />
              </div>
              {placedOrderId && (
                <p className="mt-4 text-xs font-medium tracking-[0.16em] text-emerald-800/80 sm:text-sm">
                  ORDER ID: {placedOrderId}
                </p>
              )}
              <Link
                href="/"
                className="mt-6 inline-flex rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Continue Shopping
              </Link>
              </div>
            </div>
          )}

          {!isOrderPlaced && (
            <>
          {submitError && (
            <div className="mb-5 space-y-3">
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </p>
            </div>
          )}

          {count === 0 ? (
            <div className="mx-auto max-w-2xl rounded-[20px] border border-black/10 bg-black/[0.02] p-8 text-center sm:p-10">
              <p className="text-lg font-semibold">Your cart is empty.</p>
              <p className="mt-2 text-sm leading-6 text-black/55">
                Add a product to see it here.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start lg:gap-8">
              <div className="space-y-5">
                {items.map((item) => (
                  <article
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex min-h-[160px] flex-wrap items-center justify-between gap-5 rounded-[16px] border border-black/10 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] sm:min-h-[180px] sm:p-5"
                  >
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4 sm:flex-nowrap">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[12px] border border-black/10 bg-black/[0.02]">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1 overflow-hidden">
                        <p className="text-xs uppercase tracking-[0.22em] text-black/45">
                          {item.product.category}
                        </p>
                        <h2 className="text-[18px] font-semibold leading-6 break-words sm:text-[20px]">
                          {item.product.name}
                        </h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm leading-6 text-black/65">
                          <span>Size: {item.selectedSize}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                      <p className="text-[16px] font-semibold text-black">
                        {formatPrice(item.product.price)}
                      </p>
                      <p className="text-sm leading-6 text-black/55">
                        Subtotal: {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="min-h-[320px] rounded-[16px] border border-black/10 bg-black/[0.02] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] sm:min-h-[380px] sm:p-8">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4 text-[14px] text-black/70">
                      <span>Items</span>
                      <span>{count}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-[14px] text-black/70">
                      <span>Product Total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-[14px] text-black/70">
                      <span>Shipping</span>
                      <span>{formatPrice(SHIPPING_FEE)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-black/10 pt-4 text-[15px] font-semibold text-black">
                      <span>Grand Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <form
                    className="space-y-5 rounded-[16px] border border-black/10 bg-white p-5 sm:p-6"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      await handlePlaceOrder();
                    }}
                  >
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
                        Customer Information
                      </p>
                      <p className="text-[13px] leading-6 text-black/55">
                        Please complete these fields before placing the order.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <label className="block space-y-2">
                        <span className="text-[13px] font-medium text-black/80">Full Name</span>
                        <input
                          type="text"
                          value={customerInfo.fullName}
                          onChange={(event) =>
                            setCustomerInfo((current) => ({
                              ...current,
                              fullName: event.target.value,
                            }))
                          }
                          className="h-11 w-full rounded-2xl border border-black/10 px-4 text-[14px] outline-none transition placeholder:text-black/30 focus:border-black/30 focus:ring-4 focus:ring-black/5"
                          placeholder="Enter full name"
                        />
                        {errors.fullName && (
                          <p className="text-xs text-red-600">{errors.fullName}</p>
                        )}
                      </label>

                      <label className="block space-y-2">
                        <span className="text-[13px] font-medium text-black/80">City</span>
                        <input
                          type="text"
                          value={customerInfo.city}
                          onChange={(event) =>
                            setCustomerInfo((current) => ({
                              ...current,
                              city: event.target.value,
                            }))
                          }
                          className="h-11 w-full rounded-2xl border border-black/10 px-4 text-[14px] outline-none transition placeholder:text-black/30 focus:border-black/30 focus:ring-4 focus:ring-black/5"
                          placeholder="Enter city"
                        />
                        {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
                      </label>

                      <label className="block space-y-2">
                        <span className="text-sm font-medium text-black/80">
                          Complete Address
                        </span>
                        <input
                          type="text"
                          value={customerInfo.address}
                          onChange={(event) =>
                            setCustomerInfo((current) => ({
                              ...current,
                              address: event.target.value,
                            }))
                          }
                          className="h-11 w-full rounded-2xl border border-black/10 px-4 text-[14px] outline-none transition placeholder:text-black/30 focus:border-black/30 focus:ring-4 focus:ring-black/5"
                          placeholder="Street, house number, area"
                        />
                        {errors.address && (
                          <p className="text-xs text-red-600">{errors.address}</p>
                        )}
                      </label>

                      <label className="block space-y-2">
                        <span className="text-[13px] font-medium text-black/80">Phone Number</span>
                        <input
                          type="tel"
                          inputMode="tel"
                          value={customerInfo.phone}
                          onChange={(event) =>
                            setCustomerInfo((current) => ({
                              ...current,
                              phone: event.target.value,
                            }))
                          }
                          className="h-11 w-full rounded-2xl border border-black/10 px-4 text-[14px] outline-none transition placeholder:text-black/30 focus:border-black/30 focus:ring-4 focus:ring-black/5"
                          placeholder="Enter phone number"
                        />
                        {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                      </label>

                      <div className="pt-3">
                        <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-black/70">
                          Payment Method
                        </h2>

                        <fieldset className="mt-3 space-y-2.5">
                          <label className="block cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="cod"
                              checked={paymentMethod === "cod"}
                              onChange={() => setPaymentMethod("cod")}
                              className="sr-only"
                            />
                            <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${paymentMethod === "cod" ? "border-black bg-black/5" : "border-black/10 bg-white"}`}>
                              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-black/30">
                                {paymentMethod === "cod" && <span className="h-2 w-2 rounded-full bg-black" />}
                              </span>
                              <span className="font-medium text-black">Cash on Delivery</span>
                            </div>
                          </label>

                          <label className="block cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="online"
                              checked={paymentMethod === "online"}
                              onChange={() => setPaymentMethod("online")}
                              className="sr-only"
                            />
                            <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${paymentMethod === "online" ? "border-black bg-black/5" : "border-black/10 bg-white"}`}>
                              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-black/30">
                                {paymentMethod === "online" && <span className="h-2 w-2 rounded-full bg-black" />}
                              </span>
                              <span className="font-medium text-black">Online Payment</span>
                            </div>
                          </label>
                        </fieldset>

                        {paymentMethod === "online" && (
                          <div className="mt-3 rounded-2xl border border-black/10 bg-black/[0.03] p-3 text-sm text-black/85">
                            <p>Bank Name: United Bank Limited</p>
                            <p className="mt-1">Account Number: 1346358073554</p>
                            <p className="mt-1">Account Name: Sarfraz Akram</p>
                            <p className="mt-3">JazzCash Number: 03211315355</p>
                            <p className="mt-1">Name: Sarfraz Akram</p>
                            <p className="mt-3 text-xs text-black/65">
                              Please send payment screenshot to this number: 03211315355 after
                              completing transfer.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row lg:flex-col">
                      <button
                        type="button"
                        onClick={clearCart}
                        className="w-full rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold text-black transition hover:bg-black/5"
                      >
                        Clear Cart
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || isOrderPlaced}
                        className="w-full rounded-2xl bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSubmitting ? "Placing Order..." : "Place Order"}
                      </button>
                    </div>
                  </form>
                </div>
              </aside>
            </div>
          )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}