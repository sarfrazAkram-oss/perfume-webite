"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "MEN",
    link: "/men",
    image: "/images/products/men.svg",
  },
  {
    name: "WOMEN",
    link: "/women",
    image: "/images/products/women.svg",
  },
  {
    name: "ARABIC",
    link: "/arabic",
    image: "/images/products/arabic.svg",
  },
];

export default function CategoryQuickAccess() {
  return (
    <section className="section-padding content-px">
      <div className="content-container">
        <div className="grid grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.link}
              className="group"
            >
              <div className="aspect-square rounded-full overflow-hidden bg-gray-100 hover:shadow-lg hover:shadow-[#C9A24A]/20 transition-shadow duration-300">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-center text-sm sm:text-base font-semibold text-black mt-4 group-hover:text-[#C9A24A] transition-colors">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
