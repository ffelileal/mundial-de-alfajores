"use client";

import { useEffect } from "react";

export function Confetti({ trigger = true }: { trigger?: boolean }) {
  useEffect(() => {
    if (!trigger || typeof window === "undefined") return;

    let isMounted = true;
    import("canvas-confetti").then((module) => {
      const confetti = module.default;
      if (!isMounted) return;

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#74acdf", "#ffffff", "#f59e0b", "#4a2712"],
        });
      } catch {
        // Safe ignore
      }
    });

    return () => {
      isMounted = false;
    };
  }, [trigger]);

  return null;
}
