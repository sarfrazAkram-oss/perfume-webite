"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { formatPrice, getDiscountPercent } from "@/lib/products";
import ProductCard from "./ProductCard";
import { useCart } from "./CartContext";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [addedCount, setAddedCount] = useState(0);

  const discountPercent = useMemo(() => getDiscountPercent(product), [product]);

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      selectedSize,
    });
    setAddedCount((current) => current + quantity);
    router.push("/cart");
  };

  const handleBuyNow = () => {
    addItem({
      product,
      quantity,
      selectedSize,
    });
    router.push("/cart");
  };

  const handleShare = async () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on The Olfactory Gallery`,
      url: currentUrl,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(currentUrl);
  };

  return (
    <main className="min-h-screen bg-transparent text-black">
      <section className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.05),_transparent_48%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center justify-between gap-6 text-xs uppercase tracking-[0.25em] text-black">
            <Link href="/" className="transition-colors hover:text-gray-700">
              Home
            </Link>
            <span>{product.category}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            
            {/* Product Image */}
            <div className="rounded-[2rem] border border-gray-200 bg-[#FBF6EF] p-4 shadow-sm sm:p-6">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="rounded-t-2xl border border-gray-200 bg-[#FBF6EF] p-6 flex flex-col gap-8 sm:p-8">
              
              {/* Category & Discount */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black">
                  {product.category}
                </span>

                {discountPercent > 0 && (
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold uppercase tracking-[0.14em] text-black sm:text-4xl">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-end gap-4">
                <span className="text-3xl font-bold text-black sm:text-4xl">
                  {formatPrice(product.price)}
                </span>

                {product.oldPrice && (
                  <span className="pb-1 text-base text-gray-500 line-through sm:text-lg">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm leading-7 text-gray-700">
                {product.description}
              </p>

              {/* Quantity & Delivery */}
              <div className="grid gap-6 sm:grid-cols-2">
                
                {/* Quantity */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    Quantity
                  </p>

                  <div className="inline-flex items-center rounded-full border border-gray-300 bg-[#FBF6EF]">
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      className="h-11 w-11 text-lg font-bold text-black hover:bg-gray-100"
                    >
                      -
                    </button>

                    <span className="min-w-14 px-4 text-center text-base font-semibold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => setQuantity((current) => current + 1)}
                      className="h-11 w-11 text-lg font-bold text-black hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delivery */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    Delivery
                  </p>

                  <p className="text-sm leading-7 text-gray-700">
                    Delivery in 4-5 working days with secure packaging and tracking.
                  </p>
                </div>
              </div>

              {/* Size */}
              <div className="flex flex-col gap-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Size / Variant
                </p>

                <div className="flex flex-wrap gap-4">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 bg-[#FBF6EF] text-black hover:bg-[#F1E7D9]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full rounded-2xl bg-black px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-white hover:bg-gray-800"
                >
                  Add To Cart
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full rounded-2xl border border-gray-300 bg-[#FBF6EF] px-5 py-4 text-sm font-bold uppercase tracking-[0.22em] text-black hover:bg-[#F1E7D9]"
                >
                  Buy It Now
                </button>
              </div>

              {/* Info */}
              <div className="flex flex-wrap justify-between gap-4 text-sm text-gray-600">
                <p>
                  Selected size: <span className="text-black">{selectedSize}</span>
                </p>
                <p>
                  Added to cart: <span className="text-black">{addedCount}</span>
                </p>
              </div>

              {/* Share */}
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-full border border-gray-300 bg-[#FBF6EF] px-4 py-2 text-sm text-black hover:bg-[#F1E7D9]"
                >
                  Share
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

   {/* Related Products */} <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
     <div className="mb-6 flex items-end justify-between gap-5"> 
      <div> 
        <p className="text-xs uppercase tracking-[0.3em] text-white/45"> Related Products </p> 
        <h2 className="mt-4 text-2xl font-bold uppercase tracking-[0.12em] text-white"> More from {product.category} 
          </h2> 
          </div> 
          </div>
           <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 sm:gap-7"> {relatedProducts.map((relatedProduct) => ( <ProductCard key={relatedProduct.id} product={relatedProduct} /> ))} 
           </div>
            </section>
             </main> );
              }