"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState, type ReactNode } from "react";
import { createOrder, describeFirebaseOrderError } from "@/lib/firebase/orders";
import {
  formatPrice,
  getDiscountPercent,
  getProductById,
  getProductByKey,
  products,
} from "@/lib/products";
import { useCart } from "./CartContext";

type CheckoutPageProps = {
  initialProductId?: number;
  initialProductKey?: string;
  initialQuantity?: number;
  initialSize?: string;
};

const SHIPPING_FEE = 150;

type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  orderNotes: string;
};

type FieldProps = {
  label: string;
  error?: string;
  fullWidth?: boolean;
  children: ReactNode;
};

function Field({ label, error, fullWidth = false, children }: FieldProps) {
  return (
    <label className={`block ${fullWidth ? "md:col-span-2 xl:col-span-3" : ""}`}>
      <span className="mb-2 block text-[16px] font-semibold text-[#111111]">{label}</span>
      {children}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </label>
  );
}

function FeatureIcon({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#f4f4f4] text-[#111111]">
        {children}
      </span>
      <span className="text-[16px] font-medium text-[#444444]">{title}</span>
    </div>
  );
}

function FeatureIconSvg({ type }: { type: "bottle" | "clock" | "gift" }) {
  if (type === "clock") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="8" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "gift") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 12H4m16 0v8H4v-8m16 0H4m8 0V4m0 8c-2.2 0-4-1.8-4-4 0-1.7 1.3-3 3-3 1.3 0 2.4.8 3 2 .6-1.2 1.7-2 3-2 1.7 0 3 1.3 3 3 0 2.2-1.8 4-4 4Z" />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 4h8v4l2 2v10H6V10l2-2V4Zm2 0v4m4-4v4M9 12h6" />
    </svg>
  );
}

export default function CheckoutPage({
  initialProductId,
  initialProductKey,
  initialQuantity = 1,
  initialSize,
}: CheckoutPageProps) {
  const { items, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    orderNotes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  const selectedProduct = useMemo(() => {
    if (typeof initialProductKey === "string" && initialProductKey.trim()) {
      return getProductByKey(initialProductKey) ?? products[0];
    }

    if (typeof initialProductId === "number" && Number.isFinite(initialProductId)) {
      return getProductById(initialProductId) ?? products[0];
    }

    return items[0]?.product ?? products[0];
  }, [initialProductId, initialProductKey, items]);

  const orderProducts = useMemo(() => {
    const quantity = Math.max(1, initialQuantity);

    if (typeof initialProductKey === "string" && initialProductKey.trim()) {
      return [
        {
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity,
        },
      ];
    }

    if (typeof initialProductId === "number" && Number.isFinite(initialProductId)) {
      return [
        {
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity,
        },
      ];
    }

    if (items.length > 0) {
      return items.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));
    }

    return [
      {
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: 1,
      },
    ];
  }, [initialProductId, initialProductKey, initialQuantity, items, selectedProduct]);

  const discountPercent = useMemo(() => getDiscountPercent(selectedProduct), [selectedProduct]);
  const subtotal = orderProducts.reduce(
    (runningTotal, item) => runningTotal + item.price * item.quantity,
    0,
  );
  const total = subtotal + SHIPPING_FEE;
  const selectedSize = initialSize || items[0]?.selectedSize || selectedProduct.sizes[0] || "Default";

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof CustomerInfo, string>> = {};
    const cleanedPhone = customerInfo.phone.replace(/\D/g, "");

    if (!customerInfo.fullName.trim()) nextErrors.fullName = "Full name is required.";

    if (!customerInfo.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(customerInfo.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!customerInfo.phone.trim()) nextErrors.phone = "Phone number is required.";
    else if (cleanedPhone.length < 10) {
      nextErrors.phone = "Enter a valid phone number with at least 10 digits.";
    }

    if (!customerInfo.address.trim()) nextErrors.address = "Address is required.";
    if (!customerInfo.city.trim()) nextErrors.city = "City is required.";
    if (!customerInfo.orderNotes.trim()) nextErrors.orderNotes = "Order notes are required.";

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
        email: customerInfo.email.trim(),
        phone: customerInfo.phone.trim(),
        address: customerInfo.address.trim(),
        city: customerInfo.city.trim(),
        orderNotes: customerInfo.orderNotes.trim(),
        state: "",
        country: "",
        postalCode: "",
        paymentMethod: "cod",
        products: orderProducts,
        totalPrice: total,
      });

      clearCart();
      setPlacedOrderId(orderResult.id);
      setIsOrderPlaced(true);
      setCustomerInfo({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        orderNotes: "",
      });
      setErrors({});
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[CheckoutPage] Order placement failed", error);
      }

      setSubmitError(describeFirebaseOrderError(error, "write"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrderPlaced) {
    return (
      <main className="w-full bg-white text-black">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-center px-4 py-10 sm:px-6">
          <section className="w-full max-w-3xl rounded-[18px] border border-[#eeeeee] bg-white p-8 text-center shadow-[0_18px_40px_rgba(17,17,17,0.06)] sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e7f8ea] text-[#32c852]">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="mt-5 text-[14px] font-semibold uppercase tracking-[0.28em] text-[#32c852]">
              Order Confirmed
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111111] sm:text-5xl">
              Thank you for your order
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#666666] sm:text-lg">
              Your order has been placed successfully. We have received your information and the team will process it shortly.
            </p>
            {placedOrderId && (
              <p className="mt-6 text-sm font-medium tracking-[0.2em] text-[#6b7280]">
                ORDER ID: {placedOrderId}
              </p>
            )}
            <Link
              href="/"
              className="mt-8 inline-flex h-[60px] items-center justify-center rounded-[10px] bg-[#ff6600] px-8 text-lg font-bold text-white transition hover:bg-[#e85c00]"
            >
              Continue Shopping
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-white text-black">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-6">
        <section className="grid gap-10 lg:grid-cols-[48fr_52fr] lg:gap-10">
          <div className="relative">
            <div className="relative h-[360px] overflow-hidden rounded-[16px] bg-[#f8f8f8] sm:h-[520px] lg:h-[620px]">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />

              {discountPercent > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-[#32c852] px-3.5 py-2 text-[14px] font-semibold text-white">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-start pt-2 lg:pt-0">
            <h1 className="text-[34px] font-bold tracking-tight text-[#111111] sm:text-[42px] lg:text-[52px] lg:leading-[1.04]">
              {selectedProduct.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <span className="text-[34px] font-bold text-[#ff6600] lg:text-[48px]">
                {formatPrice(selectedProduct.price)}
              </span>
              {selectedProduct.oldPrice && (
                <span className="text-[22px] text-[#999999] line-through lg:text-[28px]">
                  {formatPrice(selectedProduct.oldPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="rounded-[8px] bg-[#e7f8ea] px-3 py-1.5 text-[16px] font-semibold text-[#32c852]">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <p className="mt-6 max-w-2xl text-[18px] leading-[32px] text-[#666666]">
              {selectedProduct.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-6">
              <FeatureIcon title="Eau De Parfum">
                <FeatureIconSvg type="bottle" />
              </FeatureIcon>
              <FeatureIcon title="Long Lasting">
                <FeatureIconSvg type="clock" />
              </FeatureIcon>
              <FeatureIcon title="Premium Quality">
                <FeatureIconSvg type="gift" />
              </FeatureIcon>
            </div>
          </div>
        </section>

        <section className="mt-[60px] rounded-[18px] border border-[#eeeeee] bg-white p-6 sm:p-10 lg:p-10">
          <div className="max-w-3xl">
            <h2 className="text-[30px] font-bold tracking-tight text-[#111111] sm:text-[38px]">
              Customer Information
            </h2>
            <p className="mt-2 text-[17px] text-[#777777]">
              Please provide your details to place the order.
            </p>
          </div>

          <form className="mt-10" onSubmit={handleSubmit} data-selected-size={selectedSize}>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Full Name" error={errors.fullName}>
                <input
                  type="text"
                  value={customerInfo.fullName}
                  onChange={(event) =>
                    setCustomerInfo((current) => ({ ...current, fullName: event.target.value }))
                  }
                  placeholder="Enter your full name"
                  className="h-[62px] w-full rounded-[10px] border border-[#dddddd] bg-white px-[18px] text-[16px] text-[#111111] outline-none transition placeholder:text-[#9ca3af] focus:border-[#ff6600] focus:shadow-[0_0_0_4px_rgba(255,102,0,0.12)]"
                />
              </Field>

              <Field label="Email Address" error={errors.email}>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(event) =>
                    setCustomerInfo((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="Enter your email"
                  className="h-[62px] w-full rounded-[10px] border border-[#dddddd] bg-white px-[18px] text-[16px] text-[#111111] outline-none transition placeholder:text-[#9ca3af] focus:border-[#ff6600] focus:shadow-[0_0_0_4px_rgba(255,102,0,0.12)]"
                />
              </Field>

              <Field label="Phone Number" error={errors.phone}>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(event) =>
                    setCustomerInfo((current) => ({ ...current, phone: event.target.value }))
                  }
                  placeholder="Enter your phone number"
                  className="h-[62px] w-full rounded-[10px] border border-[#dddddd] bg-white px-[18px] text-[16px] text-[#111111] outline-none transition placeholder:text-[#9ca3af] focus:border-[#ff6600] focus:shadow-[0_0_0_4px_rgba(255,102,0,0.12)]"
                />
              </Field>

              <Field label="Address" error={errors.address} fullWidth>
                <input
                  type="text"
                  value={customerInfo.address}
                  onChange={(event) =>
                    setCustomerInfo((current) => ({ ...current, address: event.target.value }))
                  }
                  placeholder="Enter your full address"
                  className="h-[62px] w-full rounded-[10px] border border-[#dddddd] bg-white px-[18px] text-[16px] text-[#111111] outline-none transition placeholder:text-[#9ca3af] focus:border-[#ff6600] focus:shadow-[0_0_0_4px_rgba(255,102,0,0.12)]"
                />
              </Field>

              <Field label="City" error={errors.city}>
                <input
                  type="text"
                  value={customerInfo.city}
                  onChange={(event) =>
                    setCustomerInfo((current) => ({ ...current, city: event.target.value }))
                  }
                  placeholder="Enter your city"
                  className="h-[62px] w-full rounded-[10px] border border-[#dddddd] bg-white px-[18px] text-[16px] text-[#111111] outline-none transition placeholder:text-[#9ca3af] focus:border-[#ff6600] focus:shadow-[0_0_0_4px_rgba(255,102,0,0.12)]"
                />
              </Field>

              <Field label="Order Notes" error={errors.orderNotes} fullWidth>
                <textarea
                  value={customerInfo.orderNotes}
                  onChange={(event) =>
                    setCustomerInfo((current) => ({ ...current, orderNotes: event.target.value }))
                  }
                  placeholder="Any special instructions for your order?"
                  className="h-[140px] w-full resize-none rounded-[10px] border border-[#dddddd] bg-white px-[18px] py-[16px] text-[16px] text-[#111111] outline-none transition placeholder:text-[#9ca3af] focus:border-[#ff6600] focus:shadow-[0_0_0_4px_rgba(255,102,0,0.12)]"
                />
              </Field>
            </div>

            {submitError && (
              <p className="mt-5 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-[30px] flex h-[68px] w-full items-center justify-center rounded-[10px] bg-[#ff6600] text-[24px] font-bold text-white transition hover:bg-[#e85c00] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
