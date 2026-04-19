"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import {
  formatPrice,
  getDiscountPercent,
  getProductHref,
} from "@/lib/products";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const discountPercent = getDiscountPercent(product);

  return (
    <Link
      href={getProductHref(product)}
      className="group block rounded-2xl border border-black/10 bg-[#FBF6EF] p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A24A]/50 hover:shadow-lg hover:shadow-black/10"
      aria-label={`Open ${product.name}`}
    >
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
    </Link>
  );
}
