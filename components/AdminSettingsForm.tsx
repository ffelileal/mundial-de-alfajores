"use client";

import { useState } from "react";
import { updateCompetitionConfig, resetTournament } from "@/actions/competition";
import { Check, AlertTriangle, Key, ShieldCheck } from "lucide-react";

interface AdminSettingsFormProps {
  competition: any;
}

export function AdminSettingsForm({ competition }: AdminSettingsFormProps) {
  const [name, setName] = useState(competition.name || "Mundial de Alfajores");
  const [description, setDescription] = useState(competition.description || "");
  const [adminPassword, setAdminPassword] = useState(competition.adminPassword || "admin123");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCompetitionConfig(competition.id, {
        name,
        description: description || undefined,
        adminPassword: adminPassword.trim() || undefined,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetScoresOnly = async () => {
    if (
      confirm(
        "¿Borrar todas las evaluaciones registradas? Los alfajores y participantes se conservarán para empezar una nueva cata."
      )
    ) {
      setIsResetting(true);
      try {
        await resetTournament(competition.id, false);
        alert("Puntuaciones reiniciadas con éxito.");
      } finally {
        setIsResetting(false);
      }
    }
  };

  const handleFullReset = async () => {
    if (
      confirm(
        "⚠️ ATENCIÓN: ¿Borrar TODO? Se eliminarán todos los participantes, alfajores y evaluaciones para empezar desde cero."
      )
    ) {
      setIsResetting(true);
      try {
        await resetTournament(competition.id, true);
        alert("Reinicio total completado.");
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. General Config Form */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl p-5 sm:p-7 border border-[#e6dacd] shadow-sm space-y-4"
      >
        <h3 className="text-xs font-black text-[#54311c] uppercase tracking-wider">
          Configuración General del Torneo
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#786556] block">
              Nombre de la Competencia
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#fbf9f6] border border-[#e6dacd] rounded-2xl px-3.5 py-3 text-xs sm:text-sm font-bold text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#786556] block">
              Contraseña de Administrador
            </label>
            <div className="relative">
              <input
                type="text"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-[#fbf9f6] border border-[#e6dacd] rounded-2xl px-3.5 py-3 text-xs sm:text-sm font-bold text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <Key className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[#786556] block">
            Descripción o Dedicatoria (Opcional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Edición amigos 2026 en lo de Feli"
            className="w-full bg-[#fbf9f6] border border-[#e6dacd] rounded-2xl px-3.5 py-3 text-xs sm:text-sm font-medium text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-black text-[#54311c] uppercase tracking-wider block">
            Ponderación Oficial de Puntuación
          </label>
          <div className="flex items-center justify-between bg-[#fbf9f6] border border-[#e6dacd] rounded-2xl p-3.5 text-xs font-black text-[#54311c]">
            <span>🍫 Sabor: 80% (0.80)</span>
            <span className="text-stone-300">|</span>
            <span className="text-sky-800">📦 Empaque: 20% (0.20)</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto bg-[#54311c] hover:bg-[#3d2112] text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>¡Guardado con éxito!</span>
              </>
            ) : (
              <span>Guardar Ajustes</span>
            )}
          </button>
        </div>
      </form>

      {/* 2. Danger Zone */}
      <div className="bg-red-50/60 rounded-3xl p-5 sm:p-7 border border-red-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <h3 className="font-black text-sm sm:text-base">Zona de Reinicio del Torneo</h3>
        </div>
        <p className="text-xs text-red-700/80">
          Reiniciá las evaluaciones para una nueva degustación o borrá todo para empezar de cero.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleResetScoresOnly}
            disabled={isResetting}
            className="w-full sm:w-auto bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs py-3 px-4 rounded-2xl transition-all cursor-pointer active:scale-95 touch-manipulation text-center"
          >
            🔄 Borrar solo puntuaciones (conservar alfajores y amigos)
          </button>

          <button
            type="button"
            onClick={handleFullReset}
            disabled={isResetting}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-xs transition-all cursor-pointer active:scale-95 touch-manipulation text-center"
          >
            🗑️ Reinicio Total (Borrar todo)
          </button>
        </div>
      </div>
    </div>
  );
}
