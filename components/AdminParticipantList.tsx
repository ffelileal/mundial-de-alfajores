"use client";

import { useState } from "react";
import { deleteParticipant, resetParticipantProgress } from "@/actions/participant";
import { Trash2, RotateCcw, CheckCircle2, User, Sparkles } from "lucide-react";

interface AdminParticipantListProps {
  participants: any[];
  totalProducts: number;
}

export function AdminParticipantList({
  participants,
  totalProducts,
}: AdminParticipantListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleReset = async (id: string, name: string) => {
    if (confirm(`¿Reiniciar las evaluaciones de "${name}"? Se borrarán sus notas registradas para que pueda votar de nuevo.`)) {
      setLoadingId(id);
      try {
        await resetParticipantProgress(id);
      } finally {
        setLoadingId(null);
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Eliminar al participante "${name}" del Mundial?`)) {
      setLoadingId(id);
      try {
        await deleteParticipant(id);
      } finally {
        setLoadingId(null);
      }
    }
  };

  if (!participants || participants.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#e6dacd] text-center space-y-2">
        <div className="text-3xl">👥</div>
        <h3 className="font-black text-sm text-[#2c1810]">Aún no hay participantes registrados</h3>
        <p className="text-xs text-[#786556] max-w-sm mx-auto">
          Los jugadores se registran automáticamente cuando ingresan su nombre/alias en la página principal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {participants.map((p) => {
        const evalCount = p.evaluations?.length || 0;
        const isFinished = totalProducts > 0 && evalCount >= totalProducts;
        const progress = totalProducts > 0 ? Math.round((evalCount / totalProducts) * 100) : 0;
        const isLoading = loadingId === p.id;

        return (
          <div
            key={p.id}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e6dacd] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#fbf9f6] border border-[#e6dacd] flex items-center justify-center text-2xl shrink-0 shadow-xs">
                {p.avatarEmoji || "👤"}
              </div>

              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-base text-[#2c1810] leading-tight">
                    {p.name}
                  </h4>
                  {isFinished && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completo</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#786556] mt-0.5">
                  Alias: <strong className="text-[#2c1810]">{p.alias}</strong> • Evaluó <strong>{evalCount}</strong> de <strong>{totalProducts}</strong>
                </p>
              </div>
            </div>

            {/* Actions & Progress Bar */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e6dacd]/60">
              <div className="w-24 sm:w-32">
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isFinished ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#786556] text-right font-bold mt-0.5">
                  {progress}%
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleReset(p.id, p.name)}
                  disabled={isLoading}
                  title="Reiniciar progreso de este jugador"
                  className="text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 p-2.5 rounded-xl border border-amber-200 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1 active:scale-95 touch-manipulation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reiniciar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(p.id, p.name)}
                  disabled={isLoading}
                  title="Eliminar participante"
                  className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2.5 rounded-xl border border-red-200 transition-colors cursor-pointer text-xs font-bold active:scale-95 touch-manipulation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
