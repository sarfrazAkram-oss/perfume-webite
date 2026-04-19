"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (item: CartItem) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const count = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      count,
      addItem: (item: CartItem) => {
        setItems((currentItems) => {
          const existingIndex = currentItems.findIndex(
            (currentItem) =>
              currentItem.product.id === item.product.id &&
              currentItem.selectedSize === item.selectedSize,
          );

          if (existingIndex === -1) {
            return [...currentItems, item];
          }

          return currentItems.map((currentItem, index) =>
            index === existingIndex
              ? {
                  ...currentItem,
                  quantity: currentItem.quantity + item.quantity,
                }
              : currentItem,
          );
        });
      },
      clearCart: () => {
        setItems([]);
      },
    }),
    [count, items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}