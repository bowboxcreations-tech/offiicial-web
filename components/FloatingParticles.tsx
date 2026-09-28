"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TOKENS } from "./Tokens";

/**
 * Decorative ambient particles (exact visual clone of the original
 * home-page implementation: deterministic per-index values, so there is
 * zero hydration risk). Rendered only after mount.
 */
export function FloatingParticles({
  isDarkMode = false,
  count = 20,
}: {
  isDarkMode?: boolean;
  count?: number;
}) {
  const [particles, setParticles] = useState<
    {
      id: string;
      color: string;
      size: number;
      left: string;
      top: string;
      duration: number;
      delay: number;
    }[]
  >([]);

  useEffect(() => {
    const colors = [TOKENS.cream, TOKENS.peach, TOKENS.rose, TOKENS.pink];
    setParticles(
      Array.from({ length: count }).map((_, i) => ({
        id: `p-${i}`,
        color: colors[i % 4],
        size: 4 + ((i * 17) % 8),
        left: `${(i * 5.3) % 100}%`,
        top: `${(i * 7.7 + 10) % 100}%`,
        duration: 8 + ((i * 13) % 12),
        delay: (i * 3) % 5,
      })),
    );
  }, [count]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            left: p.left,
            top: p.top,
            opacity: isDarkMode ? 0.1 : 0.15,
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            scale: [1, 1.2, 0.8, 1.1, 1],
            opacity: isDarkMode
              ? [0.08, 0.15, 0.05, 0.12, 0.08]
              : [0.15, 0.25, 0.1, 0.2, 0.15],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
