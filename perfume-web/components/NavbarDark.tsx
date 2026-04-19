"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import SearchMenu from "./SearchMenu";

interface NavbarDarkProps {
  onMenuClick: () => void;
}

export default function NavbarDark({ onMenuClick }: NavbarDarkProps) {
  const { count } = useCart();

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0B0B0B] border-b border-[#1F1F1F] z-50 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-20 py-4">
        {/* Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className="flex-shrink-0 text-white hover:text-[#D4AF37] transition-colors duration-300"
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo & Brand Name */}
        <div className="flex-1 flex flex-col items-center mx-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
            <span className="text-[#0B0B0B] text-xs sm:text-sm font-bold">OG</span>
          </div>
          <p className="text-[10px] sm:text-xs tracking-widest text-[#A0A0A0] mt-1 hidden sm:block">
            THE OLFACTORY GALLERY
          </p>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          {/* Search Icon */}
          <SearchMenu theme="dark" />

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="text-white hover:text-[#D4AF37] transition-colors duration-300 relative"
            aria-label="Checkout"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#0B0B0B] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
