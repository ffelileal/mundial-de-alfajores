import { getPlayerSession } from "@/lib/player-auth";
import { getOrCreateDefaultCompetition } from "@/actions/competition";
import { calculateRanking, calculateStatistics } from "@/lib/scoring";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Podium } from "@/components/Podium";
import { Confetti } from "@/components/Confetti";
import { WhatsAppShareButton } from "@/components/WhatsAppShareButton";
import { SpecialVoteCard } from "@/components/SpecialVoteCard";
import {
  Trophy,
  BarChart3,
  Flame,
  MessageSquare,
  ArrowLeft,
  Lock,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default async function PlayerResultsPage() {
  const session = await getPlayerSession();

  if (!session?.participantId) {
    redirect("/");
  }

  const competition = await getOrCreateDefaultCompetition();

  // STRICT BACKEND ACCESS CONTROL: If results are not visible, reject access
  if (!competition.resultsVisible) {
    return (
      <div className="max-w-md mx-auto py-8 sm:py-16 text-center space-y-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-3xl sm:text-4xl shadow-inner border border-amber-300">
          🔒
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-[#2c1810]">
            Resultados aún no publicados
          </h2>
          <p className="text-xs sm:text-sm text-[#786556] leading-relaxed">
            El administrador todavía no habilitó la visualización de los resultados oficiales. Podrás ver el podio y los ganadores en cuanto se dé inicio a la ceremonia.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/play"
            className="inline-flex items-center justify-center gap-2 bg-[#54311c] text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a mi panel</span>
          </Link>
          <Link
            href="/play/results"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#54311c] border border-[#e6dacd] font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Actualizar</span>
          </Link>
        </div>
      </div>
    );
  }

  const participants = competition.participants || [];
  const products = competition.products || [];
  const evaluations = competition.evaluations || [];
  const specialVotes = competition.specialVotes || [];

  const ranked = calculateRanking(products, evaluations, participants);
  const stats = calculateStatistics(products, evaluations, participants);

  return (
    <div className="space-y-6 sm:space-y-10 py-2 sm:py-6">
      <Confetti trigger={true} />

      {/* Top navigation */}
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/play"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#786556] hover:text-[#54311c] px-2 py-1 rounded-lg hover:bg-[#efe6dc]/50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al lobby</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-black text-xs shadow-xs">
          <span>🏆</span>
          <span>RESULTADOS OFICIALES DEL MUNDIAL</span>
          <span>🇦🇷</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#2c1810] tracking-tight">
          ¡Tenemos Campeón! 👑
        </h1>
        <p className="text-xs sm:text-sm text-[#786556] max-w-lg mx-auto">
          {evaluations.length} evaluaciones registradas por el jurado.
        </p>

        {ranked.length > 0 && (
          <div className="flex justify-center pt-2">
            <WhatsAppShareButton
              ranked={ranked}
              stats={stats}
              competitionName={competition.name}
            />
          </div>
        )}
      </div>

      {/* 1. Podio de Ganadores */}
      <Podium ranked={ranked} blindTasting={false} />

      {/* 2. Tabla / Tarjetas de Posiciones */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#e6dacd] shadow-sm space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-[#e6dacd] pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#2c1810]">
                Tabla de Posiciones Oficial
              </h2>
              <p className="text-[11px] sm:text-xs text-[#786556]">
                Fórmula: (Sabor × 80%) + (Empaque × 20%)
              </p>
            </div>
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden space-y-2.5">
          {ranked.map((p, idx) => {
            const medals = ["🥇", "🥈", "🥉"];
            const medal = medals[idx];

            return (
              <div
                key={p.id}
                className={`rounded-2xl p-3.5 border transition-all ${
                  idx === 0
                    ? "bg-amber-50/80 border-amber-300 shadow-xs"
                    : idx === 1
                    ? "bg-stone-50 border-stone-300"
                    : idx === 2
                    ? "bg-amber-50/40 border-amber-200"
                    : "bg-[#fbf9f6] border-[#e6dacd]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#e6dacd] flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                      {medal || `${p.rank}°`}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-black text-sm text-[#2c1810] leading-tight">
                          {p.name}
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#efe6dc] text-[#54311c]">
                          {p.brand}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#786556] mt-0.5">{p.flavor}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-xl font-black text-sm ${
                        idx === 0
                          ? "bg-amber-400 text-amber-950 shadow-xs"
                          : "bg-white text-[#2c1810] border border-[#e6dacd]"
                      }`}
                    >
                      ⭐ {p.finalScoreAverage.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#e6dacd]/60 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-3 font-bold">
                    <span className="text-[#54311c]">🍫 Sabor: {p.tasteAverage.toFixed(1)}</span>
                    <span className="text-sky-800">📦 Empaque: {p.packagingAverage.toFixed(1)}</span>
                  </div>
                  {p.tiebreakerReason && (
                    <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                      ⚖️ Desempate
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e6dacd] text-[11px] font-black text-[#786556] uppercase tracking-wider">
                <th className="py-3 px-3">Puesto</th>
                <th className="py-3 px-3">Alfajor</th>
                <th className="py-3 px-3 text-right">🍫 Sabor (80%)</th>
                <th className="py-3 px-3 text-right">📦 Empaque (20%)</th>
                <th className="py-3 px-3 text-right">⭐ Puntaje Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dacd] text-sm">
              {ranked.map((p, idx) => {
                const medals = ["🥇", "🥈", "🥉"];
                const medal = medals[idx];

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-[#fbf9f6] transition-colors ${
                      idx === 0
                        ? "bg-amber-50/60 font-bold"
                        : idx === 1
                        ? "bg-stone-50/50"
                        : idx === 2
                        ? "bg-amber-50/20"
                        : ""
                    }`}
                  >
                    <td className="py-4 px-3 font-black text-base">
                      {medal ? (
                        <span className="text-xl">{medal}</span>
                      ) : (
                        <span className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-600">
                          {p.rank}°
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#2c1810]">{p.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#efe6dc] text-[#54311c]">
                          {p.brand}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#786556]">{p.flavor}</p>
                      {p.tiebreakerReason && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                          ⚖️ {p.tiebreakerReason}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3 text-right font-bold text-[#54311c]">
                      {p.tasteAverage.toFixed(1)}
                    </td>
                    <td className="py-4 px-3 text-right font-bold text-sky-800">
                      {p.packagingAverage.toFixed(1)}
                    </td>
                    <td className="py-4 px-3 text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-xl font-black text-base ${
                          idx === 0
                            ? "bg-amber-400 text-amber-950 shadow-xs"
                            : "bg-[#fbf9f6] text-[#2c1810] border border-[#e6dacd]"
                        }`}
                      >
                        {p.finalScoreAverage.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Deck de Estadísticas */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-[#2c1810] tracking-tight text-center">
          Estadísticas & Distinciones Especiales 🏅
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {stats.champion && (
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🏆</span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  Campeón General
                </span>
              </div>
              <h4 className="font-black text-sm sm:text-base text-[#2c1810] leading-snug">{stats.champion.name}</h4>
              <p className="text-[11px] text-[#786556]">{stats.champion.brand} • {stats.champion.flavor}</p>
              <div className="pt-1 text-lg sm:text-xl font-black text-amber-700">
                ⭐ {stats.champion.finalScoreAverage.toFixed(1)} / 10
              </div>
            </div>
          )}

          {stats.bestTaste && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6dacd] shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🍫</span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-stone-100 text-[#54311c] px-2 py-0.5 rounded-full">
                  Mejor Sabor
                </span>
              </div>
              <h4 className="font-black text-sm sm:text-base text-[#2c1810] leading-snug">{stats.bestTaste.name}</h4>
              <p className="text-[11px] text-[#786556]">{stats.bestTaste.brand}</p>
              <div className="pt-1 text-lg sm:text-xl font-black text-[#54311c]">
                ⭐ {stats.bestTaste.tasteAverage.toFixed(1)} / 10
              </div>
            </div>
          )}

          {stats.bestPackaging && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6dacd] shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">📦</span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                  Mejor Packaging
                </span>
              </div>
              <h4 className="font-black text-sm sm:text-base text-[#2c1810] leading-snug">{stats.bestPackaging.name}</h4>
              <p className="text-[11px] text-[#786556]">{stats.bestPackaging.brand}</p>
              <div className="pt-1 text-lg sm:text-xl font-black text-sky-700">
                ⭐ {stats.bestPackaging.packagingAverage.toFixed(1)} / 10
              </div>
            </div>
          )}

          {stats.crowdFavorite && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6dacd] shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-2xl">❤️</span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                  Favorito del Público
                </span>
              </div>
              <h4 className="font-black text-sm sm:text-base text-[#2c1810] leading-snug">
                {stats.crowdFavorite.product.name}
              </h4>
              <p className="text-[11px] text-[#786556]">{stats.crowdFavorite.product.brand}</p>
              <div className="pt-1 text-xs sm:text-sm font-black text-rose-600">
                🎯 {stats.crowdFavorite.tenCount} calificaciones de 10/10
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6dacd] shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📊</span>
              <span className="text-[9px] font-black uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                Promedio del Torneo
              </span>
            </div>
            <h4 className="font-black text-sm sm:text-base text-[#2c1810] leading-snug">Nivel General</h4>
            <p className="text-[11px] text-[#786556]">{evaluations.length} evaluaciones</p>
            <div className="pt-1 text-lg sm:text-xl font-black text-stone-700">
              ⭐ {stats.generalAverage.toFixed(1)} / 10
            </div>
          </div>
        </div>
      </div>

      {/* 4. Momento Polémico */}
      {stats.mostControversial && (
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] sm:text-xs font-black">
              <Flame className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
              <span>🔥 MOMENTO POLÉMICO</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
                La Grieta: {stats.mostControversial.productName}
              </h3>
              <p className="text-[11px] sm:text-xs text-orange-100 mt-0.5">
                Diferencia de {stats.mostControversial.difference} puntos entre miembros del jurado.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] sm:text-xs font-bold text-yellow-200">
                    😍 {stats.mostControversial.highestEvaluation.participantName}
                  </span>
                  <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-lg">
                    ⭐ {stats.mostControversial.highestEvaluation.score}/10
                  </span>
                </div>
                <p className="text-xs italic text-white/90">
                  {stats.mostControversial.highestEvaluation.comment ? `“${stats.mostControversial.highestEvaluation.comment}”` : "Le pareció una maravilla."}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] sm:text-xs font-bold text-orange-200">
                    🤨 {stats.mostControversial.lowestEvaluation.participantName}
                  </span>
                  <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-lg">
                    ⭐ {stats.mostControversial.lowestEvaluation.score}/10
                  </span>
                </div>
                <p className="text-xs italic text-white/90">
                  {stats.mostControversial.lowestEvaluation.comment ? `“${stats.mostControversial.lowestEvaluation.comment}”` : "No le gustó para nada."}
                </p>
              </div>
            </div>

            <p className="text-xs text-center font-bold text-yellow-100 italic pt-0.5">
              “Acá claramente alguien no entiende de alfajores.” 😉
            </p>
          </div>
        </div>
      )}

      {/* 5. Frases del Jurado */}
      {stats.featuredQuotes.length > 0 && (
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#e6dacd] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#e6dacd] pb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#2c1810]">
                Frases & Opiniones del Jurado 🗣️
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {stats.featuredQuotes.map((q, idx) => (
              <div
                key={idx}
                className="bg-[#fbf9f6] rounded-2xl p-3.5 border border-[#e6dacd] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    {q.productName}
                  </span>
                  <span className="text-xs font-black text-stone-700">
                    ⭐ {q.finalScore.toFixed(1)}/10
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#2c1810] italic font-medium">
                  “{q.comment}”
                </p>
                <p className="text-[10px] font-bold text-[#786556] text-right">
                  — {q.participantName}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
