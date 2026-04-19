"use client";

import { useState } from "react";
import NavbarDark from "@/components/NavbarDark";
import Footer from "@/components/Footer";
import SideDrawer from "@/components/SideDrawer";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";

interface CategoryPageProps {
  title: string;
  products: Product[];
}

export default function CategoryPage({ title, products }: CategoryPageProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent">
      <NavbarDark onMenuClick={() => setDrawerOpen(true)} />
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="pt-[120px] sm:pt-[130px]">
        <div className="h-14 sm:h-16" />

        <section className="content-px pt-0">
          <div className="content-container text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gray-500 sm:mb-5">
              Discovery Selection
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-[0.12em] text-black sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <div className="mx-auto h-1 w-10 bg-[#C9A24A]" />
          </div>
        </section>

        <section className="section-padding content-px mt-14 sm:mt-16 mb-28 sm:mb-32">
          <div className="content-container">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}