"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitEvaluation } from "@/actions/evaluation";
import { RatingSelector } from "@/components/RatingSelector";
import { calculateIndividualScore } from "@/lib/scoring";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  EyeOff,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TastingEvaluationFormProps {
  competitionId: string;
  participant: {
    id: string;
    name: string;
    avatarEmoji: string;
  };
  product: {
    id: string;
    orderNumber: number;
    name: string;
    brand: string;
    flavor: string;
    image?: string | null;
    description?: string | null;
  };
  totalProducts: number;
  currentProductIndex: number;
  nextProductId?: string | null;
  blindTasting?: boolean;
  tasteWeight?: number;
  packagingWeight?: number;
}

export function TastingEvaluationForm({
  competitionId,
  participant,
  product,
  totalProducts,
  currentProductIndex,
  nextProductId,
  blindTasting = false,
  tasteWeight = 0.8,
  packagingWeight = 0.2,
}: TastingEvaluationFormProps) {
  const router = useRouter();

  // Ratings State
  const [tasteScore, setTasteScore] = useState<number>(8);
  const [packagingScore, setPackagingScore] = useState<number>(8);
  const [comment, setComment] = useState<string>("");

  // UI Flow State
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  const previewFinalScore = calculateIndividualScore(
    tasteScore,
    packagingScore,
    tasteWeight,
    packagingWeight
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await submitEvaluation({
        competitionId,
        participantId: participant.id,
        productId: product.id,
        tasteScore,
        packagingScore,
        comment,
      });

      setShowConfirmModal(false);
      setShowSuccessToast(true);

      // Navigate to next or complete after short delay
      setTimeout(() => {
        if (nextProductId) {
          router.push(`/play/tasting/${nextProductId}`);
        } else {
          router.push(`/play`);
        }
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Error al registrar la puntuación.");
      setIsSubmitting(false);
    }
  };

  const progressPercent = Math.round((currentProductIndex / totalProducts) * 100);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-xl mx-auto pb-24 sm:pb-8">
      {/* 1. Progress & Participant Header */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#e6dacd] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#fbf9f6] border border-[#e6dacd] flex items-center justify-center text-xl shrink-0">
            {participant.avatarEmoji || "👤"}
          </div>
          <div>
            <span className="text-[9px] font-black text-[#786556] uppercase tracking-wider">
              Degustando
            </span>
            <h3 className="font-black text-sm text-[#2c1810] leading-none mt-0.5">
              {participant.name}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-black text-amber-600">
            Alfajor {currentProductIndex} de {totalProducts}
          </span>
          <div className="w-24 sm:w-28 h-2 bg-stone-100 rounded-full overflow-hidden mt-1 border border-stone-200">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Product Presentation Card */}
      <div className="bg-gradient-to-br from-[#2c1810] to-[#432314] text-white rounded-3xl p-5 sm:p-7 border border-amber-900 shadow-lg relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {blindTasting ? (
          /* Blind Tasting Anonymous View */
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800 text-[10px] sm:text-xs font-black">
              <EyeOff className="w-3.5 h-3.5" />
              <span>CATA A CIEGAS</span>
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-stone-900/90 border border-stone-700 flex items-center justify-center text-2xl sm:text-3xl shadow-inner">
              🍫
            </div>

            <div>
              <p className="text-[10px] sm:text-xs font-bold text-amber-400/80 tracking-widest uppercase">
                Muestra Oculta
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                ALFAJOR #{String(product.orderNumber).padStart(2, "0")}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-300/80 mt-1 italic max-w-xs mx-auto">
                La identidad se revelará automáticamente en los resultados.
              </p>
            </div>
          </div>
        ) : (
          /* Regular View with full brand & flavor info */
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-amber-300 border border-white/20 text-[10px] font-bold">
              <span>🍫 MUESTRA #{product.orderNumber}</span>
            </div>

            {product.image && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl overflow-hidden border-2 border-amber-300/40 shadow-md">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <p className="text-[10px] sm:text-xs font-black text-amber-400 tracking-widest uppercase">
                {product.brand}
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 font-medium mt-0.5">
                {product.flavor}
              </p>
              {product.description && (
                <p className="text-[11px] sm:text-xs text-amber-200/70 italic mt-1.5 max-w-sm mx-auto">
                  {product.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Rating: Sabor (80%) */}
      <RatingSelector
        label="Sabor del Alfajor"
        category="taste"
        value={tasteScore}
        onChange={setTasteScore}
        weightText="80%"
        icon="🍫"
      />

      {/* 4. Rating: Empaque (20%) */}
      <RatingSelector
        label="Empaque & Packaging"
        category="packaging"
        value={packagingScore}
        onChange={setPackagingScore}
        weightText="20%"
        icon="📦"
      />

      {/* 5. Comentario / Opinión */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6dacd] shadow-sm space-y-2">
        <label className="text-xs font-black text-[#54311c] uppercase tracking-wider flex items-center gap-1.5">
          <span>💬</span>
          <span>¿Qué opinás de este alfajor? (Opcional)</span>
        </label>
        <textarea
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="“Demasiado dulce, pero banco fuerte el chocolate...” / “La masa es una manteca...”"
          className="w-full bg-[#fbf9f6] border border-[#e6dacd] rounded-2xl p-3 text-xs sm:text-sm text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#74acdf] resize-none"
        />
        <p className="text-[10px] text-[#786556]">
          Tu frase podrá aparecer como cita destacada en el podio final.
        </p>
      </div>

      {/* Error notification if any */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 6. Mobile Floating Sticky Bottom Confirmation Bar */}
      <div className="fixed bottom-14 sm:bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-[#fbf9f6] via-[#fbf9f6]/95 to-transparent backdrop-blur-xs">
        <div className="max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-sm sm:text-base py-3.5 sm:py-4 px-4 rounded-2xl shadow-xl shadow-amber-950/20 active:scale-95 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🍫</span>
              <span>CONFIRMAR PUNTUACIÓN</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-950 text-amber-200 text-xs px-2.5 py-1 rounded-xl font-black">
              <span>⭐ {previewFinalScore.toFixed(1)}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* 7. Confirmation Modal (Optimized for Mobile) */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 border border-[#e6dacd] shadow-2xl space-y-4 text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl shadow-xs">
                ⚖️
              </div>

              <div>
                <h3 className="font-black text-base sm:text-lg text-[#2c1810]">
                  ¿Confirmar puntuación?
                </h3>
                <p className="text-xs text-[#786556] mt-0.5">
                  Una vez confirmada, tu nota quedará asentada en la base de datos.
                </p>
              </div>

              {/* Score Breakdown Summary */}
              <div className="bg-[#fbf9f6] rounded-2xl p-3.5 border border-[#e6dacd] space-y-2 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#54311c]">🍫 Sabor (80%):</span>
                  <span className="font-black text-sm text-[#2c1810]">{tasteScore} / 10</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#54311c]">📦 Empaque (20%):</span>
                  <span className="font-black text-sm text-[#2c1810]">{packagingScore} / 10</span>
                </div>
                <div className="w-full h-px bg-[#e6dacd]" />
                <div className="flex justify-between items-center text-sm">
                  <span className="font-extrabold text-[#2c1810]">⭐ Nota Ponderada:</span>
                  <span className="font-black text-base text-amber-600">
                    {previewFinalScore.toFixed(1)} / 10
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  className="bg-[#efe6dc] hover:bg-[#e6dacd] text-[#54311c] font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer active:scale-95"
                >
                  Modificar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-[#54311c] hover:bg-[#3d2112] text-white font-black text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1 active:scale-95"
                >
                  {isSubmitting ? "Guardando..." : "Confirmar ✓"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. Success Feedback Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-[#2c1810] text-white px-6 py-5 rounded-3xl shadow-2xl border-2 border-amber-400 flex flex-col items-center gap-2 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-black shadow-lg">
              ✓
            </div>
            <p className="font-black text-base text-amber-300">¡Puntuación registrada! 🍫</p>
            <p className="text-xs text-stone-300">Pasando al siguiente alfajor...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
