import Link from "next/link";
import { getOrCreateDefaultCompetition } from "@/actions/competition";
import { redirect } from "next/navigation";
import { Trophy, CheckCircle2, Users, BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { Confetti } from "@/components/Confetti";

interface CompletePageProps {
  searchParams: Promise<{ participantId?: string }>;
}

export default async function TastingCompletePage({ searchParams }: CompletePageProps) {
  const { participantId } = await searchParams;

  if (!participantId) {
    redirect("/tasting");
  }

  const competition = await getOrCreateDefaultCompetition();
  const participant = competition.participants.find((p) => p.id === participantId);

  if (!participant) {
    redirect("/tasting");
  }

  const userEvaluations = competition.evaluations.filter(
    (e) => e.participantId === participantId
  );

  const totalProducts = competition.products.length;

  return (
    <div className="max-w-md mx-auto py-2 sm:py-8 space-y-5 text-center">
      <Confetti trigger={true} />

      {/* Celebration Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl sm:text-4xl shadow-inner border-2 border-emerald-300 animate-bounce">
        🎉
      </div>

      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>MISIÓN CUMPLIDA</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#2c1810] tracking-tight">
          ¡Excelente, {participant.name}! 🍫
        </h1>
        <p className="text-xs sm:text-sm text-[#786556] max-w-sm mx-auto">
          Completaste la evaluación de los {userEvaluations.length} alfajores del Mundial.
        </p>
      </div>

      {/* Personal Score Recap */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#e6dacd] shadow-sm text-left space-y-3">
        <div className="flex items-center justify-between border-b border-[#e6dacd] pb-2.5">
          <h3 className="font-black text-xs sm:text-sm text-[#2c1810] flex items-center gap-1.5">
            <span>📋</span>
            <span>Tus puntuaciones</span>
          </h3>
          <span className="text-[10px] font-bold text-stone-500 bg-[#fbf9f6] px-2 py-0.5 rounded-md border border-[#e6dacd]">
            Privado para vos
          </span>
        </div>

        <div className="divide-y divide-[#e6dacd] max-h-64 overflow-y-auto pr-1">
          {userEvaluations.map((ev) => {
            const product = competition.products.find((p) => p.id === ev.productId);
            if (!product) return null;

            return (
              <div key={ev.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-xs sm:text-sm text-[#2c1810]">
                    {competition.blindTasting
                      ? `Alfajor #${String(product.orderNumber).padStart(2, "0")}`
                      : product.name}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#786556]">
                    Sabor: <strong>{ev.tasteScore}/10</strong> • Empaque: <strong>{ev.packagingScore}/10</strong>
                  </p>
                  {ev.comment && (
                    <p className="text-[10px] text-amber-800 italic mt-0.5 line-clamp-1">
                      “{ev.comment}”
                    </p>
                  )}
                </div>
                <div className="bg-amber-100 text-amber-950 px-2 py-1 rounded-xl font-black text-xs sm:text-sm shrink-0">
                  ⭐ {ev.finalScore.toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        <Link
          href="/tasting"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#54311c] hover:bg-[#3d2112] text-white font-black text-xs sm:text-sm py-4 rounded-2xl shadow-md active:scale-95 transition-all touch-manipulation cursor-pointer"
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Pasar el teléfono al siguiente amigo 👤</span>
        </Link>

        <Link
          href="/ranking"
          className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-[#54311c] font-bold text-xs sm:text-sm py-3.5 rounded-2xl border border-[#e6dacd] shadow-sm transition-all active:scale-95 touch-manipulation cursor-pointer"
        >
          <BarChart3 className="w-4 h-4 text-sky-600" />
          <span>Ver Podio y Resultados Generales 🏆</span>
        </Link>
      </div>
    </div>
  );
}
