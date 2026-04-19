"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SearchMenuTheme = "light" | "dark";

interface SearchMenuProps {
  theme: SearchMenuTheme;
}

export default function SearchMenu({ theme }: SearchMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const submitSearch = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const triggerClassName =
    theme === "dark"
      ? "text-[#D4AF37] hover:text-[#E7C97D]"
      : "text-[#C9A24A] hover:text-[#8A6F2D]";
  const panelBorder = theme === "dark" ? "border-[#1F1F1F]" : "border-gray-200";
  const panelBackground = theme === "dark" ? "bg-[#111111]" : "bg-[#FBF6EF]";
  const inputBackground = theme === "dark" ? "bg-[#0B0B0B]" : "bg-[#F7EDE0]";
  const inputBorder = theme === "dark" ? "border-[#262626]" : "border-gray-200";
  const inputText = theme === "dark" ? "text-white" : "text-gray-900";
  const placeholderText = theme === "dark" ? "placeholder:text-gray-500" : "placeholder:text-gray-400";

  return (
    <div ref={containerRef} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`transition-colors duration-300 ${triggerClassName}`}
        aria-label="Search products"
        aria-expanded={isOpen}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}
          className={`absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(92vw,340px)] rounded-2xl border ${panelBorder} ${panelBackground} p-3 shadow-[0_20px_40px_rgba(0,0,0,0.18)]`}
        >
          <div className={`flex items-center gap-3 rounded-xl border ${inputBorder} ${inputBackground} px-4 py-3`}>
            <svg
              className="h-5 w-5 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Search products"
              className={`w-full bg-transparent text-sm outline-none ${inputText} ${placeholderText}`}
            />
            <button
              type="submit"
              className="rounded-full bg-[#C9A24A] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-[#D8B866]"
            >
              Go
            </button>
          </div>
        </form>
      )}
    </div>
  );
}