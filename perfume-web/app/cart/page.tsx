import type { Metadata } from "next";
import CartPage from "@/components/CartPage";

export const metadata: Metadata = {
  title: "Cart - The Olfactory Gallery",
  description: "Review your selected fragrance before checkout.",
};

export default function Page() {
  return <CartPage />;
}