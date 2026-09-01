import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrCreateDefaultCompetition } from "@/actions/competition";
import { calculateRanking, calculateStatistics } from "@/lib/scoring";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { Podium } from "@/components/Podium";
import { BlindRevealModal } from "@/components/BlindRevealModal";
import { WhatsAppShareButton } from "@/components/WhatsAppShareButton";
import { SpecialVoteCard } from "@/components/SpecialVoteCard";
import {
  Trophy,
  BarChart3,
  Flame,
  MessageSquare,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

export default async function AdminResultsPage() {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    redirect("/admin");
  }

  const competition = await getOrCreateDefaultCompetition();

  const participants = competition.participants || [];
  const products = competition.products || [];
  const evaluations = competition.evaluations || [];
  const specialVotes = competition.specialVotes || [];

  const ranked = calculateRanking(products, evaluations, participants);
  const stats = calculateStatistics(products, evaluations, participants);

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2 sm:py-6">
      <AdminNav />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6dacd] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#2c1810]">
              Resultados & Ranking en Vivo (Admin)
            </h1>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                competition.resultsVisible
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {competition.resultsVisible ? "Públicos para jugadores" : "Ocultos a jugadores"}
            </span>
          </div>
          <p className="text-xs text-[#786556]">
            {evaluations.length} evaluaciones registradas en tiempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {competition.blindTasting && products.length > 0 && (
            <BlindRevealModal products={ranked} />
          )}

          {ranked.length > 0 && (
            <WhatsAppShareButton
              ranked={ranked}
              stats={stats}
              competitionName={competition.name}
            />
          )}
        </div>
      </div>

      {/* Podio */}
      {ranked.length > 0 && evaluations.length > 0 ? (
        <Podium ranked={ranked} blindTasting={false} />
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-[#e6dacd] text-center space-y-2">
          <div className="text-3xl">🍫</div>
          <h3 className="font-black text-sm text-[#2c1810]">No hay evaluaciones registradas</h3>
          <p className="text-xs text-[#786556]">
            A medida que los jugadores califiquen alfajores, el ranking y podio se calcularán en vivo aquí.
          </p>
        </div>
      )}

      {/* Tabla Oficial */}
      {ranked.length > 0 && (
        <div className="bg-white rounded-3xl p-4 sm:p-7 border border-[#e6dacd] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#e6dacd] pb-3">
            <h2 className="text-base sm:text-lg font-black text-[#2c1810]">
              Tabla Oficial de Posiciones
            </h2>
            <span className="text-[10px] font-bold text-[#786556] bg-[#fbf9f6] px-2.5 py-1 rounded-xl border border-[#e6dacd]">
              (Sabor × 0.80) + (Empaque × 0.20)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e6dacd] text-[11px] font-black text-[#786556] uppercase tracking-wider">
                  <th className="py-3 px-3">Puesto</th>
                  <th className="py-3 px-3">Alfajor</th>
                  <th className="py-3 px-3 text-right">🍫 Sabor (80%)</th>
                  <th className="py-3 px-3 text-right">📦 Empaque (20%)</th>
                  <th className="py-3 px-3 text-right">⭐ Final</th>
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
                        idx === 0 ? "bg-amber-50/60 font-bold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-3 font-black text-base">
                        {medal ? (
                          <span>{medal}</span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-600">
                            {p.rank}°
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#2c1810]">{p.name}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#efe6dc] text-[#54311c]">
                            {p.brand}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#786556]">{p.flavor}</p>
                        {p.tiebreakerReason && (
                          <span className="inline-block text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded mt-0.5">
                            ⚖️ {p.tiebreakerReason}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-[#54311c]">
                        {p.tasteAverage.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-sky-800">
                        {p.packagingAverage.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-[#2c1810]">
                        ⭐ {p.finalScoreAverage.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Momento Polémico */}
      {stats.mostControversial && (
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-3xl p-5 sm:p-7 shadow-lg space-y-3">
          <div className="flex items-center gap-1.5 font-black text-xs">
            <Flame className="w-4 h-4 text-yellow-200" />
            <span>🔥 MOMENTO POLÉMICO DETECTADO</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black">
            {stats.mostControversial.productName} (Grieta de {stats.mostControversial.difference} pts)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
              <p className="font-bold text-yellow-200">
                😍 {stats.mostControversial.highestEvaluation.participantName}: {stats.mostControversial.highestEvaluation.score}/10
              </p>
              <p className="italic mt-1 text-white/90">
                {stats.mostControversial.highestEvaluation.comment ? `“${stats.mostControversial.highestEvaluation.comment}”` : "Puntaje máximo."}
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
              <p className="font-bold text-orange-200">
                🤨 {stats.mostControversial.lowestEvaluation.participantName}: {stats.mostControversial.lowestEvaluation.score}/10
              </p>
              <p className="italic mt-1 text-white/90">
                {stats.mostControversial.lowestEvaluation.comment ? `“${stats.mostControversial.lowestEvaluation.comment}”` : "Puntaje más bajo."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Voto Especial "El Más Argentino" */}
      <SpecialVoteCard
        competitionId={competition.id}
        participants={participants}
        products={products}
        existingVotes={specialVotes}
      />
    </div>
  );
}
