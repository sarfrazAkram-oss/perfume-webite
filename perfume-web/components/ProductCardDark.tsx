"use client";

import Image from "next/image";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  discount?: string;
  notes?: string;
}

export default function ProductCardDark({
  id,
  name,
  price,
  oldPrice,
  image,
  discount = "-75% OFF",
  notes,
}: ProductCardProps) {
  const handleAddToCart = () => {
    console.log(`Added ${name} to cart`);
    // TODO: Implement add to cart functionality
  };

  return (
    <div className="group mx-auto w-full max-w-[350px] cursor-pointer">
      {/* Product Image Container */}
      <div className="relative mb-4 sm:mb-5">
        <div className="relative h-[250px] w-full overflow-hidden rounded-lg bg-gray-900 sm:h-[260px]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-4 right-4 bg-[#D4AF37] text-black px-3 py-1 rounded text-xs sm:text-sm font-bold">
              {discount}
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2.5 sm:space-y-3">
        {/* Product Name */}
        <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-2">
          {name}
        </h3>

        {/* Product Notes */}
        {notes && (
          <p className="text-xs sm:text-sm text-[#A0A0A0] uppercase tracking-wider leading-relaxed">
            {notes}
          </p>
        )}

        {/* Price Info */}
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <p className="text-lg sm:text-xl font-bold text-[#D4AF37]">
              {price}
            </p>
            {oldPrice && (
              <p className="text-xs sm:text-sm text-[#666666] line-through">
                {oldPrice}
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="mt-1 w-full rounded bg-[#D4AF37] px-4 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-[#E6C767] active:scale-95"
          title="Add to Cart"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
