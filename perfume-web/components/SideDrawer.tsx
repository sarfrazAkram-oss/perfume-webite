"use client";

import { useEffect } from "react";
import Link from "next/link";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const primaryLinks = [
    { label: "HOME", href: "/" },
    { label: "MEN", href: "/men" },
    { label: "WOMEN", href: "/women" },
    { label: "ARABIC", href: "/arabic" },
    { label: "ITTAR COLLECTION", href: "/ittar" },
    { label: "BEST SELLER", href: "/best-seller" },
    { label: "BULK ORDER", href: "/bulk-order" },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-[84vw] max-w-[360px] transform flex-col overflow-hidden bg-[#FBF6EF] shadow-[12px_0_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="relative flex h-[92px] items-center justify-center bg-black px-6 text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
          >
            ✕
          </button>

          <div className="flex flex-col items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-sm font-semibold tracking-[0.22em] text-white">
              OG
            </div>
            <p className="text-[10px] tracking-[0.34em] text-white/80">
              THE OLFACTORY GALLERY
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto bg-[#FBF6EF]">
          <nav>
            <ul className="border-t border-[#E5E5E5] pt-5">
              {primaryLinks.map((item) => (
                <li
                  key={item.label}
                  className="border-b border-[#E5E5E5]"
                >
                  {/* 🔥 IMPORTANT: relative added */}
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="relative flex items-center justify-center py-10 text-[17px] font-semibold uppercase tracking-[0.18em] text-gray-900 hover:bg-gray-100"
                  >
                    {/* Center Text */}
                    <span>{item.label}</span>

                    {/* Arrow Right */}
                    <svg
                      className="absolute right-5 h-4 w-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}