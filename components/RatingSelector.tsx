"use client";

import { useState } from "react";
import { Star, Minus, Plus } from "lucide-react";
import { clsx } from "clsx";

interface RatingSelectorProps {
  label: string;
  category: "taste" | "packaging";
  value: number;
  onChange: (value: number) => void;
  weightText?: string;
  icon?: string;
}

const REACTION_MAP: Record<number, { emoji: string; label: string; color: string }> = {
  1: { emoji: "💀", label: "Incomible / Desastre", color: "text-red-600 bg-red-50 border-red-200" },
  2: { emoji: "🤢", label: "Muy flojo", color: "text-red-500 bg-red-50 border-red-200" },
  3: { emoji: "😕", label: "Decepcionante", color: "text-amber-800 bg-amber-50 border-amber-200" },
  4: { emoji: "😐", label: "Apenas zafa", color: "text-amber-700 bg-amber-50 border-amber-200" },
  5: { emoji: "🙂", label: "Medio pelo / Cumple", color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  6: { emoji: "👌", label: "Digno para el mate", color: "text-yellow-800 bg-yellow-50 border-yellow-200" },
  7: { emoji: "😋", label: "Rico y rendidor", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  8: { emoji: "🤤", label: "Muy bueno, recomendado", color: "text-emerald-800 bg-emerald-50 border-emerald-200" },
  9: { emoji: "🔥", label: "Una locura total", color: "text-orange-700 bg-orange-50 border-orange-200 font-bold" },
  10: { emoji: "👑", label: "¡De otro planeta! Obra de arte", color: "text-amber-900 bg-amber-100 border-amber-300 font-black" },
};

export function RatingSelector({
  label,
  category,
  value,
  onChange,
  weightText,
  icon,
}: RatingSelectorProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const activeValue = hovered !== null ? hovered : value;
  const currentReaction = REACTION_MAP[activeValue] || REACTION_MAP[8];

  const isTaste = category === "taste";

  const handleDecrement = () => {
    if (value > 1) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < 10) onChange(value + 1);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6dacd] shadow-sm space-y-3.5">
      {/* Category Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-[#fbf9f6] border border-[#e6dacd] flex items-center justify-center text-2xl shrink-0">
            {icon || (isTaste ? "🍫" : "📦")}
          </div>
          <div>
            <h3 className="font-black text-[#2c1810] text-sm sm:text-base tracking-tight leading-snug">
              {label}
            </h3>
            {weightText && (
              <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#efe6dc] text-[#54311c] mt-0.5">
                Peso: {weightText}
              </span>
            )}
          </div>
        </div>

        {/* 1-Hand Stepper Controls for Mobile */}
        <div className="flex items-center gap-1.5 bg-[#fbf9f6] p-1 rounded-2xl border border-[#e6dacd] shrink-0">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={value <= 1}
            aria-label="Disminuir nota"
            className="w-8 h-8 rounded-xl bg-white text-[#54311c] border border-[#e6dacd] flex items-center justify-center font-black disabled:opacity-30 active:scale-90 transition-transform touch-manipulation cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="w-10 text-center">
            <span className={clsx("text-xl font-black", isTaste ? "text-[#54311c]" : "text-sky-700")}>
              {activeValue}
            </span>
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={value >= 10}
            aria-label="Aumentar nota"
            className="w-8 h-8 rounded-xl bg-white text-[#54311c] border border-[#e6dacd] flex items-center justify-center font-black disabled:opacity-30 active:scale-90 transition-transform touch-manipulation cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Emoji & Verbal Reaction Pill */}
      <div
        className={clsx(
          "flex items-center justify-center gap-2 py-2 px-3 rounded-2xl border text-center transition-all min-h-[44px]",
          currentReaction.color
        )}
      >
        <span className="text-xl shrink-0">{currentReaction.emoji}</span>
        <span className="text-xs sm:text-sm font-bold tracking-tight">
          {currentReaction.label}
        </span>
      </div>

      {/* Mobile-Friendly Buttons: 2 rows of 5 buttons on mobile (52px height each) */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2 pt-0.5">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
          const isSelected = value === num;
          const isHover = hovered === num;

          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              onMouseEnter={() => setHovered(num)}
              onMouseLeave={() => setHovered(null)}
              className={clsx(
                "h-12 sm:h-11 rounded-2xl font-black text-sm sm:text-base flex flex-col items-center justify-center transition-all cursor-pointer select-none touch-manipulation active:scale-90",
                isSelected
                  ? isTaste
                    ? "bg-[#4a2712] text-white shadow-md shadow-amber-950/30 scale-[1.03] ring-2 ring-amber-400"
                    : "bg-sky-600 text-white shadow-md shadow-sky-950/30 scale-[1.03] ring-2 ring-sky-300"
                  : isHover
                  ? "bg-[#efe6dc] text-[#2c1810]"
                  : "bg-[#fbf9f6] text-[#54311c] border border-[#e6dacd] hover:bg-[#efe6dc]"
              )}
            >
              <span>{num}</span>
              {num === 10 && <span className="text-[9px] -mt-1">⭐</span>}
            </button>
          );
        })}
      </div>

      {/* Star indicator & Slider bar */}
      <div className="pt-1 flex items-center justify-between gap-2">
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-[#54311c] cursor-pointer h-2 bg-stone-100 rounded-lg appearance-none"
        />
      </div>
    </div>
  );
}
