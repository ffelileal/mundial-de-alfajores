"use client";

import { useState } from "react";
import { RankedProduct } from "@/lib/scoring";
import { Eye, EyeOff, Sparkles, ChevronRight, ChevronLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlindRevealModalProps {
  products: RankedProduct[];
  onFinish?: () => void;
}

export function BlindRevealModal({ products, onFinish }: BlindRevealModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const currentProduct = products[currentIndex];

  const handleRevealCurrent = () => {
    setIsRevealed(true);
    if (!revealedIds.includes(currentProduct.id)) {
      setRevealedIds([...revealedIds, currentProduct.id]);
    }
  };

  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsRevealed(revealedIds.includes(products[currentIndex + 1].id));
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsRevealed(revealedIds.includes(products[currentIndex - 1].id));
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-black text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-lg shadow-purple-950/20 active:scale-95 transition-all cursor-pointer touch-manipulation"
      >
        <Eye className="w-4 h-4 text-purple-200" />
        <span>🎭 Ceremonia de Revelación (Cata a Ciegas)</span>
      </button>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-[#231208] text-stone-100 rounded-3xl max-w-lg w-full p-5 sm:p-7 border border-amber-900/50 shadow-2xl relative overflow-hidden flex flex-col justify-between max-h-[92vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-amber-950 pb-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🕵️</span>
                  <div>
                    <h3 className="font-black text-sm sm:text-base text-amber-400">
                      Revelación de Identidades
                    </h3>
                    <p className="text-[10px] text-stone-400">
                      Muestra {currentIndex + 1} de {products.length}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-stone-400 hover:text-white p-1.5 rounded-xl bg-stone-900 cursor-pointer active:scale-90"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Central Reveal Stage */}
              <div className="text-center py-4 my-auto">
                <div className="inline-block bg-purple-950 text-purple-300 font-black text-[10px] sm:text-xs px-3 py-1 rounded-full border border-purple-800 mb-3">
                  ALFAJOR #{String(currentProduct.orderNumber).padStart(2, "0")}
                </div>

                {!isRevealed ? (
                  <div className="space-y-3 my-2">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-stone-900 border-2 border-stone-700 flex items-center justify-center text-3xl sm:text-4xl shadow-inner animate-pulse">
                      ❓
                    </div>
                    <h4 className="text-lg sm:text-2xl font-black text-amber-200 leading-tight">
                      ¿Quién era el Alfajor #{String(currentProduct.orderNumber).padStart(2, "0")}?
                    </h4>
                    <p className="text-[11px] sm:text-xs text-stone-400">
                      Puntaje en la cata: <strong className="text-amber-400">{currentProduct.finalScoreAverage.toFixed(1)}/10</strong>
                    </p>

                    <button
                      type="button"
                      onClick={handleRevealCurrent}
                      className="w-full mt-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-black text-sm sm:text-base py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 touch-manipulation"
                    >
                      <Sparkles className="w-5 h-5 text-amber-950" />
                      <span>¡REVELAR AHORA! ✨</span>
                    </button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-3 my-2"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-700 border-2 border-amber-300 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-amber-500/30">
                      🍫
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-widest">
                        {currentProduct.brand}
                      </span>
                      <h4 className="text-xl sm:text-3xl font-black text-white mt-0.5 leading-tight">
                        {currentProduct.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-300 font-medium mt-0.5">
                        {currentProduct.flavor}
                      </p>
                    </div>

                    <div className="bg-stone-900/90 rounded-2xl p-3 border border-amber-900/40 grid grid-cols-3 gap-1 divide-x divide-stone-800 text-center">
                      <div>
                        <p className="text-[9px] text-stone-400">Sabor</p>
                        <p className="text-base sm:text-lg font-black text-amber-400">
                          {currentProduct.tasteAverage.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-stone-400">Empaque</p>
                        <p className="text-base sm:text-lg font-black text-sky-400">
                          {currentProduct.packagingAverage.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-stone-400">Final</p>
                        <p className="text-base sm:text-lg font-black text-white">
                          {currentProduct.finalScoreAverage.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-amber-950 mt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-3.5 py-2 rounded-xl bg-stone-900 text-stone-300 disabled:opacity-25 text-xs font-bold active:scale-95 touch-manipulation flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>

                <div className="flex gap-1">
                  {products.map((p, idx) => (
                    <div
                      key={p.id}
                      className={`w-1.5 h-1.5 rounded-full ${
                        idx === currentIndex
                          ? "bg-amber-400 scale-125"
                          : revealedIds.includes(p.id)
                          ? "bg-emerald-500"
                          : "bg-stone-700"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === products.length - 1}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 text-amber-950 disabled:opacity-25 text-xs font-black flex items-center gap-1 active:scale-95 touch-manipulation"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
