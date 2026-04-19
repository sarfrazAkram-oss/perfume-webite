"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import Image from "next/image";
import type { Product } from "@/lib/products";

interface ProductSectionProps {
  title: string;
  products: Product[];
  link: string;
}

export default function ProductSection({
  title,
  products,
  link,
}: ProductSectionProps) {
  return (
    <section className="section-padding content-px border-b border-gray-200">
      <div className="content-container">
        {/* Section Title */}
        <Link href={link} className="block">
          <h2 className="luxury-heading">
            {title}
          </h2>
        </Link>

        {/* Products Grid (2 per row on mobile, responsive) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index === 0} />
          ))}
        </div>

        {/* Spacing between products and featured images */}
        <div className="h-6 sm:h-8" />

        {/* Featured Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src="/images/ui/featured-one.svg"
              alt="Featured Collection 1"
              width={600}
              height={300}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src="/images/ui/featured-two.svg"
              alt="Featured Collection 2"
              width={600}
              height={300}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Spacing between featured images and button */}
        <div className="h-8 sm:h-10" />

        {/* See More Button */}
        <div className="flex justify-center pt-6 sm:pt-8">
          <Link href={link}>
            <button className="button-ghost font-semibold text-sm sm:text-base">
              SEE MORE
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
