import Link from "next/link";
import { BookOpen, Trophy, ArrowRight } from "lucide-react";

export default function RulesPage() {
  const rules = [
    {
      number: "1",
      title: "Participación total",
      desc: "Cada participante debe probar y calificar individualmente todos los alfajores en competencia.",
      icon: "👥",
    },
    {
      number: "2",
      title: "Sabor supremo (80%)",
      desc: "El sabor es el rey indiscutido. Su calificación de 1 a 10 representa el 80% del puntaje total.",
      icon: "🍫",
    },
    {
      number: "3",
      title: "Empaque y Presentación (20%)",
      desc: "El diseño del envoltorio y primera impresión representa el 20% restante del puntaje.",
      icon: "📦",
    },
    {
      number: "4",
      title: "Voto Secreto y Privacidad",
      desc: "Nadie puede ver las calificaciones de los demás ni los rankings parciales hasta el final.",
      icon: "🔒",
    },
    {
      number: "5",
      title: "Puntuación inmutable",
      desc: "Una vez confirmada la evaluación de un alfajor, queda registrada en la base de datos.",
      icon: "✍️",
    },
    {
      number: "6",
      title: "Cálculo matemático oficial",
      desc: "El ranking final surge de la fórmula: Puntaje = (Sabor × 0.8) + (Empaque × 0.2).",
      icon: "🧮",
    },
    {
      number: "7",
      title: "Criterio de Desempate #1",
      desc: "En caso de empate en el puntaje general, gana el alfajor con mayor promedio en Sabor.",
      icon: "⚖️",
    },
    {
      number: "8",
      title: "Criterio de Desempate #2",
      desc: "Si continúa el empate, gana el alfajor con más calificaciones máximas (10s) en Sabor.",
      icon: "👑",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 py-1 sm:py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black">
          <BookOpen className="w-3.5 h-3.5" />
          <span>CÓDIGO DE HONOR DE LA CATA</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#2c1810] tracking-tight">
          Reglas Oficiales del Mundial 📜
        </h1>
        <p className="text-xs sm:text-sm text-[#786556] max-w-lg mx-auto">
          Para que el torneo sea justo, transparente e irreprochable entre amigos.
        </p>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
        {rules.map((rule) => (
          <div
            key={rule.number}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6dacd] shadow-xs flex items-start gap-3.5 hover:border-amber-400 transition-colors"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#fbf9f6] border border-[#e6dacd] flex items-center justify-center text-xl shrink-0 shadow-xs">
              {rule.icon}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Regla #{rule.number}
                </span>
                <h3 className="font-extrabold text-xs sm:text-sm text-[#2c1810]">
                  {rule.title}
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-[#786556] leading-relaxed pt-0.5">
                {rule.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Sommelier Tasting Tips */}
      <div className="rounded-3xl bg-sky-50 border border-sky-200 p-4 sm:p-7 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <h3 className="text-sm sm:text-base font-black text-sky-950">
            Consejos para la Degustación Perfecta
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-sky-900 font-medium">
          <div className="bg-white/90 p-3 rounded-2xl border border-sky-100">
            💧 <strong>Agua entre bocados:</strong> Tomar un sorbo de agua a temperatura ambiente para limpiar el paladar de azúcar y dulce de leche.
          </div>
          <div className="bg-white/90 p-3 rounded-2xl border border-sky-100">
            🍫 <strong>Corte transversal:</strong> Cortar el alfajor al medio para observar el grosor del relleno, la capa y las tapas.
          </div>
          <div className="bg-white/90 p-3 rounded-2xl border border-sky-100">
            🤐 <strong>Silencio en la mordida:</strong> No emitir veredictos en voz alta hasta que todos hayan registrado su puntuación.
          </div>
        </div>
      </div>

      {/* Navigation CTA */}
      <div className="text-center pt-1">
        <Link
          href="/tasting"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#54311c] text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg hover:bg-[#3d2112] active:scale-95 transition-all text-sm sm:text-base touch-manipulation cursor-pointer"
        >
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>¡Entendido! Ir a Degustar</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
