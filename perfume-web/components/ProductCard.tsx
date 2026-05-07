"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { formatPrice, getCheckoutHref, getDiscountPercent } from "@/lib/products";
import { useCart } from "./CartContext";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const discountPercent = getDiscountPercent(product);

  const handleAddToCart = () => {
    addItem({
      product,
      quantity: 1,
      selectedSize: product.sizes[0] ?? "Default",
    });

    router.push(getCheckoutHref(product));
  };

  return (
    <div className="group block rounded-2xl border border-black/10 bg-[#FBF6EF] p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A24A]/50 hover:shadow-lg hover:shadow-black/10">
      <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl bg-black/5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
        {discountPercent > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
            Save {discountPercent}%
          </span>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8A6F2D]">
          {product.category}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-black sm:text-base">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-red-600 sm:text-lg">
            {formatPrice(product.price)}
          </p>
          {product.oldPrice && (
            <p className="text-xs text-black/40 line-through sm:text-sm">
              {formatPrice(product.oldPrice)}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-[14px] flex h-[52px] w-full items-center justify-center rounded-[10px] border border-[#d9d9d9] bg-white px-5 text-[16px] font-semibold tracking-[0.3px] text-[#111111] transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
      >
        Add to Cart
      </button>
    </div>
  );
}
