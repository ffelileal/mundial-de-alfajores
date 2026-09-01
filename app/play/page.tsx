import { getPlayerSession } from "@/lib/player-auth";
import { getPlayerStatus } from "@/actions/player";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  BarChart3,
  User,
} from "lucide-react";
import { ClearPlayerButton } from "@/components/ClearPlayerButton";

export default async function PlayerLobbyPage() {
  const session = await getPlayerSession();

  if (!session?.participantId) {
    redirect("/");
  }

  const data = await getPlayerStatus(session.participantId);

  if (!data || !data.participant) {
    redirect("/");
  }

  const { competition, participant, totalProducts, evaluatedCount, nextProductId } = data;
  const progressPercent = totalProducts > 0 ? Math.round((evaluatedCount / totalProducts) * 100) : 0;
  const isFinished = totalProducts > 0 && evaluatedCount >= totalProducts;

  return (
    <div className="max-w-xl mx-auto py-3 sm:py-8 space-y-5 sm:space-y-6">
      {/* 1. Header with greeting and avatar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e6dacd] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#fbf9f6] border border-[#e6dacd] flex items-center justify-center text-3xl shadow-xs shrink-0">
            {participant.avatarEmoji || "👤"}
          </div>
          <div>
            <span className="text-[10px] font-black text-[#786556] uppercase tracking-wider">
              Participante
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#2c1810] tracking-tight leading-tight">
              ¡Hola, {participant.alias}! 👋
            </h1>
            <p className="text-xs text-[#786556]">Bienvenido al Mundial de Alfajores.</p>
          </div>
        </div>

        <ClearPlayerButton />
      </div>

      {/* 2. State-Driven Competition Card */}

      {/* STATE A: 🟡 PREPARATION / AÚN NO COMENZÓ */}
      {competition.status === "PREPARATION" && (
        <div className="chocolate-gradient text-white rounded-3xl p-6 sm:p-8 border border-amber-900/60 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center text-3xl sm:text-4xl shadow-inner animate-pulse">
            🍫
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 text-xs font-black">
              <Clock className="w-3.5 h-3.5" />
              <span>ESTADO: PREPARACIÓN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Preparando el Mundial...
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-sm mx-auto leading-relaxed">
              El administrador todavía no dio inicio a la competencia. En cuanto comience, podrás catar y calificar cada alfajor.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/play"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer touch-manipulation"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Comprobar si ya comenzó 🔄</span>
            </Link>
          </div>
        </div>
      )}

      {/* STATE B: 🟢 IN_PROGRESS */}
      {competition.status === "IN_PROGRESS" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-white to-[#fbf9f6] rounded-3xl p-5 sm:p-7 border-2 border-amber-400/80 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>🟢 MUNDIAL EN CURSO</span>
              </div>

              <span className="text-xs font-black text-amber-700">
                {evaluatedCount} de {totalProducts} probados
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-[#786556] text-right font-bold">
                {progressPercent}% completado
              </p>
            </div>

            {/* If there are unevaluated products, show CTA to tasting */}
            {!isFinished && nextProductId && (
              <div className="pt-2">
                <Link
                  href={`/play/tasting/${nextProductId}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#54311c] to-[#3d2112] text-white font-black text-base py-4 px-6 rounded-2xl shadow-lg shadow-amber-950/20 hover:scale-[1.01] active:scale-95 transition-all touch-manipulation cursor-pointer"
                >
                  <Play className="w-5 h-5 text-amber-400" />
                  <span>
                    {evaluatedCount === 0 ? "Comenzar Degustación →" : "Continuar con el Siguiente Alfajor →"}
                  </span>
                </Link>
              </div>
            )}

            {/* If player already evaluated all products */}
            {isFinished && (
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-emerald-800 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>¡Ya probaste y calificaste todos los alfajores!</span>
                </div>
                <p className="text-xs text-emerald-700">
                  Esperando que los demás participantes terminen y el administrador publique los resultados.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STATE C: 🔴 FINISHED */}
      {competition.status === "FINISHED" && (
        <div className="space-y-4">
          <div className="chocolate-gradient text-white rounded-3xl p-6 sm:p-8 border border-amber-900 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-amber-500/30">
              🏆
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black">
                <span>🔴 COMPETENCIA FINALIZADA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ¡El Mundial ha concluido!
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-sm mx-auto leading-relaxed">
                Todas las degustaciones fueron procesadas y el ranking oficial ha sido calculado.
              </p>
            </div>

            {competition.resultsVisible ? (
              <div className="pt-2">
                <Link
                  href="/play/results"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black text-base sm:text-lg py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/30 hover:scale-[1.01] active:scale-95 transition-all touch-manipulation cursor-pointer"
                >
                  <Trophy className="w-6 h-6 text-amber-950" />
                  <span>VER PODIO & RESULTADOS 🏆</span>
                </Link>
              </div>
            ) : (
              <div className="bg-amber-950/80 rounded-2xl p-4 border border-amber-800 text-xs text-amber-200 space-y-2">
                <p className="font-bold">
                  ⏳ El administrador está preparando la ceremonia de resultados oficiales.
                </p>
                <Link
                  href="/play"
                  className="inline-flex items-center gap-1.5 text-xs text-white font-black underline"
                >
                  <span>Actualizar página</span>
                  <RotateCcw className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Official Rules & Confidentiality Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6dacd] shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-black text-[#2c1810]">Voto 100% confidencial</p>
            <p className="text-[11px] text-[#786556]">
              Nadie puede ver tus notas hasta la revelación del podio.
            </p>
          </div>
        </div>
        <Link
          href="/rules"
          className="text-xs font-black text-[#54311c] bg-[#efe6dc] hover:bg-[#e6dacd] px-3 py-2 rounded-xl transition-colors shrink-0"
        >
          Reglas →
        </Link>
      </div>
    </div>
  );
}
