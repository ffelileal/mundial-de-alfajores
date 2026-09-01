"use client";

import { RankedProduct, MundialStatistics } from "@/lib/scoring";
import { Share2, Check, Copy } from "lucide-react";
import { useState } from "react";

interface WhatsAppShareButtonProps {
  ranked: RankedProduct[];
  stats: MundialStatistics;
  competitionName: string;
}

export function WhatsAppShareButton({
  ranked,
  stats,
  competitionName,
}: WhatsAppShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const generateSummaryText = () => {
    let text = `🏆 *RESULTADOS OFICIALES: ${competitionName.toUpperCase()}* 🇦🇷🍫\n\n`;
    text += `👑 *PODIO FINAL:*\n`;

    const medals = ["🥇", "🥈", "🥉"];
    ranked.slice(0, 5).forEach((p, idx) => {
      const medal = medals[idx] || `${idx + 1}°`;
      text += `${medal} *${p.name}* (${p.brand}) ➔ ⭐ ${p.finalScoreAverage.toFixed(1)}/10 (Sabor: ${p.tasteAverage.toFixed(1)} | Empaque: ${p.packagingAverage.toFixed(1)})\n`;
    });

    if (stats.mostControversial) {
      text += `\n🔥 *ALFAJOR MÁS POLÉMICO:*\n`;
      text += `👉 ${stats.mostControversial.productName}\n`;
      text += `• ${stats.mostControversial.highestEvaluation.participantName}: ${stats.mostControversial.highestEvaluation.score}/10\n`;
      text += `• ${stats.mostControversial.lowestEvaluation.participantName}: ${stats.mostControversial.lowestEvaluation.score}/10\n`;
      text += `_"Acá claramente alguien no entiende de alfajores."_\n`;
    }

    if (stats.crowdFavorite) {
      text += `\n❤️ *FAVORITO DEL PÚBLICO:* ${stats.crowdFavorite.product.name} (${stats.crowdFavorite.tenCount} veces 10/10)\n`;
    }

    text += `\n🇦🇷 _"Acá no existen los empates. Existe el alfajor que merecía ganar."_`;

    return text;
  };

  const handleShareWhatsApp = () => {
    const text = generateSummaryText();
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  const handleCopy = () => {
    const text = generateSummaryText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
      <button
        onClick={handleShareWhatsApp}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-3.5 rounded-2xl shadow-md active:scale-95 transition-all cursor-pointer text-xs sm:text-sm touch-manipulation"
      >
        <Share2 className="w-4 h-4" />
        <span>Compartir en WhatsApp 📱</span>
      </button>

      <button
        onClick={handleCopy}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#54311c] font-bold px-4 py-3.5 rounded-2xl border border-[#e6dacd] hover:bg-[#efe6dc] active:scale-95 transition-all cursor-pointer text-xs sm:text-sm touch-manipulation"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 font-black">¡Copiado al portapapeles!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-stone-500" />
            <span>Copiar resumen 📋</span>
          </>
        )}
      </button>
    </div>
  );
}
