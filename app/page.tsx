import Link from "next/link";
import { PlayerLoginForm } from "@/components/PlayerLoginForm";
import { Sparkles, Trophy, ShieldCheck, Lock } from "lucide-react";
import { getOrCreateDefaultCompetition } from "@/actions/competition";

export default async function HomePage() {
  const competition = await getOrCreateDefaultCompetition();

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-xl mx-auto py-4 sm:py-8 px-1">
      {/* Main Player Portal Hero */}
      <div className="my-auto space-y-6 sm:space-y-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-black text-xs shadow-xs">
          <span>🇦🇷</span>
          <span>COMPETENCIA OFICIAL ENTRE AMIGOS</span>
          <span>🍫</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black text-[#2c1810] tracking-tight uppercase leading-[1.05] drop-shadow-xs">
            Mundial de <br />
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
              Alfajores 🏆
            </span>
          </h1>
          <p className="text-base sm:text-xl text-[#786556] font-extrabold italic max-w-md mx-auto leading-snug">
            “Prepará el paladar. La competencia está por comenzar.”
          </p>
        </div>

        {/* Player Login Card */}
        <div className="chocolate-gradient text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <PlayerLoginForm />
            <p className="text-[11px] text-amber-200/70 italic">
              Sin contraseñas ni registros largos: tu nombre es tu pase al torneo.
            </p>
          </div>
        </div>

        {/* Rules hint */}
        <div className="bg-white rounded-2xl p-4 border border-[#e6dacd] shadow-xs flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-lg font-bold shrink-0">
              ⚖️
            </div>
            <div>
              <p className="font-extrabold text-xs text-[#2c1810]">
                Puntuación Oficial: Sabor 80% • Empaque 20%
              </p>
              <p className="text-[10px] text-[#786556]">
                Votación 100% privada hasta la revelación del podio.
              </p>
            </div>
          </div>
          <Link
            href="/rules"
            className="text-xs font-black text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-xl transition-all shrink-0"
          >
            Reglas →
          </Link>
        </div>
      </div>

      {/* Discrete Footer with Admin Link */}
      <footer className="pt-6 pb-2 border-t border-[#e6dacd]/60 flex items-center justify-between text-xs text-[#786556]">
        <span>🇦🇷 Mundial de Alfajores</span>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 font-bold text-stone-400 hover:text-[#54311c] transition-colors px-2 py-1 rounded-lg hover:bg-[#efe6dc]/50"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Administración</span>
        </Link>
      </footer>
    </div>
  );
}
