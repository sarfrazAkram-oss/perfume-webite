'use client';

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { createOrder, describeFirebaseOrderError } from "@/lib/firebase/orders";
import { getProductById, products } from "@/lib/products";
import { useCart } from "./CartContext";

type CheckoutPageProps = {
  initialProductId: number;
};

const SHIPPING_FEE = 150;

function formatRsPrice(value: number) {
  const rounded = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);

  return `Rs ${rounded}`;
}

function CartIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-1.5 6h11l1.5-6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
    </svg>
  );
}

export default function CheckoutPage({ initialProductId }: CheckoutPageProps) {
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

  const product = useMemo(
    () => getProductById(initialProductId) ?? products[0],
    [initialProductId],
  );

  const orderProducts = useMemo(
    () =>
      items.length > 0
        ? items.map((item) => ({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          }))
        : [
            {
              name: product.name,
              price: product.price,
              quantity: 1,
            },
          ],
    [items, product.name, product.price],
  );

  const subtotal = orderProducts.reduce(
    (runningTotal, item) => runningTotal + item.price * item.quantity,
    0,
  );
  const total = subtotal + SHIPPING_FEE;

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || isOrderPlaced) {
      return;
    }

    setSubmitError("");

    if (!validateForm()) {
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
        products: orderProducts,
        totalPrice: total,
      });

      clearCart();
      setPlacedOrderId(orderResult.id);
      setIsOrderPlaced(true);
      setCustomerInfo({
        fullName: "",
        city: "",
        address: "",
        phone: "",
      });
      setErrors({});
      setPaymentMethod("cod");
    } catch (error) {
      console.error("[CheckoutPage] Order placement failed", error);
      setSubmitError(describeFirebaseOrderError(error, "write"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:max-w-4xl lg:px-8">
        <header className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-black/5 pb-4 sm:pb-5">
          <div />

          <Link
            href="/"
            className="flex items-center gap-3 justify-self-center text-black"
            aria-label="The Olfactory Gallery home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black text-sm font-semibold text-white shadow-sm">
              OG
            </span>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] sm:text-xs">
              The Olfactory Gallery
            </span>
          </Link>

          <button
            type="button"
            className="relative justify-self-end rounded-full border border-black/10 bg-white p-3 text-black shadow-sm transition hover:border-black/20 hover:bg-black/5"
            aria-label="Cart"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
        </header>

        <form className="flex-1 py-6 sm:py-8" onSubmit={handleSubmit}>
          <div className="space-y-5 sm:space-y-6">
            {isOrderPlaced && (
              <section className="rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 text-center shadow-[0_18px_35px_rgba(16,185,129,0.12)] sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700/80">
                  Order Confirmed
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-900 sm:text-4xl">
                  Thank You
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-emerald-900/80 sm:text-base">
                  Your order has been placed successfully. We appreciate your purchase and will
                  start processing your order details shortly.
                </p>
                {placedOrderId && (
                  <p className="mt-4 text-xs font-medium tracking-[0.18em] text-emerald-800/80 sm:text-sm">
                    ORDER ID: {placedOrderId}
                  </p>
                )}
                <Link
                  href="/"
                  className="mt-6 inline-flex rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Continue Shopping
                </Link>
              </section>
            )}

            {!isOrderPlaced && (
              <>
            <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
                Cart Summary
              </p>

              <div className="mt-4 space-y-3 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                {orderProducts.map((orderProduct, index) => (
                  <div
                    key={`${orderProduct.name}-${index}`}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold text-black">
                        {orderProduct.name}
                      </p>
                      <p className="text-xs text-black/55">Quantity: {orderProduct.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-black">
                      {formatRsPrice(orderProduct.price * orderProduct.quantity)}
                    </p>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-black/10 bg-white">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-3 rounded-[24px] border border-black/10 p-4">
                <div className="flex items-center justify-between gap-4 text-sm text-black/70">
                  <span>Product Price</span>
                  <span className="font-medium">{formatRsPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm text-black/70">
                  <span>Shipping</span>
                  <span className="font-medium">{formatRsPrice(SHIPPING_FEE)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-black/10 pt-3 text-base font-semibold text-black">
                  <span>Total</span>
                  <span>{formatRsPrice(total)}</span>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
                Customer Information
              </p>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black/80" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter full name"
                    value={customerInfo.fullName}
                    onChange={(event) =>
                      setCustomerInfo((currentValue) => ({
                        ...currentValue,
                        fullName: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-[15px] text-black outline-none transition placeholder:text-black/30 focus:border-black/30 focus:ring-4 focus:ring-black/5"
                  />
                  {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black/80" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="Enter city"
                    value={customerInfo.city}
                    onChange={(event) =>
                      setCustomerInfo((currentValue) => ({
                        ...currentValue,
                        city: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-[15px] text-black outline-none transition placeholder:text-black/30 focus:border-black/30 focus:ring-4 focus:ring-black/5"
                  />
                  {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black/80" htmlFor="address">
                    Complete Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    placeholder="Street, house number, area"
                    value={customerInfo.address}
                    onChange={(event) =>
                      setCustomerInfo((currentValue) => ({
                        ...currentValue,
                        address: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-[15px] text-black outline-none transition placeholder:text-black/30 focus:border-black/30 focus:ring-4 focus:ring-black/5"
                  />
                  {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black/80" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Enter phone number"
                  value={customerInfo.phone}
                  onChange={(event) =>
                    setCustomerInfo((currentValue) => ({
                      ...currentValue,
                      phone: event.target.value,
                    }))
                  }
                  className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-[15px] text-black outline-none transition placeholder:text-black/30 focus:border-black/30 focus:ring-4 focus:ring-black/5"
                />
                {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
              </div>
            </section>

            <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-6">
              <h2 className="text-lg font-semibold tracking-tight text-black">Payment Method</h2>

              <fieldset className="mt-4 space-y-3">
                <label className="block cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="sr-only"
                  />
                  <div
                    className={`flex items-center gap-4 rounded-2xl border px-4 py-4 transition hover:border-black/20 hover:bg-black/[0.02] ${paymentMethod === "cod" ? "border-black bg-black/5" : "border-black/10"}`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-black/30">
                      {paymentMethod === "cod" && <span className="h-2.5 w-2.5 rounded-full bg-black" />}
                    </span>
                    <span className="text-[15px] font-medium">Cash on Delivery</span>
                  </div>
                </label>

                <label className="block cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="sr-only"
                  />
                  <div
                    className={`flex items-center gap-4 rounded-2xl border px-4 py-4 transition hover:border-black/20 hover:bg-black/[0.02] ${paymentMethod === "online" ? "border-black bg-black/5" : "border-black/10"}`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-black/30">
                      {paymentMethod === "online" && <span className="h-2.5 w-2.5 rounded-full bg-black" />}
                    </span>
                    <span className="text-[15px] font-medium">Online Payment</span>
                  </div>
                </label>
              </fieldset>

              {paymentMethod === "online" && (
                <div className="mt-4 rounded-[24px] border border-black/10 bg-black/[0.03] p-4 sm:p-5">
                  <p className="text-sm font-medium text-black">Bank Name: United Bank Limited</p>
                  <p className="mt-2 text-sm font-medium text-black">Account Number: 1346358073554</p>
                  <p className="mt-2 text-sm font-medium text-black">Account Name: Sarfraz Akram</p>

                  <p className="mt-4 text-sm font-medium text-black">JazzCash Number: 03211315355</p>
                  <p className="mt-2 text-sm font-medium text-black">Name: Sarfraz Akram</p>

                  <p className="mt-4 text-xs text-black/65">
                    Please send payment screenshot to this number: 03211315355 after completing
                    transfer.
                  </p>
                </div>
              )}
            </section>

            <div className="mt-6 space-y-3 sm:mt-8">
              <button
                type="button"
                onClick={clearCart}
                className="w-full rounded-2xl border border-black/10 bg-white px-5 py-4 text-base font-semibold text-black transition hover:bg-black/5"
              >
                Clear Cart
              </button>

              {submitError && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isOrderPlaced}
                className="w-full rounded-2xl bg-black px-5 py-4 text-base font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.12)] transition hover:bg-black/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
              </>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
