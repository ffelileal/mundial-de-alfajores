"use client";

import { useState } from "react";
import {
  setCompetitionStatus,
  setResultsVisible,
  toggleBlindTasting,
} from "@/actions/competition";
import { Play, Pause, CheckCircle, Eye, EyeOff, Sparkles } from "lucide-react";
import { clsx } from "clsx";

interface AdminStatusControlsProps {
  competitionId: string;
  currentStatus: string;
  resultsVisible: boolean;
  blindTasting: boolean;
}

export function AdminStatusControls({
  competitionId,
  currentStatus,
  resultsVisible,
  blindTasting,
}: AdminStatusControlsProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isResultsOn, setIsResultsOn] = useState(resultsVisible);
  const [isBlindOn, setIsBlindOn] = useState(blindTasting);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: "PREPARATION" | "IN_PROGRESS" | "FINISHED") => {
    setIsUpdating(true);
    try {
      await setCompetitionStatus(competitionId, newStatus);
      setStatus(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleResults = async () => {
    setIsUpdating(true);
    try {
      const nextVal = !isResultsOn;
      await setResultsVisible(competitionId, nextVal);
      setIsResultsOn(nextVal);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleBlind = async () => {
    setIsUpdating(true);
    try {
      const nextVal = !isBlindOn;
      await toggleBlindTasting(competitionId, nextVal);
      setIsBlindOn(nextVal);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Primary Tournament Status Switcher */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e6dacd] shadow-sm space-y-3">
        <h3 className="text-xs font-black text-[#54311c] uppercase tracking-wider">
          Estado del Mundial
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Preparation */}
          <button
            type="button"
            onClick={() => handleStatusChange("PREPARATION")}
            disabled={isUpdating}
            className={clsx(
              "p-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation active:scale-95",
              status === "PREPARATION"
                ? "bg-yellow-400 text-yellow-950 shadow-md ring-2 ring-yellow-500"
                : "bg-[#fbf9f6] text-stone-600 border border-[#e6dacd] hover:bg-stone-100"
            )}
          >
            <span>🟡</span>
            <span>Preparación (Pausado)</span>
          </button>

          {/* In Progress */}
          <button
            type="button"
            onClick={() => handleStatusChange("IN_PROGRESS")}
            disabled={isUpdating}
            className={clsx(
              "p-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation active:scale-95",
              status === "IN_PROGRESS"
                ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400"
                : "bg-[#fbf9f6] text-stone-600 border border-[#e6dacd] hover:bg-stone-100"
            )}
          >
            <span>🟢</span>
            <span>En Curso (Degustando)</span>
          </button>

          {/* Finished */}
          <button
            type="button"
            onClick={() => handleStatusChange("FINISHED")}
            disabled={isUpdating}
            className={clsx(
              "p-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer touch-manipulation active:scale-95",
              status === "FINISHED"
                ? "bg-[#54311c] text-amber-300 shadow-md ring-2 ring-amber-400"
                : "bg-[#fbf9f6] text-stone-600 border border-[#e6dacd] hover:bg-stone-100"
            )}
          >
            <span>🔴</span>
            <span>Finalizado</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Visibility & Mode Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Results Visibility Toggle */}
        <div className="bg-white rounded-3xl p-5 border border-[#e6dacd] shadow-sm flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-sm text-[#2c1810]">
                Resultados Visibles para Jugadores
              </h4>
              <span
                className={clsx(
                  "text-[9px] font-black px-2 py-0.5 rounded-full",
                  isResultsOn ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-600"
                )}
              >
                {isResultsOn ? "PÚBLICOS" : "OCULTOS"}
              </span>
            </div>
            <p className="text-[11px] text-[#786556] mt-0.5">
              Si está desactivado, los jugadores no podrán ver el podio ni el ranking.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleResults}
            disabled={isUpdating}
            className={clsx(
              "px-4 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer shrink-0 touch-manipulation active:scale-95",
              isResultsOn
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                : "bg-stone-200 text-stone-700 hover:bg-stone-300"
            )}
          >
            {isResultsOn ? "Publicados ✓" : "Habilitar"}
          </button>
        </div>

        {/* Blind Tasting Mode Toggle */}
        <div className="bg-white rounded-3xl p-5 border border-[#e6dacd] shadow-sm flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-sm text-[#2c1810]">
                Modo Cata a Ciegas
              </h4>
              <span
                className={clsx(
                  "text-[9px] font-black px-2 py-0.5 rounded-full",
                  isBlindOn ? "bg-purple-100 text-purple-800" : "bg-stone-100 text-stone-600"
                )}
              >
                {isBlindOn ? "ACTIVADO" : "DESACTIVADO"}
              </span>
            </div>
            <p className="text-[11px] text-[#786556] mt-0.5">
              Oculta nombres y marcas durante la degustación (ej: <em>ALFAJOR #01</em>).
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleBlind}
            disabled={isUpdating}
            className={clsx(
              "px-4 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer shrink-0 touch-manipulation active:scale-95",
              isBlindOn
                ? "bg-purple-700 text-white hover:bg-purple-800 shadow-xs"
                : "bg-stone-200 text-stone-700 hover:bg-stone-300"
            )}
          >
            {isBlindOn ? "Ciegas ON" : "Activar"}
          </button>
        </div>
      </div>
    </div>
  );
}
