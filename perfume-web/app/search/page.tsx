"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NavbarDark from "@/components/NavbarDark";
import SideDrawer from "@/components/SideDrawer";
import Footer from "@/components/Footer";
import type { Product } from "@/lib/products";
import {
  searchProducts,
  formatPrice,
  getProductHref,
} from "@/lib/products";

function highlightMatch(text: string, query: string) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return text;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = normalizedQuery.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return text;
  }

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + normalizedQuery.length);
  const after = text.slice(matchIndex + normalizedQuery.length);

  return (
    <>
      {before}
      <span className="bg-[#C9A24A]/20 text-[#8A6F2D]">{match}</span>
      {after}
    </>
  );
}

function SearchResultCard({ product, query }: { product: Product; query: string }) {
  return (
    <Link
      href={getProductHref(product)}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-[#FBF6EF] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A24A]/50 hover:shadow-lg hover:shadow-black/10"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="space-y-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8A6F2D]">
          {product.category}
        </p>
        <h2 className="text-sm font-semibold leading-6 text-black sm:text-base">
          {highlightMatch(product.name, query)}
        </h2>
        <p className="text-base font-bold text-red-600 sm:text-lg">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [drawerOpen, setDrawerOpen] = useState(false);

  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <div className="min-h-screen bg-transparent text-black">
      <NavbarDark onMenuClick={() => setDrawerOpen(true)} />
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="pt-[120px] sm:pt-[130px]">
        <section className="content-px pt-0">
          <div className="content-container text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gray-500 sm:mb-5">
              Search Results
            </p>
            <h1 className="mb-4 text-4xl font-bold tracking-[0.12em] text-black sm:text-5xl lg:text-6xl">
              {query ? `Results for "${query}"` : "Search Products"}
            </h1>
            <div className="mx-auto h-1 w-10 bg-[#C9A24A]" />
          </div>
        </section>

        <section className="section-padding content-px mt-14 sm:mt-16 mb-28 sm:mb-32">
          <div className="content-container">
            {query ? (
              results.length > 0 ? (
                <>
                  <p className="mb-8 text-sm uppercase tracking-[0.2em] text-gray-500">
                    {results.length} product{results.length === 1 ? "" : "s"} found
                  </p>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
                    {results.map((product) => (
                      <SearchResultCard key={product.id} product={product} query={query} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-gray-200 bg-[#FBF6EF] px-6 py-16 text-center shadow-sm sm:px-10">
                  <p className="text-lg font-semibold text-black sm:text-xl">
                    No products found
                  </p>
                  <p className="mt-3 text-sm text-gray-500 sm:text-base">
                    Try a different product name.
                  </p>
                </div>
              )
            ) : (
              <div className="rounded-3xl border border-gray-200 bg-[#FBF6EF] px-6 py-16 text-center shadow-sm sm:px-10">
                <p className="text-lg font-semibold text-black sm:text-xl">
                  Search for a product name above.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F6F0E8] px-4 py-10 text-black sm:px-6">
          <div className="mx-auto w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 text-center shadow-[0_14px_35px_rgba(0,0,0,0.07)] sm:p-8">
            Loading search...
          </div>
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}