"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginOrRegisterPlayer } from "@/actions/player";
import { Trophy, ArrowRight, Sparkles, AlertCircle } from "lucide-react";

export function PlayerLoginForm() {
  const [alias, setAlias] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAlias = alias.trim();
    if (!cleanAlias) {
      setErrorMessage("Por favor, ingresá tu nombre o alias para comenzar.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await loginOrRegisterPlayer(cleanAlias);
      if (res.success) {
        router.push("/play");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Ocurrió un error al ingresar al Mundial.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto w-full">
      <div className="space-y-2 text-left">
        <label
          htmlFor="player-alias"
          className="text-xs sm:text-sm font-black text-amber-200 uppercase tracking-wider block"
        >
          ¿Cuál es tu nombre o alias?
        </label>
        <div className="relative">
          <input
            id="player-alias"
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            disabled={isLoading}
            placeholder="Ej: Feli, Agus, Juan, El Rey del Dulce..."
            maxLength={32}
            autoFocus
            className="w-full bg-white/95 text-[#2c1810] placeholder-[#786556]/60 font-black text-base sm:text-lg px-4 py-4 rounded-2xl border-2 border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300/40 shadow-lg transition-all"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
            🍫
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-500/90 border border-red-300 text-white p-3 rounded-2xl text-xs font-bold flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !alias.trim()}
        className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-amber-950 font-black text-base sm:text-lg py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/30 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation"
      >
        <span>{isLoading ? "Ingresando al Mundial..." : "ENTRAR AL MUNDIAL →"}</span>
        {!isLoading && <Trophy className="w-5 h-5 text-amber-950" />}
      </button>
    </form>
  );
}
