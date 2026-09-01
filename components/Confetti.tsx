"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function Confetti({ trigger = true }: { trigger?: boolean }) {
  useEffect(() => {
    if (!trigger) return;

    // First burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#74acdf", "#ffffff", "#f59e0b", "#4a2712"],
    });

    // Secondary burst
    const timer = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#74acdf", "#ffffff", "#fbbf24"],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#74acdf", "#ffffff", "#d97706"],
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [trigger]);

  return null;
}
