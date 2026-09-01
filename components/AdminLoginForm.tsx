"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/actions/competition";
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage("Por favor, ingresá la contraseña de administrador.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await adminLogin(password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Contraseña de administrador incorrecta.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto w-full">
      <div className="space-y-2 text-left">
        <label
          htmlFor="admin-password"
          className="text-xs font-black text-amber-200 uppercase tracking-wider block"
        >
          Contraseña de Administrador
        </label>
        <div className="relative">
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Ingresá la clave de admin..."
            autoFocus
            className="w-full bg-white/95 text-[#2c1810] font-black text-base px-4 py-3.5 rounded-2xl border-2 border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300/40 shadow-md transition-all"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400">
            <Lock className="w-4 h-4" />
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
        disabled={isLoading || !password.trim()}
        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-sm py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation"
      >
        <span>{isLoading ? "Verificando acceso..." : "INGRESAR AL PANEL →"}</span>
        {!isLoading && <ArrowRight className="w-4 h-4" />}
      </button>

      <p className="text-[11px] text-amber-200/70 text-center italic">
        Clave predeterminada: <strong>admin123</strong> (configurable en ajustes).
      </p>
    </form>
  );
}
