"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Trophy, ShieldCheck, Lock } from "lucide-react";

export function Navbar({ blindTasting = false }: { blindTasting?: boolean }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e6dacd] bg-[#fbf9f6]/95 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <Link href={isAdminRoute ? "/admin/dashboard" : "/"} className="flex items-center gap-2 sm:gap-2.5 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#4a2712] to-[#231208] text-amber-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <span className="text-base sm:text-xl">🍫</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black tracking-tight text-[#2c1810] text-sm sm:text-lg uppercase">
                Mundial de Alfajores
              </span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-sky-100 text-sky-800 font-bold border border-sky-200">
                🇦🇷
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-[#786556] font-medium hidden sm:block">
              {isAdminRoute ? "Panel de Administración 👑" : "Edición Amigos • Cata & Puntuación"}
            </p>
          </div>
        </Link>

        {/* Right Navigation */}
        <div className="flex items-center gap-2">
          {/* Blind mode indicator */}
          {blindTasting && (
            <div className="flex items-center gap-1 bg-purple-100 text-purple-800 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full border border-purple-200 animate-pulse">
              <span>👀</span>
              <span>Cata a Ciegas</span>
            </div>
          )}

          {!isAdminRoute ? (
            <Link
              href="/rules"
              className="inline-flex items-center gap-1 text-xs font-black text-[#54311c] bg-[#efe6dc] hover:bg-[#e6dacd] px-3 py-1.5 rounded-xl transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reglas</span>
            </Link>
          ) : (
            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold text-stone-500 hover:text-[#54311c] px-2.5 py-1 rounded-lg border border-[#e6dacd] bg-white hidden sm:inline"
            >
              Ver portada ↗
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
