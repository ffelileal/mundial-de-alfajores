"use client";

import { RankedProduct } from "@/lib/scoring";
import { Trophy, Sparkles } from "lucide-react";

interface PodiumProps {
  ranked: RankedProduct[];
  blindTasting?: boolean;
}

export function Podium({ ranked, blindTasting = false }: PodiumProps) {
  const first = ranked[0];
  const second = ranked[1];
  const third = ranked[2];

  if (!first) return null;

  return (
    <div className="w-full my-4 sm:my-8">
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs mb-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
          <span>¡TENEMOS CAMPEÓN!</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#2c1810] tracking-tight">
          El Podio del Mundial 🇦🇷
        </h2>
      </div>

      {/* Responsive Podium Grid Layout: 2nd, 1st, 3rd */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4 items-end max-w-2xl mx-auto px-0.5 sm:px-2">
        {/* 🥈 2nd Place */}
        {second ? (
          <div className="flex flex-col items-center">
            {/* Card Info */}
            <div className="w-full bg-white/95 rounded-2xl p-2 sm:p-4 border-2 border-slate-300 shadow-sm text-center mb-1.5 flex flex-col items-center min-h-[125px] sm:min-h-[145px] justify-between">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-base sm:text-xl shadow-inner">
                🥈
              </div>
              <div className="w-full">
                <p className="text-[9px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  2° Puesto
                </p>
                <h4 className="font-extrabold text-[11px] sm:text-sm text-[#2c1810] line-clamp-1 leading-tight mt-0.5">
                  {second.name}
                </h4>
                <p className="text-[9px] sm:text-[11px] text-[#786556] line-clamp-1">{second.brand}</p>
              </div>
              <div className="bg-slate-100 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg font-black text-[11px] sm:text-sm text-slate-800 border border-slate-200">
                ⭐ {second.finalScoreAverage.toFixed(1)}
              </div>
            </div>
            {/* Pedestal Bar */}
            <div className="w-full h-18 sm:h-28 bg-gradient-to-t from-slate-400 to-slate-200 rounded-t-2xl flex items-center justify-center font-black text-lg sm:text-2xl text-slate-700 shadow-inner">
              2°
            </div>
          </div>
        ) : (
          <div className="invisible" />
        )}

        {/* 🥇 1st Place (Champion) */}
        {first && (
          <div className="flex flex-col items-center -mt-4 sm:-mt-6">
            {/* Crown / Trophy icon */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-amber-500/30 animate-bounce mb-1 border-2 border-white">
              👑
            </div>
            {/* Card Info */}
            <div className="w-full bg-gradient-to-b from-amber-50 to-white rounded-2xl p-2.5 sm:p-5 border-2 border-amber-400 shadow-lg text-center mb-1.5 flex flex-col items-center min-h-[145px] sm:min-h-[165px] justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 font-black text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded-bl-lg">
                CAMPEÓN
              </div>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-lg sm:text-2xl shadow-inner">
                🥇
              </div>
              <div className="w-full">
                <p className="text-[9px] sm:text-xs font-bold text-amber-700 uppercase tracking-wider">
                  1° Puesto
                </p>
                <h4 className="font-black text-xs sm:text-base text-[#2c1810] line-clamp-2 leading-tight mt-0.5">
                  {first.name}
                </h4>
                <p className="text-[9px] sm:text-[11px] font-semibold text-[#786556] line-clamp-1">{first.brand}</p>
              </div>
              <div className="bg-amber-400 text-amber-950 px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl font-black text-xs sm:text-base shadow-xs">
                ⭐ {first.finalScoreAverage.toFixed(1)}
              </div>
            </div>
            {/* Pedestal Bar */}
            <div className="w-full h-28 sm:h-40 bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-300 rounded-t-2xl flex flex-col items-center justify-center font-black text-2xl sm:text-3xl text-amber-950 shadow-inner">
              <span>1°</span>
              <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-amber-900 mt-0.5" />
            </div>
          </div>
        )}

        {/* 🥉 3rd Place */}
        {third ? (
          <div className="flex flex-col items-center">
            {/* Card Info */}
            <div className="w-full bg-white/95 rounded-2xl p-2 sm:p-4 border-2 border-amber-700/40 shadow-sm text-center mb-1.5 flex flex-col items-center min-h-[125px] sm:min-h-[145px] justify-between">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-50 border border-amber-700/30 flex items-center justify-center text-base sm:text-xl shadow-inner">
                🥉
              </div>
              <div className="w-full">
                <p className="text-[9px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider">
                  3° Puesto
                </p>
                <h4 className="font-extrabold text-[11px] sm:text-sm text-[#2c1810] line-clamp-1 leading-tight mt-0.5">
                  {third.name}
                </h4>
                <p className="text-[9px] sm:text-[11px] text-[#786556] line-clamp-1">{third.brand}</p>
              </div>
              <div className="bg-amber-100/70 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg font-black text-[11px] sm:text-sm text-amber-900 border border-amber-200">
                ⭐ {third.finalScoreAverage.toFixed(1)}
              </div>
            </div>
            {/* Pedestal Bar */}
            <div className="w-full h-14 sm:h-20 bg-gradient-to-t from-amber-800 to-amber-600 rounded-t-2xl flex items-center justify-center font-black text-lg sm:text-2xl text-amber-100 shadow-inner">
              3°
            </div>
          </div>
        ) : (
          <div className="invisible" />
        )}
      </div>
    </div>
  );
}
