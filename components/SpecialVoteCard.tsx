"use client";

import { useState } from "react";
import { submitSpecialVote } from "@/actions/special-vote";
import { Check, Sparkles } from "lucide-react";

interface SpecialVoteCardProps {
  competitionId: string;
  participants: { id: string; name: string; avatarEmoji: string }[];
  products: { id: string; name: string; brand: string; flavor: string }[];
  existingVotes: { id: string; participantId: string; productId: string; category: string }[];
}

export function SpecialVoteCard({
  competitionId,
  participants,
  products,
  existingVotes,
}: SpecialVoteCardProps) {
  const [selectedParticipant, setSelectedParticipant] = useState(participants[0]?.id || "");
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || "");
  const [isVoting, setIsVoting] = useState(false);
  const [votedSuccess, setVotedSuccess] = useState(false);

  // Group votes by product
  const voteCounts: Record<string, number> = {};
  existingVotes
    .filter((v) => v.category === "MAS_ARGENTINO")
    .forEach((v) => {
      voteCounts[v.productId] = (voteCounts[v.productId] || 0) + 1;
    });

  // Find winner
  let topProductId: string | null = null;
  let maxVotes = 0;
  Object.entries(voteCounts).forEach(([pId, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      topProductId = pId;
    }
  });

  const topProduct = products.find((p) => p.id === topProductId);

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant || !selectedProduct) return;
    setIsVoting(true);
    try {
      await submitSpecialVote({
        competitionId,
        participantId: selectedParticipant,
        productId: selectedProduct,
        category: "MAS_ARGENTINO",
      });
      setVotedSuccess(true);
      setTimeout(() => setVotedSuccess(false), 2000);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-white border-2 border-sky-300 p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-sky-200 pb-3 sm:pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-sky-200 text-sky-950 flex items-center justify-center text-xl sm:text-2xl shadow-xs shrink-0">
            🇦🇷
          </div>
          <div>
            <h3 className="font-black text-base sm:text-xl text-sky-950">
              Premio Especial: “El Más Argentino”
            </h3>
            <p className="text-[11px] sm:text-xs text-sky-800">
              Votación de honor: ¿Cuál representa mejor la argentinidad?
            </p>
          </div>
        </div>

        {topProduct && maxVotes > 0 && (
          <div className="bg-sky-600 text-white px-3 py-1 rounded-xl text-xs font-black self-start sm:self-auto flex items-center gap-1.5 shadow-xs">
            <span>👑 Líder: {topProduct.name} ({maxVotes} votos)</span>
          </div>
        )}
      </div>

      {/* Interactive Vote Form */}
      {participants.length > 0 && products.length > 0 && (
        <form onSubmit={handleVote} className="bg-white rounded-2xl p-3.5 sm:p-4 border border-sky-200/80 shadow-xs space-y-3">
          <h4 className="text-[11px] sm:text-xs font-black text-sky-950 uppercase tracking-wider">
            Emitir o cambiar mi voto
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-sky-800 block mb-1">
                ¿Quién sos?
              </label>
              <select
                value={selectedParticipant}
                onChange={(e) => setSelectedParticipant(e.target.value)}
                className="w-full bg-[#fbf9f6] border border-[#e6dacd] rounded-xl px-3 py-2.5 text-xs font-bold text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.avatarEmoji} {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-sky-800 block mb-1">
                ¿Cuál es el más argentino?
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-[#fbf9f6] border border-[#e6dacd] rounded-xl px-3 py-2.5 text-xs font-bold text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.brand})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isVoting}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black text-xs sm:text-sm py-3.5 rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation"
          >
            {votedSuccess ? (
              <>
                <Check className="w-4 h-4 text-sky-200" />
                <span>¡Voto registrado con éxito! 🇦🇷</span>
              </>
            ) : (
              <span>Votar “Más Argentino” 🗳️</span>
            )}
          </button>
        </form>
      )}

      {/* Live Vote Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {products.map((p) => {
          const count = voteCounts[p.id] || 0;
          return (
            <div
              key={p.id}
              className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all ${
                count > 0
                  ? "bg-sky-100/80 border-sky-300 font-extrabold text-sky-950 shadow-xs"
                  : "bg-white/70 border-stone-200 text-stone-600 text-xs"
              }`}
            >
              <p className="font-bold text-xs truncate leading-tight">{p.name}</p>
              <span className="inline-block mt-1 bg-white px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-black text-sky-900 border border-sky-200">
                {count} {count === 1 ? "voto" : "votos"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
