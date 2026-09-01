import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrCreateDefaultCompetition } from "@/actions/competition";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { AdminStatusControls } from "@/components/AdminStatusControls";
import Link from "next/link";
import {
  Users,
  Trophy,
  BarChart3,
  Settings,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    redirect("/admin");
  }

  const competition = await getOrCreateDefaultCompetition();

  const participantCount = competition.participants?.length || 0;
  const productCount = competition.products?.length || 0;
  const evaluationCount = competition.evaluations?.length || 0;
  const totalPossible = participantCount * productCount;
  const progressPercent = totalPossible > 0 ? Math.round((evaluationCount / totalPossible) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2 sm:py-6">
      {/* Admin Navigation */}
      <AdminNav />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6dacd] pb-4">
        <div>
          <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded-md">
            MUNDIAL ACTIVO
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2c1810] tracking-tight mt-1">
            {competition.name}
          </h1>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-xs font-bold text-[#786556] hover:text-[#54311c] self-start sm:self-auto bg-white px-3 py-1.5 rounded-xl border border-[#e6dacd] shadow-xs"
        >
          👁️ Ver web como jugador ↗
        </Link>
      </div>

      {/* Real-time KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Status */}
        <div className="bg-white rounded-3xl p-4 border border-[#e6dacd] shadow-sm text-center">
          <p className="text-[10px] font-black text-[#786556] uppercase tracking-wider">Estado</p>
          <div className="mt-1">
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-xs font-black ${
                competition.status === "IN_PROGRESS"
                  ? "bg-emerald-100 text-emerald-800"
                  : competition.status === "FINISHED"
                  ? "bg-amber-100 text-amber-900"
                  : "bg-yellow-100 text-yellow-900"
              }`}
            >
              {competition.status === "IN_PROGRESS"
                ? "🟢 En Curso"
                : competition.status === "FINISHED"
                ? "🔴 Finalizado"
                : "🟡 Preparación"}
            </span>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-3xl p-4 border border-[#e6dacd] shadow-sm text-center">
          <p className="text-[10px] font-black text-[#786556] uppercase tracking-wider">Participantes</p>
          <p className="text-2xl font-black text-[#54311c] mt-0.5">{participantCount}</p>
          <p className="text-[10px] text-[#786556]">amigos registrados</p>
        </div>

        {/* Products */}
        <div className="bg-white rounded-3xl p-4 border border-[#e6dacd] shadow-sm text-center">
          <p className="text-[10px] font-black text-[#786556] uppercase tracking-wider">Alfajores</p>
          <p className="text-2xl font-black text-[#54311c] mt-0.5">{productCount}</p>
          <p className="text-[10px] text-[#786556]">muestras en cata</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-3xl p-4 border border-[#e6dacd] shadow-sm text-center">
          <p className="text-[10px] font-black text-[#786556] uppercase tracking-wider">Evaluaciones</p>
          <p className="text-2xl font-black text-amber-600 mt-0.5">
            {evaluationCount} {totalPossible > 0 && <span className="text-xs text-[#786556]">/ {totalPossible}</span>}
          </p>
          <p className="text-[10px] text-[#786556]">{progressPercent}% completado</p>
        </div>
      </div>

      {/* State & Mode Controls Component */}
      <AdminStatusControls
        competitionId={competition.id}
        currentStatus={competition.status}
        resultsVisible={competition.resultsVisible}
        blindTasting={competition.blindTasting}
      />

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <Link
          href="/admin/participants"
          className="bg-white rounded-3xl p-5 border border-[#e6dacd] shadow-sm hover:border-[#54311c] transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xl shrink-0">
              👥
            </div>
            <div>
              <h3 className="font-black text-sm text-[#2c1810]">Gestionar Participantes</h3>
              <p className="text-[11px] text-[#786556]">
                Ver alias, progreso individual y reiniciar notas.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#54311c] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/products"
          className="bg-white rounded-3xl p-5 border border-[#e6dacd] shadow-sm hover:border-[#54311c] transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xl shrink-0">
              🍫
            </div>
            <div>
              <h3 className="font-black text-sm text-[#2c1810]">Gestionar Alfajores</h3>
              <p className="text-[11px] text-[#786556]">
                Agregar marcas, fotos, variedad y cargar clásicos.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#54311c] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/results"
          className="bg-white rounded-3xl p-5 border border-[#e6dacd] shadow-sm hover:border-[#54311c] transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-yellow-100 text-yellow-900 flex items-center justify-center font-bold text-xl shrink-0">
              🏆
            </div>
            <div>
              <h3 className="font-black text-sm text-[#2c1810]">Ver Ranking & Podio</h3>
              <p className="text-[11px] text-[#786556]">
                Resultados en vivo, ceremonia de revelación y WhatsApp.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#54311c] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/admin/settings"
          className="bg-white rounded-3xl p-5 border border-[#e6dacd] shadow-sm hover:border-[#54311c] transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-xl shrink-0">
              ⚙️
            </div>
            <div>
              <h3 className="font-black text-sm text-[#2c1810]">Configuración General</h3>
              <p className="text-[11px] text-[#786556]">
                Cambiar clave admin, ponderación y reinicio.
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#54311c] group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
}
