"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: "Winter Sale",
      subtitle: "Up to 75% Off",
      image: "/images/ui/winter-collection.svg",
    },
    {
      id: 2,
      title: "Summer Breeze",
      subtitle: "New Arrivals",
      image: "/images/ui/summer-collection.svg",
    },
    {
      id: 3,
      title: "Luxury Collection",
      subtitle: "Exclusive Scents",
      image: "/images/ui/luxury-collection.svg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-[60vh] sm:h-[65vh] overflow-hidden bg-gray-100 mb-8 sm:mb-12">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </div>

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-widest">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-2xl md:text-3xl text-[#C9A24A] font-semibold">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-[#C9A24A] transition-colors"
        aria-label="Previous slide"
      >
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-[#C9A24A] transition-colors"
        aria-label="Next slide"
      >
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10"
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
      </button>

      {/* Indicators (Dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-3 h-3 bg-[#C9A24A]"
                : "w-2 h-2 bg-gray-600 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
