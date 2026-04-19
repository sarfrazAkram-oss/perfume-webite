"use client";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export default function StarRating({ value, onChange, disabled = false }: StarRatingProps) {
  return (
    <div className="inline-flex items-center gap-1" aria-label="Rating">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(starValue)}
            className={`text-[22px] leading-none transition-colors ${isActive ? "text-[#C9A24A]" : "text-black/20"} ${disabled ? "cursor-default" : "hover:text-[#C9A24A]"}`}
            aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}