"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryQuickAccess from "@/components/CategoryQuickAccess";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import SideDrawer from "@/components/SideDrawer";
import {
  bestSellerIds,
  bulkOrderIds,
  getProductsByCategory,
  getProductsByIds,
} from "@/lib/products";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menProducts = getProductsByCategory("Men").slice(0, 4);
  const womenProducts = getProductsByCategory("Women").slice(0, 4);
  const arabicProducts = getProductsByCategory("Arabic").slice(0, 4);
  const bestSellerProducts = getProductsByIds(bestSellerIds);
  const bulkOrderProducts = getProductsByIds(bulkOrderIds);

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar onMenuClick={() => setDrawerOpen(true)} />
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="pt-16">
        {/* Hero Carousel */}
        <Hero />

        {/* Category Quick Access */}
        <CategoryQuickAccess />

        {/* Men Section */}
        <ProductSection
          title="BEST SELLER"
          products={bestSellerProducts}
          link="/best-seller"
        />

        <ProductSection
          title="BULK ORDER"
          products={bulkOrderProducts}
          link="/bulk-order"
        />

        <ProductSection
          title="MEN"
          products={menProducts}
          link="/men"
        />

        {/* Women Section */}
        <ProductSection
          title="WOMEN"
          products={womenProducts}
          link="/women"
        />

        {/* Arabic Section */}
        <ProductSection
          title="ARABIC"
          products={arabicProducts}
          link="/arabic"
        />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
