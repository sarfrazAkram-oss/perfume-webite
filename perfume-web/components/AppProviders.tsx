"use client";

import { CartProvider } from "./CartContext";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}